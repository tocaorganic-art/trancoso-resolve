import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

const PRICE_IDS = {
  lancamento: 'price_1TOr0zRX4Ldl6df5OfyF3iCW',
  regular: 'price_1TOr0zRX4Ldl6df5Bc6wSto5',
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { plan, success_url, cancel_url, user_email } = await req.json();

    const priceId = PRICE_IDS[plan];
    if (!priceId) {
      return Response.json({ error: 'Plano inválido' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: success_url || 'https://trancosoresolve.base44.app/Dashboard?checkout=success',
      cancel_url: cancel_url || 'https://trancosoresolve.base44.app/Planos?checkout=cancelled',
      customer_email: user_email || undefined,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        plan,
      },
      locale: 'pt-BR',
    });

    console.log(`Checkout criado: ${session.id} para plano ${plan}`);
    return Response.json({ url: session.url, session_id: session.id });

  } catch (error) {
    console.error('Erro ao criar checkout:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});