import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ClassificationBadge from './ClassificationBadge';
import AnimatedCounter from './AnimatedCounter';
import { fadeUp, useReducedMotion } from '@/lib/motion';

// Card de indicador: valor animado + unidade + período + classificação de evidência + fonte.
export default function MetricCard({ label, value, format, unit, period, classification, classificationLabel, source, description, periodLabel, sourceLabel }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      variants={fadeUp(reduce)}
      className="group relative rounded-brand-lg bg-card border border-border p-5 transition-shadow hover:shadow-warm-md focus-within:ring-2 focus-within:ring-orange-400"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <ClassificationBadge type={classification} label={classificationLabel} />
        {description && (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger
                type="button"
                aria-label={description}
                className="shrink-0 rounded-full p-1 text-muted-foreground/60 hover:text-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                <Info className="w-4 h-4" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs leading-relaxed">{description}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <p className="text-2xl md:text-3xl font-display font-extrabold text-orange-700 dark:text-orange-400 leading-none">
        <AnimatedCounter value={value} format={format} />
      </p>
      {unit && <p className="mt-1 text-xs font-bold uppercase tracking-wide text-muted-foreground/70">{unit}</p>}

      <p className="mt-2.5 text-sm text-foreground leading-snug">{label}</p>

      <dl className="mt-3 space-y-0.5 text-xs text-muted-foreground">
        {period && (
          <div className="flex gap-1.5">
            <dt className="font-semibold">{periodLabel}:</dt>
            <dd>{period}</dd>
          </div>
        )}
        {source && (
          <div className="flex gap-1.5">
            <dt className="font-semibold">{sourceLabel}:</dt>
            <dd>{source}</dd>
          </div>
        )}
      </dl>
    </motion.div>
  );
}
