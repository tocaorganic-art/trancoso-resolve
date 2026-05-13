import React, { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import usePullToRefresh from "@/hooks/usePullToRefresh";
import { base44 } from "@/api/base44Client";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import LazyImage from "@/components/ui/LazyImage";
import BannerCategorias from "@/components/BannerCategorias";
import PromotionalBanner from "@/components/PromotionalBanner";
import Testimonials from "@/components/home/Testimonials";
import {
  Search, Sparkles, UtensilsCrossed, Hammer, Leaf,
  Baby, Zap, Star, MapPin, Phone, Grid3x3, AlertCircle, Loader2, Shirt, Car, Compass, PartyPopper, BookOpen, Home, Wrench, BrainCircuit, ArrowRight
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import OnboardingTour from "@/components/onboarding/OnboardingTour";

// Mapeamento completo de imagens por categoria (alinhado com enum da entidade ServiceListing)
const categoryImageMap = {
  // Categorias do enum: Limpeza, Garçom, Pedreiro, Jardinagem, Babá, Eletricista, Encanador, Pintor, Cozinheiro, Outro
  'Limpeza': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663209925483/inigQzgVMUPeKrkL.png',
  'Garçom': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Pedreiro': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Jardinagem': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663209925483/MmnYpPgxNHhyniba.png',
  'Babá': 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Eletricista': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663209925483/loNdoqfPbYrpiZUY.png',
  'Encanador': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663209925483/SzIYzgzmeNbfcRvv.png',
  'Pintor': 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Cozinheiro': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663209925483/XKIqXQfxYpLpcnsh.png',
  'Outro': 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  // Categorias extras para compatibilidade
  'Construção': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Beleza': 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Turismo': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Gastronomia': 'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Festas': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Aulas': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Transporte': 'https://images.unsplash.com/photo-1601628828688-632f38a5a7d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Automóveis': 'https://images.unsplash.com/photo-1553440569-b506745199de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'default': 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
};

// Descrições melhoradas por categoria para serviços sem descrição cadastrada
const categoryDescriptionMap = {
  'Limpeza': 'Serviço completo de limpeza e higienização residencial com produtos ecológicos e técnicas avançadas para um ambiente impecável.',
  'Eletricista': 'Instalação e manutenção de sistemas elétricos residenciais e comerciais. Profissionais certificados com garantia de segurança.',
  'Jardinagem': 'Criação e manutenção de jardins tropicais com plantas nativas da Bahia. Poda especializada, adubação orgânica e design paisagístico.',
  'Cozinheiro': 'Chef particular para jantares e eventos com menu personalizado focado na culinária baiana e frutos do mar frescos.',
  'Encanador': 'Soluções completas para vazamentos, entupimentos e instalações hidráulicas. Atendimento emergencial 24h com equipe qualificada.',
  'Pedreiro': 'Construção, reforma e manutenção com materiais de qualidade. Acabamento perfeito e prazo garantido.',
  'Garçom': 'Serviço profissional para eventos e jantares. Equipe treinada e uniformizada para elevar o padrão do seu evento.',
  'Babá': 'Cuidados especializados para crianças de todas as idades. Profissionais com experiência e referências verificadas.',
  'Pintor': 'Pintura residencial e comercial com técnicas modernas. Acabamento de alta qualidade em ambientes internos e externos.',
};

const categoryIconMap = {
    'Limpeza': Home,
    'Garçom': UtensilsCrossed,
    'Pedreiro': Hammer,
    'Jardinagem': Leaf,
    'Babá': Baby,
    'Eletricista': Zap,
    'Encanador': Wrench,
    'Pintor': Hammer,
    'Cozinheiro': UtensilsCrossed,
    'Outro': Wrench,
    'Construção': Hammer,
    'Beleza': Shirt,
    'Transporte': Car,
    'Turismo': Compass,
    'Gastronomia': UtensilsCrossed,
    'Festas': PartyPopper,
    'Aulas': BookOpen,
    'Automóveis': Wrench,
    'default': Wrench
};

const ServiceSkeletonCard = () => (
  <Card className="border-none shadow-lg">
    <Skeleton className="h-48 w-full" />
    <CardContent className="p-5 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-8 w-1/3" />
      </div>
      <Skeleton className="h-10 w-full mt-2" />
    </CardContent>
  </Card>
);

const ProviderSkeletonCard = () => (
    <Card className="border-none shadow-lg">
        <CardContent className="p-4 text-center">
            <Skeleton className="w-20 h-20 rounded-full mx-auto mb-3" />
            <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-3 w-1/2 mx-auto mb-2" />
            <Skeleton className="h-4 w-1/4 mx-auto" />
        </CardContent>
    </Card>
);

// Função para validar se uma URL de imagem parece válida e relevante
const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  // Verifica se é uma URL válida de imagem
  const validDomains = ['unsplash.com', 'images.unsplash.com', 'storage.googleapis.com', 'base44.com', 'ui-avatars.com', 'manuscdn.com'];
  try {
    const urlObj = new URL(url);
    return validDomains.some(domain => urlObj.hostname.includes(domain));
  } catch {
    return false;
  }
};

const ServiceCard = ({ service, provider }) => {
    const serviceImage = service.images?.[0];
    const hasValidImage = isValidImageUrl(serviceImage);
    const fallbackImage = categoryImageMap[service.category] || categoryImageMap.default;
    const imageSrc = hasValidImage ? serviceImage : fallbackImage;
    const Icon = categoryIconMap[service.category] || categoryIconMap.default;
    const description = service.description || categoryDescriptionMap[service.category] || 'Serviço profissional de qualidade em Trancoso.';

    return (
        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group flex flex-col">
            <div className="aspect-video w-full overflow-hidden bg-slate-200">
                {imageSrc ? (
                    <LazyImage
                        src={imageSrc}
                        alt={`${service.title} — serviço de ${service.category} em Trancoso`}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full" aria-hidden="true">
                        <Icon className="w-10 h-10 text-slate-400" />
                    </div>
                )}
            </div>
            <CardContent className="p-5 flex flex-col flex-grow">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-slate-900">{service.title}</h3>
                    <Badge className="bg-cyan-100 text-cyan-800 shrink-0 ml-2">{service.category}</Badge>
                </div>

                {provider && (
                    <p className="text-sm text-slate-600 mb-3">{provider.full_name}</p>
                )}

                <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-grow">{description}</p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-bold">
                            {provider?.rating ? provider.rating.toFixed(1) : 'Novo'}
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold text-cyan-600">
                            R$ {service.price.toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-500">por {service.price_unit || 'serviço'}</p>
                        {provider?.total_reviews > 0 && (
                            <span className="text-xs text-slate-500">({provider.total_reviews} avaliações)</span>
                        )}
                    </div>
                </div>

                <Link to={createPageUrl("ServicoDetalhes", `?id=${service.id}`)} data-testid={`service-card-link-${service.id}`} className="mt-4" aria-label={`Ver detalhes do serviço ${service.title}`}>
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                        Ver Detalhes
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Trancoso Resolve: Encontre Profissionais Verificados em Trancoso, Bahia";

    // Meta description otimizada
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = "Contrate diaristas, eletricistas, encanadores, jardineiros e mais em Trancoso, BA. Profissionais verificados com avaliações reais. Orçamento grátis.";

    // Canonical + OG URL da Home
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = `${window.location.origin}/`;

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) { ogUrl = document.createElement('meta'); ogUrl.setAttribute('property', 'og:url'); document.head.appendChild(ogUrl); }
    ogUrl.content = `${window.location.origin}/`;

    // Schema Markup - LocalBusiness + WebSite + FAQPage
    const existingSchema = document.getElementById('schema-home');
    if (existingSchema) existingSchema.remove();
    const schema = document.createElement('script');
    schema.id = 'schema-home';
    schema.type = 'application/ld+json';
    schema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "LocalBusiness",
          "name": "Trancoso Resolve",
          "description": "Marketplace de serviços locais em Trancoso, Bahia. Profissionais verificados para limpeza, elétrica, jardinagem, cozinha, encanamento e muito mais.",
          "url": `${window.location.origin}`,
          "logo": "https://media.base44.com/images/public/68eb21726a9614db4a82ba99/866729f3e_trancoso_resolve_logo_principal.png",
          "image": "https://media.base44.com/images/public/68eb21726a9614db4a82ba99/866729f3e_trancoso_resolve_logo_principal.png",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Trancoso",
            "addressRegion": "BA",
            "addressCountry": "BR"
          },
          "geo": { "@type": "GeoCoordinates", "latitude": -16.5897, "longitude": -39.0828 },
          "areaServed": { "@type": "Place", "name": "Trancoso, Bahia, Brasil" },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Serviços em Trancoso",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Diarista em Trancoso" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Eletricista em Trancoso" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Encanador em Trancoso" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Jardinagem em Trancoso" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Cozinheiro em Trancoso" } }
            ]
          },
          "sameAs": ["https://www.trancosoresolve.com.br"]
        },
        {
          "@type": "WebSite",
          "url": `${window.location.origin}`,
          "name": "Trancoso Resolve",
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${window.location.origin}/ServicosCategoria?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Como encontrar prestadores de serviços em Trancoso?",
              "acceptedAnswer": { "@type": "Answer", "text": "Na Trancoso Resolve você encontra prestadores verificados de limpeza, elétrica, jardinagem, garçom, pedreiro, encanador, pintor, cozinheiro e babá. Todos passam por verificação de antecedentes criminais antes de serem listados." }
            },
            {
              "@type": "Question",
              "name": "Quanto custa contratar um prestador pelo Trancoso Resolve?",
              "acceptedAnswer": { "@type": "Answer", "text": "Para clientes, o acesso à plataforma é gratuito. Você encontra o prestador, entra em contato e negocia diretamente com ele, sem comissão ou taxa da plataforma." }
            },
            {
              "@type": "Question",
              "name": "Os prestadores são verificados e confiáveis?",
              "acceptedAnswer": { "@type": "Answer", "text": "Sim. Todos os prestadores passam por verificação de antecedentes criminais em bases oficiais (Polícia Federal e órgãos estaduais) antes de aparecerem nas buscas. Apenas prestadores aprovados recebem o Selo Verificado." }
            },
            {
              "@type": "Question",
              "name": "O Trancoso Resolve atende villas e pousadas?",
              "acceptedAnswer": { "@type": "Answer", "text": "Sim. A plataforma é ideal para gestores de villas, pousadas e empreendimentos em Trancoso que precisam de prestadores de serviços pontuais ou recorrentes com confiança e rapidez." }
            }
          ]
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Início", "item": `${window.location.origin}` },
            { "@type": "ListItem", "position": 2, "name": "Serviços em Trancoso", "item": `${window.location.origin}/ServicosCategoria` }
          ]
        }
      ]
    });
    document.head.appendChild(schema);
    return () => { const s = document.getElementById('schema-home'); if (s) s.remove(); };
  }, []);

  const handleRefresh = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['serviceProviders'] }),
      queryClient.invalidateQueries({ queryKey: ['serviceListings'] }),
    ]);
  }, [queryClient]);

  const { isPulling, pullDistance, threshold } = usePullToRefresh(handleRefresh);

  const { data: user, isLoading: isLoadingUser, isFetched: isUserFetched } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  // Redirecionar apenas após o login (não no acesso inicial ao site)
  // Só redireciona se: dados carregados, usuário existe E veio de um login recente
  useEffect(() => {
    if (!isUserFetched || !user) return;
    // Verifica se o login foi recente (último minuto) para evitar redirect no acesso direto
    const loginTime = sessionStorage.getItem('loginTimestamp');
    const isRecentLogin = loginTime && (Date.now() - parseInt(loginTime)) < 60000;
    if (!isRecentLogin) return;
    if (user.user_type === 'prestador') {
      sessionStorage.removeItem('loginTimestamp');
      navigate('/Dashboard', { replace: true });
    } else if (user.user_type === 'cliente') {
      sessionStorage.removeItem('loginTimestamp');
      navigate('/MeusPedidos', { replace: true });
    }
  }, [user, isUserFetched, navigate]);

  const { data: providers, isLoading: isLoadingProviders, isError: isErrorProviders } = useQuery({
    queryKey: ['serviceProviders'],
    queryFn: () => base44.entities.ServiceProvider.list('-rating', 50),
  });
  
  const { data: services, isLoading: isLoadingServices, isError: isErrorServices } = useQuery({
    queryKey: ['serviceListings'],
    queryFn: () => base44.entities.ServiceListing.filter({ active: true, featured: true }, '-created_date', 6),
  });

  const { data: recommendedServices, isLoading: isLoadingRecommendations } = useQuery({
    queryKey: ['recommendedServices', user?.id],
    queryFn: () => base44.functions.invoke('getRecommendations', { userId: user.id }),
    enabled: !!user,
  });

  const topProviders = providers
    ?.filter(p => p.rating > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6) || [];
    
  const popularServices = ["Faxina", "Eletricista", "Passeio Turístico", "Transporte", "Massagem"];

  return (
    <div className="bg-slate-50 overflow-x-hidden">
      <style>{`
        @media (max-width: 768px) {
          .service-card-title { font-size: 1.125rem !important; line-height: 1.4 !important; }
          .service-card-desc { font-size: 0.9375rem !important; line-height: 1.6 !important; }
          .provider-name { font-size: 1rem !important; font-weight: 700 !important; }
          .provider-occupation { font-size: 0.875rem !important; }
          .section-heading { font-size: 1.5rem !important; font-weight: 800 !important; }
          .card-text { color: #1e293b !important; }
          .card-text-dark { color: #f1f5f9 !important; }
          h1, h2, h3 { text-shadow: 0 1px 2px rgba(0,0,0,0.1); }
        }
      `}</style>
      {/* Pull-to-refresh indicator */}
      {pullDistance > 10 && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-blue-50 border-b border-blue-200 transition-all"
          style={{ height: `${Math.min(pullDistance, threshold)}px` }}
        >
          <div className={`flex items-center gap-2 text-blue-600 text-sm font-medium ${isPulling ? 'animate-spin' : ''}`}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            {isPulling ? 'Atualizando...' : pullDistance >= threshold ? 'Solte para atualizar' : 'Puxe para atualizar'}
          </div>
        </div>
      )}
      <OnboardingTour />
      {/* Hero Section */}
      <div className="bg-white">
        <section className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-4 md:gap-6 py-5 md:py-20 px-4 overflow-hidden">
          <div className="hero-content text-center lg:text-left">
            <h1 className="text-xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-2 drop-shadow-sm">
              Trancoso Resolve: Encontre Profissionais Verificados em Trancoso
            </h1>
            <p className="text-base md:text-lg text-slate-700 mb-4 font-medium leading-relaxed">
              Diaristas, eletricistas, encanadores, cozinheiros e muito mais — todos verificados e prontos para atender.
            </p>
            
            <div className="flex w-full max-w-lg mx-auto lg:mx-0 mb-4 min-w-0">
              <Input
                type="text"
                placeholder="O que você precisa?"
                className="flex-1 rounded-r-none focus:ring-0 focus:ring-offset-0 border-r-0 text-base h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Buscar serviços"
              />
              <Link to={createPageUrl("ServicosCategoria", `?q=${searchQuery}`)}>
              <Button className="rounded-l-none h-12 bg-[var(--primary)] min-w-[80px]" aria-label={`Buscar serviços: ${searchQuery || 'todos'}`}>
                  <Search className="w-5 h-5 mr-1" aria-hidden="true" />
                  <span>Buscar</span>
              </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap">
              <span className="text-sm font-medium text-slate-700">Popular:</span>
              <div className="flex gap-2 flex-wrap justify-center lg:justify-start">
                {popularServices.map(service => (
                    <Link key={service} to={createPageUrl("ServicosCategoria", `?cat=${service}`)}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-[var(--secondary)] hover:border-[var(--secondary)] bg-white border-slate-200 rounded-full text-xs py-1 px-2">{service}</Badge>
                    </Link>
                ))}
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <PromotionalBanner />
          </div>
        </section>
      </div>

      <div className="container mx-auto max-w-7xl px-4 lg:hidden mt-0">
        <PromotionalBanner />
      </div>

      <BannerCategorias />

      {/* CTA Destacado */}
      <section className="bg-gradient-to-r from-cyan-600 to-blue-700 py-8 md:py-16 my-4 md:my-12">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">
          Precisa de Ajuda? Encontre a Solução em Trancoso Agora!
        </h2>
        <p className="text-base md:text-xl text-white font-medium mb-6 leading-relaxed">
          Profissionais verificados em Trancoso prontos para resolver.
        </p>
          <Link to={createPageUrl("ServicosCategoria")}>
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold text-lg px-8 py-6">
              Encontrar Solução Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-16">

        {/* Recomendações com IA */}
        {user && (isLoadingRecommendations || (recommendedServices?.data && recommendedServices.data.length > 0)) && (
            <section className="mb-20">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><BrainCircuit className="w-6 h-6 text-purple-600" /> Para Você</h2>
                    <Link to={createPageUrl("ServicosCategoria")}>
                        <Button variant="ghost" className="text-cyan-600 hover:text-cyan-700">Ver todos</Button>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoadingRecommendations ? (
                        Array.from({ length: 3 }).map((_, i) => <ServiceSkeletonCard key={i} />)
                    ) : (
                        recommendedServices.data.map((service) => {
                            const provider = providers?.find(p => p.id === service.provider_id);
                            return <ServiceCard key={service.id} service={service} provider={provider} />;
                        })
                    )}
                </div>
            </section>
        )}

        {/* Featured Services */}
        <section className="mb-10 md:mb-20">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 drop-shadow-sm">Descubra os Serviços Mais Procurados em Trancoso</h2>
            <Link to={createPageUrl("ServicosCategoria")} data-testid="home-ver-todos-servicos-link">
              <Button variant="ghost" className="text-cyan-600 hover:text-cyan-700" aria-label="Ver todos os serviços">
                Ver todos
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {isLoadingServices ? (
                  Array.from({ length: 3 }).map((_, i) => <ServiceSkeletonCard key={i} />)
                ) : isErrorServices ? (
                  <div className="col-span-full text-center py-10 bg-red-50 rounded-lg">
                    <AlertCircle className="w-8 h-8 mx-auto text-red-500 mb-2" />
                    <p className="text-red-700">Não foi possível carregar os serviços em destaque.</p>
                  </div>
                ) : services && services.length > 0 ? (
                  services.map((service) => {
                    const provider = providers?.find(p => p.id === service.provider_id);
                    return <ServiceCard key={service.id} service={service} provider={provider} />;
                  })
                ) : (
                  <div className="col-span-full text-center py-12 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                    <Sparkles className="w-12 h-12 mx-auto text-blue-400 mb-3" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">Serviços em Destaque em Breve!</h3>
                    <p className="text-slate-500 mb-4 max-w-md mx-auto">
                      Estamos selecionando os melhores serviços para você. Enquanto isso, explore nossos profissionais.
                    </p>
                    <Link to={createPageUrl("ServicosCategoria")}>
                      <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                        Explorar Profissionais
                      </Button>
                    </Link>
                  </div>
                )}
          </div>
        </section>

        {/* Top Rated Providers */}
        <section className="mb-10 md:mb-20">
          <div className="text-center mb-4 md:mb-8">
            <h2 className="text-xl md:text-3xl font-bold text-slate-900 drop-shadow-sm">Conheça os Profissionais Mais Bem Avaliados de Trancoso</h2>
            <p className="text-base md:text-lg text-slate-700 font-medium mt-2 leading-relaxed">Os favoritos da comunidade, com qualidade comprovada.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-6">
            {isLoadingProviders ? (
                Array.from({ length: 6 }).map((_, i) => <ProviderSkeletonCard key={i} />)
            ) : isErrorProviders ? (
              <div className="col-span-full text-center py-10 bg-red-50 rounded-lg">
                <AlertCircle className="w-8 h-8 mx-auto text-red-500 mb-2" />
                <p className="text-red-700">Não foi possível carregar os profissionais.</p>
              </div>
            ) : topProviders.length > 0 ? (
                topProviders.map((provider) => (
                  <Link key={provider.id} to={createPageUrl("PrestadorPerfil", `?id=${provider.id}`)} aria-label={`Ver perfil de ${provider.full_name}, ${provider.occupation}`}>
                    <Card className="border-none shadow-lg hover:shadow-xl transition-all text-center cursor-pointer focus-within:ring-2 focus-within:ring-cyan-500 focus-within:ring-offset-2">
                      <CardContent className="p-4">
                        <div className="relative mb-3">
                          <LazyImage
                            src={provider.photo_url || `https://ui-avatars.com/api/?name=${provider.full_name}&size=200`}
                            alt={`Foto de perfil de ${provider.full_name}`}
                            className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-md"
                          />
                          {provider.verified && (
                            <div className="absolute bottom-0 right-1/2 translate-x-1/2 bg-cyan-500 rounded-full p-1" aria-label="Profissional verificado">
                              <Star className="w-3 h-3 text-white fill-current" />
                            </div>
                          )}
                        </div>
                        <p className="font-bold text-base text-slate-900 mb-1 leading-tight">{provider.full_name}</p>
                        <p className="text-sm text-slate-700 font-medium mb-2">{provider.occupation}</p>
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" aria-hidden="true" />
                          <span className="text-base font-bold text-slate-900">{provider.rating ? provider.rating.toFixed(1) : 'Novo'}</span>
                          <span className="sr-only">estrelas</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
            ) : (
              <div className="col-span-full text-center py-12 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                <Star className="w-12 h-12 mx-auto text-amber-400 mb-3" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Seja o Primeiro Avaliado!</h3>
                <p className="text-slate-500 mb-4 max-w-md mx-auto">
                  Os profissionais mais bem avaliados aparecerão aqui. Cadastre-se e conquiste suas primeiras avaliações.
                </p>
                <Link to={createPageUrl("SejaPrestador")}>
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    Cadastrar como Prestador
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Landing Pages por Serviço - SEO Local */}
         <section className="mb-10 md:mb-20 pt-8 md:pt-16">
           <div className="text-center mb-8">
             <h2 className="text-2xl md:text-4xl font-bold text-slate-900 drop-shadow-sm mb-2">Serviços Mais Buscados em Trancoso</h2>
             <p className="text-base md:text-lg text-slate-700 font-medium max-w-2xl mx-auto">Acesse guias completos com profissionais verificados em cada categoria</p>
           </div>
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
             {[
               { slug: 'limpeza-trancoso', label: 'Diarista', emoji: '🧹' },
               { slug: 'eletricista-trancoso', label: 'Eletricista', emoji: '⚡' },
               { slug: 'encanador-trancoso', label: 'Encanador', emoji: '🔧' },
               { slug: 'jardinagem-trancoso', label: 'Jardineiro', emoji: '🌿' },
               { slug: 'cozinheiro-trancoso', label: 'Cozinheiro', emoji: '👨‍🍳' },
               { slug: 'pedreiro-trancoso', label: 'Pedreiro', emoji: '🏗️' },
               { slug: 'pintor-trancoso', label: 'Pintor', emoji: '🖌️' },
               { slug: 'baba-trancoso', label: 'Babá', emoji: '👶' },
               { slug: 'garcom-trancoso', label: 'Garçom', emoji: '🍽️' },
             ].map(item => (
               <Link key={item.slug} to={`/ServicoLanding?slug=${item.slug}`}>
                 <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-4 text-center shadow-md hover:shadow-lg transition-all duration-300 border-2 border-slate-200 hover:border-cyan-400 cursor-pointer group h-full flex flex-col items-center justify-center">
                   <span className="text-3xl block mb-2" aria-hidden="true">{item.emoji}</span>
                   <span className="text-sm md:text-base font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">{item.label}</span>
                   <span className="block text-xs font-medium text-slate-500 mt-1">em Trancoso</span>
                 </div>
               </Link>
             ))}
           </div>
         </section>

        {/* Testimonials Section */}
        <Testimonials />

        {/* Quick Help CTA */}
        <Card className="border-none bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-2xl mt-10 md:mt-20">
          <CardContent className="p-6 md:p-8 text-center">
            <Zap className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3" />
            <h3 className="text-xl md:text-2xl font-bold mb-2 drop-shadow-md">Serviço Urgente? Contrate Agora em Trancoso!</h3>
            <p className="text-white mb-5 text-base md:text-lg font-medium">
              Precisa de um serviço com urgência? Entre em contato e encontraremos alguém disponível agora.
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-orange-50 font-semibold" data-testid="home-ajuda-urgente-button" aria-label="Solicitar serviço urgente agora">
              <Phone className="w-5 h-5 mr-2" aria-hidden="true" />
              Solicitar Agora
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}