import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Grid3x3, Calendar, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Início", path: "/", icon: Home },
  { label: "Serviços", path: "/ServicosCategoria", icon: Grid3x3 },
  { label: "Agenda", path: "/MinhaAgenda", icon: Calendar },
  { label: "Financeiro", path: "/Financeiro", icon: TrendingUp },
];

export default function BottomNav() {
  const location = useLocation();

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
            className={cn(
              "select-none flex flex-col items-center justify-center flex-1 py-2 gap-0.5 text-xs transition-colors",
              isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
            )}
          >
            <Icon className={cn("w-5 h-5 select-none", isActive && "stroke-blue-600")} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}