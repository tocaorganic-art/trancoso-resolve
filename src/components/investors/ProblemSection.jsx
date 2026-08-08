import { motion } from 'framer-motion';
import Section from './Section';
import FragmentationFlow from './FragmentationFlow';
import { useInvestorLang } from './InvestorLangContext';
import { fadeUp, stagger, useReducedMotion, VIEWPORT } from '@/lib/motion';

export default function ProblemSection() {
  const { t } = useInvestorLang();
  const p = t.problem;
  const reduce = useReducedMotion();

  return (
    <Section id="problema" eyebrow={p.eyebrow} title={p.title} subtitle={p.subtitle}>
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <motion.div initial="hidden" whileInView="visible" viewport={VIEWPORT} variants={stagger(reduce)} className="grid gap-5">
          {p.cards.map((c) => (
            <motion.div
              key={c.title}
              variants={fadeUp(reduce)}
              className="rounded-brand-lg border border-border bg-card p-6 md:p-8 transition-shadow hover:shadow-warm-md"
            >
              <h3 className="text-lg font-bold text-foreground mb-2">{c.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
          <motion.p variants={fadeUp(reduce)} className="text-sm font-semibold text-orange-700 dark:text-orange-400">
            {p.closing}
          </motion.p>
        </motion.div>

        <FragmentationFlow {...t.viz.flow} />
      </div>
    </Section>
  );
}
