# 🧪 ROTEIRO DE TESTES: TOCA TRIA
## 5 Cenários Reais (PT + EN) | Meta: 30%+ conversão em leads

**Data**: 13 de maio de 2026  
**Objetivo**: Validar se Toca TrIA converte conversa em lead qualificado  
**Métrica**: % de conversas que chegam em "pegou contato + entendeu serviço + criou solicitação"

---

## 📋 COMO ANOTAR UM LEAD

**Lead Convertido** ✅:
- [x] Toca TrIA perguntou qual serviço específico
- [x] Toca TrIA perguntou bairro/data
- [x] Toca TrIA ofereceu prestadores OU criou solicitação
- [x] Cliente teve ação clara (escolheu prestador, agendou, deixou contato)

**Lead Falhado** ❌:
- Conversa morreu (cliente parou de responder)
- Toca TrIA deu resposta genérica (não levou a ação)
- Cliente pediu algo que plataforma não faz (ex: "faça o serviço para mim")

---

## 🇧🇷 CENÁRIOS EM PORTUGUÊS (Cliente Local)

### Cenário 1: Limpeza Urgente

**Seu input (como cliente)**:
```
"Preciso de alguém para limpeza de uma casa amanhã em Quadrado. É urgente."
```

**O que observar**:
- Toca TrIA detectou [BUSCA_SERVICO] + urgência?
- Pediu informações: quantos cômodos? Que tipo de limpeza?
- Ofereceu prestadores verificados de Quadrado?
- Tom: acolhedor, direto, orientado a ação?

**Conversa esperada**: 4-5 trocas (não mais, não menos)

**Anotar**:
```
[ ] Lead convertido ✅
[ ] Lead falhado ❌
Motivo: ________________
```

---

### Cenário 2: Serviço de Cozinheiro (Lead Qualificado)

**Seu input**:
```
"Olá! Estou planejando uma festa para 20 pessoas no fim de semana, e quero contratar um cozinheiro. Já tem alguém que você recomenda?"
```

**O que observar**:
- Toca TrIA entendeu que é evento + contratação?
- Perguntou data exata, cardápio, orçamento?
- Ofereceu cozinheiros verificados?
- Conseguiu "fechar" uma solicitação (pegou contato, data, tudo)?

**Conversa esperada**: 5-6 trocas

**Anotar**:
```
[ ] Lead convertido ✅
[ ] Lead falhado ❌
Motivo: ________________
```

---

### Cenário 3: Dúvida + Busca Misturada

**Seu input**:
```
"Oi, tudo bem? Eu não sei como funciona esse negócio de serviços. Eu preciso de um eletricista para instalar uma TV na parede. Como eu faço?"
```

**O que observar**:
- Toca TrIA explicou o que é plataforma rapidamente?
- Virou para ação (pegou dados do serviço)?
- Não ficou muito "explicativo" (risco: virar aula)?
- Conseguiu capturar: eletricista → instalação de TV → local?

**Conversa esperada**: 4-5 trocas

**Anotar**:
```
[ ] Lead convertido ✅
[ ] Lead falhado ❌
Motivo: ________________
```

---

### Cenário 4: Cliente Prestador (Quer Saber sobre Plano)

**Seu input**:
```
"Oi! Sou eletricista em Trancoso e queria saber se dá pra eu me cadastrar aí. Como funciona? Que plano vocês têm?"
```

**O que observar**:
- Toca TrIA detectou [DUVIDA_PLANOS] + tipo_user: prestador?
- Explicou planos (Lançamento, Regular, Empresas) com números?
- Ofereceu próximo passo (cadastro, verificação)?
- Tom diferente de cliente (mais técnico)?

**Conversa esperada**: 3-4 trocas

**Anotar**:
```
[ ] Lead convertido ✅ (neste caso = prestador encaminhado pra onboarding)
[ ] Lead falhado ❌
Motivo: ________________
```

---

### Cenário 5: Reclamação / Caso Difícil

**Seu input**:
```
"Olá! Eu contratei um serviço semana passada e o cara não apareceu. Como eu faço pra reclamar?"
```

**O que observar**:
- Toca TrIA reconheceu que isso é [SUPORTE_GERAL], não [BUSCA_SERVICO]?
- Ofereceu soluções (ver solicitação, contatar suporte)?
- Escalou corretamente (não tentou resolver sozinha)?
- Tom empático?

**Conversa esperada**: 2-3 trocas

**Anotar**:
```
[ ] Lead convertido ✅ (neste caso = escalação para suporte)
[ ] Lead falhado ❌
Motivo: ________________
```

---

## 🌍 CENÁRIOS EM INGLÊS (Turista / Estrangeiro)

### Cenário 1: Private Chef (Turista Premium)

**Your input (como turista)**:
```
"Hello! I'm visiting Trancoso with my family for 10 days. I'd like to hire a private chef to cook at our villa. Can you help me find someone?"
```

**What to observe**:
- Toca TrIA responded in English?
- Understood [BUSCA_SERVICO] + "premium" angle?
- Asked key info: date range, dietary preferences, group size?
- Offered verified chefs?
- Tone: welcoming, professional, action-oriented?

**Expected conversation**: 5-6 exchanges

**Anotar**:
```
[ ] Lead convertido ✅
[ ] Lead falhado ❌
Reason: ________________
```

---

### Cenário 2: Tour Guide + Transport (Multi-Service)

**Your input**:
```
"We need a tour guide for Trancoso and also someone to drive us around. First time here, no idea where to start. Help?"
```

**What to observe**:
- Toca TrIA handled 2 services (tour + transport) or got confused?
- Asked dates, group size, preferences?
- Offered separate providers or combined solutions?
- Language: fluent English, no "lost in translation" moments?

**Expected conversation**: 6-7 exchanges

