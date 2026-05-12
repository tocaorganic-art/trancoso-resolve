# 🚀 CHECKLIST DE QA FINAL — TRANCOSO RESOLVE

**Data:** 2026-05-12  
**Status:** Pronto para Soft Opening (48h)  
**Objetivo:** Validar fluxos críticos antes do lançamento público

---

## 📋 COMO USAR ESTE DOCUMENTO

1. **Marque cada teste** como você o executa
2. **Qualquer ❌ (erro crítico)** bloqueia o lançamento
3. **⚠️ (ajuste pequeno)** pode ser corrigido após lançamento se não bloquear uso
4. **Teste em navegador real** — não use apenas preview
5. **Reporte problemas** com screenshot + URL da página

---

## ✅ BLOCO 1 — PÁGINA DO ASSISTENTE DE IA

| # | Teste | Como executar | Esperado | Status |
|---|-------|---|---|---|
| 1 | Hero carrega | Acessar `/AssistenteVirtual` | Título grande + subtítulo + 2 botões visíveis | ☐ |
| 2 | Botão "Ativar" sem login | Clique no botão azul (sem estar logado) | Redireciona para tela de login | ☐ |
| 3 | Botão "Ativar" com login | Logar como prestador + clique no botão | Vai para `/Dashboard` | ☐ |
| 4 | Botão "Ver como funciona" | Clicar no botão secundário | Abre `/Assistentevirtual` (chat interface) | ☐ |
| 5 | Cards de cenários | Rolar para baixo na página | 3 cards aparentes (Cliente noite, Atendimento, Perguntas) | ☐ |
| 6 | Cards têm ícones | Verificar cada card | Cada um tem um ícone diferente (clock, phone, zap) | ☐ |
| 7 | Seção Benefícios | Rolar mais | 4 benefit blocks com check verde + descrição | ☐ |
| 8 | Seção "Como Funciona" | Rolar mais | 3 passos numerados (1, 2, 3) com texto | ☐ |
| 9 | Chat de exemplo | Rolar mais | Conversa simulada entre cliente e assistente aparece | ☐ |
| 10 | Chat legível | Verificar diálogo | Balões de cliente (azul) e assistente (cinza) claros | ☐ |
| 11 | Seção Toca TrIA | Rolar mais | Título "O poder do Toca TrIA..." + 2 cards | ☐ |
| 12 | FAQ | Rolar até o fim | 5 perguntas com expand/collapse | ☐ |
| 13 | FAQ funcionando | Clique em cada pergunta | Resposta abre e fecha corretamente | ☐ |
| 14 | CTA final | Ver no rodapé | Botão "Ativar Assistente" aparece | ☐ |
| 15 | Sem erros console | F12 → Console | Nenhuma mensagem de erro (warnings ok) | ☐ |

---

## 📱 BLOCO 2 — RESPONSIVIDADE MOBILE

| # | Teste | Como executar | Esperado | Status |
|---|-------|---|---|---|
| 16 | Hero mobile | `/AssistenteVirtual` no celular (iPhone/Android) | Texto legível, botões clicáveis (44px mín) | ☐ |
| 17 | Cards mobile | Rolar no celular | Cards empilhados em coluna, não truncados | ☐ |
| 18 | FAQ mobile | Abrir FAQ no celular | Perguntas legíveis, chevron rotaciona ao abrir | ☐ |
| 19 | Chat exemplo mobile | Rolar no celular | Balões não cortam, mensagens legíveis | ☐ |
| 20 | Botões mobile | Verificar todos os botões | Largura >= 44px, altura >= 44px (touch target) | ☐ |
| 21 | Sem overflow | Verificar scrollbar | Sem scroll horizontal em nenhuma seção | ☐ |

---

## 🔍 BLOCO 3 — BUSCA E CATEGORIAS (HOME)

| # | Teste | Como executar | Esperado | Status |
|---|-------|---|---|---|
| 22 | Busca "faxina" | Campo busca na home + "faxina" | Lista de prestadores OU mensagem "nenhum resultado" | ☐ |
| 23 | Busca "limpeza" | Campo busca + "limpeza" | Mesmo acima | ☐ |
| 24 | Busca vazia | Campo busca + digitar "xyzabc" | Mensagem amigável (não erro genérico) | ☐ |
| 25 | Clicar categoria | Clicar em chip/card de categoria na home | Abre página de categoria sem erro | ☐ |
| 26 | Busca sem error 500 | Tentar buscas aleatórias | Nunca mostra erro genérico ou página branca | ☐ |
| 27 | Busca responsivo | Buscar no celular | Campo funciona normalmente | ☐ |

---

## 📝 BLOCO 4 — CADASTRO (TIPO DE USUÁRIO)

**Nota:** Criar contas de teste — use emails reais e simule os fluxos

