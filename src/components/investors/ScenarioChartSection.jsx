import { lazy, Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import Section from './Section';
import ChartFrame from './ChartFrame';
import MetricCard from './MetricCard';
import { useInvestorLang } from './InvestorLangContext';
import { stagger, useReducedMotion, VIEWPORT } from '@/lib/motion';
import { DENSITY_SCENARIOS, INVESTOR_METRICS, PRICING, formatBRL, formatMetric, mrrFor } from '@/data/investors/metrics';

// Recharts pesa ~105 KB gzip. Carregado sob demanda para não travar o carregamento inicial.
const ScenarioBarChart = lazy(() => import('./charts/ScenarioBarChart'));

const SERIES = [
  { key: 'fundador', color: '#6B7C3A', price: PRICING.fundador },
  { key: 'profissional', color: '#E8571A', price: PRICING.profissional },
];

export default function ScenarioChartSection() {
  const { t } = useInvestorLang();
  const s = t.scenarioChart;
  const viz = t.viz;
  const reduce = useReducedMotion();
  const [hidden, setHidden] = useState([]);

  const chartData = DENSITY_SCENARIOS.map((providers) => ({
    providers: String(providers),
    fundador: mrrFor(providers, PRICING.fundador),
    profissional: mrrFor(providers, PRICING.profissional),
  }));

  const legend = { fundador: s.chartLegendFundador, profissional: s.chartLegendProfissional };
  const toggle = (key) => setHidden((h) => (h.includes(key) ? h.filter((k) => k !== key) : [...h, key]));

  return (
    <Section eyebrow={s.eyebrow} title={s.title} tone="sand">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        variants={stagger(reduce)}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
      >
        {INVESTOR_METRICS.map((metric) => (
          <MetricCard
            key={metric.id}
            value={metric.value}
            format={(v) => formatMetric({ ...metric, value: v })}
            unit={metric.unit}
            period={metric.period}
            classification={metric.classification}
            classificationLabel={t.classification[metric.classification]}
            source={viz.sources[metric.sourceKey]}
            label={viz.metricLabels[metric.id]}
            description={viz.metricDescriptions[metric.id]}
            periodLabel={viz.periodLabel}
            sourceLabel={viz.sourceLabel}
          />
        ))}
      </motion.div>

      <ChartFrame
        title={s.chartTitle}
        description={viz.chartDescription}
        note={s.formulaNote}
        tableCaption={s.chartTitle}
        tableColumns={viz.chartColumns}
        tableRows={chartData.map((row) => [row.providers, formatBRL(row.fundador), formatBRL(row.profissional)])}
        showTableLabel={viz.showTable}
        hideTableLabel={viz.hideTable}
      >
        <Suspense fallback={<div className="h-full w-full rounded-brand-md bg-muted/50 animate-pulse" />}>
          <ScenarioBarChart data={chartData} series={SERIES} legend={legend} hidden={hidden} animate={!reduce} />
        </Suspense>
      </ChartFrame>

      {/* Ligar/desligar séries — fora do gráfico, para funcionar por teclado. */}
      <div className="mt-4 flex flex-wrap gap-2">
        {SERIES.map((serie) => {
          const off = hidden.includes(serie.key);
          return (
            <button
              key={serie.key}
              type="button"
              onClick={() => toggle(serie.key)}
              aria-pressed={!off}
              className={`inline-flex items-center gap-2 rounded-pill border px-3 py-1.5 text-xs font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
                off ? 'border-border text-muted-foreground/50 line-through' : 'border-border text-foreground hover:border-brand-primary/50'
              }`}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: off ? 'transparent' : serie.color, border: `2px solid ${serie.color}` }} />
              {legend[serie.key]}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        <p className="text-sm font-bold text-foreground mb-2">{s.exclusionsTitle}</p>
        <div className="flex flex-wrap gap-2">
          {s.exclusions.map((e) => (
            <span key={e} className="rounded-pill bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              {e}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}