**Anotar**:
```
[ ] Lead convertido ✅
[ ] Lead falhado ❌
Reason: ________________
```

---

### Cenário 3: Emergency Service (Time-Sensitive)

**Your input**:
```
"Hi! I'm here on vacation and my AC broke. It's very hot. Can someone fix it today?"
```

**What to observe**:
- Toca TrIA recognized [BUSCA_SERVICO] + urgency?
- Immediately asked bairro/address?
- Understood "today" = same-day urgency?
- Offered fast response options?
- Tone: calm, solution-focused?

**Expected conversation**: 3-4 exchanges

**Anotar**:
```
[ ] Lead convertido ✅
[ ] Lead falhado ❌
Reason: ________________
```

---

### Cenário 4: Information Seeker (Not a Buyer)

**Your input**:
```
"What are the best beaches near Trancoso? And are there restaurants?"
```

**What to observe**:
- Toca TrIA recognized this is [CURADORIA_LOCAL], not [BUSCA_SERVICO]?
- Gave useful info but also tried to convert to service search?
- Didn't waste time on irrelevant info?
- Offered "looking for dining service?" as follow-up?

**Expected conversation**: 2-3 exchanges

**Anotar**:
```
[ ] Lead convertido ✅ (if pivoted to service)
[ ] Lead falhado ❌ (if stayed in info-mode)
Reason: ________________
```

---

### Cenário 5: Vague Request (Fishing)

**Your input**:
```
"I need someone who can do... everything? Like, everything a good local knows? Shopping, cooking, planning?"
```

**What to observe**:
- Toca TrIA asked for specifics instead of getting lost?
- Broken into individual services (shopping = service A, cooking = service B)?
- Didn't hallucinate "concierge" service that doesn't exist?
- Pragmatic: "I can help with X and Y, but not Z"?

**Expected conversation**: 4-5 exchanges

**Anotar**:
```
[ ] Lead convertido ✅
[ ] Lead falhado ❌
Reason: ________________
```

---

## 📊 SCORECARD: HOW TO TRACK

After running all 5 scenarios in each language (10 total), fill this out:

| Cenário | Idioma | Lead? | Motivo | Nota |
|---------|--------|-------|--------|------|
| 1. Limpeza Urgente | PT | [ ] ✅ [ ] ❌ | | |
| 2. Cozinheiro | PT | [ ] ✅ [ ] ❌ | | |
| 3. Dúvida + Busca | PT | [ ] ✅ [ ] ❌ | | |
| 4. Prestador | PT | [ ] ✅ [ ] ❌ | | |
| 5. Reclamação | PT | [ ] ✅ [ ] ❌ | | |
| 1. Private Chef | EN | [ ] ✅ [ ] ❌ | | |
| 2. Tour + Transport | EN | [ ] ✅ [ ] ❌ | | |
| 3. AC Urgência | EN | [ ] ✅ [ ] ❌ | | |
| 4. Info Seeker | EN | [ ] ✅ [ ] ❌ | | |
| 5. Vague Request | EN | [ ] ✅ [ ] ❌ | | |

**Total Conversões**: ___ / 10  
**Taxa**: ___% (Alvo: 30%+)

---

## 🎯 CRITÉRIO DE SUCESSO

- **80%+** (8/10): Toca TrIA está pronto para soft opening. Publicar.
- **50-70%** (5-7/10): Bom, mas ajuste o tom/fluxo. Faça mais testes.
- **< 50%** (< 5/10): Revise as instruções de Toca TrIA. Tipo user está confusa? Intenção está sendo detectada?

---

## 📝 TEMPLATE PARA RELATAR (Copie e cole aqui depois):

```
TESTE RODADO: [DATA]
TESTADOR: [SEU NOME]

PORTUGUÊS (5 cenários):
Cenário 1 (Limpeza): [ ] ✅ [ ] ❌ → Motivo: ___
Cenário 2 (Chef): [ ] ✅ [ ] ❌ → Motivo: ___
Cenário 3 (Dúvida): [ ] ✅ [ ] ❌ → Motivo: ___
Cenário 4 (Prestador): [ ] ✅ [ ] ❌ → Motivo: ___
Cenário 5 (Reclamação): [ ] ✅ [ ] ❌ → Motivo: ___
Subtotal PT: ___ / 5

ENGLISH (5 cenários):
Scenario 1 (Chef): [ ] ✅ [ ] ❌ → Reason: ___
Scenario 2 (Tour+Transport): [ ] ✅ [ ] ❌ → Reason: ___
Scenario 3 (AC): [ ] ✅ [ ] ❌ → Reason: ___
Scenario 4 (Info): [ ] ✅ [ ] ❌ → Reason: ___
Scenario 5 (Vague): [ ] ✅ [ ] ❌ → Reason: ___
Subtotal EN: ___ / 5

TOTAL: ___ / 10 (___ %)
STATUS: [ ] Pronto para soft opening | [ ] Ajustar tom | [ ] Revisar intenções

FEEDBACK:
- Melhor cenário: ___
- Pior cenário: ___
- Tom: (muito genérico? muito técnico? perfeito?)
- Sugestão de ajuste: ___
```

---

## 🚀 PRÓXIMAS AÇÕES

1. **Você roda os 10 cenários** (ou convida 1-2 pessoas para rodar também)
2. **Você me manda o scorecard** com os resultados
3. **Se taxa < 80%**: você me manda um dos diálogos que "falhou" → eu ajusto as instruções de Toca TrIA
4. **Se taxa >= 80%**: publicamos para soft opening com turistas

---

**Duração esperada**: 30 minutos (5 min por cenário + logging)  
**Quando**: Idealmente hoje (ainda é 13 de maio)  
**Depois**: Me manda o scorecard aqui mesmo nesse chat