# CONTEXTO ATUAL — Trancoso Resolve

> Última atualização: 22/07/2026  
> Branch de trabalho: `claude/trancoso-deploy-sync-validate-pg15wl`  
> Commit HEAD: `a6e3d86` — docs: adiciona RELEASE_CHECKLIST.md

---

## Estado atual do projeto

O site **trancosoresolve.com.br** está ao vivo e servido pelo **Base44**
(App ID: `68eb21726a9614db4a82ba99`). A Vercel é um segundo ambiente de
deploy (via integração Git com `main`), mas o domínio aponta para o Base44.

| Ambiente | URL | Estado |
|---|---|---|
| Base44 (produção) | trancosoresolve.com.br | ✅ Build verde, checkpoints salvos |
| Vercel (preview/CI) | *.vercel.app | ✅ Builds passando |
| GitHub main | tocaorganic-art/trancoso-resolve | ✅ Atualizado (PR #72 merged) |

**Stack:** React 18 + Vite 6.1 + Tailwind 3.4 + shadcn/ui (new-york) + Base44 SDK

---

## O que foi feito nesta sessão

### 1. Confirmação de pré-condições

- PR #72 confirmado merged em `main` antes de iniciar o sync.
- Divergências entre `main` e Base44 foram mapeadas (ver seção "Arquivos
  modificados" abaixo).

### 2. Sync main → Base44

Todos os arquivos foram escritos diretamente no sandbox do Base44
(`/app/src/…`). Nenhuma alteração foi feita no repositório GitHub nesta
sessão — o `main` já estava atualizado pelo PR #72.

#### Componentes do assistente TryA (renaming TrIA → TryA)

Três arquivos em `src/components/assistente/` foram atualizados no Base44:

- **TocaTrIAPremium.jsx** — chave de storage atualizada para `v2`, texto
  do welcome atualizado, `console.error` corrigido de `[TrIA]` → `[TryA]`
- **TrIASidebar.jsx** — props novas, `formatDate`, delete por conversa
- **TrIAChatArea.jsx** — streaming melhorado, texto de boas-vindas TryA

#### Novas páginas SEO

Todas escritas via heredoc (`cat > arquivo << 'ENDOFFILE'`) porque o
`mcp__Base44__write_file` expirava em arquivos acima de ~8 KB.

| Arquivo | Rota | Descrição |
|---|---|---|
| `src/pages/DestinoHub.jsx` | `/:destino` | Hub dinâmico por destino (Trancoso, Arraial, Porto Seguro, Caraíva) |
| `src/pages/ServicoDestino.jsx` | `/:destino/:categoria` | Serviço + destino dinâmico (ex: `/trancoso/eletricista`) |
| `src/pages/servicos/DJTrancoso.jsx` | `/servicos/dj-trancoso` | DJ profissional em Trancoso |
| `src/pages/destinos/CasamentoTrancoso.jsx` | `/destinos/casamento-trancoso` | Fornecedores para casamento |
| `src/pages/destinos/RevelionTrancoso.jsx` | `/destinos/reveillon-trancoso` | Profissionais para Réveillon |
| `src/pages/guides/MorarTrancoso.jsx` | `/guides/morar-em-trancoso` | Guia para morar em Trancoso |
| `src/pages/servicos/CozinheiroArraialDajuda.jsx` | `/servicos/cozinheiro-arraial-dajuda` | Chef em Arraial d'Ajuda |

#### Novos arquivos de suporte

| Arquivo | Motivo |
|---|---|
| `src/data/seoLocal.js` | Diretório `src/data/` não existia no Base44; exporta `DESTINOS`, `CATEGORIAS`, `DESTINO_MAP`, `CATEGORIA_MAP`, `BASE_URL` usados por DestinoHub e ServicoDestino |
| `src/lib/performance.js` | Existia no repo local mas estava ausente do sandbox Base44; exporta `reportWebVitals()` e `measurePageLoad()` usados no App.jsx |

#### Correções de build

| Problema | Solução |
|---|---|
| `@vercel/analytics` não instalado no Base44 | Removido do `App.jsx` do Base44 via `sed -i` (local permanece com o import para Vercel) |
| 5 arquivos com typo `ArrayalDajuda` (dois "r") | `cp *ArrayalDajuda.jsx *ArraialDajuda.jsx` para cada um dos 5 casos |
| `CozinheiroArraialDajuda.jsx` faltando | Criado do zero no Base44 |
| `src/lib/performance.js` faltando no Base44 | Copiado do repo local para o sandbox |
| `src/data/seoLocal.js` faltando no Base44 | Criado no Base44 (`mkdir -p /app/src/data` + heredoc) |

#### Checkpoints Base44 salvos

| # | ID | Conteúdo |
|---|---|---|
| 1 | `6a5fbcd7` | TryA renaming, novas páginas SEO, App.jsx/Layout.jsx atualizados |
| 2 | `6a5fbe2c` | `seoLocal.js`, `performance.js`, aliases ArraialDajuda, CozinheiroArraialDajuda — build limpo |

**Build final:** `npm run build` → exit 0, `dist/` gerado (2,7 MB, `index.html` 15781 bytes).

---

## Decisões tomadas e motivos

### index.html do Base44 NÃO foi sobrescrito

O `index.html` do Base44 tem **277 linhas** com GTM + Consent Mode v2
(Meta Pixel 1469130194903035 dispara `PageView` SOMENTE após o visitante
aceitar cookies via banner LGPD). O `index.html` do `main` tem **265 linhas**
com `PageView` imediato — menos seguro do ponto de vista da LGPD.

**Decisão:** preservar o `index.html` do Base44 intacto. Nunca sobrescrever.

### Vercel Analytics removido SOMENTE no Base44

O pacote `@vercel/analytics` e `@vercel/speed-insights` não estão em
`node_modules` do sandbox Base44. Removê-los do `App.jsx` do Base44 foi
necessário para o build não quebrar. O `App.jsx` do repo local **mantém
os imports** para que a Vercel continue recebendo métricas.

### Heredoc para arquivos grandes

O `mcp__Base44__write_file` expira com timeout em arquivos maiores que
aproximadamente 8 KB. A solução adotada foi escrever via
`mcp__Base44__run_command` com heredoc bash:
```bash
cat > /app/src/pages/Pagina.jsx << 'ENDOFFILE'
... conteúdo ...
ENDOFFILE
```
O delimitador com aspas simples (`'ENDOFFILE'`) evita expansão de variáveis
shell no conteúdo JSX.

### Regra de push Base44 → GitHub: NUNCA fazer

O Base44 tem um `git_remote_source: s3` e se fizer push do Base44 para o
GitHub sobrescreve toda a migração de marca. O fluxo correto é sempre
**GitHub (main) → Base44** (pull manual nas Configurações do Base44).

---

## Próximos passos pendentes

### Verificação manual (não é possível do ambiente remoto)

O proxy do ambiente remoto bloqueia `trancosoresolve.com.br` (HTTP 403),
então os itens abaixo precisam ser testados pelo usuário em um browser:

- [ ] **Smoke test** — verificar que as seguintes rotas carregam sem erro:
  - `/` · `/planos` · `/seja-prestador` · `/login`
  - `/servicos/dj-trancoso`
  - `/destinos/casamento-trancoso`
  - `/destinos/reveillon-trancoso`
  - `/guides/morar-em-trancoso`
  - `/trancoso` · `/arraial-dajuda` · `/porto-seguro` · `/caraiva` (DestinoHub)
  - `/trancoso/eletricista` · `/arraial-dajuda/diarista` etc. (ServicoDestino)
- [ ] **Mercado Pago** — iniciar um checkout e confirmar que o gateway responde
- [ ] **Meta Pixel 1469130194903035** — DevTools → Network → filtrar
  `facebook.com/tr` → `PageView` deve disparar SOMENTE após aceitar cookies

### SEO (backlog)

- [ ] Criar `public/og-image.jpg` (1200×630 px) para Open Graph
- [ ] Submeter `sitemap.xml` no Google Search Console
- [ ] Verificar/criar Google Business Profile para Trancoso Resolve
- [ ] Conectar Google Analytics ao Search Console

### Produto

- [ ] i18n — traduzir conteúdo das páginas internas (coberto: nav, footer, hero, categorias)
- [ ] App mobile — citado como produto digital; ainda não iniciado
- [ ] Testes automatizados — `@testing-library/react` instalado, sem suíte configurada
- [ ] Acessibilidade — auditar contraste (laranja sobre areia), foco visível, labels semânticas

---

## Arquivos modificados nesta sessão

> Todos os arquivos abaixo foram modificados **diretamente no sandbox Base44**
> (`/app/src/…`). O repositório GitHub **não foi alterado** nesta sessão.

### Modificados (existiam no Base44, atualizados)

| Arquivo Base44 | O que mudou |
|---|---|
| `/app/src/App.jsx` | Removidos `import Analytics`, `import SpeedInsights`, `<Analytics />`, `<SpeedInsights />` (não instalados no Base44) |
| `/app/src/Layout.jsx` | ProFloatingButton, nav lojista — sincronizado com main |
| `/app/src/components/assistente/TocaTrIAPremium.jsx` | TryA, STORAGE_KEY v2, `[TrIA]` → `[TryA]` no console.error |
| `/app/src/components/assistente/TrIASidebar.jsx` | Props novas, formatDate, delete por conversa |
| `/app/src/components/assistente/TrIAChatArea.jsx` | Streaming, texto welcome TryA |

### Criados (novos no Base44)

| Arquivo Base44 | Tipo |
|---|---|
| `/app/src/pages/DestinoHub.jsx` | Página dinâmica |
| `/app/src/pages/ServicoDestino.jsx` | Página dinâmica |
| `/app/src/pages/servicos/DJTrancoso.jsx` | Página SEO |
| `/app/src/pages/destinos/CasamentoTrancoso.jsx` | Página SEO |
| `/app/src/pages/destinos/RevelionTrancoso.jsx` | Página SEO |
| `/app/src/pages/guides/MorarTrancoso.jsx` | Página SEO |
| `/app/src/pages/servicos/CozinheiroArraialDajuda.jsx` | Página SEO |
| `/app/src/data/seoLocal.js` | Dados compartilhados (DESTINO_MAP, CATEGORIA_MAP, BASE_URL) |
| `/app/src/lib/performance.js` | reportWebVitals, measurePageLoad |

### Aliases criados por `cp` (typo corrigido: ArrayalDajuda → ArraialDajuda)

| Arquivo destino (correto) | Origem (typo) |
|---|---|
| `DiaristaArraialDajuda.jsx` | `DiaristaArrayalDajuda.jsx` |
| `EletricistaArraialDajuda.jsx` | `EletricistaArrayalDajuda.jsx` |
| `JardineiroArraialDajuda.jsx` | `JardineiroArrayalDajuda.jsx` |
| `PedreiroArraialDajuda.jsx` | `PedreiroArrayalDajuda.jsx` |
| `PiscineiroArraialDajuda.jsx` | `PiscineiroArrayalDajuda.jsx` |

---

## Referências

- `CLAUDE.md` — instruções do projeto, design system, arquitetura
- `STATUS-DO-PROJETO.md` — snapshot de funcionalidades
- `RELEASE_CHECKLIST.md` — checklist de processo para releases
- Base44 App: `https://base44.com/apps/68eb21726a9614db4a82ba99`
- Vercel Dashboard: projeto `trancoso-resolve` (tocaorganic-art)
- Google Search Console: trancosoresolve.com.br (verificação pendente)
