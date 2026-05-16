import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Grid3x3, Wand2, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
{ label: "Início", path: "/", icon: Home },
{ label: "Serviços", path: "/ServicosCategoria", icon: Grid3x3 },
{ label: "Toca Vision", path: "/GeradorDeImagem", icon: Wand2 },
{ label: "Toca TrIA", path: "/Assistentevirtual", icon: Bot }];


export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e, path) => {
    const isActive = path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
    if (isActive) {
      e.preventDefault();
      navigate(path, { replace: true });
      window.scrollTo(0, 0);
    }
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-800 border-t border-slate-700 flex items-center justify-around"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      
      {navItems.map(({ label, path, icon: Icon }) => {
        const isActive =
        path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
        return (
          <Link
            key={path}
            to={path}
            onClick={(e) => handleNavClick(e, path)}
            className={cn(
              "select-none flex flex-col items-center justify-center flex-1 py-3 px-2 gap-1 transition-colors min-h-[60px] bg-[hsl(var(--background))] text-[#1f6ee5]",
              isActive ? "text-cyan-400 bg-slate-700" : "hover:text-slate-200"
            )}>
            
            <Icon className={cn("w-6 h-6 select-none", isActive ? "stroke-[2.5]" : "stroke-2")} />
            <span className="text-xs font-semibold leading-tight">{label}</span>
          </Link>);

      })}
    </nav>);

}