| # | Teste | Como executar | Esperado | Status |
|---|-------|---|---|---|
| 28 | Cadastro PF | Criar nova conta como Pessoa Física | Vai para perfil, vê apenas Planos de Prestador | ☐ |
| 29 | Cadastro MEI sem loja | Criar MEI, marcar "Sem ponto físico" | Vê Planos de Prestador | ☐ |
| 30 | Cadastro MEI com loja | Criar MEI, marcar "Com ponto físico" | Vê Planos de Empresa + aviso explicativo | ☐ |
| 31 | Cadastro PJ com loja | Criar PJ, marcar "Com ponto físico" | Vê Planos de Empresa | ☐ |
| 32 | Tipo armazenado | Após cadastro, logar novamente | Tipo correto mantido | ☐ |

---

## 🎯 BLOCO 5 — VERIFICAÇÃO DE IDENTIDADE

| # | Teste | Como executar | Esperado | Status |
|---|-------|---|---|---|
| 33 | Modal PF aberto | Ir para Perfil como PF → Verificação | Modal com CNH/RG apenas | ☐ |
| 34 | Modal Empresa | Ir para Perfil como Empresa → Verificação | Modal com CNH/RG/CNPJ/MEI | ☐ |
| 35 | Foto corpo inteiro | Empresa com loja física → abrir modal | Campo de foto de corpo inteiro NÃO aparece | ☐ |
| 36 | Título modal | Abrir como empresa | Diz "Verificar Identidade da Empresa" | ☐ |
| 37 | Upload funciona | Fazer upload de foto | Arquivo aceito, progresso visual | ☐ |

---

## 🏢 BLOCO 6 — PÁGINAS INSTITUCIONAIS

| # | Teste | Como executar | Esperado | Status |
|---|-------|---|---|---|
| 38 | Como Funciona | Acessar `/ComoFunciona` | Página carrega, sem erro | ☐ |
| 39 | Segurança | Acessar `/Seguranca` | Página carrega, selo explicado | ☐ |
| 40 | Seja Prestador | Acessar `/SejaPrestador` | Cards de vantagens visíveis, tabela comparativa ok | ☐ |
| 41 | Toca TrIA mencionado | Verificar em Seja Prestador | Nome "Toca TrIA" aparece (não "Toca" ou "TrIA") | ☐ |
| 42 | Toca Vision mencionado | Verificar em Seja Prestador | Nome "Toca Vision" aparece corretamente | ☐ |
| 43 | Links internos | Clicar em links das páginas institucionais | Navegam corretamente sem erro | ☐ |
| 44 | CTAs funcionam | Clicar em botões de ação | Redirecionam corretamente | ☐ |

---

## ⚡ BLOCO 7 — FLUXO COMPLETO DO CLIENTE (0 → Solicitar Serviço)

**Objetivo:** Simular cliente que nunca usou a plataforma

```
1. Entrar na home sem estar logado
2. Buscar um serviço (ex: "faxina")
3. Clicar em um prestador
4. Ver o perfil completo
5. Solicitar serviço OU enviar mensagem
6. Ver confirmação
7. Voltar para home
```

| # | Teste | Passo | Esperado | Status |
|---|-------|---|---|---|
| 45 | Home sem login | Abrir home | Vê serviços destacados e campo busca | ☐ |
| 46 | Busca funciona | Buscar "faxina" | Vê lista de prestadores | ☐ |
| 47 | Clica prestador | Clicar em um card | Abre perfil completo | ☐ |
| 48 | Perfil carrega | Verificar página | Foto, nome, bio, serviços, avaliações visíveis | ☐ |
| 49 | Botão solicitar | Clicar "Solicitar Serviço" | Abre modal ou página de agendamento | ☐ |
| 50 | Preenche dados | Preencher formulário | Todos os campos aceitam input | ☐ |
| 51 | Envia pedido | Clicar "Enviar" | Mostra mensagem de sucesso | ☐ |
| 52 | Redirect confirmação | Após sucesso | Vai para página de confirmação ou volta à home | ☐ |
| 53 | Sem erros | Durante todo fluxo | Nenhum erro 500 ou branco screen | ☐ |

---

## 🛠️ BLOCO 8 — FLUXO COMPLETO DO PRESTADOR (0 → Dashboard → Assistente)

**Objetivo:** Simular novo prestador ativando conta

```
1. Acessar "Seja Prestador"
2. Criar conta (PF ou MEI)
3. Preencher perfil com serviços
4. Fazer verificação de identidade
5. Escolher plano
6. Efetuar pagamento (ou trial)
7. Acessar dashboard
8. Ver seção do Assistente de IA
```

