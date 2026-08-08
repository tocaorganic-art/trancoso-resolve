import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import Section from './Section';
import ChartFrame from './ChartFrame';
import { useInvestorLang } from './InvestorLangContext';
import { fadeUp, stagger, useReducedMotion, VIEWPORT } from '@/lib/motion';

const FundsDonutChart = lazy(() => import('./charts/FundsDonutChart'));

const COLORS = ['#E8571A', '#6B7C3A', '#2D7D8A'];

export default function UseOfFundsSection() {
  const { t } = useInvestorLang();
  const u = t.useOfFunds;
  const viz = t.viz;
  const reduce = useReducedMotion();

  const data = u.items.map((item) => ({ name: item.label, value: item.pct }));

  return (
    <Section eyebrow={u.eyebrow} title={u.title} subtitle={u.subtitle} tone="sand">
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <ChartFrame
          title={viz.fundsChartTitle}
          note={viz.fundsPending}
          tableCaption={viz.fundsChartTitle}
          tableColumns={viz.fundsColumns}
          tableRows={u.items.map((item) => [item.label, `${item.pct}%`, item.desc])}
          showTableLabel={viz.showTable}
          hideTableLabel={viz.hideTable}
          height="h-64 md:h-72"
        >
          <Suspense fallback={<div className="h-full w-full rounded-brand-md bg-muted/50 animate-pulse" />}>
            <FundsDonutChart data={data} colors={COLORS} animate={!reduce} />
          </Suspense>
        </ChartFrame>

        <motion.div initial="hidden" whileInView="visible" viewport={VIEWPORT} variants={stagger(reduce)} className="space-y-4">
          {u.items.map((item, i) => (
            <motion.div
              key={item.label}
              variants={fadeUp(reduce)}
              className="rounded-brand-lg bg-card border border-border p-5 transition-shadow hover:shadow-warm-md"
            >
              <div className="flex items-center gap-3 mb-1.5">
                <span className="h-3 w-3 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} aria-hidden="true" />
                <h4 className="font-bold text-foreground">{item.label}</h4>
                <span className="ml-auto font-display font-extrabold text-orange-700 dark:text-orange-400">{item.pct}%</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
