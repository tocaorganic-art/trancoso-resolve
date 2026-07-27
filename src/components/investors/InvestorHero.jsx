import { motion } from 'framer-motion';
import { ChevronDown, Download, MapPin, MessageCircle } from 'lucide-react';
import { useInvestorLang } from './InvestorLangContext';
import { fadeUp, maskReveal, stagger, useReducedMotion } from '@/lib/motion';

export default function InvestorHero() {
  const { t } = useInvestorLang();
  const h = t.hero;
  const reduce = useReducedMotion();

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });

  const titleWords = h.title.split(/(\s+)/);

  return (
    <section className="relative overflow-hidden bg-[#1A1208] text-white">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(60% 50% at 20% 10%, rgba(232,87,26,0.35), transparent), radial-gradient(50% 40% at 90% 20%, rgba(107,124,58,0.25), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="relative container mx-auto px-4 max-w-6xl py-20 md:py-32">
        {/* Sequência: marca → frase principal → texto explicativo → chamadas para ação. */}
        <motion.div initial="hidden" animate="visible" variants={stagger(reduce, { each: 0.06 })}>
          <motion.span
            variants={fadeUp(reduce, { distance: 10 })}
            className="inline-flex items-center gap-2 rounded-pill border border-orange-400/40 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-orange-300 mb-6"
          >
            {h.badge}
          </motion.span>

          <motion.p
            variants={fadeUp(reduce, { distance: 10 })}
            className="flex items-center gap-1.5 text-sm font-semibold text-white/60 mb-4"
          >
            <MapPin className="w-4 h-4" aria-hidden="true" /> {h.eyebrow}
          </motion.p>

          <h1
            aria-label={h.title}
            className="font-display font-extrabold text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] max-w-3xl"
          >
            <span aria-hidden="true">
              {titleWords.map((word, i) =>
                /^\s+$/.test(word) ? (
                  word
                ) : (
                  <motion.span key={`${word}-${i}`} variants={maskReveal(reduce, { duration: 0.65 })} className="inline-block">
                    {word}
                  </motion.span>
                )
              )}
            </span>
          </h1>

          <motion.p variants={fadeUp(reduce, { delay: 0.15 })} className="mt-6 text-lg md:text-xl text-white/75 max-w-2xl leading-relaxed">
            {h.subtitle}
          </motion.p>
          <motion.p variants={fadeUp(reduce, { delay: 0.2 })} className="mt-4 text-base text-white/60 max-w-2xl">
            {h.context}
          </motion.p>

          <motion.div variants={fadeUp(reduce, { delay: 0.25 })} className="mt-10 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => scrollTo('downloads')}
              className="group inline-flex items-center justify-center gap-2 rounded-pill bg-brand-primary text-white font-bold px-6 py-3.5 shadow-brand transition-all hover:bg-brand-primary-hover hover:scale-[1.02] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1208]"
            >
              <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" /> {h.ctaPrimary}
            </button>
            <button
              onClick={() => scrollTo('contato')}
              className="inline-flex items-center justify-center gap-2 rounded-pill border border-white/25 text-white font-bold px-6 py-3.5 transition-colors hover:bg-white/10 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1208]"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" /> {h.ctaSecondary}
            </button>
          </motion.div>

          <motion.div variants={fadeUp(reduce, { delay: 0.3 })} className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
            {h.stripe.map((s) => (
              <span key={s} className="text-xs font-semibold text-white/50 uppercase tracking-wide">
                · {s}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Indicador discreto de rolagem — puramente decorativo. */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/30"
        initial={reduce ? false : { opacity: 0 }}
        animate={reduce ? { opacity: 1 } : { opacity: [0, 1, 1, 0.4], y: [0, 0, 6, 0] }}
        transition={reduce ? { duration: 0 } : { duration: 2.4, repeat: Infinity, times: [0, 0.3, 0.7, 1], delay: 1.2 }}
      >
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </section>
  );
}
