# RELATÓRIO DE ARQUITETURA: TOCA TRIA V2
## Separação de Responsabilidades - Camada de IA vs Interface

**Data**: 13 de maio de 2026  
**Status**: ✅ Implementado e Documentado  
**Prioridade**: Fase 1 - Núcleo de Arquitetura

---

## 📊 DIAGRAMA DE FLUXO

```
┌─────────────────────────────────────────────────────────────────┐
│                        USUÁRIO FINAL                             │
│             (Cliente / Prestador / Turista)                      │
└────────────────────┬────────────────────────────────────────────┘
                     │ Digita mensagem em qualquer idioma
                     ▼
     ┌───────────────────────────────┐
     │  CHAT TRANCOSO RESOLVE        │  ← CAMADA DE INTERFACE
     │  (Interface de Conversa)      │
     │                               │
     │  ✅ Recebe texto do usuário    │
     │  ✅ Passa para Toca TrIA      │
     │  ✅ Exibe resposta             │
     │  ❌ NÃO faz NLP                │
     │  ❌ NÃO decide lógica          │
     └────────────┬──────────────────┘
                  │
                  │ POST /api/toca-tria/message
                  │ {
                  │   message: string,
                  │   user_id?: string,
                  │   user_type: "cliente|prestador|anonimo",
                  │   language: "pt|en|es|fr",
                  │   session_id: string
                  │ }
                  ▼
     ┌─────────────────────────────────────────┐
     │   TOCA TRIA (Agente de IA)              │  ← CAMADA DE IA
     │   NÚCLEO DE INTELIGÊNCIA                │
     │                                         │
     │  1. ENTENDER                            │
     │     └─ NLP: O que o usuário quer?      │
     │                                         │
     │  2. CLASSIFICAR INTENÇÃO                │
     │     └─ [BUSCA_SERVICO]                  │
     │     └─ [AGENDAMENTO]                    │
     │     └─ [DUVIDA_PLANO]                   │
     │     └─ [DUVIDA_VERIFICACAO]             │
     │     └─ [GESTAO_PERFIL]                  │
     │     └─ [CURADORIA_LOCAL]                │
     │                                         │
     │  3. COLETAR DADOS (se necessário)       │
     │     └─ Qual serviço?                    │
     │     └─ Qual bairro?                     │
     │     └─ Que urgência?                    │
     │                                         │
     │  4. DECIDIR AÇÃO                        │
     │     ├─ Chamar ferramenta interna?       │
     │     │  └─ [buscar_prestadores]          │
     │     │  └─ [criar_solicitacao]           │
     │     │  └─ [ver_status_verificacao]      │
     │     │                                    │
     │     └─ Chamar API externa?              │
     │        └─ [Google Translate]            │
     │        └─ [Weather API]                 │
     │        └─ [Maps API]                    │
     │                                         │
     │  5. MONTAR RESPOSTA                     │
     │     └─ Estruturada, acionável,          │
     │        personalizada por tipo_user      │
     │                                         │
     │  6. RETORNAR                            │
     │     {                                   │
     │       reply: string,                    │
     │       intent: string,                   │
     │       actions?: string[]                │
     │     }                                   │
     └────────┬────────────────────────────────┘
              │
     ┌────────┴──────────────────────────────────┐
     │                                           │
     │       FERRAMENTAS INTERNAS                │   ← CAMADA DE DADOS
     │       (Entidades Base44)                  │
     │                                           │
     │  • ServiceProvider (ler)                  │
     │  • ServiceRequest (ler, criar)            │
     │  • Verificacao (ler)                      │
     │  • Plan (ler)                             │
     │  • ServiceReview (ler)                    │
     │                                           │
     └────────────────────────────────────────┘
                     │
     ┌───────────────┴──────────────────────────┐
     │                                          │
     │      APIs EXTERNAS                       │   ← CAMADA EXTERNA
     │      (Chamadas SOMENTE via Toca TrIA)    │
     │                                          │
     │  • Google Translate API                  │
     │  • Google Maps API                       │
     │  • Weather API (OpenWeather)             │
     │  • Event Discovery API                   │
     │                                          │
     └──────────────────────────────────────────┘
```

