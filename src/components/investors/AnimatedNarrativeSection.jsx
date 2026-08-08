import { motion } from 'framer-motion';
import Section from './Section';
import { fadeUp, maskReveal, stagger, useReducedMotion, VIEWPORT } from '@/lib/motion';

// Divide o texto em palavras preservando os espaços, para animar sem quebrar a seleção
// nem introduzir hifenização artificial no celular.
function Words({ text, highlights = [], reduce }) {
  if (reduce) return <>{highlightPlain(text, highlights)}</>;

  const tokens = text.split(/(\s+)/);
  return tokens.map((token, i) => {
    if (/^\s+$/.test(token)) return token;
    const isHighlight = highlights.some((h) => token.toLowerCase().replace(/[.,;:—"]/g, '').includes(h.toLowerCase()));
    return (
      <motion.span
        key={`${token}-${i}`}
        variants={maskReveal(reduce, { duration: 0.5 })}
        className={`inline-block ${isHighlight ? 'text-orange-700 dark:text-orange-400' : ''}`}
      >
        {token}
      </motion.span>
    );
  });
}

function highlightPlain(text, highlights) {
  if (!highlights.length) return text;
  const pattern = new RegExp(`(${highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  return text.split(pattern).map((part, i) =>
    highlights.some((h) => h.toLowerCase() === part.toLowerCase()) ? (
      <span key={i} className="text-orange-700 dark:text-orange-400">
        {part}
      </span>
    ) : (
      part
    )
  );
}

// Seção narrativa: título revelado por palavra, descrição e passos em cascata,
// mídia opcional ao lado. Com prefers-reduced-motion tudo aparece de imediato.
export default function AnimatedNarrativeSection({
  id,
  eyebrow,
  title,
  description,
  highlights = [],
  steps = [],
  media,
  alignment = 'left',
  tone = 'default',
  children,
}) {
  const reduce = useReducedMotion();
  const dark = tone === 'dark';
  const sideBySide = Boolean(media);

  return (
    <Section id={id} tone={tone}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        variants={stagger(reduce, { each: 0.035 })}
        className={sideBySide ? 'grid lg:grid-cols-2 gap-10 lg:gap-14 items-center' : ''}
      >
        <div className={alignment === 'center' && !sideBySide ? 'max-w-3xl mx-auto text-center' : 'max-w-3xl'}>
          {eyebrow && (
            <motion.p
              variants={fadeUp(reduce, { distance: 10 })}
              className={`text-xs font-bold uppercase tracking-[0.12em] mb-3 ${dark ? 'text-orange-400' : 'text-orange-700'}`}
            >
              {eyebrow}
            </motion.p>
          )}

          {title && (
            <h2
              aria-label={title}
              className={`text-3xl md:text-4xl font-display font-extrabold leading-tight tracking-[-0.02em] ${
                dark ? 'text-white' : 'text-foreground'
              }`}
            >
              <span aria-hidden="true">
                <Words text={title} highlights={highlights} reduce={reduce} />
              </span>
            </h2>
          )}

          {description && (
            <motion.p
              variants={fadeUp(reduce, { delay: 0.1 })}
              className={`mt-4 text-base md:text-lg leading-relaxed ${dark ? 'text-white/70' : 'text-muted-foreground'}`}
            >
              {description}
            </motion.p>
          )}

          {steps.length > 0 && (
            <motion.ol variants={stagger(reduce)} className="mt-8 space-y-4">
              {steps.map((step, i) => (
                <motion.li key={step.title ?? i} variants={fadeUp(reduce)} className="flex gap-4">
                  <span
                    className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-xs font-extrabold ${
                      dark ? 'bg-orange-500/20 text-orange-300' : 'bg-brand-primary/10 text-orange-700'
                    }`}
                    aria-hidden="true"
                  >
                    {step.n ?? i + 1}
                  </span>
                  <div>
                    <h3 className={`font-bold ${dark ? 'text-white' : 'text-foreground'}`}>{step.title}</h3>
                    <p className={`text-sm leading-relaxed mt-0.5 ${dark ? 'text-white/60' : 'text-muted-foreground'}`}>
                      {step.desc}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
          )}

          {children}
        </div>

        {media && <motion.div variants={fadeUp(reduce, { delay: 0.15 })}>{media}</motion.div>}
      </motion.div>
    </Section>
  );
}
