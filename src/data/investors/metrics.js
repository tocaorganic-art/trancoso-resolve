// Fonte única de verdade dos números da página de investidores.
// Os valores vêm do modelo financeiro oficial "Trancoso_Resolve_Pacote_Investidores_2026".
// Nada aqui é resultado comprovado: cada indicador carrega sua classificação de evidência,
// e os rótulos traduzidos vivem em content.js, referenciados por `id`.

// Preços — hipóteses de lançamento, não contratos vigentes.
export const PRICING = {
  fundador: 19.9,
  profissional: 59,
  commissionMinPct: 8,
  commissionMaxPct: 12,
};

// Cenário ilustrativo oficial: 500 prestadores no plano Profissional.
export const OFFICIAL_SCENARIO = {
  providers: 500,
  price: PRICING.profissional,
};

// Densidades usadas na sensibilidade do gráfico.
export const DENSITY_SCENARIOS = [100, 250, 500, 1000];

export const mrrFor = (providers, price) => providers * price;
export const arrFor = (providers, price) => mrrFor(providers, price) * 12;

export const SCENARIO_MRR = mrrFor(OFFICIAL_SCENARIO.providers, OFFICIAL_SCENARIO.price);
export const SCENARIO_ARR = arrFor(OFFICIAL_SCENARIO.providers, OFFICIAL_SCENARIO.price);

export function formatBRL(value, { compact = false, decimals = 0 } = {}) {
  if (!Number.isFinite(value)) return '—';
  if (compact && Math.abs(value) >= 1000) {
    const scaled = value / 1000;
    const isWhole = Number.isInteger(scaled);
    return `R$ ${scaled.toLocaleString('pt-BR', {
      minimumFractionDigits: isWhole ? 0 : 1,
      maximumFractionDigits: 1,
    })} mil`;
  }
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatNumber(value) {
  return Number.isFinite(value) ? value.toLocaleString('pt-BR') : '—';
}

// Indicadores exibidos como cards. `classification` usa a taxonomia já existente
// em ClassificationBadge / content.js: cenario, hipotese, hipoteseFutura, fonteExterna, faltante.
export const INVESTOR_METRICS = [
  {
    id: 'scenarioProviders',
    value: OFFICIAL_SCENARIO.providers,
    unit: 'prestadores',
    format: 'number',
    period: 'cenário 18M',
    classification: 'cenario',
    sourceKey: 'modeloFinanceiro',
  },
  {
    id: 'scenarioPrice',
    value: PRICING.profissional,
    unit: '/mês',
    format: 'currency',
    period: 'hipótese de preço',
    classification: 'hipotese',
    sourceKey: 'modeloFinanceiro',
  },
  {
    id: 'scenarioMrr',
    value: SCENARIO_MRR,
    unit: 'MRR',
    format: 'currencyCompact',
    period: 'mensal · ilustrativo',
    classification: 'cenario',
    sourceKey: 'modeloFinanceiro',
  },
  {
    id: 'scenarioArr',
    value: SCENARIO_ARR,
    unit: 'ARR run-rate',
    format: 'currencyCompact',
    period: 'anualizado · ilustrativo',
    classification: 'cenario',
    sourceKey: 'modeloFinanceiro',
  },
];

// Status das janelas do plano de 18 meses. Nenhuma marcada como concluída:
// a auditoria técnica mantém os gates críticos em aberto, então não há evidência
// que sustente "concluído" ou "atual". Propriedade semântica, igual nos 3 idiomas.
export const PLAN_PHASE_STATUS = ['planejado', 'dependente', 'dependente', 'dependente', 'dependente'];

// Ordem dos nós do ecossistema — os rótulos traduzidos vêm de content.js.
export const ECOSYSTEM_NODE_IDS = ['prestadores', 'moradores', 'anfitrioes', 'visitantes', 'parceiros', 'categorias'];

export function formatMetric(metric) {
  switch (metric.format) {
    case 'currency':
      return formatBRL(metric.value, { decimals: metric.value % 1 === 0 ? 0 : 2 });
    case 'currencyCompact':
      return formatBRL(metric.value, { compact: true });
    case 'number':
    default:
      return formatNumber(metric.value);
  }
}
