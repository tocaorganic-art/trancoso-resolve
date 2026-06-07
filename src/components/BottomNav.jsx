import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Início", path: "/", emoji: "🏠" },
  { label: "Categorias", path: "/ServicosCategoria", emoji: "▦" },
  { label: "IA", path: "/GeradorDeImagem", emoji: "✦" },
  { label: "Assistente", path: "/Assistentevirtual", emoji: "🤖" }
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
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a1628]/95 backdrop-blur-lg border-t border-white/10 flex justify-around py-2"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 4px)" }}>
      
      {navItems.map(({ label, path, emoji }) => {
        const isActive =
        path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
        return (
          <Link
            key={path}
            to={path}
            onClick={(e) => handleNavClick(e, path)}
            className={cn(
              "select-none flex flex-col items-center gap-0.5 flex-1 py-2 px-1 transition-colors",
              isActive ? "text-amber-400" : "text-slate-500 hover:text-slate-300"
            )}>
            
            <span className="text-base leading-none">{emoji}</span>
            <span className="text-[10px] font-medium leading-tight">{label}</span>
          </Link>);

      })}
    </nav>);

}