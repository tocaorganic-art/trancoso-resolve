import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, stagger, useReducedMotion, VIEWPORT } from '@/lib/motion';

const CENTER = { x: 200, y: 170 };
const RADIUS = 128;

// Distribui os nós em arco ao redor do centro.
function positionFor(index, total) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return { x: CENTER.x + RADIUS * Math.cos(angle), y: CENTER.y + RADIUS * Math.sin(angle) };
}

export default function EcosystemGraph({ centerLabel, nodes = [], hint }) {
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = useState(null);
  const active = nodes.find((n) => n.id === activeId) || null;

  return (
    <div className="grid lg:grid-cols-5 gap-6 items-center">
      {/* Desktop / tablet: grafo interativo. Escondido no celular, onde os cards abaixo mandam. */}
      <div className="hidden md:block lg:col-span-3">
        <svg viewBox="0 0 400 340" className="w-full h-auto" role="img" aria-label={hint}>
          {nodes.map((node, i) => {
            const p = positionFor(i, nodes.length);
            const dim = activeId !== null && activeId !== node.id;
            return (
              <motion.line
                key={`line-${node.id}`}
                x1={CENTER.x}
                y1={CENTER.y}
                x2={p.x}
                y2={p.y}
                stroke={activeId === node.id ? '#E8571A' : '#6B7C3A'}
                strokeWidth={activeId === node.id ? 2.5 : 1.5}
                initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: dim ? 0.15 : 0.6 }}
                viewport={VIEWPORT}
                transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : i * 0.08 }}
              />
            );
          })}

          <circle cx={CENTER.x} cy={CENTER.y} r="46" fill="#E8571A" fillOpacity="0.1" />
          <circle cx={CENTER.x} cy={CENTER.y} r="34" fill="#E8571A" />
          <text x={CENTER.x} y={CENTER.y + 4} textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff">
            {centerLabel}
          </text>

          {nodes.map((node, i) => {
            const p = positionFor(i, nodes.length);
            const isActive = activeId === node.id;
            const dim = activeId !== null && !isActive;
            return (
              <motion.g
                key={node.id}
                initial={reduce ? false : { scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: dim ? 0.35 : 1 }}
                viewport={VIEWPORT}
                transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.2 + i * 0.08 }}
                style={{ transformOrigin: `${p.x}px ${p.y}px`, cursor: 'pointer' }}
                onMouseEnter={() => setActiveId(node.id)}
                onMouseLeave={() => setActiveId(null)}
                onFocus={() => setActiveId(node.id)}
                onBlur={() => setActiveId(null)}
                onClick={() => setActiveId(isActive ? null : node.id)}
                tabIndex={0}
                role="button"
                aria-pressed={isActive}
                aria-label={`${node.label}: ${node.value}`}
                className="focus:outline-none [&:focus-visible>circle]:stroke-orange-500 [&:focus-visible>circle]:stroke-[3px]"
              >
                <circle cx={p.x} cy={p.y} r="30" fill={isActive ? '#E8571A' : 'var(--surface-card, #fff)'} stroke="#6B7C3A" strokeWidth="1.5" className="dark:fill-neutral-800" />
                <text
                  x={p.x}
                  y={p.y + 3.5}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="700"
                  fill={isActive ? '#fff' : 'currentColor'}
                  className="text-foreground pointer-events-none"
                >
                  {node.short}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      <div className="lg:col-span-2">
        {/* Painel de detalhe no desktop */}
        <div className="hidden md:block min-h-[150px] rounded-brand-lg border border-border bg-card p-5">
          {active ? (
            <>
              <h3 className="font-bold text-foreground">{active.label}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{active.desc}</p>
              <p className="mt-3 text-sm font-semibold text-orange-700 dark:text-orange-400">{active.value}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">{hint}</p>
          )}
        </div>

        {/* Celular: cards sequenciais, sem depender de hover */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={stagger(reduce)}
          className="md:hidden space-y-3"
        >
          {nodes.map((node) => (
            <motion.div key={node.id} variants={fadeUp(reduce)} className="rounded-brand-lg border border-border bg-card p-4">
              <h3 className="font-bold text-foreground text-sm">{node.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{node.desc}</p>
              <p className="mt-2 text-xs font-semibold text-orange-700 dark:text-orange-400">{node.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
