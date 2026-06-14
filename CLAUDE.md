# Trancoso Resolve

> **Idioma das respostas:** responda **sempre em português (pt-BR)**, de forma
> calorosa e direta, tratando a pessoa por **você**.

Marketplace de serviços locais em **Trancoso, Bahia**. Conecta moradores,
empresários e donos de imóvel a prestadores de serviços locais — elétrica,
limpeza, jardinagem, reformas e mais. Produtos digitais: **app web** e **app mobile**.

> A promessa da marca é um trocadilho: "Resolve" *resolve* o problema **e** é o nome do
> produto. Use a palavra ativamente — "A gente resolve.", "Resolva hoje."

---

## Comandos de desenvolvimento

```bash
npm run dev        # Vite dev server
npm run build      # build de produção
npm run lint       # eslint
npm run lint:fix   # eslint --fix
npm run typecheck  # tsc -p ./jsconfig.json
```

Stack: **React 18 + Vite + Tailwind + shadcn/ui (new-york) + Base44 SDK**. Sem TypeScript
estrito (JSX + `jsconfig`). Ícones: **lucide-react**.

---

## Design System da marca (identidade nova, quente e terrosa)

Esta é a **nova identidade** — um redesign que abandona o antigo logo azul-marinho +
verde com a silhueta da igreja. A fonte da verdade vive em `src/styles/brand/`,
importada de forma **aditiva** no topo de `src/index.css` (expõe os tokens sem
sobrescrever o tema atual do app).

- `src/styles/brand/tokens/` — `fonts.css`, `colors.css`, `typography.css`,
  `spacing.css`, `radius.css` (raio + sombra + motion), `base.css` (reset opcional).
- `src/styles/brand/index.css` — entry **aditivo** (tokens + fontes, sem reset).
- `src/styles/brand/styles.css` — entry completo e fiel do DS (inclui o `base.css`).
- `src/styles/brand/fonts/` — Nunito variável (normal + itálico), self-hosted.
- `src/styles/brand/assets/` — `logo-mark.svg`, `logo-mark-mono.svg`.
- `public/brand/` — assets públicos: `logo-mark.svg`, `logo-mark-mono.svg`,
  `logo-lockup.svg`, `logo-lockup-dark.svg`. Favicon novo em `public/favicon.svg`.

### Como consumir no código

Sempre referencie os **aliases semânticos** (não os valores crus do ramp):
`--brand-primary`, `--surface-card`, `--text-body`, `--border-default`…

No Tailwind (estendido de forma aditiva em `tailwind.config.js`):

```jsx
<button className="bg-brand-primary text-white rounded-pill shadow-brand font-nunito font-bold">
  Encontrar profissional
</button>
```

Utilities disponíveis: `bg-orange-500`, `bg-olive-500`, `bg-sand`, `text-terracotta`,
`bg-brand-primary`, `rounded-pill`, `rounded-brand-lg`, `shadow-brand`, `shadow-warm-md`,
`font-nunito` / `font-display`.

---

## MEMÓRIA — fatos fixos da marca

> Cole aqui (e mantenha) os fatos que nunca mudam. Referência rápida pra qualquer
> agente ou pessoa que tocar no projeto.

### 🎯 Público-alvo

- **Moradores** de Trancoso que precisam resolver serviços do dia a dia.
- **Empresários e donos de imóvel locais** (pousadas, villas, comércio).
- **Turistas de alto padrão** hospedados na região.
- Idioma do produto: **português do Brasil (pt-BR)**. Trate o usuário por **você**,
  de forma calorosa e direta.

### 🎨 Cores

| Papel | Token | Hex |
|---|---|---|
| Primária — laranja queimado | `--orange-500` / `--brand-primary` | `#E8571A` |
| Secundária — terracota | `--orange-700` / `--terracotta` | `#C1440E` |
| Acento — verde-oliva | `--olive-500` / `--brand-secondary` | `#6B7C3A` |
| Fundo claro — areia | `--sand` | `#F2DEC4` |
| Fundo escuro — café escuro | (near-black quente) | `#1A1208` |

- Neutros são **quentes** (tingidos de barro), nunca cinza puro. Texto forte:
  `--neutral-900 #241D16`.
- Semânticas: sucesso `#3E8E5A`, alerta `#E59A12`, erro `#D7382B`, info teal `#2D7D8A`
  (o único acento frio, usado com parcimônia).
- Sombras são **quentes** (base de barro `rgba(56,47,38,…)`), nunca azul-acinzentadas.
  CTA primário leva um brilho laranja (`--shadow-brand`).

### 🔤 Tipografia

- **Família única: Nunito** (variável, pesos 300–1000, self-hosted). Terminais
  arredondados que ecoam os cantos arredondados. Sem fonte secundária.
- **RESOLVE** — peso **900**, **uppercase**, destaque máximo (é o único lockup em
  caixa-alta).
- **Trancoso** — peso **700**, letra-espaçamento amplo (tracking largo).
- Display/headings: 900/800, tracking apertado (`-0.02em`). Body: 400, leading 1.65.
- Labels/botões: 700. Eyebrows: 700 uppercase, tracking `0.12em`.

### ✨ Estilo & voz

- **Cantos arredondados em tudo.** Botões e chips são **pílula** (`--radius-pill`);
  cards usam `lg (20px)`. Raios de `xs 6px` a `2xl 36px`.
- Voz **descontraída e profissional** — caloroso, de vizinho, confiante, nunca
  corporativo. Casing em sentence case (só "RESOLVE" é all-caps).
- **Ícones**: geometria **Lucide**, stroke 2px, cantos arredondados. Sem emoji na UI.
- **Ícone da marca legível em 16×16px** (favicon) — squircle laranja com a igreja
  São João Batista simplificada.
- Sabor local sempre: Trancoso, o Quadrado, a Bahia, "pertinho de você".

### 📝 Microcopy de referência

- Hero: "Encontre quem resolve, pertinho de você."
- CTA: "Encontrar profissional", "Pedir orçamento", "Sou profissional".
- Confiança: "Resposta em até 2 horas", "Avaliações reais", "Profissional verificado".
- Vazio: "Nada por aqui ainda. Que tal pedir seu primeiro orçamento?"
