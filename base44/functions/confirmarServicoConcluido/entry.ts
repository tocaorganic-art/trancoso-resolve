import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { payment_id, request_id } = body;

    if (!payment_id && !request_id) {
      return Response.json({ error: 'payment_id ou request_id obrigatório' }, { status: 400 });
    }

    // Busca o pagamento
    let payments;
    if (payment_id) {
      payments = await base44.asServiceRole.entities.Payment.filter({ id: payment_id });
    } else {
      payments = await base44.asServiceRole.entities.Payment.filter({ request_id });
    }

    if (!payments || payments.length === 0) {
      return Response.json({ error: 'Pagamento não encontrado' }, { status: 404 });
    }

    const payment = payments[0];

    // Verifica se o usuário é o cliente deste pagamento
    if (payment.client_email !== user.email && user.role !== 'admin') {
      return Response.json({ error: 'Não autorizado para confirmar este pagamento' }, { status: 403 });
    }

    if (payment.status !== 'requires_capture') {
      return Response.json({ error: `Pagamento não pode ser capturado. Status atual: ${payment.status}` }, { status: 400 });
    }

    console.log(`[confirmarServico] Capturando PaymentIntent: ${payment.stripe_payment_intent_id}`);

    // Captura o Payment Intent (libera o dinheiro)
    const capturedIntent = await stripe.paymentIntents.capture(payment.stripe_payment_intent_id);

    const chargeId = capturedIntent.latest_charge;
    console.log(`[confirmarServico] Capturado com sucesso. Charge: ${chargeId}`);

    // Atualiza o pagamento no banco
    await base44.asServiceRole.entities.Payment.update(payment.id, {
      status: 'captured',
      stripe_charge_id: chargeId || null,
      captured_at: new Date().toISOString(),
    });

    // Atualiza o status da ServiceRequest para Concluído
    if (payment.request_id) {
      await base44.asServiceRole.entities.ServiceRequest.update(payment.request_id, {
        status: 'Concluído',
      });
    }

    console.log(`[confirmarServico] Pagamento ${payment.id} capturado e ServiceRequest ${payment.request_id} marcada como Concluída`);

    return Response.json({
      ok: true,
      payment_id: payment.id,
      status: 'captured',
      amount_provider: payment.amount_provider,
      amount_platform: payment.amount_platform,
    });

  } catch (error) {
    console.error('[confirmarServico] Erro:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});