import { motion } from 'framer-motion';
import { Search, Users, ClipboardCheck, MessageSquare, Wrench, Repeat } from 'lucide-react';
import { fadeUp, stagger, useReducedMotion, VIEWPORT } from '@/lib/motion';

const ICONS = [Search, Users, ClipboardCheck, MessageSquare, Wrench, Repeat];

// Trilha da jornada: horizontal no desktop, vertical no celular.
// A linha de progresso é desenhada conforme a seção entra na tela.
export default function JourneyTrail({ steps = [], title }) {
  const reduce = useReducedMotion();

  return (
    <div>
      {title && <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-8 max-w-2xl">{title}</h3>}

      <motion.ol
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        variants={stagger(reduce, { each: 0.12 })}
        className="relative grid gap-6 md:grid-cols-3 lg:grid-cols-6"
      >
        {/* Trilho horizontal (desktop) */}
        <div className="hidden lg:block absolute left-0 right-0 top-6 h-0.5 bg-border" aria-hidden="true">
          <motion.div
            className="h-full bg-brand-primary origin-left"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: reduce ? 0 : 1.4, ease: 'easeInOut' }}
          />
        </div>

        {steps.map((step, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <motion.li key={step.title} variants={fadeUp(reduce)} className="relative flex gap-4 lg:block">
              {/* Trilho vertical (celular/tablet) */}
              {i !== steps.length - 1 && (
                <span className="lg:hidden absolute left-6 top-12 bottom-[-1.5rem] w-0.5 bg-border" aria-hidden="true" />
              )}

              <span
                className="relative z-10 shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary text-white shadow-brand"
                aria-hidden="true"
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
              </span>

              <div className="lg:mt-4">
                <span className="text-xs font-bold text-muted-foreground/60">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h4 className="font-bold text-foreground leading-tight">{step.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </motion.li>
          );
        })}
      </motion.ol>
    </div>
  );
}
