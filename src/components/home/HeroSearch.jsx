import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, Home, Zap, Wrench, Leaf, UtensilsCrossed, Hammer, Paintbrush, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const QUICK_CATEGORIES = [
  { label: "Limpeza", icon: Home, cat: "Limpeza" },
  { label: "Eletricista", icon: Zap, cat: "Eletricista" },
  { label: "Encanador", icon: Wrench, cat: "Encanador" },
  { label: "Jardineiro", icon: Leaf, cat: "Jardinagem" },
  { label: "Cozinheiro", icon: UtensilsCrossed, cat: "Cozinheiro" },
  { label: "Garçom", icon: UtensilsCrossed, cat: "Garçom" },
  { label: "Pedreiro", icon: Hammer, cat: "Pedreiro" },
  { label: "Pintor", icon: Paintbrush, cat: "Pintor" },
];

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(createPageUrl("ServicosCategoria", `?q=${encodeURIComponent(query.trim())}`));
    }
  };

  const handleCategory = (cat) => {
    navigate(createPageUrl("ServicosCategoria", `?cat=${encodeURIComponent(cat)}`));
  };

  return (
    <section className="bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-3xl text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          <ShieldCheck className="w-3.5 h-3.5" />
          Profissionais verificados em Trancoso, Bahia
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
          Precisa resolver algo{" "}
          <span className="text-amber-400">em Trancoso?</span>
        </h1>
        <p className="text-base md:text-lg text-stone-300 mb-10 max-w-xl mx-auto leading-relaxed">
          Encontre profissionais verificados para qualquer serviço — rápido e sem complicação.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-xl mx-auto mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="O que você precisa resolver hoje?"
              className="pl-10 h-12 text-base bg-white text-stone-900 border-0 rounded-xl shadow-lg"
            />
          </div>
          <Button type="submit" className="h-12 px-6 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-sm whitespace-nowrap transition-colors duration-200">
            Encontrar profissional
          </Button>
        </form>

        {/* Quick categories */}
        <div className="flex flex-wrap gap-2 justify-center">
          {QUICK_CATEGORIES.map(({ label, icon: Icon, cat }) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-amber-700/40 border border-white/20 hover:border-amber-500/40 text-white text-xs font-semibold px-3 py-2 rounded-full transition-all duration-200"
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}