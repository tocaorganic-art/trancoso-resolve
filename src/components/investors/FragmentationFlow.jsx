import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { drawPath, fadeIn, useReducedMotion } from '@/lib/motion';

const DEMAND_Y = [40, 95, 150, 205];
const SUPPLY_Y = [40, 95, 150, 205];

// Caminhos cruzados: cada pedido tenta vários canais, sem padrão.
const TANGLED = [
  'M70,40 C160,60 180,180 300,205',
  'M70,95 C170,30 200,200 300,40',
  'M70,150 C150,190 210,60 300,150',
  'M70,205 C180,150 190,90 300,95',
  'M70,40 C150,120 220,140 300,150',
  'M70,150 C160,80 200,30 300,40',
];

// Caminhos organizados: tudo passa pelo nó central.
const ORGANIZED = [
  ...DEMAND_Y.map((y) => `M70,${y} C130,${y} 150,122 185,122`),
  ...SUPPLY_Y.map((y) => `M300,${y} C240,${y} 220,122 185,122`),
];

export default function FragmentationFlow({ beforeLabel, afterLabel, demandLabel, supplyLabel, hubLabel, caption }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [organized, setOrganized] = useState(reduce);

  useEffect(() => {
    if (reduce || !inView) return undefined;
    const timer = setTimeout(() => setOrganized(true), 2200);
    return () => clearTimeout(timer);
  }, [inView, reduce]);

  const active = reduce || inView;

  return (
    <div ref={ref} className="rounded-brand-lg border border-border bg-card p-4 md:p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <span
          className={`text-xs font-bold uppercase tracking-wide transition-colors ${
            organized ? 'text-muted-foreground/50' : 'text-[#D7382B]'
          }`}
        >
          {beforeLabel}
        </span>
        <span
          className={`text-xs font-bold uppercase tracking-wide transition-colors ${
            organized ? 'text-olive-700 dark:text-olive-400' : 'text-muted-foreground/50'
          }`}
        >
          {afterLabel}
        </span>
      </div>

      <svg viewBox="0 0 370 245" className="w-full h-auto" role="img" aria-label={caption}>
        <g className="text-muted-foreground/70" fill="currentColor">
          <text x="70" y="20" textAnchor="middle" fontSize="11" fontWeight="700">
            {demandLabel}
          </text>
          <text x="300" y="20" textAnchor="middle" fontSize="11" fontWeight="700">
            {supplyLabel}
          </text>
        </g>

        {/* Caminhos dispersos */}
        <motion.g
          initial={reduce ? false : 'hidden'}
          animate={active ? 'visible' : 'hidden'}
          style={{ opacity: organized ? 0 : 1, transition: 'opacity 600ms ease' }}
        >
          {TANGLED.map((d, i) => (
            <motion.path
              key={d}
              d={d}
              fill="none"
              stroke="#D7382B"
              strokeOpacity="0.45"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              variants={drawPath(reduce, { delay: i * 0.12, duration: 0.9 })}
            />
          ))}
        </motion.g>

        {/* Caminhos organizados pela plataforma */}
        <motion.g
          initial={false}
          animate={organized ? 'visible' : 'hidden'}
          style={{ opacity: organized ? 1 : 0, transition: 'opacity 600ms ease' }}
        >
          {ORGANIZED.map((d, i) => (
            <motion.path
              key={d}
              d={d}
              fill="none"
              stroke="#6B7C3A"
              strokeOpacity="0.75"
              strokeWidth="1.75"
              variants={drawPath(reduce, { delay: i * 0.07, duration: 0.7 })}
            />
          ))}
        </motion.g>

        {/* Nó central — a plataforma */}
        <motion.g
          initial={reduce ? false : { scale: 0.6, opacity: 0 }}
          animate={organized ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: '185px 122px' }}
        >
          <circle cx="185" cy="122" r="30" fill="#E8571A" fillOpacity="0.12" />
          <circle cx="185" cy="122" r="19" fill="#E8571A" />
          <text x="185" y="168" textAnchor="middle" fontSize="10" fontWeight="800" fill="currentColor" className="text-orange-700 dark:text-orange-400">
            {hubLabel}
          </text>
        </motion.g>

        {/* Pontos de demanda e oferta */}
        {DEMAND_Y.map((y) => (
          <circle key={`d${y}`} cx="70" cy={y} r="6" fill="#2D7D8A" />
        ))}
        {SUPPLY_Y.map((y) => (
          <circle key={`s${y}`} cx="300" cy={y} r="6" fill="#6B7C3A" />
        ))}
      </svg>

      <motion.p
        variants={fadeIn(reduce)}
        initial="hidden"
        animate={active ? 'visible' : 'hidden'}
        className="mt-3 text-xs text-muted-foreground leading-relaxed"
      >
        {caption}
      </motion.p>
    </div>
  );
}
