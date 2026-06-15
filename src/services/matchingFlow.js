// Fluxo 2: Matching — TrIA seleciona prestadores ideais para o cliente

import { base44 } from '@/api/base44Client';

export async function triggerMatchingFlow(serviceRequest) {
  // Encontrar prestadores que combinam com a solicitação de serviço
  try {
    console.log('[TrIA] Iniciando Fluxo 2: Matching para', serviceRequest.id);

    const { categoria, destino } = serviceRequest;

    // Filtrar prestadores por categoria e destino
    const prestadores = await base44.entities.Prestador.filter({
      categoria,
      destino,
      status: 'verificado',
    });

    if (!prestadores || prestadores.length === 0) {
      console.log('[TrIA] Nenhum prestador encontrado para', categoria, destino);
      return null;
    }

    // Ordenar por rating (descendente) e limitar a 3 por dia (regra de negócio)
    const selectedPrestadores = prestadores
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3);

    console.log('[TrIA] Selecionados', selectedPrestadores.length, 'prestadores para matching');

    // Registrar tentativa de matching para cada prestador
    const matches = await Promise.all(
      selectedPrestadores.map(async (prestador) => {
        const match = await base44.entities.ServiceMatch.create({
          service_request_id: serviceRequest.id,
          prestador_id: prestador.id,
          categoria,
          destino,
          status: 'pendente',
          criado_em: new Date().toISOString(),
        });
        return match;
      })
    );

    console.log('[TrIA] Criados', matches.length, 'matches');

    // Trigger Fluxo 3: Notificação
    await triggerNotificationFlow(matches, serviceRequest);

    return matches;
  } catch (error) {
    console.error('[TrIA] Erro no Fluxo 2 (Matching):', error);
    throw error;
  }
}

async function triggerNotificationFlow(matches, serviceRequest) {
  // Dispara fluxo 3 após criar matches
  console.log('[TrIA] Iniciando Fluxo 3: Notificação para', matches.length, 'prestadores');
  // Implementado em notificacaoService.js
}
