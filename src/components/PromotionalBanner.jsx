import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Zap, Users, Star, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import LazyImage from '@/components/ui/LazyImage';

const banners = [
  {
    id: 1,
    badge: null,
    title: "Trancoso Resolve",
    highlight: "Serviços com Confiança",
    subtitle: "Conectando você aos melhores profissionais verificados de Trancoso. Rápido, seguro e transparente.",
    cta: "Explorar Profissionais",
    ctaLink: "/ServicosCategoria",
    bgColor: "linear-gradient(135deg, #0A81D1 0%, #0D8A6F 100%)",
    image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    Icon: Star,
  },
  {
    id: 2,
    badge: "🎉 Oferta de Lançamento — Vagas Limitadas!",
    title: "Seja um dos Primeiros",
    highlight: "e Ganhe Mais!",
    subtitle: "Os 50 primeiros prestadores cadastrados têm 3 meses de gratuidade total na plataforma. Sem mensalidade, apenas 20% de comissão por serviço realizado.",
    cta: "Quero Minha Gratuidade",
    ctaLink: "/SejaPrestador",
    bgColor: "linear-gradient(135deg, #F9A825 0%, #F95738 100%)",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    Icon: Zap,
    spots: true,
  },
  {
    id: 3,
    badge: null,
    title: "Sem Mensalidade.",
    highlight: "Só 20% por Serviço.",
    subtitle: "Cadastre-se gratuitamente e comece a receber clientes agora. Você paga apenas quando realiza um serviço — simples assim.",
    cta: "Comece a Lucrar Agora",
    ctaLink: "/SejaPrestador",
    bgColor: "linear-gradient(135deg, #0D8A6F 0%, #2D3047 100%)",
    image: "https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    Icon: Percent,
  },
  {
    id: 4,
    badge: null,
    title: "Profissionais Verificados",
    highlight: "em Trancoso",
    subtitle: "Faxina, eletricista, jardinagem, cozinheiro e muito mais — tudo num só lugar, com avaliações reais e confiança garantida.",
    cta: "Ver Todos os Serviços",
    ctaLink: "/ServicosCategoria",
    bgColor: "linear-gradient(135deg, #1A2B3C 0%, #0A81D1 100%)",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    Icon: Users,
  }
];

export default function PromotionalBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const nextSlide = () => setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  return (
    <div className="relative w-full h-[240px] md:h-[460px] rounded-2xl overflow-hidden shadow-2xl my-4 md:my-8">
      {banners.map((banner, index) => {
        const Icon = banner.Icon;
        return (
          <div
            key={banner.id}
            className={cn(
              "absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out",
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
            style={{ background: banner.bgColor }}
          >
            {/* Background image */}
            <div className="absolute right-0 top-0 h-full w-full md:w-3/5">
              <LazyImage
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />

            {/* Content */}
            <div className="relative h-full flex items-center z-20 px-5 md:px-12">
              <div className="text-white max-w-xs md:max-w-md">
                
                {/* Badge de escassez */}
                {banner.badge && (
                  <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1 mb-3 md:mb-4">
                    <span className="text-xs md:text-sm font-semibold text-yellow-300 drop-shadow">{banner.badge}</span>
                  </div>
                )}

                {/* Título */}
                <h2 className="text-xl md:text-4xl font-bold leading-tight drop-shadow-md">
                  {banner.title}{" "}
                  <span className="text-yellow-300">{banner.highlight}</span>
                </h2>

                {/* Subtítulo */}
                <p className="text-xs md:text-base opacity-90 mt-1.5 md:mt-3 mb-3 md:mb-6 leading-relaxed drop-shadow-sm line-clamp-2 md:line-clamp-3">
                  {banner.subtitle}
                </p>

                {/* Contador de vagas (apenas no banner de oferta) */}
                {banner.spots && (
                  <div className="flex items-center gap-2 mb-3 md:mb-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={cn("w-2 h-2 md:w-3 md:h-3 rounded-full", i < 3 ? "bg-red-400" : "bg-white/40")} />
                      ))}
                    </div>
                    <span className="text-xs md:text-sm font-medium text-yellow-200">Apenas 50 vagas disponíveis</span>
                  </div>
                )}

                {/* CTA Button */}
                <Link to={banner.ctaLink}>
                  <Button
                    size="sm"
                    className="bg-white text-slate-900 hover:bg-yellow-100 font-bold shadow-xl md:text-base md:px-6 md:h-11 transition-transform hover:scale-105"
                  >
                    {Icon && <Icon className="w-4 h-4 mr-1.5 shrink-0" />}
                    {banner.cta}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 left-3 -translate-y-1/2 z-20 text-white bg-black/25 hover:bg-black/50 rounded-full w-8 h-8 md:w-10 md:h-10"
        onClick={prevSlide}
        aria-label="Banner anterior"
      >
        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 right-3 -translate-y-1/2 z-20 text-white bg-black/25 hover:bg-black/50 rounded-full w-8 h-8 md:w-10 md:h-10"
        onClick={nextSlide}
        aria-label="Próximo banner"
      >
        <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
      </Button>

      {/* Navigation Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Ir para o banner ${index + 1}`}
            className={cn(
              "rounded-full transition-all duration-300",
              currentIndex === index
                ? "bg-white w-5 h-2 md:w-6 md:h-2.5"
                : "bg-white/50 w-2 h-2 md:w-2.5 md:h-2.5 hover:bg-white/80"
            )}
          />
        ))}
      </div>
    </div>
  );
}