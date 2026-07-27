import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, stagger, useReducedMotion, VIEWPORT } from '@/lib/motion';

const STATUS_STYLES = {
  concluido: 'bg-[#3E8E5A]/15 text-[#3E8E5A] border-[#3E8E5A]/30',
  atual: 'bg-brand-primary/15 text-orange-700 dark:text-orange-400 border-brand-primary/30',
  planejado: 'bg-muted text-muted-foreground border-border',
  dependente: 'bg-[#2D7D8A]/15 text-[#2D7D8A] border-[#2D7D8A]/30 border-dashed',
};

// Timeline navegável por teclado (padrão tabs com roving tabindex).
// No celular vira sequência vertical: a lista rola horizontalmente e o painel fica abaixo.
export default function Plan18Timeline({ phases = [], statusLabels = {}, fieldLabels = {}, gateNote }) {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef([]);

  const focusTab = (index) => {
    const next = (index + phases.length) % phases.length;
    setSelected(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      focusTab(selected + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      focusTab(selected - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusTab(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      focusTab(phases.length - 1);
    }
  };

  const active = phases[selected];
  if (!active) return null;

  return (
    <div>
      <div className="relative">
        <div className="absolute left-0 right-0 top-[22px] h-0.5 bg-border hidden md:block" aria-hidden="true">
          <motion.div
            className="h-full bg-brand-primary origin-left"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: reduce ? 0 : 1.2, ease: 'easeInOut' }}
          />
        </div>

        <div
          role="tablist"
          aria-label={fieldLabels.timeline}
          onKeyDown={onKeyDown}
          className="relative flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:gap-2 md:overflow-visible"
        >
          {phases.map((phase, i) => {
            const isSelected = i === selected;
            return (
              <button
                key={phase.window}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`plan-tab-${i}`}
                aria-selected={isSelected}
                aria-controls={`plan-panel-${i}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setSelected(i)}
                className="group shrink-0 md:shrink text-left focus:outline-none"
              >
                <span
                  className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 text-xs font-extrabold transition-all group-focus-visible:ring-2 group-focus-visible:ring-orange-400 group-focus-visible:ring-offset-2 ${
                    isSelected
                      ? 'bg-brand-primary border-brand-primary text-white shadow-brand scale-105'
                      : 'bg-card border-border text-muted-foreground group-hover:border-brand-primary/50'
                  }`}
                >
                  {i + 1}
                </span>
                <span
                  className={`mt-2.5 block text-xs font-bold whitespace-nowrap md:whitespace-normal transition-colors ${
                    isSelected ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {phase.window}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <motion.div
        key={selected}
        id={`plan-panel-${selected}`}
        role="tabpanel"
        aria-labelledby={`plan-tab-${selected}`}
        tabIndex={0}
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.35 }}
        className="mt-6 rounded-brand-lg border border-border bg-card p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
      >
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <h3 className="text-lg font-display font-extrabold text-foreground">{active.window}</h3>
          <span
            className={`inline-flex items-center rounded-pill border px-3 py-1 text-xs font-bold uppercase tracking-wide ${
              STATUS_STYLES[active.status] || STATUS_STYLES.planejado
            }`}
          >
            {statusLabels[active.status] || statusLabels.planejado}
          </span>
        </div>

        <motion.dl
          initial="hidden"
          animate="visible"
          variants={stagger(reduce, { each: 0.06 })}
          className="grid sm:grid-cols-2 gap-x-8 gap-y-5"
        >
          {[
            ['product', active.product],
            ['offer', active.offer],
            ['demand', active.demand],
            ['financial', active.financial],
          ].map(([key, text]) => (
            <motion.div key={key} variants={fadeUp(reduce, { distance: 10 })}>
              <dt className="text-xs font-bold uppercase tracking-wide text-orange-700 dark:text-orange-400 mb-1">
                {fieldLabels[key]}
              </dt>
              <dd className="text-sm text-muted-foreground leading-relaxed">{text}</dd>
            </motion.div>
          ))}
        </motion.dl>

        <div className="mt-5 pt-5 border-t border-border">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">{fieldLabels.gate}</p>
          <p className="text-sm font-semibold text-foreground">{active.gate}</p>
        </div>
      </motion.div>

      {gateNote && <p className="mt-5 text-sm font-semibold text-foreground/80">{gateNote}</p>}
    </div>
  );
}
