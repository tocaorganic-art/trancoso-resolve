import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import usePullToRefresh from "@/hooks/usePullToRefresh";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LazyImage from "@/components/ui/LazyImage";
import ProvidersMap from "@/components/map/ProvidersMap";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Search, Star, MapPin, ArrowLeft, Filter, Loader2, AlertCircle, List, Map, Navigation, X } from "lucide-react";
import VerificacaoBadge from "@/components/verificacao/VerificacaoBadge";
import BadgeEmVerificacao from "@/components/verificacao/BadgeEmVerificacao";

const ProviderCard = ({ provider }) => (
    <Card className="border-none shadow-lg hover:shadow-xl transition-all h-full flex flex-col overflow-hidden">
        {/* Foto de Capa */}
        <div className="relative h-32 bg-gradient-to-r from-cyan-400 to-blue-500 shrink-0">
            {provider.cover_photo_url ? (
                <LazyImage
                    src={provider.cover_photo_url}
                    alt={`Foto de capa de ${provider.full_name}`}
                    className="w-full h-full object-cover"
                />
            ) : null}
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        <CardContent className="p-6 flex flex-col flex-grow -mt-10 relative">
            <div className="flex items-start gap-4 mb-4">
                <LazyImage
                    src={provider.photo_url || `https://ui-avatars.com/api/?name=${provider.full_name}&size=200`}
                    alt={`Foto de perfil de ${provider.full_name}`}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md shrink-0"
                />
                <div className="flex-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-bold text-lg text-slate-900">{provider.full_name}</h3>
                            <p className="text-sm text-slate-600">{provider.occupation}</p>
                        </div>
                        {provider.verified && (
                            <VerificacaoBadge verified showLabel size="sm" />
                        )}
                        {provider.status_verificacao && provider.status_verificacao !== 'aprovado' && provider.status_verificacao !== 'reprovado' && (
                            <BadgeEmVerificacao />
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{provider.rating ? provider.rating.toFixed(1) : 'Novo'}</span>
                        </div>
                        {provider.total_reviews > 0 && <span className="text-xs text-slate-500">({provider.total_reviews} avaliações)</span>}
                    </div>
                </div>
            </div>

            {provider.bio && (
                <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-grow">{provider.bio}</p>
            )}

            <div className="flex items-center justify-between mb-4 mt-auto">
                {provider.location?.city && (
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                        <MapPin className="w-4 h-4" />
                        <span>{provider.location.city}</span>
                    </div>
                )}
                {provider.price_range && (
                    <Badge variant="outline">{provider.price_range}</Badge>
                )}
            </div>

            {provider.availability && (
                 <Badge className={`mb-4 self-start ${
                    provider.availability === 'Disponível' ? 'bg-green-100 text-green-800' :
                    provider.availability === 'Ocupado' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {provider.availability}
                </Badge>
            )}

            <Link to={createPageUrl("PrestadorPerfil", `?id=${provider.id}`)}>
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                    Ver Perfil Completo
                </Button>
            </Link>
        </CardContent>
    </Card>
);

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

    const schemaId = 'schema-categoria';
    const existing = document.getElementById(schemaId);
    if (existing) existing.remove();
    const schema = document.createElement('script');
    schema.id = schemaId;
    schema.type = 'application/ld+json';
    schema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": cat ? `${cat} em Trancoso` : "Serviços em Trancoso",
      "description": cat
        ? `Lista de profissionais de ${cat} verificados em Trancoso, Bahia`
        : "Todos os serviços disponíveis em Trancoso, Bahia",
      "url": `https://www.trancosoresolve.com.br/ServicosCategoria${cat ? `?cat=${encodeURIComponent(cat)}` : ''}`,
      "numberOfItems": filteredProviders?.length || 0,
    });
    document.head.appendChild(schema);
    return () => { const s = document.getElementById(schemaId); if (s) s.remove(); };
  }, [selectedCategory, filteredProviders?.length]);

  const { data: providers, isLoading: isLoadingProviders, isError: isErrorProviders } = useQuery({
    queryKey: ['serviceProviders'],
    queryFn: () => base44.entities.ServiceProvider.list('-rating'),
  });

  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['serviceProviders'] });
  }, [queryClient]);

  const { isPulling, pullDistance, threshold } = usePullToRefresh(handleRefresh);

  // Contadores dinâmicos para filtros
  const filterCounts = useMemo(() => {
    if (!providers) return { price: {}, rating: {}, availability: {}, neighborhoods: [] };
    
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

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim() === '') {
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
          const providerContext = providers.map(p => ({
            id: p.id,
            name: p.full_name,
            occupation: p.occupation,
            bio: p.bio,
            specialties: p.specialties,
          }));

          const result = await base44.integrations.Core.InvokeLLM({
            prompt: `Baseado na busca do usuário "${searchQuery}", analise a lista de prestadores e retorne os IDs dos mais relevantes. Entenda a intenção, não apenas palavras-chave. Exemplo: se a busca for "consertar vazamento", priorize "Encanador". Contexto: ${JSON.stringify(providerContext)}`,
            response_json_schema: {
              type: "object",
              properties: {
                relevant_provider_ids: {
                  type: "array",
                  items: { type: "string" },
                }
              },
              required: ["relevant_provider_ids"]
            }
          });
          
          setAiFilteredProviderIds(result?.relevant_provider_ids || []);
        } catch (error) {
          console.error("AI search failed:", error);
          setAiFilteredProviderIds([]);
        } finally {
          setIsSearching(false);
        }
      };
      performSearch();
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery, providers]);


  const filteredProviders = useMemo(() => providers?.filter(provider => {
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
  }) || [], [providers, selectedCategory, searchQuery, aiFilteredProviderIds, priceFilter, ratingFilter, availabilityFilter, neighborhoodFilter]);
  


  const renderContent = () => {
    if (isLoadingProviders) {
        return (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-slate-500 text-lg">Carregando profissionais...</p>
          </div>
        );
    }

    if (isErrorProviders) {
        return (
            <div className="text-center py-16 bg-red-50 rounded-lg">
                <AlertCircle className="w-10 h-10 mx-auto text-red-500 mb-4" />
                <h3 className="text-xl font-semibold text-red-800">Erro ao Carregar</h3>
                <p className="text-red-600 mt-2">Não foi possível buscar os profissionais. Por favor, tente novamente mais tarde.</p>
            </div>
        );
    }
    
    if (searchQuery.trim() !== '' && isSearching) {
        return (
            <div className="text-center py-16">
                <Loader2 className="w-8 h-8 mx-auto text-blue-500 animate-spin mb-4" />
                <p className="text-slate-500 text-lg">Buscando profissionais com IA...</p>
            </div>
        );
    }
    
    if (filteredProviders.length === 0) {
        const hasActiveFilters = priceFilter !== 'all' || ratingFilter !== 'all' || availabilityFilter !== 'all' || neighborhoodFilter !== 'all' || searchQuery.trim() !== '';
        return (
          <div className="col-span-full text-center py-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-200 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Nenhum Profissional Encontrado</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              {hasActiveFilters 
                ? "Não encontramos profissionais com os filtros selecionados. Experimente ajustar sua busca."
                : "Ainda não há profissionais cadastrados nesta categoria."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {hasActiveFilters && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                  setSearchQuery('');
                  setPriceFilter('all');
                  setRatingFilter('all');
                  setAvailabilityFilter('all');
                  setSelectedCategory('Todos');
                  }}
                  className="gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Limpar Filtros
                </Button>
              )}
              <Link to={createPageUrl("SejaPrestador")}>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 gap-2">
                  <Star className="w-4 h-4" />
                  Seja o Primeiro!
                </Button>
              </Link>
            </div>
          </div>
        );
    }

    if (viewMode === 'map') {
        return (
            <div className="col-span-full">
                <ProvidersMap providers={filteredProviders} />
            </div>
        );
    }
    
    return filteredProviders.map((provider) => <ProviderCard key={provider.id} provider={provider} />);
  };

  return (
    <div className="min-h-screen bg-slate-50">
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
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <Link to={createPageUrl("Home")}>
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold mb-2">
            {selectedCategory === 'Todos' ? 'Serviços em Trancoso, BA' : `${selectedCategory} em Trancoso, BA`}
          </h1>
          <p className="text-blue-100">
            {isLoadingProviders ? "Carregando..." :
             (isSearching ? "Buscando com IA..." :
             `${filteredProviders.length} profissiona${filteredProviders.length !== 1 ? 'is' : 'l'} encontrado${filteredProviders.length !== 1 ? 's' : ''}`)}
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
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-600" />
              <h3 className="font-semibold text-slate-900">Filtros</h3>
            </div>
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)} className="flex">
              <ToggleGroupItem value="list" aria-label="Ver em lista">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="map" aria-label="Ver no mapa">
                <Map className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Busca inteligente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label="Busca inteligente de profissionais"
              />
              {isSearching && (
                 <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
              )}
            </div>
            
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger aria-label="Filtrar por faixa de preço">
                <SelectValue placeholder="Faixa de Preço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Preços ({filterCounts.price.all || 0})</SelectItem>
                <SelectItem value="$">$ - Econômico ({filterCounts.price['$'] || 0})</SelectItem>
                <SelectItem value="$$">$$ - Moderado ({filterCounts.price['$$'] || 0})</SelectItem>
                <SelectItem value="$$$">$$$ - Premium ({filterCounts.price['$$$'] || 0})</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger aria-label="Filtrar por avaliação">
                <SelectValue placeholder="Avaliação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Avaliações ({filterCounts.rating.all || 0})</SelectItem>
                <SelectItem value="4.5">⭐ 4.5+ Excelente ({filterCounts.rating['4.5'] || 0})</SelectItem>
                <SelectItem value="4.0">⭐ 4.0+ Muito Bom ({filterCounts.rating['4.0'] || 0})</SelectItem>
                <SelectItem value="3.5">⭐ 3.5+ Bom ({filterCounts.rating['3.5'] || 0})</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger aria-label="Filtrar por disponibilidade">
                <SelectValue placeholder="Disponibilidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Qualquer Disponibilidade ({filterCounts.availability?.all || 0})</SelectItem>
                <SelectItem value="Disponível">🟢 Disponível agora ({filterCounts.availability?.['Disponível'] || 0})</SelectItem>
                <SelectItem value="Ocupado">🟡 Ocupado ({filterCounts.availability?.['Ocupado'] || 0})</SelectItem>
              </SelectContent>
            </Select>

            <Select value={neighborhoodFilter} onValueChange={setNeighborhoodFilter}>
              <SelectTrigger aria-label="Filtrar por bairro">
                <SelectValue placeholder="Bairro / Região" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <span className="flex items-center gap-2"><Navigation className="w-3 h-3" /> Toda Trancoso</span>
                </SelectItem>
                {filterCounts.neighborhoods?.map(n => (
                  <SelectItem key={n} value={n}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(priceFilter !== 'all' || ratingFilter !== 'all' || availabilityFilter !== 'all' || neighborhoodFilter !== 'all' || searchQuery.trim() !== '') && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setPriceFilter('all');
                  setRatingFilter('all');
                  setAvailabilityFilter('all');
                  setNeighborhoodFilter('all');
                }}
                className="gap-2 text-slate-600"
                aria-label="Limpar todos os filtros"
              >
                <X className="w-4 h-4" />
                Limpar Filtros
              </Button>
            )}
          </div>
        </div>

        {/* Providers Grid / Map */}
        <div className={`grid gap-6 ${viewMode === 'list' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {renderContent()}
        </div>
      </div>
    </div>
  );
}