---

## 🎯 RESPONSABILIDADES POR CAMADA

### CAMADA 1: Chat Trancoso Resolve (Interface de Conversa)

**Arquivo**: `components/assistente/TrIAChatArea.jsx`  
**Responsável por**:

✅ **FAZER**:
- Renderizar UI do chat (bubbles, input, botões)
- Receber texto digitado pelo usuário
- Manter estado local da conversa (mensagens visíveis)
- Gerenciar seletor de idioma (language state)
- Animar mensagens, status "digitando", indicadores de carregamento
- Exibir resposta que Toca TrIA retorna

❌ **NÃO FAZER**:
- Detectar intenção (quem quer busca vs agendamento?)
- Chamar banco de dados direto
- Invocar APIs externas (Google Translate, Maps, etc.)
- Tomar decisão de qual ferramenta usar
- Validar dados complexos
- Implementar regras de negócio

**Exemplo de Fluxo Correto**:
```javascript
// ✅ CORRETO: Chat apenas passa mensagem adiante
const handleSendMessage = async (content) => {
  setInput('');
  setIsLoading(true);
  
  try {
    // Chamar o ENDPOINT do Toca TrIA (não diretamente a função)
    const response = await fetch('/api/toca-tria/message', {
      method: 'POST',
      body: JSON.stringify({
        message: content,
        language: language,
        user_type: userType, // cliente|prestador|anonimo
        session_id: sessionId
      })
    });
    
    const { reply } = await response.json();
    setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
  } finally {
    setIsLoading(false);
  }
};
```

---

### CAMADA 2: Toca TrIA (Núcleo de Inteligência)

**Arquivo**: `agents/toca.json`  
**Responsável por**:

✅ **FAZER**:
1. **Entender**: NLP - o que o usuário quer?
2. **Classificar**: Detectar intenção ([BUSCA_SERVICO], [AGENDAMENTO], etc.)
3. **Coletar**: Pedir dados faltantes (bairro, data, urgência)
4. **Decidir**: Qual ferramenta usar (interna ou externa)?
5. **Executar**: Chamar entidades ou APIs
6. **Responder**: Estruturar resposta clara e acionável

❌ **NÃO FAZER**:
- Renderizar HTML/CSS
- Decidir layout da interface
- Armazenar UI state
- Conectar direto a componentes React

**Responsabilidades Detalhadas**:

#### 2.1 Entender e Classificar (Cadeia de Pensamento)

```
Input: "Preciso de um eletricista urgente em Quadrado"

Toca TrIA (internamente):
1. INTENÇÃO: [BUSCA_SERVICO]
2. TIPO_USUARIO: cliente (não logado? anonimo)
3. CONTEXTO: eletricista, Quadrado, urgente
4. PROXIMA_ACAO: [buscar_prestadores] com params
5. COMPLICACOES: Sem data específica, precisa confirmar

Output ao Chat:
{
  "reply": "Ótimo! Encontrei 3 eletricistas em Quadrado. Preciso confirmar: é para hoje ou amanhã? E que horário?",
  "intent": "BUSCA_SERVICO",
  "actions": ["await_date_confirmation"]
}
```

#### 2.2 Coletar Dados Necessários

Toca TrIA SEMPRE coleta ANTES de chamar ferramentas:
- Serviço/categoria
- Localização (bairro/rua)
- Data/urgência
- Detalhes adicionais

Exemplo:
```
User: "Preciso de um serviço"
Toca: "Qual tipo de serviço? (limpeza, reparo, construção?)"
User: "Limpeza"
Toca: "Qual bairro? (Quadrado, Taípe, Rio da Barra, outro?)"
User: "Quadrado"
Toca: "Quando? Hoje, amanhã, próxima semana?"
User: "Hoje à tarde"

→ Agora tem TODOS os dados, chama [buscar_prestadores]
```

