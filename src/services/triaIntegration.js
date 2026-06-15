// Integração TrIA: conecta chat com os 4 fluxos de automação

import { base44 } from '@/api/base44Client';
import { createServiceRequest, TRIA_SYSTEM_PROMPT } from './triaDiscoveryFlow.js';
import { handleEvaluationSubmitted } from './posServicoService.js';

/**
 * Hook para integração de ações TrIA com o chat
 * Detecta e executa ações disparadas pelo agente
 */
export async function processTrIAAction(action, dados) {
  try {
    switch (action) {
      case 'createServiceRequest':
        return await createServiceRequest(dados);

      case 'submitEvaluation':
        return await handleEvaluationSubmitted(
          dados.serviceId,
          dados.rating,
          dados.comment
        );

      case 'trackEvent':
        // Rastrear eventos de interação do usuário
        console.log('[TrIA] Evento rastreado:', dados);
        return true;

      default:
        console.warn('[TrIA] Ação desconhecida:', action);
        return null;
    }
  } catch (error) {
    console.error('[TrIA] Erro ao processar ação:', action, error);
    throw error;
  }
}

/**
 * Configurar agente TrIA com system prompt e custom functions
 */
export async function setupTrIAAgent() {
  try {
    console.log('[TrIA] Configurando agente...');

    // Verificar se o agente já existe
    const existingAgent = await base44.agents.getAgent('toca').catch(() => null);

    if (existingAgent) {
      console.log('[TrIA] Agente já configurado');
      return existingAgent;
    }

    // Criar agente com system prompt
    const agent = await base44.agents.createAgent({
      name: 'toca',
      description: 'Assistente TrIA para qualificar clientes',
      systemPrompt: TRIA_SYSTEM_PROMPT,
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 1024,
    });

    console.log('[TrIA] Agente criado com sucesso');
    return agent;
  } catch (error) {
    console.error('[TrIA] Erro ao configurar agente:', error);
    // Continuar mesmo se falhar (agente pode estar já configurado no backend)
  }
}

/**
 * Interceptar resposta do agente e executar ações
 */
export function createTrIAResponseInterceptor() {
  return async (response) => {
    try {
      // Detectar padrão de ação na resposta
      // Exemplo: {"action": "createServiceRequest", "dados": {...}}
      const actionMatch = response.match(/\{["']action["']:\s*["'](\w+)["'],\s*["']dados["']:\s*(\{.*?\})\}/s);

      if (actionMatch) {
        const [, action, jsonStr] = actionMatch;
        const dados = JSON.parse(jsonStr);

        console.log('[TrIA] Executando ação:', action);
        await processTrIAAction(action, dados);

        // Remover a ação JSON da resposta visível
        return response.replace(actionMatch[0], '').trim();
      }

      return response;
    } catch (error) {
      console.error('[TrIA] Erro ao interceptar resposta:', error);
      return response;
    }
  };
}

/**
 * Validar formato de WhatsApp
 */
export function validateWhatsApp(whatsapp) {
  if (!whatsapp) return false;

  // Remove espaços e hífens
  const cleaned = whatsapp.replace(/[\s-]/g, '');

  // Validar formatos: +5585987654321 ou 85987654321
  const patterns = [
    /^\+55\d{10,11}$/, // +55 com 10 ou 11 dígitos
    /^\d{10,11}$/, // Sem +55, 10 ou 11 dígitos
  ];

  return patterns.some((p) => p.test(cleaned));
}

/**
 * Formatar WhatsApp para envio
 */
export function formatWhatsAppForAPI(whatsapp) {
  if (!whatsapp) return null;

  let cleaned = whatsapp.replace(/[\s-]/g, '');

  // Adicionar +55 se não existir
  if (!cleaned.startsWith('+55')) {
    // Se começar com 0, remover
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    cleaned = '+55' + cleaned;
  }

  return cleaned;
}