| # | Teste | Passo | Esperado | Status |
|---|-------|---|---|---|
| 54 | Acessa página | `/SejaPrestador` | Página carrega com CTAs | ☐ |
| 55 | Clica CTA | Botão "Começar Cadastro" | Vai para tela de tipo de usuário | ☐ |
| 56 | Seleciona tipo | Escolher PF ou MEI | Avança sem erro | ☐ |
| 57 | Preenche dados | Nome, email, telefone | Campos aceitam input | ☐ |
| 58 | Escolhe serviços | Selecionar 2-3 serviços | Aparecem checados | ☐ |
| 59 | Vai para verificação | Clica "Próximo" | Modal de verificação abre | ☐ |
| 60 | Faz verificação | Upload de documento | Arquivo enviado, status "Pendente" | ☐ |
| 61 | Vai para planos | Clica "Próximo" | Tela de planos mostra apenas tipo correto | ☐ |
| 62 | Seleciona plano | Clicar em "Plano Lançamento" | Vai para checkout | ☐ |
| 63 | Checkout seguro | Verificar página | Tem "https" e informações de pagamento | ☐ |
| 64 | Pagamento funciona | Usar cartão de teste Stripe (4242...) | Redirecionado para sucesso | ☐ |
| 65 | Dashboard acessível | Após pagamento, logar | Vê Dashboard com data de expiração | ☐ |
| 66 | Assistente visível | Procurar seção IA | Vê card ou botão do Assistente de IA | ☐ |
| 67 | Clica Assistente | Clicar no card | Vai para `/AssistenteVirtual` | ☐ |

---

## 🖼️ BLOCO 9 — IMAGENS E ASSETS

| # | Teste | Como executar | Esperado | Status |
|---|-------|---|---|---|
| 68 | Logo carrega | Verificar topo de cada página | Logo Trancoso Resolve aparece | ☐ |
| 69 | Sem imagens quebradas | F12 → Network → Images | Nenhuma imagem com status 404 | ☐ |
| 70 | Imagens responsivas | Abrir em mobile | Imagens se ajustam ao tamanho | ☐ |
| 71 | Watermark Igreja | Home/páginas públicas | Marca d'água Igreja de Trancoso visível mas discreta | ☐ |

---

## ⚙️ BLOCO 10 — PERFORMANCE

| # | Teste | Como executar | Esperado | Status |
|---|-------|---|---|---|
| 72 | Home carrega rápido | Network throttling 4G (DevTools) | Carrega em < 4 segundos | ☐ |
| 73 | Página IA rápida | `/AssistenteVirtual` em 4G | Carrega em < 3 segundos | ☐ |
| 74 | Sem memory leaks | F12 → Memory | Uso de RAM estável ao navegar | ☐ |
| 75 | Smooth scroll | Rolar páginas | Nenhum jank ou travamento | ☐ |

---

## 🔒 BLOCO 11 — SEGURANÇA E ACESSO

| # | Teste | Como executar | Esperado | Status |
|---|-------|---|---|---|
| 76 | HTTPS em todas páginas | Verificar URL | Todas têm cadeado verde | ☐ |
| 77 | Sem dados sensíveis console | F12 → Console | Nenhum token/senha logado | ☐ |
| 78 | CSRF token presente | POST requests | Verificar header X-CSRF-Token | ☐ |
| 79 | Permissões corretas | Logar como cliente, acessar `/Dashboard` | Vê mensagem de acesso negado | ☐ |

---

## 📊 RESUMO FINAL

Depois de completar tudo acima, preencha:

| Categoria | ✅ OK | ⚠️ Ajuste | ❌ Erro |
|-----------|-------|----------|--------|
| Assistente IA | ☐ | ☐ | ☐ |
| Mobile | ☐ | ☐ | ☐ |
| Busca | ☐ | ☐ | ☐ |
| Cadastro | ☐ | ☐ | ☐ |
| Verificação | ☐ | ☐ | ☐ |
| Institucionais | ☐ | ☐ | ☐ |
| Fluxo Cliente | ☐ | ☐ | ☐ |
| Fluxo Prestador | ☐ | ☐ | ☐ |
| Assets | ☐ | ☐ | ☐ |
| Performance | ☐ | ☐ | ☐ |
| Segurança | ☐ | ☐ | ☐ |
| **TOTAL** | **☐** | **☐** | **☐** |

---

## 🚩 CRITÉRIO DE LANÇAMENTO

- ✅ **Lanço se:** Todos os ❌ foram corrigidos. ⚠️ podem vir depois.
- ❌ **NÃO lanço se:** Qualquer item ❌ permanecer aberto.

---

## 📞 REPORTAR PROBLEMA

Ao encontrar um erro, use este formato:

```
**Teste:** [Número e nome]
**Navegador:** Chrome 125 / Safari / Edge
**Device:** Desktop / iPhone 15 / Android
**URL:** https://...
**Passo a passo para reproduzir:**
1. ...
2. ...

**Resultado esperado:** ...
**Resultado atual:** ...
**Screenshot:** [anexar]
```

---

**Data de conclusão esperada:** 2026-05-14  
**Responsável:** [Seu nome aqui]  
**Aprovado para lançamento:** ☐