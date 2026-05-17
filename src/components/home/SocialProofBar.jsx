import React from "react";
import { ShieldCheck, Grid3x3, Star, MapPin } from "lucide-react";

export default function SocialProofBar({ totalVerificados = 0, totalCategorias = 0, totalAvaliacoes = 0 }) {
  const hasData = totalVerificados > 0 || totalCategorias > 0;

  if (!hasData) {
    return (
      <div className="bg-slate-800 border-b border-slate-700 py-3 px-4">
        <p className="text-center text-slate-300 text-sm">
          Plataforma oficial de serviços em Trancoso · Verificação de antecedentes · Avaliações reais · Suporte local
        </p>
      </div>
    );
  }

  const metrics = [
    { icon: ShieldCheck, value: `${totalVerificados}+`, label: "Profissionais Verificados" },
    { icon: Grid3x3, value: `${totalCategorias}+`, label: "Categorias de Serviço" },
    { icon: Star, value: totalAvaliacoes > 0 ? `${totalAvaliacoes}+` : "100%", label: totalAvaliacoes > 0 ? "Avaliações" : "Verificados" },
    { icon: MapPin, value: "Trancoso", label: "Bahia" },
  ];

  return (
    <div className="bg-slate-800 border-b border-slate-700 py-3 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-center gap-4 md:gap-10 flex-wrap">
          {metrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <React.Fragment key={i}>
                {i > 0 && <div className="hidden md:block w-px h-6 bg-slate-600" />}
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="text-center md:text-left">
                    <span className="text-white font-bold text-sm">{m.value}</span>
                    <span className="text-xs ml-1" style={{ color: '#94A3B8' }}>{m.label}</span>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}