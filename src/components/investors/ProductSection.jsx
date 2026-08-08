import { motion } from 'framer-motion';
import { Search, ShieldCheck, ArrowRightCircle } from 'lucide-react';
import Section from './Section';
import JourneyTrail from './JourneyTrail';
import { useInvestorLang } from './InvestorLangContext';
import { fadeUp, stagger, useReducedMotion, VIEWPORT } from '@/lib/motion';

const ICONS = [Search, ShieldCheck, ArrowRightCircle];

export default function ProductSection() {
  const { t } = useInvestorLang();
  const p = t.product;
  const reduce = useReducedMotion();

  return (
    <Section id="produto" eyebrow={p.eyebrow} title={p.title} subtitle={p.subtitle}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        variants={stagger(reduce)}
        className="grid md:grid-cols-3 gap-5"
      >
        {p.steps.map((s, i) => {
          const Icon = ICONS[i];
          return (
            <motion.div
              key={s.n}
              variants={fadeUp(reduce)}
              className="rounded-brand-lg border border-border bg-card p-6 transition-shadow hover:shadow-warm-md"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10 text-orange-700">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold text-muted-foreground/60">{s.n}</span>
              </div>
              <h3 className="font-bold text-foreground mb-1.5">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          );
        })}
      </motion.div>
      <p className="mt-6 text-sm text-muted-foreground italic">{p.note}</p>

      <div className="mt-14">
        <JourneyTrail title={p.journeyTitle} steps={p.journey} />
      </div>
    </Section>
  );
}