#### 2.3 Decidir e Executar Ações

Toca TrIA tem acesso a:

**Ferramentas Internas** (Entidades Base44):
- `ServiceProvider.list()` / `.filter()` → buscar prestadores
- `ServiceRequest.create()` → criar solicitação
- `Verificacao.read()` → consultar status
- `Plan.list()` → ver planos disponíveis
- `ServiceReview.list()` → ler avaliações

**APIs Externas** (Toca TrIA as chama):
- `tocaTriaTranslator` (Google Translate)
- Futuros: Weather API, Maps API, Events API

#### 2.4 Respeitar RLS (Row Level Security)

Toca TrIA NUNCA lê dados que o usuário não deveria ter:
```javascript
// ✅ CORRETO: Toca TrIA respeita RLS
const prestador = await base44.entities.Verificacao.read(prestador_id);
// Banco rejeita automaticamente se usuário não tem permissão

// ❌ ERRADO: Tentar contornar RLS
const allUsers = await fetch('/api/users'); // Não faz isso!
```

---

### CAMADA 3: APIs Externas

**Exemplos**:
- Google Translate API
- Google Maps API
- OpenWeather API
- EventBrite API

**Responsável por**:
✅ Entregar dados quando chamadas via Toca TrIA
❌ Nunca são chamadas direto do Chat
❌ Nunca guardam contexto de negócio Trancoso Resolve

**Configuração**:
```javascript
// ✅ CORRETO: Toca TrIA chama API
const response = await fetch('https://translation.googleapis.com/...', {
  headers: { 'Authorization': 'Bearer ...' }
});

// ❌ ERRADO: Chat chama API direto
// (Chat NUNCA faz isso)
```

---

## 🔄 FLUXO DE MENSAGEM PASSO A PASSO

### Exemplo 1: Cliente Busca Eletricista

```
PASSO 1: Usuário digita no Chat
   User: "Eletricista em Quadrado"
   Chat recebe input, exibe na UI

PASSO 2: Chat envia para Toca TrIA
   Chat → POST /api/toca-tria/message
   Payload: {
     "message": "Eletricista em Quadrado",
     "language": "pt",
     "user_type": "anonimo"
   }

PASSO 3: Toca TrIA processa
   a) Entender: Quer buscar eletricista
   b) Classificar: [BUSCA_SERVICO]
   c) Dados coletados: eletricista ✓, Quadrado ✓, sem data ✗
   d) Decidir: Pedir confirmação de data/urgência
   
   e) NÃO chama ferramenta ainda (dados insuficientes)

PASSO 4: Toca TrIA retorna
   {
     "reply": "Encontrei eletricistas em Quadrado. Quando você precisa? Hoje, amanhã, ou outra data?",
     "intent": "BUSCA_SERVICO",
     "actions": ["await_date_confirmation"]
   }

PASSO 5: Chat exibe resposta
   Chat renderiza bubble com resposta
   Input fica ativo para próxima mensagem

PASSO 6: Usuário responde
   User: "Hoje à tarde"
   Chat → POST /api/toca-tria/message (novo payload)

PASSO 7: Toca TrIA processa (novamente)
   a) Entender: Quer eletricista hoje à tarde
   b) Classificar: [BUSCA_SERVICO] (confirmação)
   c) Dados: eletricista ✓, Quadrado ✓, hoje à tarde ✓
   d) Decidir: AGORA chama [buscar_prestadores]
   
   e) Executa:
      prestadores = ServiceProvider.filter({
        occupation: "eletricista",
        location.neighborhood: "Quadrado",
        availability: "Disponível"
      })
   
   f) Gera resposta com TOP 3:
      "⚡ Encontrei 3 eletricistas em Quadrado disponíveis hoje:
       1. João da Eletra (⭐4.9, 15+ serviços)
       2. Maria Técnica (⭐4.8, 8 serviços)
       3. Carlos Elétrica (⭐4.5, 12 serviços)
       
       Qual você prefere? (Digite 1, 2 ou 3)"

PASSO 8: Chat exibe lista
   Renderiza com imagens, ratings, botões de ação

PASSO 9: Usuário seleciona
   User: "1"
   Chat → POST /api/toca-tria/message

PASSO 10: Toca TrIA processa (agendamento)
   a) Intenção: [AGENDAMENTO]
   b) Executa: ServiceRequest.create({
        cliente_id: user_id,
        prestador_id: "joao_eletra_123",
        data: "2026-05-13",
        horario: "14:00",
        status: "Pendente"
      })
   c) Retorna confirmação

PASSO 11: Chat mostra confirmação final
   "✅ Agendamento confirmado! Referência #AG-001"
```

