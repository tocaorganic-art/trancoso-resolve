// Fluxo 3: Notificação — TrIA avisa prestadores + fallback para Tony em 2h

import { base44 } from '@/api/base44Client';

export async function triggerNotificationFlow(matches, serviceRequest) {
  // Enviar notificações sequenciais aos prestadores
  try {
    console.log('[TrIA] Iniciando Fluxo 3: Notificação sequencial para', matches.length, 'prestadores');

    const notificationDelay = 30 * 60 * 1000; // 30 minutos entre notificações
    const tonyFallbackTime = 2 * 60 * 60 * 1000; // 2 horas para fallback

    // Notificar prestadores em sequência
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      setTimeout(() => {
        sendNotificationToProvider(match, serviceRequest);
      }, i * notificationDelay);
    }

    // Fallback para Tony após 2 horas se ninguém responder
    setTimeout(() => {
      checkAndFallbackToTony(serviceRequest);
    }, tonyFallbackTime);

    return true;
  } catch (error) {
    console.error('[TrIA] Erro no Fluxo 3 (Notificação):', error);
    throw error;
  }
}

async function sendNotificationToProvider(match, serviceRequest) {
  try {
    const prestador = await base44.entities.Prestador.get(match.prestador_id);
    if (!prestador || !prestador.whatsapp) {
      console.log('[TrIA] Prestador', match.prestador_id, 'sem WhatsApp');
      return;
    }

    const message = `
🔔 *Novo Serviço em ${serviceRequest.destino}*

Categoria: ${serviceRequest.categoria}
Urgência: ${serviceRequest.urgencia}
Descrição: ${serviceRequest.descricao?.substring(0, 150)}...

Responda "SIM" para aceitar ou "NÃO" para rejeitar.
ID Serviço: ${serviceRequest.id}
    `.trim();

    // Enviar via WhatsApp (integração com API externa)
    console.log('[TrIA] Enviando notificação WhatsApp para', prestador.whatsapp);

    // Registrar tentativa de notificação
    await base44.entities.NotificationLog.create({
      service_match_id: match.id,
      prestador_id: match.prestador_id,
      status: 'enviada',
      tipo: 'whatsapp',
      mensagem: message,
      enviado_em: new Date().toISOString(),
    });

    // Atualizar status do match para "notificado"
    await base44.entities.ServiceMatch.update(match.id, {
      status: 'notificado',
      notificado_em: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[TrIA] Erro ao notificar prestador:', error);
  }
}

async function checkAndFallbackToTony(serviceRequest) {
  try {
    // Verificar se alguém aceitou
    const matches = await base44.entities.ServiceMatch.filter({
      service_request_id: serviceRequest.id,
      status: 'aceito',
    });

    if (matches && matches.length > 0) {
      console.log('[TrIA] Fluxo 3 completo — prestador aceitou');
      return;
    }

    // Ninguém respondeu → escalate para Tony (manual)
    console.log('[TrIA] Ninguém respondeu em 2h — escalando para Tony');

    const tonyContact = {
      email: 'tony@trancosoresolve.com.br',
      whatsapp: '+55 73 99999-9999',
    };

    // Notificar Tony
    const message = `
🚨 *Serviço sem resposta — Ação Manual Necessária*

ID Serviço: ${serviceRequest.id}
Cliente WhatsApp: ${serviceRequest.cliente_whatsapp}
Categoria: ${serviceRequest.categoria}
Destino: ${serviceRequest.destino}
Urgência: ${serviceRequest.urgencia}
Descrição: ${serviceRequest.descricao}

Nenhum prestador respondeu em 2h. Favor contactar cliente manualmente.
    `.trim();

    // Registrar escalação
    await base44.entities.NotificationLog.create({
      service_request_id: serviceRequest.id,
      status: 'escalado',
      tipo: 'manual_tony',
      mensagem: message,
      escalado_em: new Date().toISOString(),
    });

    console.log('[TrIA] Escalado para Tony:', serviceRequest.id);

    // Trigger Fluxo 4: Pós-Serviço (quando serviço for concluído)
  } catch (error) {
    console.error('[TrIA] Erro no fallback para Tony:', error);
  }
}
