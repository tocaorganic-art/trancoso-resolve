import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import Section from './Section';
import { useInvestorLang } from './InvestorLangContext';
import { fadeUp, stagger, useReducedMotion, VIEWPORT } from '@/lib/motion';
import { OFFICIAL_SCENARIO, PRICING, formatBRL, formatNumber } from '@/data/investors/metrics';

const DEFAULTS = {
  fundadorProviders: 0,
  profissionalProviders: OFFICIAL_SCENARIO.providers,
  fundadorPrice: PRICING.fundador,
  profissionalPrice: PRICING.profissional,
};

// Preços negativos não têm significado no modelo: qualquer entrada inválida vira 0.
export function sanitizePrice(raw) {
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

// MRR = soma das assinaturas de cada plano. ARR = MRR × 12 (run-rate).
export function computeScenario({ fundadorProviders, profissionalProviders, fundadorPrice, profissionalPrice }) {
  const mrr = fundadorProviders * fundadorPrice + profissionalProviders * profissionalPrice;
  return {
    mrr,
    arr: mrr * 12,
    totalProviders: fundadorProviders + profissionalProviders,
  };
}

export default function FinancialCalculator() {
  const { t } = useInvestorLang();
  const c = t.calculator;
  const viz = t.viz.calculator;
  const reduce = useReducedMotion();
  const [state, setState] = useState(DEFAULTS);
  const [invalid, setInvalid] = useState({});

  const { mrr, arr, totalProviders } = useMemo(() => computeScenario(state), [state]);

  const updateProviders = (key) => (e) => {
    setState((s) => ({ ...s, [key]: Number(e.target.value) }));
  };

  const updatePrice = (key) => (e) => {
    const raw = e.target.value;
    const clean = sanitizePrice(raw);
    setInvalid((v) => ({ ...v, [key]: raw !== '' && Number(raw) < 0 }));
    setState((s) => ({ ...s, [key]: clean }));
  };

  const reset = () => {
    setState(DEFAULTS);
    setInvalid({});
  };

  const priceField = (key, label) => (
    <div>
      <label htmlFor={key} className="block text-sm font-semibold text-foreground mb-1.5">
        {label}
      </label>
      <input
        id={key}
        type="number"
        min={0}
        step={0.1}
        value={state[key]}
        onChange={updatePrice(key)}
        aria-invalid={Boolean(invalid[key])}
        aria-describedby={invalid[key] ? `${key}-error` : undefined}
        className={`w-full rounded-lg border bg-muted px-3 py-2 text-sm text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 ${
          invalid[key] ? 'border-[#D7382B]' : 'border-border'
        }`}
      />
      {invalid[key] && (
        <p id={`${key}-error`} role="alert" className="mt-1 text-xs font-semibold text-[#D7382B]">
          {viz.invalidPrice}
        </p>
      )}
    </div>
  );

  const slider = (key, label) => (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={key} className="text-sm font-semibold text-foreground">
          {label}
        </label>
        <span className="text-sm font-bold text-orange-700 dark:text-orange-400 tabular-nums">{formatNumber(state[key])}</span>
      </div>
      <input
        id={key}
        type="range"
        min={0}
        max={1000}
        step={10}
        value={state[key]}
        onChange={updateProviders(key)}
        className="w-full accent-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-pill"
      />
    </div>
  );

  return (
    <Section id="calculadora" eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle}>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 rounded-brand-lg border border-border bg-card p-6 space-y-6">
          {slider('fundadorProviders', c.fundadorLabel)}
          {slider('profissionalProviders', c.profissionalLabel)}

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            {priceField('fundadorPrice', c.fundadorPriceLabel)}
            {priceField('profissionalPrice', c.profissionalPriceLabel)}
          </div>

          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-pill text-xs font-bold text-muted-foreground transition-colors hover:text-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" /> {c.resetLabel}
          </button>
        </div>

        {/* Resultados: aria-live para que o recálculo seja anunciado. */}
        <div
          className="lg:col-span-2 rounded-brand-lg bg-[#1A1208] text-white p-6 flex flex-col justify-center gap-6"
          aria-live="polite"
          aria-atomic="true"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-white/50">{c.resultProviders}</p>
            <p className="text-2xl font-display font-extrabold mt-1 tabular-nums">{formatNumber(totalProviders)}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-white/50">{c.resultMrr}</p>
            <p className="text-3xl font-display font-extrabold mt-1 text-orange-400 tabular-nums">{formatBRL(mrr)}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-white/50">{c.resultArr}</p>
            <p className="text-2xl font-display font-extrabold mt-1 tabular-nums">{formatBRL(arr)}</p>
          </div>
        </div>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        variants={stagger(reduce, { each: 0.06 })}
        className="mt-6 rounded-brand-lg border border-border bg-sand/40 dark:bg-neutral-900/60 p-5"
      >
        <h3 className="text-sm font-bold text-foreground mb-3">{viz.assumptionsTitle}</h3>
        <ul className="space-y-1.5">
          {viz.assumptions.map((a) => (
            <motion.li key={a} variants={fadeUp(reduce, { distance: 8 })} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
              <span className="text-orange-700 dark:text-orange-400 font-bold" aria-hidden="true">
                ·
              </span>
              {a}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <p className="mt-6 text-sm text-muted-foreground italic max-w-2xl">{c.disclaimer}</p>
    </Section>
  );
}
