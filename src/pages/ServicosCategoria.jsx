import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import usePullToRefresh from "@/hooks/usePullToRefresh";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProvidersMap from "@/components/map/ProvidersMap";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ArrowLeft, Filter, Loader2, AlertCircle, List, Map, Navigation, X, Star, Search } from "lucide-react";
import MultilingualAutocomplete from "@/components/search/MultilingualAutocomplete";
 import ProviderCard from "@/components/providers/ProviderCard";
import FilterBar from "@/components/providers/FilterBar";
import ProviderGrid from "@/components/providers/ProviderGrid";

const slugMap = {
  'Limpeza': 'limpeza-trancoso',
  'Eletricista': 'eletricista-trancoso',
  'Encanador': 'encanador-trancoso',
  'Jardinagem': 'jardinagem-trancoso',
  'Cozinheiro': 'cozinheiro-trancoso',
  'Pedreiro': 'pedreiro-trancoso',
  'Pintor': 'pintor-trancoso',
  'Babá': 'baba-trancoso',
  'Garçom': 'garcom-trancoso',
};

export default function ServicosCategoriaPage() {
  const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const [selectedCategory, setSelectedCategory] = useState(urlParams.get('cat') || 'Todos');
  const [searchQuery, setSearchQuery] = useState(urlParams.get('q') || '');
  
  const [priceFilter, setPriceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [neighborhoodFilter, setNeighborhoodFilter] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [aiFilteredProviderIds, setAiFilteredProviderIds] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const queryClient = useQueryClient();

  // ⭐ STEP 1: Fetch providers FIRST
  const { data: providers = [], isLoading: isLoadingProviders, isError: isErrorProviders } = useQuery({
    queryKey: ['serviceProviders'],
    queryFn: async () => {
      try {
        const result = await base44.entities.ServiceProvider.list('-rating');
        return Array.isArray(result) ? result : [];
      } catch (err) {
        console.error('ServiceProvider query error:', err);
        return [];
      }
    },
  });

  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['serviceProviders'] });
  }, [queryClient]);

  const { isPulling, pullDistance, threshold } = usePullToRefresh(handleRefresh);

  // ⭐ STEP 2: Compute filtered providers AFTER providers is available
  const filteredProviders = useMemo(() => {
    if (!providers || providers.length === 0) return [];
    
    return providers.filter(provider => {
      // Ocultar reprovados sempre
      if (provider.status_verificacao === 'reprovado') return false;

      const matchesCategory = selectedCategory === 'Todos' || provider.occupation === selectedCategory;
      
      let matchesSearch = true;
      if (searchQuery.trim() !== '') {
          matchesSearch = aiFilteredProviderIds ? aiFilteredProviderIds.includes(provider.id) : false;
      }

      const matchesPrice = priceFilter === "all" || provider.price_range === priceFilter;
      const matchesRating = ratingFilter === "all" || (provider.rating && provider.rating >= parseFloat(ratingFilter));
      const matchesAvailability = availabilityFilter === "all" || provider.availability === availabilityFilter;
      const matchesNeighborhood = neighborhoodFilter === "all" || provider.location?.neighborhood === neighborhoodFilter;
      
      return matchesCategory && matchesSearch && matchesPrice && matchesRating && matchesAvailability && matchesNeighborhood;
    });
  }, [providers, selectedCategory, searchQuery, aiFilteredProviderIds, priceFilter, ratingFilter, availabilityFilter, neighborhoodFilter]);

  // ⭐ STEP 3: Compute filter counts AFTER providers is available
  const filterCounts = useMemo(() => {
    if (!providers || providers.length === 0) return { price: {}, rating: {}, availability: {}, neighborhoods: [] };
    
    const baseFiltered = providers.filter(p => {
      const matchesCategory = selectedCategory === 'Todos' || p.occupation === selectedCategory;
      let matchesSearch = true;
      if (searchQuery.trim() !== '' && aiFilteredProviderIds) {
        matchesSearch = aiFilteredProviderIds.includes(p.id);
      }
      return matchesCategory && matchesSearch;
    });

    const neighborhoods = [...new Set(baseFiltered.map(p => p.location?.neighborhood).filter(Boolean))].sort();

    return {
      price: {
        all: baseFiltered.length,
        '$': baseFiltered.filter(p => p.price_range === '$').length,
        '$$': baseFiltered.filter(p => p.price_range === '$$').length,
        '$$$': baseFiltered.filter(p => p.price_range === '$$$').length,
      },
      rating: {
        all: baseFiltered.length,
        '4.5': baseFiltered.filter(p => p.rating && p.rating >= 4.5).length,
        '4.0': baseFiltered.filter(p => p.rating && p.rating >= 4.0).length,
        '3.5': baseFiltered.filter(p => p.rating && p.rating >= 3.5).length,
      },
      availability: {
        all: baseFiltered.length,
        'Disponível': baseFiltered.filter(p => p.availability === 'Disponível').length,
        'Ocupado': baseFiltered.filter(p => p.availability === 'Ocupado').length,
      },
      neighborhoods,
    };
  }, [providers, selectedCategory, searchQuery, aiFilteredProviderIds]);

  // ⭐ STEP 4: SEO and metadata (depends on filteredProviders)
  useEffect(() => {
    const cat = selectedCategory !== 'Todos' ? selectedCategory : null;
    const title = cat
      ? `${cat} em Trancoso, BA — Profissionais Verificados | Trancoso Resolve`
      : 'Todos os Serviços em Trancoso, BA | Trancoso Resolve';
    document.title = title;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = cat
      ? `Encontre profissionais de ${cat} em Trancoso, Bahia. Verificados, avaliados pela comunidade. Solicite orçamento grátis.`
      : 'Navegue por todos os serviços disponíveis em Trancoso, BA. Profissionais verificados para limpeza, elétrica, encanamento, jardinagem e muito mais.';

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = `${window.location.origin}/ServicosCategoria${cat ? `?cat=${encodeURIComponent(cat)}` : ''}`;

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) { ogUrl = document.createElement('meta'); ogUrl.setAttribute('property', 'og:url'); document.head.appendChild(ogUrl); }
    ogUrl.content = `${window.location.origin}/ServicosCategoria${cat ? `?cat=${encodeURIComponent(cat)}` : ''}`;

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) { ogTitle = document.createElement('meta'); ogTitle.setAttribute('property', 'og:title'); document.head.appendChild(ogTitle); }
    ogTitle.content = cat
      ? `${cat} em Trancoso, BA — Profissionais Verificados | Trancoso Resolve`
      : 'Todos os Serviços em Trancoso, BA | Trancoso Resolve';

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) { ogDesc = document.createElement('meta'); ogDesc.setAttribute('property', 'og:description'); document.head.appendChild(ogDesc); }
    ogDesc.content = cat
      ? `Encontre profissionais de ${cat} em Trancoso, Bahia. Verificados, avaliados pela comunidade. Solicite orçamento grátis.`
      : 'Navegue por todos os serviços disponíveis em Trancoso, BA. Profissionais verificados para limpeza, elétrica, encanamento, jardinagem e muito mais.';

    const pageUrl = `${window.location.origin}/ServicosCategoria${cat ? `?cat=${encodeURIComponent(cat)}` : ''}`;
    const schemaId = 'schema-categoria';
    const existing = document.getElementById(schemaId);
    if (existing) existing.remove();
    
    const schema = document.createElement('script');
    schema.id = schemaId;
    schema.type = 'application/ld+json';
    schema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ItemList",
          "name": cat ? `${cat} em Trancoso` : "Profissionais de Serviços em Trancoso",
          "description": cat
            ? `Lista de profissionais de ${cat} verificados em Trancoso, Bahia`
            : "Todos os profissionais de serviços disponíveis em Trancoso, Bahia",
          "url": pageUrl,
          "numberOfItems": filteredProviders?.length || 0,
          "itemListElement": (filteredProviders || []).slice(0, 10).map((p, i) => {
            const item = {
              "@type": "Person",
              "name": p.full_name,
              "jobTitle": p.occupation,
              "description": p.bio || `${p.occupation} verificado em Trancoso, Bahia`,
              "url": `${window.location.origin}/PrestadorPerfil?id=${p.id}`
            };
            if (p.photo_url) item.image = p.photo_url;
            if (p.rating && p.total_reviews > 0) {
              item.aggregateRating = {
                "@type": "AggregateRating",
                "ratingValue": p.rating,
                "reviewCount": p.total_reviews,
                "bestRating": 5,
                "worstRating": 1
              };
            }
            return { "@type": "ListItem", "position": i + 1, "item": item };
          })
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Início", "item": `${window.location.origin}` },
            { "@type": "ListItem", "position": 2, "name": cat ? `${cat} em Trancoso` : "Serviços em Trancoso", "item": pageUrl }
          ]
        }
      ]
    });
    document.head.appendChild(schema);
    return () => { const s = document.getElementById(schemaId); if (s) s.remove(); };
  }, [selectedCategory, filteredProviders]);

  // Sinônimos para melhorar buscas
  const categoryAliases = {
    'faxina': 'Limpeza', 'faxineira': 'Limpeza', 'diarista': 'Limpeza', 'limpeza-domestica': 'Limpeza', 'limpar': 'Limpeza',
    'eletricista': 'Eletricista', 'eletrico': 'Eletricista', 'luz': 'Eletricista',
    'encanador': 'Encanador', 'encanamento': 'Encanador', 'vazamento': 'Encanador', 'tubulacao': 'Encanador',
    'jardim': 'Jardinagem', 'jardinagem': 'Jardinagem', 'grama': 'Jardinagem', 'poda': 'Jardinagem',
    'cozinha': 'Cozinheiro', 'cozinheiro': 'Cozinheiro', 'chef': 'Cozinheiro', 'comida': 'Cozinheiro',
  };

  const resolveSearchCategory = (query) => categoryAliases[query.toLowerCase().trim()] || null;

  useEffect(() => {
    const handler = setTimeout(() => {
      const normalizedQuery = searchQuery.trim();
      
      if (normalizedQuery === '') {
        setAiFilteredProviderIds(null);
        return;
      }
      
      if (!providers || providers.length === 0) {
        setAiFilteredProviderIds([]);
        return;
      }

      const performSearch = async () => {
        setIsSearching(true);
        try {
          const resolvedCategory = resolveSearchCategory(normalizedQuery);
          
          if (resolvedCategory) {
            const matchingIds = providers.filter(p => p.occupation === resolvedCategory).map(p => p.id);
            setAiFilteredProviderIds(matchingIds);
            setIsSearching(false);
            return;
          }

          const providerContext = providers.map(p => ({
            id: p.id, name: p.full_name, occupation: p.occupation,
            bio: p.bio || '', specialties: p.specialties || [],
          }));

          const result = await base44.integrations.Core.InvokeLLM({
            prompt: `Baseado na busca do usuário "${normalizedQuery}", analise a lista de prestadores e retorne APENAS os IDs dos mais relevantes. Procure por correspondência semântica. Se não encontrar correspondência, retorne array vazio. Contexto: ${JSON.stringify(providerContext.slice(0, 50))}`,
            response_json_schema: {
              type: "object",
              properties: { relevant_provider_ids: { type: "array", items: { type: "string" }, description: "IDs dos prestadores relevantes" } },
              required: ["relevant_provider_ids"]
            }
          });
          
          const ids = result?.relevant_provider_ids;
          setAiFilteredProviderIds(Array.isArray(ids) ? ids : []);
        } catch (error) {
          console.error("Search error:", error);
          setAiFilteredProviderIds([]);
        } finally {
          setIsSearching(false);
        }
      };
      performSearch();
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery, providers]);

  const renderContent = () => {
    if (isLoadingProviders) {
      return (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 mx-auto text-amber-500 animate-spin mb-4" />
          <p className="text-slate-500 text-lg">Carregando profissionais...</p>
        </div>
      );
    }

    if (isErrorProviders) {
      return (
        <div className="text-center py-16 bg-red-50 rounded-lg">
          <AlertCircle className="w-10 h-10 mx-auto text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-red-800">Erro ao Carregar</h3>
          <p className="text-red-600 mt-2">Não foi possível buscar os profissionais. Por favor, tente novamente.</p>
        </div>
      );
    }
    
    if (searchQuery.trim() !== '' && isSearching) {
      return (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 mx-auto text-amber-500 animate-spin mb-4" />
          <p className="text-slate-500 text-lg">Buscando profissionais com IA...</p>
        </div>
      );
    }
    
    if (filteredProviders.length === 0) {
       const hasActiveFilters = priceFilter !== 'all' || ratingFilter !== 'all' || availabilityFilter !== 'all' || neighborhoodFilter !== 'all' || searchQuery.trim() !== '';
       const hasSearchQuery = searchQuery.trim() !== '';

       return (
         <div className="col-span-full text-center py-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700">
           <div className="w-16 h-16 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center">
             <Search className="w-8 h-8 text-cyan-400" />
           </div>
           <h3 className="text-xl font-semibold text-slate-100 mb-2">Nenhum Prestador Encontrado</h3>
           <p className="text-slate-400 max-w-md mx-auto mb-6">
             {hasSearchQuery
               ? `Não encontramos profissionais para "${searchQuery}". Tente uma busca diferente ou explore as categorias.`
               : hasActiveFilters 
               ? "Nenhum prestador corresponde aos filtros selecionados. Ajuste sua busca e tente novamente."
               : "Nenhum prestador encontrado para essa categoria ainda. Em breve novos profissionais estarão disponíveis."}
           </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {hasActiveFilters && (
              <Button variant="outline" onClick={() => {
                setSearchQuery(''); setPriceFilter('all'); setRatingFilter('all');
                setAvailabilityFilter('all'); setNeighborhoodFilter('all'); setSelectedCategory('Todos');
              }} className="gap-2">
                <Filter className="w-4 h-4" /> Limpar Filtros
              </Button>
            )}
            <Link to={createPageUrl("SejaPrestador")}>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white gap-2">
                <Star className="w-4 h-4" /> Seja o Primeiro!
              </Button>
            </Link>
          </div>
        </div>
      );
    }

    if (viewMode === 'map') {
      return <div className="col-span-full"><ProvidersMap providers={filteredProviders} /></div>;
    }
    
    return filteredProviders.map((provider) => <ProviderCard key={provider.id} provider={provider} />);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {pullDistance > 10 && (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-amber-50 border-b border-amber-200 transition-all" style={{ height: `${Math.min(pullDistance, threshold)}px` }}>
          <div className={`flex items-center gap-2 text-amber-700 text-sm font-medium ${isPulling ? 'animate-spin' : ''}`}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            {isPulling ? 'Atualizando...' : pullDistance >= threshold ? 'Solte para atualizar' : 'Puxe para atualizar'}
          </div>
        </div>
      )}
      
      <div className="bg-gradient-to-r from-amber-800 to-amber-600 text-white py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <Link to={createPageUrl("Home")}>
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
          </Link>
          <h1 className="text-xl md:text-3xl font-bold mb-2">
            {selectedCategory === 'Todos' ? 'Serviços em Trancoso, BA' : `${selectedCategory} em Trancoso, BA`}
          </h1>
          <p className="text-blue-100">
            {isLoadingProviders ? "Carregando..." : (isSearching ? "Buscando com IA..." : `${filteredProviders.length} profissiona${filteredProviders.length !== 1 ? 'is' : 'l'} encontrado${filteredProviders.length !== 1 ? 's' : ''}`)}
          </p>
          {selectedCategory !== 'Todos' && slugMap[selectedCategory] && (
            <Link to={`/ServicoLanding?slug=${slugMap[selectedCategory]}`} className="inline-block mt-3">
              <span className="text-xs bg-white/20 hover:bg-white/30 text-white rounded-full px-3 py-1 transition-colors">
                📄 Guia completo de {selectedCategory} em Trancoso →
              </span>
            </Link>
          )}
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <FilterBar 
            viewMode={viewMode}
            setViewMode={setViewMode}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setSelectedCategory={setSelectedCategory}
            priceFilter={priceFilter}
            setPriceFilter={setPriceFilter}
            ratingFilter={ratingFilter}
            setRatingFilter={setRatingFilter}
            availabilityFilter={availabilityFilter}
            setAvailabilityFilter={setAvailabilityFilter}
            neighborhoodFilter={neighborhoodFilter}
            setNeighborhoodFilter={setNeighborhoodFilter}
            filterCounts={filterCounts}
        />
        
        <ProviderGrid 
          isLoading={isLoadingProviders || isSearching}
          isError={isErrorProviders}
          providers={filteredProviders}
          viewMode={viewMode}
          searchQuery={searchQuery}
          renderContent={renderContent}
        />
      </div>
    </div>
  );
}