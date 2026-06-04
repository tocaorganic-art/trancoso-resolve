import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    // Suporta chamada direta (leadId) e automação de entity (body.data ou event.entity_id)
    let lead = body.data || null;

    if (!lead) {
      const leadId = body.leadId || body.event?.entity_id;
      if (!leadId) {
        return Response.json({ error: 'leadId is required' }, { status: 400 });
      }
      const leads = await base44.asServiceRole.entities.LeadPreLancamento.filter({ id: leadId });
      lead = leads?.[0];
    }

    if (!lead) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    const serviceLabel = lead.service_interest || 'Serviço';
    const sourceLabel = lead.source === 'pagina-servico'
      ? `Página de serviço (${serviceLabel})`
      : (lead.source || 'Plataforma');

    // 1. Email de boas-vindas para o lead (se tiver email)
    if (lead.email) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: lead.email,
        from_name: 'Trancoso Resolve',
        subject: `${lead.name}, recebemos seu pedido! 🎉`,
        body: `Olá, ${lead.name}!

Recebemos sua solicitação de ${serviceLabel} em Trancoso e já estamos conectando você com os melhores profissionais da região.

📱 Em breve você receberá contato direto pelo WhatsApp que você informou: ${lead.phone}

O que acontece agora:
• Profissionais verificados da plataforma receberão seu pedido
• Você será contatado diretamente por WhatsApp para combinar detalhes, valores e agenda
• Todos os prestadores passam por verificação de identidade e análise de antecedentes

Se tiver dúvidas, acesse: https://trancosoresolve.com.br

Att,
Equipe Trancoso Resolve`,
      });
    }

    // 2. Notificação interna para a equipe
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'contato@trancosoresolve.com.br',
      from_name: 'Trancoso Resolve — Sistema',
      subject: `🔔 Novo Lead: ${lead.name} — ${serviceLabel}`,
      body: `Novo lead capturado na plataforma!

📋 DADOS DO LEAD
Nome: ${lead.name}
WhatsApp: ${lead.phone}
Email: ${lead.email || '(não informado)'}
Serviço de interesse: ${serviceLabel}
Origem: ${sourceLabel}
Tipo: ${lead.type || 'cliente'}
Mensagem: ${lead.message || '(não informado)'}

🕐 Recebido em: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Bahia' })}

Acesse o painel admin para mais detalhes.`,
    });

    return Response.json({ success: true, message: 'Notifications sent' });
  } catch (error) {
    console.error('[notifyNewLead] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});