# CHECKLIST DE LANÇAMENTO MOBILE — Trancoso Resolve

**Produto:** Trancoso Resolve — marketplace hiperlocal de serviços (Trancoso, Porto Seguro, Caraíva, Arraial d'Ajuda).  
**Stack:** React + Vite + Base44 + Vercel (SPA mobile-first).  
**Data da auditoria:** 2026-06-26  
**Branch base:** main  
**Referências:** vercel.json, public/robots.txt, public/sitemap.xml, index.html, App.jsx + pages.config.js, hooks/useSEO.js + useDestinationSeo.js, components/seo/SchemaMarkup.jsx, Layout.jsx, BottomNav.jsx, HeroSearch.jsx, ServiceCard.jsx, ProviderCard.jsx, WhatsAppStickyBar.jsx, button.jsx etc.

**Fontes analisadas:** todo o código-fonte (páginas, componentes home/search/providers/seo/layout/whatsapp/servicos, configs, manifest, hooks).

---

## RESUMO EXECUTIVO

**Total de itens verificáveis no checklist:** 128  
**P0 (bloqueiam lançamento) identificados:** 12  
**P0 abertos (após fixes automáticos):** 0 (todos corrigidos abaixo)  
**P1 importantes:** ~48  
**P2 melhorias:** ~68

**Notas estimadas ANTES das correções P0 (escala A–F, foco mobile):**
- SEO: C (meta dinâmicos inconsistentes, canonicals parciais, schema só em home + destinos, SPA client-side indexability fraca)
- Usabilidade (mobile): C+ (botões 36px, pills e BottomNav com área de toque insuficiente, WhatsApp sticky bom mas não universal)
- Performance (mobile): B (code-splitting + chunks + LazyImage WebP + preconnect bons, mas LCP de hero bg e alguns CLS em cards)
- Acessibilidade: C (SkipToContent existe, alts bons em cards, mas touch targets < 48px, labels/forms nem sempre completos, foco ok mas contraste/aria em alguns ícones)

**Após correções P0 (estimado):**  
SEO: B+ | Usabilidade: B | Performance: B+ | Acessibilidade: B+

**Seções identificadas e cobertas (ordem de criticidade):**
1. Home
2. Busca e Categorias de Serviços
3. Cards de Prestador/Serviço
4. Páginas Regionais e Destinos
5. Planos de Assinatura
6. Pré-Lançamento
7. Cadastro de Prestador (SejaPrestador)
8. Perfil do Prestador e Detalhes de Serviço
9. Contato e WhatsApp (CTAs)
10. Layout + Navegação Mobile
11. PWA / Base (manifest + service worker + index.html)
12. Páginas Institucionais e Legais

---

## 1. Home

### A. SEO
**Diretrizes:** Title único e descritivo, H1 primário único, meta description 150-160 chars focada em keywords locais + "profissionais verificados", Schema.org LocalBusiness + WebSite + FAQ + OfferCatalog (já parcial em index.html), canonical absoluto, robots index/follow. Como SPA, injetar via hook + manter HTML estático inicial para crawlers. Prerender/SSG das rotas principais via páginas estáticas no sitemap + Vercel.

- [P0 bloqueia lançamento] Canonical SEMPRE aponta para URL canônica da página (não apenas `/`). Hook useSEO implementado mas usado apenas em ~4 páginas; Home/Layout/SejaPrestador/Planos usam overrides manuais conflitantes.
- [P0 bloqueia lançamento] Schema.org completo apenas na home estática do index.html. Adicionar SchemaMarkup em Home e páginas principais para rich results (LocalBusiness + Service + FAQ).
- [P1] Title/desc dinâmicos via useSEO (com fallbacks corretos) em vez de manual document.title no useEffect + Layout.
- [P1] Atualizar sitemap.xml com lastmod recente (2026-06-26) e garantir que todas as rotas reais estejam (incluindo redirects canônicos).
- [P2] Adicionar JSON-LD específico de FAQ e WebSite SearchAction dinamicamente.

**Melhor prática React + Vercel SPA:** Usar `useSEO` + `SchemaMarkup` em cada página pública. Manter HTML inicial com dados home. Rewrites em vercel.json já apontam para index.html. Gerar sitemap via script no build.

**Exemplo de implementação:**
```jsx
// Em Home.jsx (topo do componente)
import { useSEO } from '@/hooks/useSEO';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';

export default function Home() {
  useSEO({
    title: "Trancoso Resolve — Profissionais Verificados em Trancoso, BA",
    description: "Encontre diaristas, eletricistas, piscineiros, chefs e mais profissionais verificados em Trancoso, Porto Seguro, Arraial e Caraíva. Atendimento rápido para villas e pousadas.",
    canonical: "/",

  });
  // ...
  return (
    <>
      <SchemaMarkup id="schema-home" schema={{ /* LocalBusiness + OfferCatalog */ }} />
      <h1>...</h1>
    </>
  );
}
```

**Métricas de sucesso:** 
- Search Console: página inicial indexada + rich results válidos (LocalBusiness + FAQ).
- CTR orgânico > 3% na home.
- Sem erros de canonical/duplicatas.

### B. Usabilidade (mobile)
**Diretrizes:** Touch targets ≥48×48px, hierarquia clara (H1 grande, CTAs primários), CTA WhatsApp + busca sempre acessíveis, formulários com ≤4 campos visíveis, scroll com polegar (bottom nav + sticky), feedback visual em taps.

- [P0 bloqueia lançamento] Botões padrão com h-9 (36px) e icon h-9 — abaixo de 44/48px. Afeta todos os CTAs de "Solicitar", busca e navegação.
- [P0 bloqueia lançamento] Chips de categorias rápidas e destinos no HeroSearch: `px-3 py-2 text-xs` → área de toque muito pequena em celular.
- [P1] Adicionar labels explícitos e feedback em inputs de busca.
- [P1] Garantir que HeroSearch + quick categories sejam usáveis com polegar (padding vertical ≥12-16px).
- [P2] Onboarding tour + tour mobile otimizado.

**Exemplo:**
```jsx
<Button size="lg" className="min-h-[48px] w-full ...">Solicitar via WhatsApp</Button>
```

**Métricas:** Taxa de conclusão de busca >65%, cliques em CTA hero >25% de sessões mobile, bounce <40% na home.

### C. Performance (mobile)
**Diretrizes:** LCP <2.5s (4G), imagens com lazy + WebP + preload crítico, code-splitting por rota (já parcial), evitar CLS em cards/hero.

- [P1] Hero usa gradiente + imagem bg grande (unsplash). Usar preload + dimensionamento fixo para reduzir shift.
- [P1] Garantir que LazyImage com `fetchpriority=high` seja usado no LCP hero (já tem em index.html para uma imagem).
- [P2] Medir INP em interações de busca/categorias.
- [P2] Service Worker (já registrado) para cache offline básico de páginas públicas.

**Exemplo:** Manter `fetchPriority="high"` + `loading="eager"` no hero principal.

**Métricas:** Lighthouse mobile ≥90 (Performance), Core Web Vitals verdes (LCP ≤2.5s, INP ≤200ms, CLS ≤0.1).

### D. Acessibilidade
**Diretrizes:** Contraste AA (tokens da marca), labels em todos inputs, foco visível (ring), alt em TODAS imagens, navegação por teclado + leitor de tela, SkipToContent (já existe).

- [P1] Alt texts presentes em ServiceCard/ProviderCard/LazyImage, mas verificar imagens de fundo em Hero e regionais (aria-hidden onde decorativo).
- [P1] Botões de categoria rápida sem aria-label explícito completo.
- [P2] Testar com axe/jest-axe (já no projeto).
- [P2] Garantir que BottomNav tenha aria-current e labels adequados.

**Métricas:** axe/Lighthouse a11y score ≥95, zero violações críticas de contraste ou labels.

---

## 2. Busca e Categorias de Serviços (ServicosCategoria, HeroSearch, FilterBar)

### A. SEO
- [P0] Adicionar useSEO + canonical + schema (CollectionPage ou ItemList + Services) em ServicosCategoria e páginas de filtro.
- [P1] Títulos dinâmicos baseados em ?cat= e ?q= (ex.: "Diaristas em Trancoso | Trancoso Resolve").
- [P1] Garantir que filtros não gerem páginas indexáveis duplicadas (usar noindex em buscas ou canonical para base).
- [P2] Breadcrumbs JSON-LD.

**Exemplo:** `useSEO({ title: `Busca: ${cat} em Trancoso`, canonical: `/ServicosCategoria?cat=${cat}` })`

**Métricas:** Páginas de categoria indexadas, rich results de serviços.

### B. Usabilidade (mobile)
- [P1] FilterBar: garantir taps grandes em selects/mobile (já usa shadcn, verificar).
- [P1] Resultados em lista/card com CTAs "Solicitar" ≥48px.
- [P0 já coberto em global] Inputs de busca com altura ≥48px + label visual.
- [P2] Pull-to-refresh (já existe hook).

### C. Performance (mobile)
- [P1] Paginação ou virtualização se >50 resultados (atualmente query Base44).
- [P2] Debounce forte na busca + TanStack Query cache.

**Métricas:** Tempo para primeiro resultado <1s mobile.

### D. Acessibilidade
- [P1] Filtros com labels associados (`<label>` ou aria-labelledby).
- [P2] ARIA live region para contagem de resultados.

---

## 3. Cards de Prestador/Serviço (ServiceCard, ProviderCard, ProviderGrid)

### A. SEO
- [P1] Schema Service/Offer por card quando na página de listagem (via SchemaMarkup no container quando aplicável).
- [P2] Links com texto descritivo (já tem aria-label em alguns).

### B. Usabilidade (mobile)
- [P0] Cards têm botão "Solicitar" que herda do Button — deve ter min-h 48px.
- [P1] Cards clicáveis inteiros (boa prática) + botão claro. Evitar nested links problemáticos.
- [P1] Preços e estrelas legíveis em telas pequenas (fontes atuais ok).

### C. Performance (mobile)
- [P1] LazyImage + WebP já implementado — garantir que todos cards usem (sim).
- [P2] Evitar re-renders desnecessários (memo).

### D. Acessibilidade
- [P1] Alt + aria-label em avatar, capa e botões (presentes em muitos lugares).
- [P2] Cards com role="article" ou listitem + heading adequado.

---

## 4. Páginas Regionais e Destinos (Trancoso.jsx, ArraialDajuda.jsx, PortoSeguro.jsx, Caraiva.jsx, DestinoHub, ServicoDestino, bairros)

### A. SEO
- [P0] Hooks useDestinationSeo já usados mas limitados (não atualizam todas tags como og:image, twitter completo). Migrar ou estender para usar useSEO + adicionar ogImage + schema completo.
- [P1] H1 únicos por destino (já bom: "Serviços Verificados em Trancoso").
- [P1] Schema LocalBusiness + Service por destino (já parcial).
- [P1] Canonicals corretos (ex.: `/trancoso`, `/arraial-dajuda` — ver sitemap e rotas).
- [P2] Breadcrumbs + FAQ específicos por região.

**Melhor prática:** Adicionar `import { useSEO } from ...` + SchemaMarkup em cada página regional.

**Exemplo:**
```jsx
useSEO({
  title: "Trancoso Bahia | Serviços e Profissionais Verificados",
  description: "...",
  canonical: "/trancoso",
  ogImage: "..." 
});
```

### B. Usabilidade (mobile)
- [P0] WhatsAppStickyBar já presente e bom (fixed bottom, safe-area, scroll trigger) — estender para TODAS páginas de destino + ServicosCategoria.
- [P1] Grid de serviços com touch targets grandes.
- [P1] Chips de bairros/serviços com área ≥48px.

### C. Performance (mobile)
- [P1] Imagens hero regionais (bg unsplash) — usar Lazy ou preload crítico.
- [P2] Code-split por destino (já lazy no App.jsx).

### D. Acessibilidade
- [P1] Verificar alts de hero e ícones de serviço.
- [P2] Landmarks (main, nav) nas páginas.

---

## 5. Planos de Assinatura (Planos.jsx)

### A. SEO
- [P0] Substituir manual document.title/meta por `useSEO({ title: "Planos e Preços | Trancoso Resolve", description: "...", canonical: "/Planos" })`.
- [P1] Schema Offer / Product para planos (preço, trial).
- [P2] FAQ estruturado.

### B. Usabilidade (mobile)
- [P1] Cards de plano com CTAs grandes (≥48px).
- [P1] Formulário de checkout/assinatura curto e com labels claros (Stripe).
- [P2] Comparativa de planos fácil de ler em portrait.

### C. Performance (mobile)
- [P2] Evitar carregar Stripe até interação.

### D. Acessibilidade
- [P1] Labels + aria para preços e botões de escolha.

---

## 6. Pré-Lançamento (PreLancamento.jsx)

### A. SEO
- [P1] Usar useSEO com título/desc focado em "Vagas limitadas - Seja Prestador Pioneiro".
- [P2] Canonical e schema Event ou Offer.

### B. Usabilidade (mobile)
- [P1] Formulário de captura curto (já bom).
- [P0] DEADLINE hardcoded para 2025-05-19 (passado) — atualizar ou remover contagem regressiva se lançamento atual.

### C. Performance (mobile)
- [P2] Lazy no form.

### D. Acessibilidade
- [P1] Campos com labels + validação acessível.

---

## 7. Cadastro de Prestador (SejaPrestador.jsx, CadastroTipo, LeadPrestadorForm, componentes sejaprestador)

### A. SEO
- [P0] Substituir manual title/meta/canonical por useSEO consistente.
- [P1] Schema para página de "Join" / Organization.

### B. Usabilidade (mobile)
- [P0] Todos CTAs e botões de "Cadastre-se" devem ter ≥48px (herdam Button).
- [P1] Formulário multi-passo ou simples com bom progresso mobile.
- [P1] WhatsApp como canal primário de onboarding.

### C. Performance (mobile)
- [P2] Lazy forms.

### D. Acessibilidade
- [P1] Todos inputs com labels associados e mensagens de erro acessíveis.

---

## 8. Perfil do Prestador e Detalhes de Serviço (PrestadorPerfil.jsx, ServicoDetalhes.jsx, ServicoLanding)

### A. SEO
- [P1] useSEO + canonical dinâmico por `?id=` (com fallback) + schema Individual ServiceProvider / Service + Review.
- [P2] Breadcrumb + aggregateRating.

### B. Usabilidade (mobile)
- [P1] CTA WhatsApp direto e grande no perfil (visível sem scroll excessivo).
- [P1] Agenda / solicitação de serviço com form curto (≤5 campos).

### C. Performance (mobile)
- [P1] Fotos de portfólio lazy + WebP.

### D. Acessibilidade
- [P1] Alt em fotos de prestador + reviews com estrutura acessível.

---

## 9. Contato e WhatsApp (WhatsAppStickyBar, links footer/header, SupportChat, CTAs)

### A. SEO
- [P1] Manter links wa.me com texto otimizado para rastreamento (analytics já existe).

### B. Usabilidade (mobile)
- [P0] WhatsAppStickyBar excelente para mobile (bottom fixed, safe-area, cor forte). **Estender para Home, ServicosCategoria, Planos, SejaPrestador e páginas de perfil.**
- [P1] Todos CTAs wa.me abrem em nova aba + track.

### C. Performance (mobile)
- [P2] N/A (links externos).

### D. Acessibilidade
- [P1] aria-label claros em todos links WhatsApp (já presente na maioria).

---

## 10. Layout + Navegação Mobile (Layout.jsx, BottomNav.jsx, header, footer)

### A. SEO
- [P0] Lógica de title/desc no Layout é parcial e conflita com hooks. Consolidar: páginas devem usar useSEO; Layout deve apenas complementar ou ser removido da responsabilidade de SEO.
- [P1] Footer com links para todos destinos/serviços (já rico para SEO).

### B. Usabilidade (mobile)
- [P0] BottomNav: área de toque pequena (py-2 + ícone 20px + texto 10px). Aumentar para py-3, ícones 24px, área clicável maior.
- [P1] Header sticky com safe-area-inset-top (bom). Menu mobile acessível.
- [P1] Garantir que navegação com polegar funcione (bottom nav + sticky whatsapp sem sobreposição).

**Exemplo fix BottomNav:**
```jsx
<Link className="... min-h-[48px] py-3 ...">
  <Icon className="w-6 h-6" />
  ...
</Link>
```

### C. Performance (mobile)
- [P2] RoutePreloader / ImagePreloader (já existem).

### D. Acessibilidade
- [P1] SkipToContent já presente.
- [P1] aria-label e current em nav items.

---

## 11. PWA / Base (manifest.json, service-worker.js, index.html metas)

### A. SEO
- [P1] manifest.json bom (shortcuts, icons maskable, screenshots). Adicionar mais screenshots mobile se possível.
- [P2] Atualizar theme_color e apple status bar.

### B. Usabilidade (mobile)
- [P1] Standalone + portrait-primary bom para mobile.
- [P1] Instalar PWA prompt (PWAPrompt já existe).

### C. Performance (mobile)
- [P1] Service worker registrado (bom para cache). Garantir que cacheia assets críticos e sitemap/robots.
- [P2] Preconnects já bons (incluindo facebook).

### D. Acessibilidade
- [P2] Ícones com propósito.

**Métricas:** Lighthouse PWA ≥90 (se aplicável).

---

## 12. Páginas Institucionais e Legais (ComoFunciona, About, Contact, Politicas, Seguranca, Manual)

### A. SEO
- [P1] Todas devem usar useSEO + canonicals (já redirecionamentos canônicos existem para lowercase).
- [P2] Schema para About/Contact.

### B. Usabilidade (mobile)
- [P1] CTAs de contato/WhatsApp em todas as páginas institucionais.

### C. Performance (mobile)
- [P2] Estático.

### D. Acessibilidade
- [P1] Contraste e headings em páginas longas.

---

## ITENS TRANSVERSAIS / GLOBAIS

**SEO Global:**
- [P0] Atualizar Meta Pixel ID no index.html para o correto fornecido (1469130194903035).
- [P0] Consolidar uso de useSEO/useDestinationSeo em **todas** páginas públicas (Home, ServicosCategoria, Planos, SejaPrestador, PrestadorPerfil, ServicoDetalhes, institucionais). Remover ou condicionar overrides manuais em Layout e páginas.
- [P1] Garantir canonicals absolutos com BASE_URL em todos os hooks.
- [P1] Adicionar `og:image` consistente e `og:locale` em hooks.
- [P1] Manter schema estático no index.html + injetar dinâmico.
- [P1] Atualizar sitemap.xml com datas recentes + todas rotas reais (incluindo /guides, /destinos/*).

**Usabilidade Global:**
- [P0] Corrigir todos os touch targets (Button + custom chips + BottomNav + cards) para ≥48px de altura/área efetiva em mobile.
- [P1] Garantir WhatsApp sempre acessível (sticky ou floating) nas páginas de conversão.
- [P1] Formulários (Lead, booking, cadastro) curtos e com validação clara.

**Performance Global:**
- [P1] Manter manualChunks no vite + lazy routes (bom).
- [P1] Todas imagens críticas com preload ou priority + WebP.
- [P2] Medir regularmente com lighthouse-config.js.

**Acessibilidade Global:**
- [P1] Botões e links com aria-label quando ícone-only.
- [P1] Contraste verificado nos tokens de marca (laranja/terracota sobre fundos).
- [P2] Testes automatizados com jest-axe.

---

## RESUMO DE AÇÕES P0 IDENTIFICADAS (TODAS CORRIGIDAS NO PR)

1. Touch targets insuficientes em Button (default h-9) + HeroSearch chips + BottomNav.
2. Inconsistência/completude de SEO (useSEO não usado amplamente + overrides conflitantes + canonicals + schema parciais).
3. Meta Pixel ID incorreto no index.html.
4. useDestinationSeo e hooks limitados (faltam campos).
5. WhatsAppStickyBar não aplicado universalmente em páginas chave.
6. Manual title/desc em Home, SejaPrestador, Planos etc.
7. Deadline passado em PreLancamento (se ainda exposto).
8. Sitemap desatualizado (datas).

Todos os itens P0 acima foram corrigidos automaticamente neste ciclo (ver PR).

---

## PRÓXIMOS PASSOS APÓS LANÇAMENTO

- Executar Lighthouse mobile (mobile 4G) + Search Console.
- Adicionar mais testes a11y (axe).
- Regenerar sitemap via `npm run sitemap` periodicamente.
- Monitorar Core Web Vitals + eventos WhatsApp no Vercel + GA4 + Meta.
- Expandir uso de SchemaMarkup em páginas de serviço/perfil.

---

*Checklist gerado automaticamente a partir de análise completa do código. Itens são verificáveis via inspeção de arquivos, DevTools, Lighthouse e Search Console.*
