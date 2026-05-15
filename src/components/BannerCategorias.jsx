import React from "react";
import { Home, Hammer, Sparkles, Car, Compass, UtensilsCrossed, PartyPopper, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function BannerCategorias() {
  const categorias = [
    { icon: <Home size={24} />, name: "Limpeza", color: "from-blue-400 to-cyan-300", bgColor: "bg-blue-50 dark:bg-blue-900/30" },
    { icon: <Hammer size={24} />, name: "Construção", color: "from-orange-400 to-amber-300", bgColor: "bg-orange-50 dark:bg-orange-900/30" },
    { icon: <Sparkles size={24} />, name: "Beleza", color: "from-pink-400 to-rose-300", bgColor: "bg-pink-50 dark:bg-pink-900/30" },
    { icon: <Car size={24} />, name: "Transporte", color: "from-purple-400 to-violet-300", bgColor: "bg-purple-50 dark:bg-purple-900/30" },
    { icon: <Compass size={24} />, name: "Turismo", color: "from-green-400 to-emerald-300", bgColor: "bg-green-50 dark:bg-green-900/30" },
    { icon: <UtensilsCrossed size={24} />, name: "Gastronomia", color: "from-red-400 to-orange-300", bgColor: "bg-red-50 dark:bg-red-900/30" },
    { icon: <PartyPopper size={24} />, name: "Festas", color: "from-yellow-400 to-amber-300", bgColor: "bg-yellow-50 dark:bg-yellow-900/30" },
    { icon: <Wrench size={24} />, name: "Automóveis", color: "from-slate-400 to-zinc-300", bgColor: "bg-slate-50 dark:bg-slate-800" },
  ];

  return (
    <section className="py-8 md:py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-t border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-full overflow-hidden">
            <div className="mb-6 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">Categorias Principais</h3>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">Explore todos os serviços disponíveis em Trancoso</p>
            </div>
            <div className="grid grid-cols-4 md:flex md:justify-center gap-3 md:gap-4 py-2">
                {categorias.map((cat, i) => (
                    <Link 
                      key={i} 
                      to={createPageUrl("ServicosCategoria", `?cat=${cat.name}`)}
                      className="group flex flex-col items-center gap-2 text-center min-w-0 transition-all duration-300"
                      aria-label={`Ver serviços de ${cat.name} em Trancoso`}
                    >
                         <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl ${cat.bgColor} border-2 border-transparent group-hover:border-white dark:group-hover:border-slate-700 flex items-center justify-center transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-slate-400/30 dark:group-hover:shadow-black/50 shrink-0 relative overflow-hidden`}>
                            {/* Gradient background on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                            {/* Icon */}
                            <div className="text-slate-700 dark:text-slate-300 transition-all duration-300 group-hover:text-white relative z-10 group-hover:scale-125">
                              {React.cloneElement(cat.icon, { size: 24 })}
                            </div>
                          </div>
                          <span className="text-[11px] md:text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight truncate w-full group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{cat.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    </section>
  );
  }