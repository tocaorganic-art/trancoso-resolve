# Auditoria Base44 remoto ↔ repo — divergências de sync (11/08/2026)

> Sessão de auditoria via **Base44 MCP** (`appId 68eb21726a9614db4a82ba99`).
> Objetivo: comparar o estado do Base44 remoto (código que RODA em produção)
> com o que está versionado no repo (`base44/`), focando nos fluxos críticos de
> lançamento do prestador.
> Método: leitura dos `entry.ts` das functions e dos schemas de entidades no
> remoto via MCP, comparados com os arquivos versionados no branch
> `fix/launch-stabilization-monitoring`.

---

## 1. Resumo executivo

**O Base44 remoto NÃO recebeu as correções P0/P1 do fluxo do prestador.**
As correções existem no repo (commits `297b992`, `327686d`), mas as functions
críticas de verificação no remoto ainda rodam o código antigo — que tem os bugs
que o relatório de 11/08 dizia corrigidos. Em paralelo, o remoto evoluiu em
pagamentos (Mercado Pago) para além do que o repo versiona.

| Área | Estado |
|---|---|
| Verificação de identidade (`verificarDocumento`) | ❌ remoto com bug P0.1 |
| Aprovação admin (`adminVerificacao`) | ❌ remoto sem fallback da description |
| Antecedentes (`verificarAntecedentes`) | ❌ remoto quebrado (lê CPF onde não há) |
| Cobrança MP (`createSubscriptionCheckout`) | ⚠️ remoto MAIS novo que o repo |
| `ServiceProviderPrivate` (schema) | ❌ campos divergentes (`provider_id` vs `service_provider_id`) |
| `MpWebhookLog` (schema) | ⚠️ órfão no remoto e com campos diferentes |
| Trial / cancelamento / notificação | ✅ sincronizado |

**Consequência no app publicado:** no estado atual, um prestador que termina o
cadastro não tem a verificação de antecedentes executada (erro silencioso no
front) e a verificação de documento por IA falha com 403 mesmo para o dono.

---

## 2. Divergências funcionais (remoto NÃO sincronizado — repo está correto)

### 2.1 `verificarDocumento` — bug P0.1 ainda no remoto

| | Remoto | Repo (`297b992`) |
|---|---|---|
| Ownership | `user.id !== prestadorId` → **403 sempre** (User.id ≠ ServiceProvider.id) | `ServiceProvider.filter({ created_by: user.email })` + `find(p.id === prestadorId)` |
| `data_verificacao` | — | grava `data_verificacao` + `status_verificacao` no ServiceProvider |

No front, `VerificacaoDocumento.jsx` obtém `prestadorId = provider?.id`
(ServiceProvider.id) — nunca igual a `user.id`. Todo request próprio cai em 403.

### 2.2 `adminVerificacao` — sem fallback da description

| | Remoto | Repo (`327686d`) |
|---|---|---|
| Email do dono | só `verificacao?.user_email` (top-level) | `verificacao?.user_email \|\| dadosDesc?.user_email` (parse de `description`) |
| Notificação | — | envia email ao prestador em aprovar/rejeitar |

O modal `FilaVerificacao.jsx` grava `user_email`/`user_name` dentro de
`description` (JSON string). Sem o fallback, o admin que aprova via
`description` não marca o `ServiceProvider.verified = true` nem notifica.

### 2.3 `verificarAntecedentes` — quebrada no remoto

| | Remoto | Repo (`297b992`) |
|---|---|---|
| Origem do CPF | `provider.cpf \|\| provider.document_number` **no ServiceProvider** | `ServiceProviderPrivate.filter({ provider_id })` (PII fora da leitura pública) |
| Ownership | apenas autenticação | `created_by` check (não-admin) |
| Sem CPF | retorna 400 | grava `em_analise_manual` + relatório |

O ServiceProvider remoto **não tem campo `cpf`** (PII foi migrada). Logo, no
remoto `cpf` é sempre `undefined` → **400 "CPF do prestador não encontrado"** em
toda consulta. O `CadastroTipo.jsx` engole o erro (`.catch(() => {})`).

---

## 3. Divergências de schema (entidades)

### 3.1 `ServiceProviderPrivate` — campos incompatíveis

| | Remoto | Repo (`base44/entities/ServiceProviderPrivate.jsonc`) |
|---|---|---|
| Campo de vínculo | `service_provider_id` | `provider_id` |
| Required | `service_provider_id, cpf, data_nascimento` | `provider_id` |
| Outros | `data_nascimento, nome_mae, nome_pai, rg, pis, uf_nascimento` | `verification_document_url, full_body_photo_url, autorizou_verificacao, data_consentimento` |

O front `CadastroTipo.jsx` e a function `verificarAntecedentes` (repo) gravam /
filtram com `provider_id`. No remoto esse campo não existe → o registro criado
não se vincula ao prestador, e o `data_nascimento` obrigatório não é enviado
pelo formulário atual (CadastroTipo só coleta CPF/CNPJ).

**Conclusão:** o schema remoto foi evoluído (provavelmente em edição manual no
Base44) para o formato `service_provider_id` + dados de nascimento, mas o repo
e o front não acompanharam. É preciso decidir qual lado é a fonte da verdade e
alinhar os dois + `CadastroTipo.jsx` + `verificarAntecedentes`.

### 3.2 `MpWebhookLog` — órfão no remoto e com campos diferentes