---

## 📱 IMPLEMENTAÇÃO FASE 1: IDIOMA + TRADUÇÃO

### 1.1 Seletor de Idioma (Chat)

**Arquivo**: `components/assistente/LanguageSelector.jsx`  
**Status**: ✅ Implementado

```javascript
// Chat passa language para Toca TrIA
<LanguageSelector 
  currentLanguage={language}
  onLanguageChange={setLanguage}
/>

// Ao enviar mensagem:
const payload = {
  message: userText,
  language: language,  // ← Toca TrIA usa isso
  user_type: "cliente"
};
```

### 1.2 Tradução em Toca TrIA

**Arquivo**: `functions/tocaTriaTranslator.js`  
**Status**: ✅ Implementado

**Fluxo**:
```
Usuario digita em INGLÊS:
  "I need an electrician"
  
Chat envia:
  { message: "I need an electrician", language: "en" }
  
Toca TrIA:
  1) Detecta language: "en" (não é PT)
  2) Chama tocaTriaTranslator:
     → Traduz para PT: "Preciso de um eletricista"
  3) Processa em PT (NLP, entidades, tudo em PT)
  4) Gera resposta em PT: "Ótimo! Qual bairro?"
  5) Traduz resposta para EN:
     → "Great! Which neighborhood?"
  6) Retorna ao Chat em EN

Chat exibe em INGLÊS:
  "Great! Which neighborhood?"
```

**Código em Toca TrIA**:
```javascript
async function processMessage(userMessage, language) {
  // Se não é PT, traduzir entrada
  let processMessage = userMessage;
  if (language !== 'pt') {
    const translated = await tocaTriaTranslator(
      userMessage,
      language,
      'pt'
    );
    processMessage = translated;
  }
  
  // Processa tudo em PT
  const intent = detectIntent(processMessage); // NLP em PT
  const response = await generateResponse(intent, ...); // Resposta em PT
  
  // Se não é PT, traduzir resposta
  let finalResponse = response;
  if (language !== 'pt') {
    finalResponse = await tocaTriaTranslator(
      response,
      'pt',
      language
    );
  }
  
  return { reply: finalResponse, intent };
}
```

### 1.3 Cache de Traduções

**Status**: ✅ Implementado em `tocaTriaTranslator.js`

```javascript
const translationCache = new Map(); // Max 500 entradas

// Mesma tradução não é feita 2x
if (cache has "I need an electrician|en|pt") {
  return cached version (instant)
}
```

---

## ✅ VALIDAÇÃO: CHECKLIST FINAL

### Chat (Interface)

- [x] Recebe input do usuário
- [x] Envia para endpoint único: `POST /api/toca-tria/message`
- [x] Exibe resposta retornada
- [x] Manage seletor de idioma (pass language no payload)
- [x] **NÃO tem** lógica de intenção
- [x] **NÃO chama** APIs externas
- [x] **NÃO faz** validações de negócio

### Toca TrIA (IA)

- [x] É o **único** ponto de decisão para:
  - Entender intenção
  - Chamar ferramentas internas
  - Chamar APIs externas
  - Adaptar tom (cliente vs prestador)
  - Respeitar RLS

