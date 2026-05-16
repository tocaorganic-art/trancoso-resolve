# 📱 RELATÓRIO — INTEGRAÇÃO WHATSAPP BUSINESS × TOCA TRIA
**Trancoso Resolve | Gerado em: 2026-05-16**

---

## 1. STATUS ATUAL DO AGENTE

| Campo | Status |
|---|---|
| Agente | Toca TrIA |
| Canal WhatsApp | ✅ Configurado no agente (whatsapp_greeting definido) |
| Número a conectar | +55 73 99828-3579 |
| Canal Telegram | ❌ Não conectado (telegram_greeting: null) |
| Canal Line | ❌ Não conectado |
| Memória ativa | ✅ Sim (escopo: conversa + usuário) |

O agente **já possui o greeting de WhatsApp** definido. O que falta é **vincular o número físico** ao canal no painel Base44.

---

## 2. COMO CONECTAR O WHATSAPP BUSINESS — PASSO A PASSO

### Pré-requisito
- Número +55 73 99828-3579 deve ser um **número WhatsApp Business** (não pode ter o WhatsApp instalado em outro celular no momento da escaneamento).
- Acesso ao celular com esse número em mãos.

### Passo a Passo

**Passo 1 — Abrir o Painel Base44**
1. Acesse: `https://app.base44.com`
2. Clique no seu app **Trancoso Resolve** no dashboard.

**Passo 2 — Navegar até o Agente**
1. No menu lateral, clique em **"Agents"** (ou **"Agentes"**).
2. Localize o agente **"toca"** e clique nele.
3. Na tela do agente, clique na aba **"Channels"** (ou **"Canais"**).

**Passo 3 — Conectar o WhatsApp**
1. Localize o bloco **WhatsApp**.
2. Clique em **"Connect"** ou **"Conectar"**.
3. O sistema exibirá um **QR Code**.
4. No celular com o número +55 73 99828-3579:
   - Abra o WhatsApp Business
   - Toque em **⋮ (menu)** → **Aparelhos vinculados** → **Vincular um aparelho**
   - Aponte a câmera para o QR Code na tela
5. Aguarde a confirmação (ícone verde / "Connected").

**Passo 4 — Confirmar conexão**
- No painel, o status deve mudar para **"Active"** ou **"Ativo"**.
- O número conectado aparecerá ao lado do canal.

**Passo 5 — Testar**
- Envie uma mensagem de qualquer outro número para +55 73 99828-3579.
- A Toca TrIA deve responder automaticamente com o greeting configurado:
  > *"Olá! 👋 Sou a Toca TrIA, assistente da Trancoso Resolve..."*

> ⚠️ **Importante:** A conexão via QR Code tem validade. Se o celular ficar offline por muito tempo ou o WhatsApp for reinstalado, será necessário reconectar. Para conexão mais estável e sem QR Code, considere usar a **Meta WhatsApp Business API oficial** (requer aprovação da Meta).

---

## 3. MENSAGENS QUE O TOCA TRIA ENVIA/RECEBE PELO WHATSAPP

### Recebe (entrada)
| Tipo | Exemplo | Intenção detectada |
|---|---|---|
| Busca de serviço | "Preciso de diarista amanhã no Quadrado" | `[BUSCA_SERVICO]` |
| Dúvida sobre plano | "Qual o valor do plano mensal?" | `[DUVIDA_PLANOS]` |
| Status de verificação | "Minha verificação foi aprovada?" | `[DUVIDA_VERIFICACAO]` |
| Agendamento | "Quero agendar com João da Eletra" | `[AGENDAMENTO]` |
| Dúvida geral | "Como funciona a Trancoso Resolve?" | `[DUVIDA_TECNICA]` |

### Envia (saída — automático)
| Tipo | Gatilho | Canal |
|---|---|---|
| Resposta às perguntas | Qualquer mensagem recebida | WhatsApp |
| Confirmação de agendamento | Após criar ServiceRequest | WhatsApp |
| Fallback de erro | Ferramenta falha | WhatsApp |

> **Sobre duplicidade com Telegram:** O canal Telegram **não está conectado** atualmente, então não há risco de duplicidade. Quando o Telegram for conectado no futuro, cada mensagem chegará pelo canal de origem e a resposta sairá pelo mesmo canal — sem cruzamento.

---

## 4. FLUXOS DE TESTE — 3 CENÁRIOS

---

### ✅ Cenário 1 — Cliente busca serviço pelo WhatsApp

**Ator:** Cliente (qualquer número)
**Canal:** WhatsApp → +55 73 99828-3579

