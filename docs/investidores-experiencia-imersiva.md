# `/investidores` — experiência imersiva (jul/2026)

Documentação da transformação da página de investidores em uma experiência
narrativa animada, feita na branch `claude/trancoso-investidores-imersivo-eq55pw`.

## 1. Resumo das alterações

A página passou de seções estáticas para uma narrativa conduzida pela rolagem:
hero em sequência encadeada, fragmentação do mercado em SVG animado,
ecossistema interativo, jornada em trilha, gráficos com lazy-load e alternativa
textual acessível, e uma timeline navegável por teclado para o plano de 18
meses. Nenhum número, preço ou fato do conteúdo original foi alterado — apenas
a apresentação.

## 2. Componentes criados

| Componente | Arquivo | Função |
|---|---|---|
| `AnimatedCounter` | `components/investors/AnimatedCounter.jsx` | Contagem progressiva; valor final imediato sob movimento reduzido |
| `MetricCard` | `components/investors/MetricCard.jsx` | Card de indicador com unidade, período, classificação e fonte |
| `ChartFrame` | `components/investors/ChartFrame.jsx` | Casca comum dos gráficos: lazy-load por `IntersectionObserver` + tabela equivalente acessível |
| `AnimatedNarrativeSection` | `components/investors/AnimatedNarrativeSection.jsx` | Seção com título revelado por palavra e destaque de termos |
| `FragmentationFlow` | `components/investors/FragmentationFlow.jsx` | SVG conceitual: caminhos dispersos → organizados pela plataforma |
| `EcosystemGraph` | `components/investors/EcosystemGraph.jsx` | Grafo com hover/foco no desktop, cards sequenciais no celular |
| `JourneyTrail` | `components/investors/JourneyTrail.jsx` | Trilha da jornada com barra de progresso |
| `Plan18Timeline` | `components/investors/Plan18Timeline.jsx` | Timeline com padrão tabs + roving tabindex |
| `EcosystemSection` | `components/investors/EcosystemSection.jsx` | Nova seção entre "Mercado" e "Concorrentes" |
| `ScenarioBarChart` / `FundsDonutChart` | `components/investors/charts/` | Wrappers Recharts, carregados via `React.lazy` |

## 3. Arquivos modificados

- `src/pages/Investidores.jsx` — inclui `EcosystemSection`.
- `src/components/investors/{ProblemSection,ProductSection,ScenarioChartSection,UseOfFundsSection,Plan18MonthsSection,InvestorHero,FinancialCalculator}.jsx` — reescritos para usar os novos componentes.
- `src/components/ui/accordion.jsx` — tipagem JSDoc (corrige typecheck, sem mudança visual).
- `src/data/investors/content.js` — bloco `viz` adicionado nos 3 idiomas (rótulos dos novos componentes). Nenhuma string existente foi removida ou reescrita.
- `src/index.css` — bloco global `@media (prefers-reduced-motion: reduce)`.
- `package.json` / `vite.config.js` (não tocado) / `vitest.config.js` (novo) — scripts `test`/`test:watch`.

## 4. Bibliotecas utilizadas

**Nenhuma dependência de produção nova.** `framer-motion` e `recharts` já
estavam no projeto — a auditoria inicial confirmou isso antes de qualquer
mudança. Única adição: `vitest` + `jsdom` como devDependencies, para a suíte
de testes (o projeto tinha `jest`/`jest-axe` instalados mas nunca configurados).

## 5. Dados usados nos gráficos

Fonte única em `src/data/investors/metrics.js`:

- `PRICING` — R$ 19,90 (Fundador), R$ 59 (Profissional), comissão futura 8–12%.
- `OFFICIAL_SCENARIO` — 500 prestadores × R$ 59.
- `SCENARIO_MRR` / `SCENARIO_ARR` — **derivados** por multiplicação (`mrrFor`/`arrFor`), não mais strings copiadas em pt/es/en. R$ 29,5 mil e R$ 354 mil continuam batendo exatamente com o pacote oficial.
- `DENSITY_SCENARIOS` — [100, 250, 500, 1000], igual ao gráfico original.
- `PLAN_PHASE_STATUS` — todas as janelas do plano de 18M como `planejado`/`dependente`; nenhuma marcada `concluido` ou `atual`, porque a auditoria técnica mantém os gates críticos em aberto.

## 6. Classificação de cada métrica exibida

| Indicador | Classificação | Por quê |
|---|---|---|
| Prestadores no cenário (500) | Cenário ilustrativo | Densidade escolhida para sensibilidade, não base cadastrada |
| Preço mensal (R$ 59) | Hipótese | Preço-alvo, sem cobrança em operação |
| MRR ilustrativo (R$ 29,5 mil) | Cenário ilustrativo | Resultado de multiplicação, não receita cobrada |
| ARR run-rate (R$ 354 mil) | Cenário ilustrativo | MRR × 12, run-rate teórico |
| Plano Fundador / Profissional | Hipótese | Preço de lançamento, a aprovar |
| Comissão transacional (8–12%) | Hipótese futura | Só entra com categorias controláveis |
| Uso de capital (35/35/30%) | Recomendação | Percentuais recomendados; valor da rodada é "informação pendente de definição" |