- [x] Processa em PT internamente (traduz se necessário)
- [x] Coleta dados antes de agir
- [x] Retorna resposta estruturada e acionável
- [x] Respeita regras de verificação, planos, acesso

### APIs Externas

- [x] Google Translate: chamada SOMENTE via Toca TrIA
- [x] Cache de traduções em memória (500 max)
- [x] Fallback se API falhar (retorna texto original)

### Fluxo Idioma (Fase 1)

- [x] Seletor visível em Chat
- [x] Idioma (PT/EN/ES/FR) é passado em cada mensagem
- [x] Toca TrIA traduz entrada, processa, traduz saída
- [x] Usuário vê resposta sempre no seu idioma

---

## 📊 ENDPOINTS E PAYLOADS

### POST /api/toca-tria/message

**Request**:
```json
{
  "message": "texto que o usuário digitou",
  "user_id": "opcional_se_logado",
  "user_type": "cliente|prestador|anonimo",
  "language": "pt|en|es|fr",
  "session_id": "id_da_sessao"
}
```

**Response**:
```json
{
  "reply": "resposta formatada para exibir no chat",
  "intent": "[INTENCAO_DETECTADA]",
  "actions": ["acao1", "acao2"],
  "metadata": {
    "language_processed": "pt",
    "language_returned": "en",
    "translation_cache_size": 45
  }
}
```

### POST /api/toca-tria/translator

**Request**:
```json
{
  "text": "texto para traduzir",
  "sourceLanguage": "pt",
  "targetLanguage": "en"
}
```

**Response**:
```json
{
  "success": true,
  "original": "texto original",
  "translated": "texto traduzido",
  "sourceLanguage": "pt",
  "targetLanguage": "en",
  "cacheSize": 45
}
```

---

## 🚀 PRÓXIMOS PASSOS

### Fase 2: Personificação

- [ ] Adaptar tom para prestador (mais técnico, com números)
- [ ] Adaptar tom para cliente (mais acolhedor, orientado a ação)
- [ ] Diferentes prompts de boas-vindas por tipo_usuario

### Fase 3: APIs Externas Adicionais

- [ ] Google Maps (buscar proximidade de prestadores)
- [ ] Weather API (sugerir serviços por clima)
- [ ] EventBrite (eventos locais para curadoria)

### Fase 4: Persistência

- [ ] Histórico de conversas por session_id
- [ ] Analytics: quais intenções mais frequentes?
- [ ] A/B testing: qual tom converte mais?

---

## 🎓 DOCUMENTAÇÃO PARA DESENVOLVEDORES

### Para Quem Trabalha no Chat

**Regra #1**: Chat nunca toma decisão de lógica.  
**Regra #2**: Toda lógica vai para Toca TrIA.  
**Regra #3**: Chat é um pass-through: recebe → envia → exibe.

### Para Quem Trabalha em Toca TrIA

**Regra #1**: Você é o único "cérebro" da plataforma.  
**Regra #2**: Toda decisão passa por você (intenção, ferramentas, respostas).  
**Regra #3**: Sempre traduz entrada/saída se idioma ≠ PT.  
**Regra #4**: Nunca inventa dados; sempre valida ou pede.

### Para Quem Integra APIs Externas

**Regra #1**: APIs externas SÓ são chamadas por Toca TrIA.  
**Regra #2**: Chat NUNCA chama API externa.  
**Regra #3**: Se API cair, Toca TrIA tem fallback.

---

## 📝 CONCLUSÃO

✅ **Arquitetura clara**: Chat (interface) ↔ Toca TrIA (cérebro) ↔ APIs (dados)  
✅ **Responsabilidades definidas**: Cada camada sabe seu papel  
✅ **Idioma implementado**: PT/EN/ES/FR com tradução automática  
✅ **Pronto para produção**: Validado, documentado, testável  

**Próximo**: Deploy e testes com usuários reais (turistas/estrangeiros).