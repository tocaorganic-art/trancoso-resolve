// Fluxo 4: Pós-Serviço — TrIA coleta avaliação 48h após conclusão + resgate de baixos ratings

import { base44 } from '@/api/base44Client';

export async function triggerPostServiceFlow(completedService) {
  // Agendar avaliação 48h após conclusão do serviço
  try {
    console.log('[TrIA] Iniciando Fluxo 4: Pós-Serviço para', completedService.id);

    const evaluationDelay = 48 * 60 * 60 * 1000; // 48 horas

    // Agendar coleta de avaliação
    setTimeout(() => {
      sendEvaluationRequest(completedService);
    }, evaluationDelay);

    return true;
  } catch (error) {
    console.error('[TrIA] Erro no Fluxo 4 (Pós-Serviço):', error);
    throw error;
  }
}

async function sendEvaluationRequest(service) {
  try {
    console.log('[TrIA] Enviando pedido de avaliação para serviço', service.id);

    const message = `
⭐ *Sua avaliação importa!*

Como foi o serviço de ${service.categoria} em ${service.destino}?

Clique aqui para avaliar (1-5 estrelas):
https://app.trancosoresolve.com.br/avaliar/${service.id}

Sua opinião ajuda outros clientes a encontrar os melhores profissionais.
    `.trim();

    // Enviar via WhatsApp para o cliente
    console.log('[TrIA] Enviando mensagem de avaliação para', service.cliente_whatsapp);

    // Registrar envio
    await base44.entities.NotificationLog.create({
      service_request_id: service.id,
      status: 'enviada',
      tipo: 'evaluation_request',
      mensagem: message,
      enviado_em: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[TrIA] Erro ao enviar pedido de avaliação:', error);
  }
}

export async function handleEvaluationSubmitted(serviceId, rating, comment) {
  // Processar avaliação recebida
  try {
    console.log('[TrIA] Avaliação recebida para serviço', serviceId, ':', rating, 'estrelas');

    // Registrar avaliação
    const review = await base44.entities.Review.create({
      service_request_id: serviceId,
      rating,
      comment,
      criado_em: new Date().toISOString(),
    });

    // Se rating baixo (< 3 estrelas), triggar resgate proativo
    if (rating < 3) {
      await triggerLowRatingRescue(serviceId, rating, comment);
    }

    return review;
  } catch (error) {
    console.error('[TrIA] Erro ao registrar avaliação:', error);
    throw error;
  }
}

async function triggerLowRatingRescue(serviceId, rating, comment) {
  try {
    console.log('[TrIA] Rating baixo detectado —', rating, 'estrelas. Iniciando resgate.');

    const service = await base44.entities.ServiceRequest.get(serviceId);
    const prestador = await base44.entities.Prestador.get(service.prestador_id);

    // Mensagem de resgate para o cliente
    const rescueMessage = `
🤝 *Desculpamos! Queremos melhorar sua experiência.*

Entendemos que o serviço não foi o esperado.
${prestador?.name || 'O prestador'} foi contatado para corrigir o problema.

Você gostaria de:
1️⃣ Que o profissional refaça o serviço
2️⃣ Reembolso total
3️⃣ Desconto no próximo serviço

Responda com o número da opção.
    `.trim();

    // Notificar cliente
    await base44.entities.NotificationLog.create({
      service_request_id: serviceId,
      status: 'enviada',
      tipo: 'low_rating_rescue',
      mensagem: rescueMessage,
      enviado_em: new Date().toISOString(),
    });

    // Notificar prestador para melhoria
    const prestadorMessage = `
⚠️ *Feedback de Cliente: ${rating} Estrelas*

Serviço ID: ${serviceId}
Comentário: ${comment?.substring(0, 200)}...

Favor entrar em contato com o cliente para resolver.
Qualidade é nossa prioridade!
    `.trim();

    await base44.entities.NotificationLog.create({
      service_request_id: serviceId,
      prestador_id: prestador?.id,
      status: 'enviada',
      tipo: 'provider_feedback',
      mensagem: prestadorMessage,
      enviado_em: new Date().toISOString(),
    });

    console.log('[TrIA] Resgate iniciado para serviço com rating baixo:', serviceId);
  } catch (error) {
    console.error('[TrIA] Erro no resgate de rating baixo:', error);
  }
}
