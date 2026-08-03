import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const VERIFY_TOKEN = Deno.env.get('WHATSAPP_WEBHOOK_VERIFY_TOKEN');
const PHONE_ID = Deno.env.get('WABA_PHONE_ID');
const WABA_TOKEN = Deno.env.get('WABA_TOKEN');
const GRAPH_URL = 'https://graph.facebook.com/v19.0';

async function enviarAutoResposta(to: string, nomeContato: string) {
  if (!PHONE_ID || !WABA_TOKEN) return;
  const nome = nomeContato.split(' ')[0] || 'você';
  const mensagem =
    `Olá, ${nome}! 👋 Recebemos sua mensagem e vamos te responder em breve.\n\n` +
    `Veja nossos serviços em trancosoresolve.com.br — a gente resolve! ✅`;
  try {
    await fetch(`${GRAPH_URL}/${PHONE_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WABA_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: mensagem },
      }),
    });
  } catch (err) {
    console.error('[whatsappWebhook] erro na auto-resposta:', err.message);
  }
}

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // ── Verificação do endpoint pelo Meta (GET) ─────────────────────────────
  if (req.method === 'GET') {
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    if (!VERIFY_TOKEN) {
      console.error('[whatsappWebhook] WHATSAPP_WEBHOOK_VERIFY_TOKEN não configurado');
      return new Response('Configuração incompleta', { status: 503 });
    }

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('[whatsappWebhook] webhook verificado pelo Meta');
      return new Response(challenge, { status: 200 });
    }

    console.warn('[whatsappWebhook] falha na verificação — token inválido');
    return new Response('Token inválido', { status: 403 });
  }

  // ── Notificações recebidas do Meta (POST) ───────────────────────────────
  if (req.method !== 'POST') {
    return new Response('Método não permitido', { status: 405 });
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return new Response('Payload inválido', { status: 400 });
  }

  if (payload.object !== 'whatsapp_business_account') {
    return Response.json({ received: true });
  }

  const base44 = createClientFromRequest(req);

  try {
    const entries: any[] = payload.entry ?? [];
    for (const entry of entries) {
      for (const change of (entry.changes ?? [])) {
        if (change.field !== 'messages') continue;

        const value = change.value ?? {};
        const contacts: any[] = value.contacts ?? [];
        const messages: any[] = value.messages ?? [];
        const statuses: any[] = value.statuses ?? [];

        // ── Mensagens recebidas ─────────────────────────────────────────
        for (const msg of messages) {
          const from: string = msg.from;
          const msgId: string = msg.id;
          const tipo: string = msg.type;
          const nomeContato: string =
            contacts.find((c: any) => c.wa_id === from)?.profile?.name ?? '';

          let conteudo = '';
          if (tipo === 'text') conteudo = msg.text?.body ?? '';
          else if (tipo === 'image') conteudo = '[imagem]';
          else if (tipo === 'audio') conteudo = '[áudio]';
          else if (tipo === 'document') conteudo = `[documento: ${msg.document?.filename ?? ''}]`;
          else conteudo = `[${tipo}]`;

          console.log(`[whatsappWebhook] entrada de +${from} (${nomeContato}): ${conteudo}`);

          await base44.asServiceRole.entities.LogWhatsApp.create({
            direcao: 'entrada',
            tipo: 'mensagem_recebida',
            telefone: `+${from}`,
            mensagem: conteudo,
            message_id: msgId,
            status: 'entregue',
            referencia_id: nomeContato || undefined,
          });

          if (tipo === 'text') {
            await enviarAutoResposta(from, nomeContato);
          }
        }

        // ── Atualizações de status de entrega ───────────────────────────
        for (const st of statuses) {
          const msgId: string = st.id;
          const statusMeta: string = st.status; // sent | delivered | read | failed
          const statusMap: Record<string, string> = {
            sent: 'enviado',
            delivered: 'entregue',
            read: 'lido',
            failed: 'falhou',
          };
          const statusDB = statusMap[statusMeta] ?? statusMeta;
          console.log(`[whatsappWebhook] status msgId=${msgId}: ${statusMeta}`);

          try {
            const logs = await base44.asServiceRole.entities.LogWhatsApp.filter({ message_id: msgId });
            if (logs?.length > 0) {
              await base44.asServiceRole.entities.LogWhatsApp.update(logs[0].id, { status: statusDB });
            } else {
              await base44.asServiceRole.entities.LogWhatsApp.create({
                direcao: 'saida',
                tipo: 'status_entrega',
                telefone: `+${st.recipient_id ?? ''}`,
                message_id: msgId,
                status: statusDB,
              });
            }
          } catch (err) {
            console.error('[whatsappWebhook] erro ao atualizar status:', err.message);
          }
        }
      }
    }
  } catch (err) {
    console.error('[whatsappWebhook] erro ao processar payload:', err.message);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }

  return Response.json({ received: true });
});
