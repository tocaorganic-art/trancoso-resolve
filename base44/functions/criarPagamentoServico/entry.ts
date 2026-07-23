import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
const PLATFORM_FEE_RATE = 0;

// Logging helper
function logStructured(action, data, level = 'info') {
  const log = {
    timestamp: new Date().toISOString(),
    action,
    level,
    data,
    environment: Deno.env.get('ENVIRONMENT') || 'production'
  };
  console.log(JSON.stringify(log));
  return log;
}

Deno.serve(async (req) => {
  let requestIdForLog = null;
  let userEmailForLog = null;
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    // SEGURANÇA: Verifica autenticação do usuário
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    userEmailForLog = user.email;

    const body = await req.json();
    const { request_id } = body;
    requestIdForLog = request_id;

    if (!request_id) {
      return Response.json({ error: 'Campo obrigatório: request_id' }, { status: 400 });
    }

    const requests = await base44.asServiceRole.entities.ServiceRequest.filter({ id: request_id });
    const serviceRequest = requests?.[0];
    if (!serviceRequest) {
      return Response.json({ error: 'Solicitação não encontrada' }, { status: 404 });
    }

    const isOwner = serviceRequest.client_email === user.email || serviceRequest.created_by === user.email;
    if (!isOwner && user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (serviceRequest.status !== 'Confirmado') {
      return Response.json({ error: 'A solicitação precisa estar confirmada antes do pagamento' }, { status: 409 });
    }

    const listings = await base44.asServiceRole.entities.ServiceListing.filter({ id: serviceRequest.service_id });
    const listing = listings?.[0];
    if (!listing || !listing.active || listing.provider_id !== serviceRequest.provider_id) {
      return Response.json({ error: 'Serviço ou prestador inválido' }, { status: 409 });
    }
    if (!Number.isFinite(listing.price) || listing.price <= 0) {
      return Response.json({ error: 'Serviço sem preço válido' }, { status: 409 });
    }

    const existingPayments = await base44.asServiceRole.entities.Payment.filter({ request_id });
    const existing = existingPayments?.find(payment =>
      !['canceled', 'refunded'].includes(payment.status)
    );
    if (existing?.stripe_payment_intent_id) {
      const existingIntent = await stripe.paymentIntents.retrieve(existing.stripe_payment_intent_id);
      return Response.json({
        ok: true,
        reused: true,
        payment_id: existing.id,
        client_secret: existingIntent.client_secret,
        payment_intent_id: existingIntent.id,
        amount_total: existing.amount_total,
        amount_provider: existing.amount_provider,
        amount_platform: existing.amount_platform,
      });
    }

    const clientEmail = user.email;
    const provider_id = serviceRequest.provider_id;
    const amountCents = Math.round(listing.price * 100);
    const platformFee = Math.round(amountCents * PLATFORM_FEE_RATE);
    const providerAmount = amountCents - platformFee;

    // Busca conta Stripe do prestador (se já tiver feito onboarding)
    const stripeAccounts = await base44.asServiceRole.entities.ProviderStripeAccount.filter({ provider_id });
    const providerAccount = stripeAccounts?.[0];

    // Cria Payment Intent com captura manual (escrow)
    const paymentIntentParams = {
      amount: amountCents,
      currency: 'brl',
      capture_method: 'manual',
      payment_method_types: ['card'],
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        request_id,
        provider_id,
        client_email,
        platform_fee_cents: platformFee.toString(),
        provider_amount_cents: providerAmount.toString(),
      },
      description: `Trancoso Resolve - Serviço #${request_id}`,
    };

    // Se o prestador já tem conta Connect, configura o split
    if (providerAccount?.stripe_account_id && providerAccount?.charges_enabled) {
      if (platformFee > 0) paymentIntentParams.application_fee_amount = platformFee;
      paymentIntentParams.transfer_data = {
        destination: providerAccount.stripe_account_id,
      };
      console.log(`[criarPagamento] Usando Connect account: ${providerAccount.stripe_account_id}`);
    } else {
      console.log(`[criarPagamento] Prestador sem conta Connect. Split manual será feito na captura.`);
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams, {
      idempotencyKey: `service-request-${request_id}`,
    });
    console.log(`[criarPagamento] PaymentIntent criado: ${paymentIntent.id}, amount: ${amountCents}`);

    // Calcula prazo de auto-captura: 48h após a data do serviço
    const serviceDateTime = serviceRequest.date ? new Date(`${serviceRequest.date}T12:00:00`) : new Date();
    serviceDateTime.setDate(serviceDateTime.getDate() + 1); // dia seguinte ao serviço
    const autoCaptureAfter = new Date(serviceDateTime.getTime() + 48 * 60 * 60 * 1000).toISOString();

    // Salva no banco
    const payment = await base44.asServiceRole.entities.Payment.create({
      request_id,
      provider_id,
      client_email: clientEmail,
      provider_stripe_account_id: providerAccount?.stripe_account_id || null,
      amount_total: amountCents,
      amount_provider: providerAmount,
      amount_platform: platformFee,
      currency: 'brl',
      stripe_payment_intent_id: paymentIntent.id,
      status: 'requires_payment_method',
      service_date: serviceRequest.date || null,
      auto_capture_after: autoCaptureAfter,
    });

    console.log(`[criarPagamento] Payment salvo: ${payment.id}`);

    return Response.json({
      ok: true,
      payment_id: payment.id,
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      amount_total: amountCents,
      amount_provider: providerAmount,
      amount_platform: platformFee,
    });

  } catch (error) {
    logStructured('criarPagamento_error', {
      errorMessage: error.message,
      errorCode: error.code,
      requestId: requestIdForLog,
      userEmail: userEmailForLog
    }, 'error');
    
    return Response.json({ error: error.message }, { status: 500 });
  }
});
