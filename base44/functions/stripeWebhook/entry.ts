import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log('Stripe webhook received:', event.type);

  const base44 = createClientFromRequest(req);

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const customerEmail = session.customer_details?.email;
      const subscriptionId = session.subscription;
      const customerId = session.customer;

      if (!customerEmail) {
        console.warn('No customer email in session:', session.id);
        return Response.json({ received: true });
      }

      // Busca a assinatura no Stripe para pegar detalhes
      const stripeSub = subscriptionId
        ? await stripe.subscriptions.retrieve(subscriptionId)
        : null;

      const priceId = stripeSub?.items?.data?.[0]?.price?.id;
      const today = new Date().toISOString().split('T')[0];
      const nextBilling = stripeSub?.current_period_end
        ? new Date(stripeSub.current_period_end * 1000).toISOString().split('T')[0]
        : null;

      // Verifica se já existe uma assinatura para esse usuário
      const existing = await base44.asServiceRole.entities.Subscription.filter({ user_email: customerEmail });

      if (existing.length > 0) {
        await base44.asServiceRole.entities.Subscription.update(existing[0].id, {
          status: 'active',
          plan: 'monthly',
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          subscription_start: today,
          next_billing_date: nextBilling,
          payment_method: 'stripe',
        });
        console.log('Subscription updated for:', customerEmail);
      } else {
        await base44.asServiceRole.entities.Subscription.create({
          user_email: customerEmail,
          plan: 'monthly',
          status: 'active',
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          subscription_start: today,
          next_billing_date: nextBilling,
          amount: session.amount_total ? session.amount_total / 100 : 0,
          payment_method: 'stripe',
        });
        console.log('Subscription created for:', customerEmail);
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object;
      const existing = await base44.asServiceRole.entities.Subscription.filter({
        stripe_subscription_id: sub.id
      });
      if (existing.length > 0) {
        await base44.asServiceRole.entities.Subscription.update(existing[0].id, {
          status: 'cancelled',
        });
        console.log('Subscription cancelled:', sub.id);
      }
    }

    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object;
      const subId = invoice.subscription;
      const existing = await base44.asServiceRole.entities.Subscription.filter({
        stripe_subscription_id: subId
      });
      if (existing.length > 0) {
        await base44.asServiceRole.entities.Subscription.update(existing[0].id, {
          status: 'expired',
        });
        console.log('Subscription expired due to failed payment:', subId);
      }
    }

  } catch (err) {
    console.error('Error processing webhook event:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }

  return Response.json({ received: true });
});