| | Remoto | Repo (`base44/entities/MpWebhookLog.jsonc`) |
|---|---|---|
| Campos | `event_id, event_type, resource_id, payload, processed, error` | `notification_id, topic, resource_id, status, payload_snapshot, recebido_em` |
| Uso | **nenhuma function remota referencia** | `mercadoPagoWebhook` (dedup por `notification_id`) |

O `mercadoPagoWebhook` remoto usa `WebhookEvent` (schema já sincronizado) +
`FounderSlot` para idempotência, e não grava em `MpWebhookLog`. O schema remoto
de `MpWebhookLog` é resíduo. Decidir entre manter `WebhookEvent` (remoto, ok)
ou reverter para `MpWebhookLog` (repo).

---

## 4. Functions onde o REMOTO está à frente do repo

### 4.1 `createSubscriptionCheckout` — remoto é Mercado Pago, repo é Stripe

| | Remoto | Repo |
|---|---|---|
| Gateway | Mercado Pago (`MP_ACCESS_TOKEN`, preapproval) | Stripe (`STRIPE_SECRET_KEY`, price IDs antigos) |
| Catálogo | `profissional` 19,90 · `prestador_elite` 197 · `lojista_essencial` 89 · `lojista_pro` 197 · `lojista_elite` 497 · boosts | `lancamento` 29,90 · `regular` 49,90 · empresa … |
| Guard trial | sim (trial consumido) | — |

O front `Planos.jsx` chama `createSubscriptionCheckout` com `plan/billing/
user_email` e espera `res.data.url`; os `ctaKey` do front (profissional,
prestador_elite, lojista_*) batem com o catálogo **remoto**. O repo versiona a
versão Stripe legada — **o sync GitHub → Base44 NÃO deve sobrescrever esta
function** com o conteúdo do repo.

Relacionado: o repo tem `criarAssinaturaMercadoPago` (KAN-15, catálogo só
`fundador`), chamada apenas por teste (`kan15-mp-subscriptions.test.js`). No
remoto essa function **não existe** — o papel dela foi absorvido pelo
`createSubscriptionCheckout` remoto.

### 4.2 `mercadoPagoWebhook` — implementações diferentes

| | Remoto | Repo |
|---|---|---|
| Assinatura HMAC | sim (`x-signature`, `MP_WEBHOOK_SECRET`) | não |
| Idempotência | `WebhookEvent` (payload_hash/attempts) + `FounderSlot` | `MpWebhookLog` (notification_id) |
| CAPI | inline `sendCapiEvent` | — |

Ambas razoáveis; a remota é mais recente. O repo deveria absorver a versão
remota (mantendo o que for melhor de cada uma), **não o contrário**.

---

## 5. Functions sincronizadas ✅

- `atualizarStatusVerificacao` — fallback da description (regex) + notificação
  por email presentes no remoto.
- `cancelarAssinatura` — CAPI inline + regras irreversíveis do Selo Fundador
  (FounderSlot `revoked`) presentes.
- `criarTrialPrestador` — regra "um trial por vida" (`trial_consumed_at`,
  `trial_type`, `trial_version`) presente.
- `twoFactor` — `maskedEmail`, lockout, tentativas presentes (contrato com
  `Login.jsx` ok).
- Schema `Subscription` — campos novos de trial presentes no remoto.
- Schema `ServiceProvider` — sem PII; `verified`, `status_verificacao`,
  `relatorio_verificacao`, `data_verificacao` presentes (controlados por
  functions via service role).

---

## 6. Achados menores

1. **`CheckoutPagamento.jsx`** chama `base44.functions.invoke('processPayment')`
   — function inexistente no remoto e no repo. O componente **não é importado**
   em nenhum lugar (`grep CheckoutPagamento` → só a própria definição), então é
   **código morto**. Baixo risco, mas remover ou religar a function real
   (`criarPagamentoServico*`) para não confundir auditorias futuras.
2. **`criarPagamentoServico` / `criarPagamentoServicoMercadoPago`** — existem
   como functions, mas nenhum front as chama. Fluxo de "pagamento de serviço"
   aparentemente não está ativo no app publicado.
3. `service_provider_id` vs `provider_id`: também afeta `MeuPerfilPrestador.jsx`
   e `FilaVerificacao.jsx` (grep de `ServiceProviderPrivate`), que precisam ser
   revisados junto com a decisão de schema (§3.1).

---

## 7. Recomendações

1. **Bloqueio de lançamento confirmado:** o sync GitHub → Base44 é obrigatório
   e as functions P0 precisam chegar ao remoto. Sem isso, o fluxo de verificação
   do prestador fica quebrado no app publicado.
2. **Sync seletivo — NÃO sobrescrever do repo:**
   `createSubscriptionCheckout` e `mercadoPagoWebhook` (remoto mais novo; ver §4).
3. **Resolver a divergência de `ServiceProviderPrivate` ANTES de sincronizar**
   (escolher `service_provider_id` ou `provider_id`) e alinhar schema +
   `CadastroTipo.jsx` + `verificarAntecedentes` + `MeuPerfilPrestador.jsx` +
   `FilaVerificacao.jsx`. O `data_nascimento` obrigatório no remoto precisa de
   coleta no formulário (CadastroTipo/MeuPerfilPrestador) ou ser removido do
   required.
4. **`MpWebhookLog`:** decidir entre manter `WebhookEvent` (remoto) e apagar o
   schema órfão, ou sincronizar o schema do repo e trocar a function remota.
   Evitar manter dois schemas de dedup divergentes.
5. **Remover `CheckoutPagamento.jsx`** (código morto) ou religar a uma function
   real — preferencialmente no mesmo PR que resolver o item 3.
