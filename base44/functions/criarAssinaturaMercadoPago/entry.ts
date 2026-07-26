import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Catálogo de planos — SOMENTE backend pode mapear plano → preço.
// Nunca expor ao frontend. Frontend envia apenas o identificador do plano.
//
// Variáveis de ambiente necessárias:
//   MP_ACCESS_TOKEN    — token de acesso Mercado Pago (server-side, nunca expor)
//   MP_NOTIFICATION_URL — URL do webhook para receber notificações de pagamento
//   BASE_URL           — URL base do app (ex: https://www.trancosoresolve.com.br)
const PLANOS: Record<string, { nome: string; valor: number; frequencia: 'monthly'; trial_days?: number }> = {
  lancamento: {
    nome: 'Prestador Lançamento',
    valor: 29.90,
    frequencia: 'monthly',
    trial_days: 60,
  },
  regular: {
    nome: 'Prestador Mensal',
    valor: 49.90,
    frequencia: 'monthly',
    trial_days: 7,
  },
  empresa_lancamento: {
    nome: 'Empresas Lançamento',
    valor: 59.90,
    frequencia: 'monthly',
    trial_days: 7,
  },
  empresa_regular: {
    nome: 'Empresas Mensal',
    valor: 89.90,
    frequencia: 'monthly',
    trial_days: 7,
  },
};

const VAGAS_LANCAMENTO = 50;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const user = await base44.auth.me().catch(() => null);
    if (!user) {
      return Response.json({ error: 'Unauthorized: autenticação obrigatória' }, { status: 401 });
    }

    const body = await req.json();
    const { plano, success_url, failure_url } = body;

    // --- Validação do plano ---
    if (!plano || !PLANOS[plano]) {
      return Response.json({
        error: `Plano inválido. Valores aceitos: ${Object.keys(PLANOS).join(', ')}`,
      }, { status: 400 });
    }

    const mpToken = Deno.env.get('MP_ACCESS_TOKEN');
    if (!mpToken) {
      return Response.json({ error: 'Gateway de pagamento não configurado' }, { status: 503 });
    }

    const planoConfig = PLANOS[plano];

    // --- Limite de vagas para planos de lançamento ---
    if (plano === 'lancamento' || plano === 'empresa_lancamento') {
      const ativas = await base44.asServiceRole.entities.Subscription.filter({
        plano,
        status: 'ativa',
      });
      const trials = await base44.asServiceRole.entities.Subscription.filter({
        plano,
        status: 'trial',
      });
      const total = (ativas?.length || 0) + (trials?.length || 0);
      if (total >= VAGAS_LANCAMENTO) {
        const alternativa = plano === 'lancamento' ? 'regular' : 'empresa_regular';
        return Response.json({
          error: 'vagas_esgotadas',
          mensagem: 'As vagas deste plano de lançamento estão esgotadas.',
          redirect_para: alternativa,
        }, { status: 409 });
      }
    }

    const BASE_URL = Deno.env.get('BASE_URL') || 'https://www.trancosoresolve.com.br';
    const notificationUrl = Deno.env.get('MP_NOTIFICATION_URL');

    // --- Cria preapproval (assinatura recorrente) no Mercado Pago ---
    const preapprovalPayload: Record<string, unknown> = {
      reason: planoConfig.nome,
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: planoConfig.valor,
        currency_id: 'BRL',
      },
      back_url: success_url || `${BASE_URL}/AssinaturaConfirmada?plano=${plano}`,
      payer_email: user.email,
      external_reference: `${user.id}|${plano}|${Date.now()}`,
    };

    if (planoConfig.trial_days) {
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + planoConfig.trial_days);
      preapprovalPayload.free_trial = {
        frequency: planoConfig.trial_days,
        frequency_type: 'days',
      };
    }

    if (notificationUrl) {
      preapprovalPayload.notification_url = notificationUrl;
    }

    const mpRes = await fetch('https://api.mercadopago.com/preapproval', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${mpToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `assinatura-${user.id}-${plano}-${Date.now()}`,
      },
      body: JSON.stringify(preapprovalPayload),
    });

    const mpData = await mpRes.json();

    if (!mpRes.ok) {
      console.error('[criarAssinaturaMercadoPago] MP error:', JSON.stringify(mpData));
      return Response.json({
        error: 'Erro ao criar assinatura no gateway de pagamento',
        detalhe: mpData?.message || `HTTP ${mpRes.status}`,
      }, { status: 502 });
    }

    const preapprovalId = mpData.id;
    const checkoutUrl = mpData.init_point;

    // Persiste referência da assinatura pendente
    await base44.asServiceRole.entities.Subscription.create({
      user_id: user.id,
      user_email: user.email,
      plano,
      status: 'pendente',
      gateway: 'mercadopago',
      mp_preapproval_id: preapprovalId,
      external_reference: preapprovalPayload.external_reference as string,
      criado_em: new Date().toISOString(),
    });

    console.log(`[criarAssinaturaMercadoPago] preapproval=${preapprovalId} plano=${plano} user=${user.email}`);

    return Response.json({
      ok: true,
      checkout_url: checkoutUrl,
      preapproval_id: preapprovalId,
    });

  } catch (err) {
    console.error('[criarAssinaturaMercadoPago] erro:', (err as Error).message);
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
});
