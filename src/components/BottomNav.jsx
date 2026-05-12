import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Grid3x3, Wand2, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Início", path: "/", icon: Home },
  { label: "Serviços", path: "/ServicosCategoria", icon: Grid3x3 },
  { label: "Toca Vision", path: "/GeradorDeImagem", icon: Wand2 },
  { label: "Toca TrIA", path: "/Assistentevirtual", icon: Bot },
];

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
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 flex items-center justify-around"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {navItems.map(({ label, path, icon: Icon }) => {
        const isActive =
          path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
        return (
          <Link
            key={path}
            to={path}
            onClick={(e) => handleNavClick(e, path)}
            className={cn(
              "select-none flex flex-col items-center justify-center flex-1 py-2 gap-0.5 text-xs transition-colors",
              isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
            )}
          >
            <Icon className={cn("w-6 h-6 select-none", isActive && "stroke-blue-600")} />
            <span className="text-sm font-semibold">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}