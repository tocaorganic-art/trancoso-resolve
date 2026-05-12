import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

const PRICE_IDS = {
  lancamento: 'price_1TOr0zRX4Ldl6df5OfyF3iCW',        // Prestador Lançamento R$29,90
  regular: 'price_1TOr0zRX4Ldl6df5Bc6wSto5',            // Prestador Regular R$49,90
  empresa_lancamento: 'price_1TW72nRX4Ldl6df5BRv0aDRu', // Empresa Lançamento R$59,90
  empresa_regular: 'price_1TW72qRX4Ldl6df5Aw7ZXhdn',    // Empresa Regular R$89,90
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    // SEGURANÇA: Verifica autenticação do usuário
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan, success_url, cancel_url } = await req.json();

    const priceId = PRICE_IDS[plan];
    if (!priceId) {
      return Response.json({ error: 'Plano inválido' }, { status: 400 });
    }

    // SEGURANÇA: Usa email do usuário autenticado, não do body
    const customerEmail = user.email;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: success_url || 'https://trancosoresolve.base44.app/Dashboard?checkout=success',
      cancel_url: cancel_url || 'https://trancosoresolve.base44.app/Planos?checkout=cancelled',
      customer_email: customerEmail,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        plan,
        user_email: customerEmail,
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