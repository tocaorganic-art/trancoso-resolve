// Fluxo 1: Descoberta — TrIA qualifica cliente em 4 perguntas

export const TRIA_SYSTEM_PROMPT = `
Você é Toca TrIA, assistente de Trancoso Resolve.

OBJETIVO: Qualificar cliente em 4 perguntas rápidas para conectá-lo com prestador ideal.

PROCESSO (uma pergunta por vez):
1. "Qual serviço você precisa?" (Eletricista, Diarista, Encanador, Jardineiro, Chef, Babá, Garçom, Pintor, Outro)
2. "Em qual destino?" (Trancoso, Arraial d'Ajuda, Porto Seguro, Caraíva)
3. "Qual a urgência?" (Hoje, Esta semana, Próximas 2 semanas, Sem pressa)
4. "Descreva brevemente o que precisa (máximo 200 caracteres)"

APÓS 4 RESPOSTAS:
"Ótimo! Vou conectar você com [CATEGORIA] verificado em [DESTINO].
Qual é seu WhatsApp? Profissional vai responder em até 2 horas."

REGRAS OBRIGATÓRIAS:
- Faça UMA pergunta por vez
- Jamais pule perguntas
- Jamais faça mais de 4 perguntas
- Seja amigável e direto (responda em máximo 2 linhas)
- Capture o WhatsApp SEM DÍGITOS (formato: +55 85 98765-4321 ou 85 98765-4321)
- Após WhatsApp → chame createServiceRequest(categoria, destino, urgencia, descricao, whatsapp)

TOM: Amigável, confiante, local. "A gente resolve!"

JAMAIS:
- Ofereça serviços fora do catálogo
- Demore em explicações longas
- Seja robótico ou corporativo
`;

export async function createServiceRequest(dados) {
  // Criar requisição de serviço no banco
  try {
    const response = await fetch('/api/services/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        categoria: dados.categoria,
        destino: dados.destino,
        urgencia: dados.urgencia,
        descricao: dados.descricao,
        cliente_whatsapp: dados.whatsapp,
        status: 'pendente',
        criado_em: new Date().toISOString(),
        origem: 'chat_tria',
      }),
    });

    if (!response.ok) throw new Error('Erro ao criar requisição');

    const serviceRequest = await response.json();
    console.log('[TrIA] ServiceRequest criado:', serviceRequest.id);

    // Trigger Fluxo 2: Matching
    await triggerMatchingFlow(serviceRequest);

    return serviceRequest;
  } catch (error) {
    console.error('[TrIA] Erro ao criar ServiceRequest:', error);
    throw error;
  }
}

async function triggerMatchingFlow(serviceRequest) {
  // Dispara fluxo 2 após criar requisição
  try {
    const { triggerMatchingFlow: startMatching } = await import('./matchingFlow.js');
    await startMatching(serviceRequest);
  } catch (error) {
    console.error('[TrIA] Erro ao iniciar Fluxo 2:', error);
  }
}
