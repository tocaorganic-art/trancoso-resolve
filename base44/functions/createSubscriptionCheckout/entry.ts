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

    // Planos de lançamento têm 60 dias grátis após o 1º pagamento (oferta dos 50 primeiros)
    const isPlanoLancamento = plan === 'lancamento' || plan === 'empresa_lancamento';

    const sessionParams = {
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
        bonus_days: isPlanoLancamento ? '60' : '0',
      },
      locale: 'pt-BR',
    };

    // Para planos de lançamento: cobrar 1 mês agora + 60 dias grátis antes do próximo ciclo
    if (isPlanoLancamento) {
      sessionParams.subscription_data = {
        trial_period_days: 60,
        metadata: {
          plano_lancamento: 'true',
          bonus_dias: '60',
          oferta: 'pioneiro_50_primeiros',
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log(`Checkout criado: ${session.id} para plano ${plan}`);
    return Response.json({ url: session.url, session_id: session.id });

  } catch (error) {
    console.error('Erro ao criar checkout:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});