```
Cliente: "Oi, preciso de um eletricista urgente aqui no Taípe"

Toca TrIA: "Oi! 👋 Sou a Toca TrIA, assistente da Trancoso Resolve.
Vou te ajudar a encontrar um eletricista!

Para achar o melhor disponível, me conta:
1. Qual é o problema? (instalação, reparo, tomada, quadro de luz?)
2. Qual endereço no Taípe?
3. Hoje mesmo ou pode ser amanhã?

Com isso acho as melhores opções pra você ⚡"

Cliente: "Tomada queimada, rua das flores 10, precisa ser hoje"

Toca TrIA: [busca prestadores com categoria=eletricista, bairro=Taípe, urgência=true]

Toca TrIA: "⚡ Encontrei 2 eletricistas verificados no Taípe:

1. **João Elétrica** | ⭐ 4.9 | Responde em 30min ✅
2. **Ana Técnica** | ⭐ 4.7 | Responde em 1h ✅

Qual você quer contatar?"
```

**Resultado esperado:** Agendamento criado em ServiceRequest.

---

### ✅ Cenário 2 — Prestador recebe notificação de novo lead

**Ator:** Sistema (automação backend) notifica prestador
**Canal:** Email (via função `notifyProviderBooking`)

> **Nota:** A Toca TrIA responde conversas. Notificações proativas a prestadores são enviadas via email pelas funções backend existentes (`notifyProviderBooking`, `notifyBookingConfirmation`). O WhatsApp Business via QR Code **não suporta envio proativo** — isso requer Meta API oficial.
>
> **Para envio proativo via WhatsApp**, o caminho correto é:
> 1. Aprovar Templates de mensagem na Meta Business Manager
> 2. Usar a **Meta Cloud API** com token permanente
> 3. Isso é um projeto separado de integração

**Fluxo atual funcional:**
```
Cliente cria solicitação
→ Automação dispara notifyProviderBooking
→ Prestador recebe email com todos os detalhes
→ Prestador acessa o app e confirma
```

---

### ✅ Cenário 3 — Erro de entrega (mensagem falha)

**Situação:** Toca TrIA tenta buscar prestadores mas a ferramenta retorna erro.

```
Cliente: "Preciso de piscineiro no Rio da Barra"

[Sistema interno tenta buscar — falha de rede ou timeout]

Toca TrIA: "❌ Encontrei um problema técnico ao consultar o sistema.

🔄 Posso:
1. Tentar novamente em 2 minutos?
2. Deixar um pedido aberto (prestadores verão e responderão em até 2h)?
3. Te passar o contato do suporte?

O que prefere?"
```

**Resultado:** Usuário nunca vê mensagem de erro técnica. Sempre recebe opções alternativas.

---

## 5. LIMITAÇÕES DO QR CODE vs META API OFICIAL

| Recurso | QR Code (atual) | Meta API Oficial |
|---|---|---|
| Responder mensagens recebidas | ✅ Sim | ✅ Sim |
| Enviar mensagens proativas | ❌ Não | ✅ Sim (com template aprovado) |
| Estabilidade de conexão | ⚠️ Depende do celular online | ✅ Alta (servidor dedicado) |
| Reconexão automática | ❌ Manual via QR | ✅ Token permanente |
| Custo | Gratuito | Pago por mensagem (Meta pricing) |
| Velocidade de setup | 5 minutos | 2-4 semanas (aprovação Meta) |

**Recomendação:** Para o MVP, o QR Code atende. Para escalar (envio de notificações proativas a prestadores via WhatsApp), planejar migração para Meta Cloud API.

---

## 6. COMO REPETIR A CONFIGURAÇÃO EM OUTRO NÚMERO

1. Acesse o painel Base44 → Agente "toca" → Channels
2. Desconecte o número atual (se houver)
3. Clique em "Connect" no bloco WhatsApp
4. Escaneie o novo QR Code com o novo número WhatsApp Business
5. Teste enviando uma mensagem para o novo número
6. Atualize o número de contato em todas as páginas do site que mencionam WhatsApp

---

## 7. CHECKLIST FINAL

- [ ] Número +55 73 99828-3579 está como WhatsApp Business
- [ ] QR Code escaneado no painel Base44 → Agente toca → Channels
- [ ] Status do canal: **Active**
- [ ] Teste de mensagem realizado e resposta recebida
- [ ] Greeting exibido corretamente na primeira mensagem
- [ ] Número atualizado em páginas públicas do site (se necessário)

---

*Documento gerado automaticamente pela Base44 AI. Trancoso Resolve © 2026.*