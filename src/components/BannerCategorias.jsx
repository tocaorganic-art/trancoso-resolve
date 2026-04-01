import React from "react";
import { Home, Hammer, Shirt, Car, Compass, UtensilsCrossed, PartyPopper, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function BannerCategorias() {
  const categorias = [
    { icon: <Home size={24} />, name: "Limpeza" },
    { icon: <Hammer size={24} />, name: "Construção" },
    { icon: <Shirt size={24} />, name: "Beleza" },
    { icon: <Car size={24} />, name: "Transporte" },
    { icon: <Compass size={24} />, name: "Turismo" },
    { icon: <UtensilsCrossed size={24} />, name: "Gastronomia" },
    { icon: <PartyPopper size={24} />, name: "Festas" },
    { icon: <Wrench size={24} />, name: "Automóveis" },
  ];

  return (
    <section className="py-6 md:py-8 bg-[var(--background)]">
        <div className="container mx-auto px-4 max-w-full overflow-hidden">
            <div className="grid grid-cols-4 md:flex md:justify-center gap-2 md:gap-8 py-2">
                {categorias.map((cat, i) => (
                    <Link 
                      key={i} 
                      to={createPageUrl("ServicosCategoria", `?cat=${cat.name}`)}
                      className="group flex flex-col items-center gap-1.5 text-center min-w-0"
                      aria-label={`Ver serviços de ${cat.name} em Trancoso`}
                    >
                         <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center transition-all duration-300 ease-in-out group-hover:bg-[var(--secondary)] group-hover:-translate-y-1 group-hover:shadow-lg shrink-0">
                           <div className="text-gray-600 transition-colors duration-300 group-hover:text-white">
                             {React.cloneElement(cat.icon, { size: 20 })}
                           </div>
                         </div>
                         <span className="text-[10px] md:text-sm font-medium text-[var(--text-dark)] leading-tight truncate w-full">{cat.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    </section>
  );
}