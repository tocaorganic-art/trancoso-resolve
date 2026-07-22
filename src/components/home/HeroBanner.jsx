import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Flame,
  Sparkles,
  ShieldCheck,
  Building2,
  Smartphone,
  Download,
  Share,
} from "lucide-react";
import { usePwaInstall } from "@/hooks/usePwaInstall";

const SLIDES = [
  {
    id: "prestador",
    badge: { icon: Sparkles, text: "Lançamento oficial — vagas limitadas" },
    headline: ["A gente resolve.", "Seu serviço em destaque", "em Trancoso."],
    highlightIndex: 0,
    subtitle: "Comece hoje com 2 meses grátis antes que as vagas acabem. Verificação de antecedentes inclusa. A partir de R$29,90/mês.",
    cta: { label: "Garantir minha vaga", to: "/Planos", icon: true },
    cta2: { label: "Ver como funciona", to: "/ComoFunciona" },
    bg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format%3Dwebp&fit=crop&w=1600&q=80",
    overlay: "bg-gradient-to-r from-neutral-900/90 via-neutral-800/75 to-neutral-900/60",
  },
  {
    id: "cliente",
    badge: { icon: ShieldCheck, text: "Profissional verificado, sempre" },
    headline: ["Encontre quem resolve,", "pertinho de você,", "em Trancoso."],
    highlightIndex: 1,
    subtitle: "Diarista, eletricista, piscineiro, jardineiro e muito mais. Avaliações reais, resposta em até 2 horas, confiança de vizinho.",
    cta: { label: "Encontrar profissional", to: "/ServicosCategoria", icon: true },
    bg: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format%3Dwebp&fit=crop&w=1600&q=80",
    overlay: "bg-gradient-to-r from-olive-900/85 via-neutral-800/70 to-neutral-900/60",
  },
  {
    id: "empresa",
    badge: { icon: Building2, text: "Para empresas e pousadas" },
    headline: ["Sua pousada resolvida", "com", "um só painel."],
    highlightIndex: 2,
    subtitle: "Plano empresarial com múltiplos prestadores vinculados, agenda centralizada e suporte prioritário. 7 dias grátis para começar.",
    cta: { label: "Conheça o plano empresa", to: "/Planos", icon: true },
    bg: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format%3Dwebp&fit=crop&w=1600&q=80",
    overlay: "bg-gradient-to-r from-terracotta/85 via-neutral-800/70 to-neutral-900/60",
  },
  {
    id: "app",
    badge: { icon: Smartphone, text: "Trancoso na palma da mão" },
    headline: ["Baixe o app", "e resolva", "de qualquer lugar."],
    highlightIndex: 1,
    subtitle: "Instale o Trancoso Resolve na sua tela inicial. Acesso rápido, funciona offline e você recebe cada orçamento na hora.",
    cta: { label: "Baixar o app", action: "install", icon: true },
    bg: "https://media.base44.com/images/public/68eb21726a9614db4a82ba99/dfe6ee67e_generated_image.png",
    overlay: "bg-gradient-to-r from-orange-900/85 via-neutral-800/70 to-neutral-900/60",
  },
];

export default function HeroBanner({ vagasRestantes = 0, total = 0 }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const { installed, install } = usePwaInstall();

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, [paused]);

  const prev = () => { setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length); setPaused(true); };
  const next = () => { setCurrent(c => (c + 1) % SLIDES.length); setPaused(true); };

  const handleInstall = async () => {
    const { outcome } = await install();
    if (outcome === "ios") {
      toast.info("No iPhone é rapidinho", {
        description: "Toque em Compartilhar e depois em \"Adicionar à Tela de Início\".",
        icon: <Share className="w-4 h-4" />,
      });
    } else if (outcome === "installed") {
      toast.success("O app já está instalado!", {
        description: "Abra pela tela inicial do seu celular.",
      });
    } else if (outcome === "unavailable") {
      toast.info("Instalação não disponível agora", {
        description: "Abra pelo menu do navegador em \"Instalar app\" ou \"Adicionar à tela inicial\".",
      });
    }
  };

  const slide = SLIDES[current];
  const isPrestadorSlide = slide.id === "prestador";
  const BadgeIcon = slide.badge.icon;

  const totalVagas = total > 0 ? total : 50;

  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: 420 }}>
      {/* Background */}
      <div className="absolute inset-0 transition-all duration-700">
        <img
          src={slide.bg}
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className={`absolute inset-0 ${slide.overlay}`} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-5xl px-4 py-16 md:py-24 flex flex-col items-start">
        {/* Badge */}
        <div className="mb-4">
          <Badge className="bg-white/15 text-white border border-white/30 backdrop-blur-sm text-xs md:text-sm px-3 py-1 flex items-center gap-1.5">
            <BadgeIcon className="w-3.5 h-3.5" />
            {slide.badge.text}
          </Badge>
        </div>

        {/* Vagas counter — slide 1 only */}
        {isPrestadorSlide && vagasRestantes > 0 && (
          <div className={`mb-4 flex items-center gap-2 bg-red-600/80 backdrop-blur-sm text-white text-sm font-bold px-4 py-1.5 rounded-full ${vagasRestantes <= 10 ? 'animate-pulse' : ''}`}>
            <Flame className="w-4 h-4 text-amber-300" />
            {vagasRestantes} de {totalVagas} vagas restantes
          </div>
        )}

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 max-w-2xl drop-shadow-lg">
          {slide.headline.map((line, i) => (
            <span key={i}>
              {i === slide.highlightIndex ? (
                <span className="text-amber-400">{line}</span>
              ) : line}
              {i < slide.headline.length - 1 && " "}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg mb-8 max-w-xl leading-relaxed" style={{ color: '#E2E8F0' }}>
          {slide.subtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {slide.cta.action === "install" ? (
            <Button
              onClick={handleInstall}
              className="bg-white text-neutral-900 hover:bg-neutral-100 font-bold px-6 py-3 text-sm w-full sm:w-auto"
            >
              {installed ? "App já instalado" : slide.cta.label}
              <Download className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Link to={slide.cta.to}>
              <Button className="bg-white text-neutral-900 hover:bg-neutral-100 font-bold px-6 py-3 text-sm w-full sm:w-auto">
                {slide.cta.label}
                {slide.cta.icon && <ArrowRight className="w-4 h-4 ml-1" />}
              </Button>
            </Link>
          )}
          {slide.cta2 && (
            <Link to={slide.cta2.to}>
              <Button variant="outline" className="font-semibold px-6 py-3 text-sm w-full sm:w-auto hover:bg-white/10" style={{ border: '1.5px solid rgba(255,255,255,0.8)', color: '#FFFFFF', background: 'transparent' }}>
                {slide.cta2.label}
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Navigation arrows */}
      <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors" aria-label="Slide anterior">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors" aria-label="Próximo slide">
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); setPaused(true); }}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-5' : 'bg-white/40'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
