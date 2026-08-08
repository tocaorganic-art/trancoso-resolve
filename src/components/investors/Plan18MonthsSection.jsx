import { motion } from 'framer-motion';
import Section from './Section';
import Plan18Timeline from './Plan18Timeline';
import { useInvestorLang } from './InvestorLangContext';
import { fadeUp, stagger, useReducedMotion, VIEWPORT } from '@/lib/motion';
import { PLAN_PHASE_STATUS } from '@/data/investors/metrics';

export default function Plan18MonthsSection() {
  const { t } = useInvestorLang();
  const p = t.plan18;
  const viz = t.viz;
  const reduce = useReducedMotion();

  const phases = p.roadmap.map((row, i) => ({ ...row, status: PLAN_PHASE_STATUS[i] || 'planejado' }));

  return (
    <Section id="plano" eyebrow={p.eyebrow} title={p.title}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        variants={stagger(reduce)}
        className="grid md:grid-cols-3 gap-5 mb-14"
      >
        {p.phases.map((phase) => (
          <motion.div
            key={phase.range}
            variants={fadeUp(reduce)}
            className="rounded-brand-lg border border-border bg-card p-6 transition-shadow hover:shadow-warm-md"
          >
            <span className="inline-block rounded-pill bg-brand-primary/10 text-orange-700 dark:text-orange-400 text-xs font-bold px-3 py-1 mb-3">
              {phase.range}
            </span>
            <h3 className="font-bold text-foreground mb-1.5">{phase.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{phase.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      <h3 className="text-xl font-bold text-foreground mb-6">{p.roadmapTitle}</h3>
      <Plan18Timeline phases={phases} statusLabels={viz.planStatus} fieldLabels={viz.planFields} gateNote={p.gate} />
    </Section>
  );
}
