import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Suporte a dois provedores: Z-API (padrão) ou WhatsApp Business Cloud API
// Variáveis de ambiente necessárias:
//   WHATSAPP_PROVIDER = "zapi" | "waba"  (padrão: zapi)
//   ZAPI_INSTANCE_ID  — ID da instância Z-API
//   ZAPI_TOKEN        — token Z-API
//   WABA_TOKEN        — token da WhatsApp Business Cloud API
//   WABA_PHONE_ID     — phone number ID (WABA)

const TIPOS_VALIDOS = [
  'novo_pedido',
  'confirmacao',
  'cancelamento',
  'lembrete',
  'mensagem',
  'verificacao',
  'pagamento',
  'avaliacao',
  'notificacao',
] as const;

const MAX_MENSAGEM_CHARS = 4000;
const RATE_LIMIT_POR_HORA = 10;

async function enviarViaZapi(telefone: string, mensagem: string): Promise<{ message_id?: string; erro?: string }> {
  const instanceId = Deno.env.get('ZAPI_INSTANCE_ID');
  const token = Deno.env.get('ZAPI_TOKEN');

  if (!instanceId || !token) {
    return { erro: 'ZAPI_INSTANCE_ID ou ZAPI_TOKEN não configurados' };
  }

  const url = `https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: telefone, message: mensagem }),
  });

  const data = await res.json();
  if (!res.ok) {
    return { erro: data?.error || `HTTP ${res.status}` };
  }
  return { message_id: data?.messageId || data?.id };
}

async function enviarViaWABA(telefone: string, mensagem: string): Promise<{ message_id?: string; erro?: string }> {
  const token = Deno.env.get('WABA_TOKEN');
  const phoneId = Deno.env.get('WABA_PHONE_ID');

  if (!token || !phoneId) {
    return { erro: 'WABA_TOKEN ou WABA_PHONE_ID não configurados' };
  }

  // Número em formato E.164 sem o +
  const to = telefone.replace(/\D/g, '');

  const url = `https://graph.facebook.com/v19.0/${phoneId}/messages`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { preview_url: false, body: mensagem },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    return { erro: data?.error?.message || `HTTP ${res.status}` };
  }
  return { message_id: data?.messages?.[0]?.id };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Requer autenticação: usuário logado ou service role interno (ex: stripeWebhook).
    // Chamadas completamente não autenticadas são rejeitadas.
    const user = await base44.auth.me().catch(() => null);
    if (!user) {
      return Response.json({ error: 'Unauthorized: autenticação obrigatória' }, { status: 401 });
    }

    const body = await req.json();
    const {
      prestador_id,
      tipo,
      telefone,
      mensagem,
      referencia_id,
      referencia_tipo,
    } = body;

    // --- Validação de campos obrigatórios ---
    if (!telefone || !mensagem || !tipo) {
      return Response.json({ error: 'Campos obrigatórios: telefone, mensagem, tipo' }, { status: 400 });
    }

    // --- Validação do tipo ---
    if (!TIPOS_VALIDOS.includes(tipo)) {
      return Response.json({
        error: `tipo inválido. Valores aceitos: ${TIPOS_VALIDOS.join(', ')}`,
      }, { status: 400 });
    }

    // --- Validação do comprimento da mensagem ---
    if (mensagem.length > MAX_MENSAGEM_CHARS) {
      return Response.json({
        error: `mensagem excede ${MAX_MENSAGEM_CHARS} caracteres (enviados: ${mensagem.length})`,
      }, { status: 400 });
    }

    // --- Normalização e validação do telefone ---
    let tel = String(telefone).replace(/\D/g, '');
    if (!tel.startsWith('55') && tel.length <= 11) tel = `55${tel}`;
    if (tel.length < 12 || tel.length > 13) {
      return Response.json({ error: 'telefone inválido: esperado formato brasileiro (DDD + número)' }, { status: 400 });
    }
    const telE164 = `+${tel}`;

    // --- Rate limit: máximo RATE_LIMIT_POR_HORA envios por número na última hora ---
    const umaHoraAtras = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const enviosRecentes = await base44.asServiceRole.entities.LogWhatsApp.filter({
      telefone: telE164,
    });
    const enviosNaHora = (enviosRecentes || []).filter(
      (log: { timestamp?: string }) => log.timestamp && log.timestamp >= umaHoraAtras
    );
    if (enviosNaHora.length >= RATE_LIMIT_POR_HORA) {
      console.warn(`[enviarMensagemWhatsApp] rate limit atingido para ${telE164} (${enviosNaHora.length} na última hora)`);
      return Response.json({
        error: `Rate limit: máximo de ${RATE_LIMIT_POR_HORA} mensagens por hora por número`,
      }, { status: 429 });
    }

    const provider = Deno.env.get('WHATSAPP_PROVIDER') || 'zapi';
    const resultado = provider === 'waba'
      ? await enviarViaWABA(telE164, mensagem)
      : await enviarViaZapi(telE164, mensagem);

    const status = resultado.erro ? 'falhou' : 'enviado';

    // Persiste log (service role para contornar RLS)
    const logEntry = await base44.asServiceRole.entities.LogWhatsApp.create({
      prestador_id: prestador_id || null,
      tipo,
      telefone: telE164,
      mensagem,
      status,
      message_id: resultado.message_id || null,
      erro: resultado.erro || null,
      timestamp: new Date().toISOString(),
      referencia_id: referencia_id || null,
      referencia_tipo: referencia_tipo || null,
    });

    console.log(`[enviarMensagemWhatsApp] status=${status} tipo=${tipo} tel=${telE164} caller=${user.email || user.id} log=${logEntry?.id}`);

    if (resultado.erro) {
      return Response.json({ success: false, error: resultado.erro, log_id: logEntry?.id }, { status: 502 });
    }

    return Response.json({ success: true, message_id: resultado.message_id, log_id: logEntry?.id });

  } catch (err) {
    console.error('[enviarMensagemWhatsApp] erro:', (err as Error).message);
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
});
