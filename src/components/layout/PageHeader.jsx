import React from "react";
import { motion } from "framer-motion";

export default function PageHeader({ title, subtitle, icon: Icon, actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mb-8 pt-4"
      style={{
        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.08) 100%)',
        backdropFilter: 'blur(12px)',
        borderRadius: 20,
        padding: '28px 24px',
        border: '1px solid rgba(251, 191, 36, 0.2)',
        boxShadow: '0 8px 32px rgba(245, 158, 11, 0.12)'
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {Icon && (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Icon className="w-5 h-5 text-white" />
              </div>
            )}
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {title}
            </h1>
          </div>
          {subtitle && (
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </motion.div>
  );
}