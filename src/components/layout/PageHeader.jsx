import React from "react";
import { motion } from "framer-motion";

export default function PageHeader({ title, subtitle, icon: Icon, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8 pt-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          {Icon && (
            <div className="w-12 h-12 rounded-xl gradient-amber flex items-center justify-center shadow-lg shrink-0">
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-slate-100 tracking-tight leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </motion.div>
  );
}