Nenhum indicador usa a classificação `fato` — coberto por teste automatizado
(`metrics.test.js`, "nenhum indicador é apresentado como fato comprovado").

## 7. Decisões de acessibilidade

- `prefers-reduced-motion: reduce` respeitado em dois níveis: CSS global (`src/index.css`) para qualquer transição/animação CSS, e `useReducedMotion` do Framer Motion (`src/lib/motion.js`) para as variantes JS — quando ativo, todo conteúdo aparece no estado final, sem contagem progressiva, sem reveal por palavra, sem parallax.
- Todo gráfico tem alternativa em `<table>` (via `ChartFrame`), sempre no DOM para leitor de tela, visualmente oculta (`sr-only`) até o usuário optar por abri-la.
- `Plan18Timeline` e o toggle de séries do gráfico seguem o padrão ARIA de tabs/botões com `role`, `aria-selected`/`aria-pressed` e navegação por teclado (setas, Home, End) com roving tabindex.
- `EcosystemGraph` funciona por foco de teclado além de hover; no celular, os nós tornam-se cards sequenciais (sem depender de hover).
- Resultados da calculadora em `aria-live="polite"`; erro de validação usa `role="alert"`.
- Título do hero e das seções narrativas usam texto decorativo com `aria-hidden` + um `aria-label`/`sr-only` com o texto completo, para que a divisão em palavras não fragmente a leitura por voz.

## 8. Decisões de desempenho

- `recharts` (~105 KB gzip) deixou de ser importado estaticamente na rota. `ScenarioBarChart` e `FundsDonutChart` agora são `React.lazy` + `Suspense`, e `ChartFrame` só os monta quando a seção entra a ~200px do viewport (`IntersectionObserver`).
- Chunk `Investidores` (gzip): **30,0 KB → 39,9 KB** de carregamento imediato (crescimento esperado pelas novas seções), mas os ~107 KB de recharts saem do caminho crítico — confirmado inspecionando os imports do chunk (`recharts` só aparece via `import()` dinâmico, não em `from`).
- Animações usam `transform`/`opacity` (Framer Motion) — nada anima `width`/`height`/`top`/`left`.
- `AnimatedCounter` usa `requestAnimationFrame` com cleanup no `useEffect`.

## 9. Testes executados

```
npm run lint       → 0 erros (33 warnings pré-existentes, inalterados)
npm run typecheck  → 2012 erros (baseline: 2016 — reduzido, nenhum novo)
npm run test       → 55/55 testes (Vitest, novo)
npm run build      → OK
```

Cobertura da suíte nova: fórmulas de MRR/ARR, paridade de chaves PT/ES/EN,
classificação de evidência (nenhum indicador como "fato"), calculadora
(validação de negativos, recálculo, reset), timeline por teclado, toggle de
séries do gráfico, tabela acessível, comportamento sob `prefers-reduced-motion`,
hierarquia de headings.

## 10. Limitações e pendências

- Responsividade validada por revisão de código e pelas classes Tailwind (`sm:`/`md:`/`lg:`), não por screenshot em dispositivos reais — recomenda-se QA visual manual em 320/375/768/1440px antes do merge, conforme já listado no backlog do `CLAUDE.md`.
- O typecheck do projeto (`tsc -p ./jsconfig.json`) segue com 2012 erros pré-existentes, fora do escopo desta tarefa (a maioria em páginas de serviço não relacionadas e em `analytics.js`).
- `og-image.jpg`, submissão do sitemap e Google Business Profile continuam pendentes — não fazem parte deste trabalho.
- Não há captura de tela antes/depois neste documento; o revisor pode rodar `npm run dev` e abrir `/investidores` para comparar.

## 11. Instruções de manutenção

- **Números da página:** editar apenas `src/data/investors/metrics.js`. Nunca digitar R$/MRR/ARR direto em `content.js` — o objetivo da refatoração foi eliminar essa duplicação em 3 idiomas.
- **Nova métrica:** adicionar em `INVESTOR_METRICS`, mais as chaves correspondentes em `content.js` → `viz.metricLabels` / `viz.metricDescriptions` (nos 3 idiomas — o teste `content.test.js` falha se faltar uma chave).
- **Nova classificação de evidência:** usar sempre uma das 7 já existentes em `ClassificationBadge` (`fato`, `hipotese`, `hipoteseFutura`, `cenario`, `faltante`, `recomendacao`, `fonteExterna`). Não introduzir uma nova sem atualizar `ClassificationBadge.jsx` e os 3 idiomas de `classification`.
- **Novo gráfico:** colocar o componente Recharts em `components/investors/charts/`, importar via `lazy()` e envolver em `<ChartFrame>` com `tableColumns`/`tableRows` preenchidos — sem isso, o gráfico fica sem alternativa acessível.
- **Rodar a suíde:** `npm run test` (uma vez) ou `npm run test:watch` (interativo).
