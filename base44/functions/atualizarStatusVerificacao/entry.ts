import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Campos de verificação controlados exclusivamente pelo backend (admin ou service role).
// NUNCA aceitar essas atualizações diretamente do frontend via SDK.
const CAMPOS_ADMIN = [
  'verified',
  'status_verificacao',
  'relatorio_verificacao',
  'data_verificacao',
  'status_verificacao_empresa',
  'relatorio_verificacao_empresa',
  'rating',
  'total_reviews',
] as const;

type CampoAdmin = typeof CAMPOS_ADMIN[number];

const ACOES_VALIDAS = ['aprovar', 'reprovar', 'em_analise_manual', 'atualizar_empresa'] as const;
type Acao = typeof ACOES_VALIDAS[number];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: apenas administradores podem atualizar status de verificação' }, { status: 403 });
    }

    const body = await req.json();
    const { provider_id, acao, motivo } = body;

    // Rejeitar qualquer campo admin enviado diretamente no payload
    const camposProibidos = Object.keys(body).filter((k) => CAMPOS_ADMIN.includes(k as CampoAdmin));
    if (camposProibidos.length > 0) {
      return Response.json({
        error: `Campos protegidos não podem ser enviados diretamente: ${camposProibidos.join(', ')}. Use o parâmetro 'acao'.`,
      }, { status: 400 });
    }

    if (!provider_id || typeof provider_id !== 'string') {
      return Response.json({ error: 'provider_id é obrigatório' }, { status: 400 });
    }

    if (!acao || !ACOES_VALIDAS.includes(acao as Acao)) {
      return Response.json({
        error: `acao deve ser uma de: ${ACOES_VALIDAS.join(', ')}`,
      }, { status: 400 });
    }

    const provider = await base44.asServiceRole.entities.ServiceProvider.get(provider_id);
    if (!provider) {
      return Response.json({ error: 'Prestador não encontrado' }, { status: 404 });
    }

    const agora = new Date().toISOString();
    let update: Record<string, unknown> = {};

    if (acao === 'aprovar') {
      update = {
        verified: true,
        status_verificacao: 'aprovado',
        relatorio_verificacao: motivo || `Aprovado pelo admin ${user.full_name || user.email}`,
        data_verificacao: agora,
      };
    } else if (acao === 'reprovar') {
      update = {
        verified: false,
        status_verificacao: 'reprovado',
        relatorio_verificacao: motivo || `Reprovado pelo admin ${user.full_name || user.email}`,
        data_verificacao: agora,
      };
    } else if (acao === 'em_analise_manual') {
      update = {
        status_verificacao: 'em_analise_manual',
        relatorio_verificacao: motivo || 'Em análise manual',
        data_verificacao: agora,
      };
    } else if (acao === 'atualizar_empresa') {
      const { status_empresa, relatorio_empresa } = body;
      const statusValidos = ['pendente', 'regular', 'em_risco'];
      if (!status_empresa || !statusValidos.includes(status_empresa)) {
        return Response.json({ error: `status_empresa deve ser: ${statusValidos.join(', ')}` }, { status: 400 });
      }
      update = {
        status_verificacao_empresa: status_empresa,
        relatorio_verificacao_empresa: relatorio_empresa || '',
        data_verificacao: agora,
      };
    }

    await base44.asServiceRole.entities.ServiceProvider.update(provider_id, update);

    console.log(`[atualizarStatusVerificacao] admin=${user.email} provider=${provider_id} acao=${acao}`);

    return Response.json({ ok: true, provider_id, acao, campos_atualizados: Object.keys(update) });

  } catch (error) {
    console.error('[atualizarStatusVerificacao] Error:', (error as Error).message);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
});
