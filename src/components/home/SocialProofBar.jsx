import React from "react";
import { ShieldCheck, Grid3x3, Star, MapPin } from "lucide-react";

export default function SocialProofBar({ totalVerificados = 0, totalCategorias = 0, totalAvaliacoes = 0 }) {
  // Só exibe números reais quando os dados já carregaram (> 0)
  // Caso contrário, usa valores estáticos mínimos para evitar "0+"
  const verificadosDisplay = totalVerificados > 0 ? `${totalVerificados}+` : "10+";
  const categoriasDisplay = totalCategorias > 0 ? `${totalCategorias}+` : "9+";
  const avaliacoesDisplay = totalAvaliacoes > 0 ? `${totalAvaliacoes}+` : "⭐ Reais";

  const metrics = [
    { icon: ShieldCheck, value: verificadosDisplay, label: "Profissionais Verificados" },
    { icon: Grid3x3, value: categoriasDisplay, label: "Categorias de Serviço" },
    { icon: Star, value: avaliacoesDisplay, label: "Avaliações" },
    { icon: MapPin, value: "Trancoso", label: "Bahia" },
  ];

  return (
    <div className="bg-slate-800 border-b border-slate-700 py-3 px-4" aria-label="Estatísticas da plataforma">
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