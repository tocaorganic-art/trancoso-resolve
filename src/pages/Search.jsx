import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock data
const MOCK_RESULTS = [
  {
    id: '1',
    title: 'Limpeza Residencial Premium',
    category: 'Limpeza',
    price: 250,
    provider: 'Maria Silva',
    rating: 4.8,
    reviews: 45,
    image: 'https://images.unsplash.com/photo-1584567694244-14fbdf83bd30?w=400',
    location: 'Zona Norte',
    available: true,
  },
  {
    id: '2',
    title: 'Serviço Elétrico Geral',
    category: 'Eletricista',
    price: 150,
    provider: 'João Ferreira',
    rating: 4.9,
    reviews: 32,
    image: 'https://images.unsplash.com/photo-1581092921283-90fcce5e3e0b?w=400',
    location: 'Centro',
    available: true,
  },
  {
    id: '3',
    title: 'Chef Particular',
    category: 'Cozinheiro',
    price: 400,
    provider: 'Carlos Santos',
    rating: 4.7,
    reviews: 28,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    location: 'Zona Sul',
    available: false,
  },
];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState(MOCK_RESULTS);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filtros
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 1000,
    minRating: Number(searchParams.get('minRating')) || 0,
    availability: searchParams.get('availability') === 'true',
  });

  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevant');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const categories = ['Limpeza', 'Eletricista', 'Encanador', 'Jardinagem', 'Cozinheiro', 'Pedreiro', 'Pintor', 'Babá'];

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, filters, sortBy]);

  const handleSearch = useCallback(() => {
    setIsLoading(true);
    setCurrentPage(1);

    let filtered = MOCK_RESULTS.filter((item) => {
      const matchesQuery =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.provider.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = filters.category === 'all' || item.category === filters.category;
      const matchesPrice = item.price >= filters.minPrice && item.price <= filters.maxPrice;
      const matchesRating = item.rating >= filters.minRating;
      const matchesAvailability = !filters.availability || item.available;

      return matchesQuery && matchesCategory && matchesPrice && matchesRating && matchesAvailability;
    });

    if (sortBy === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setResults(filtered);
    setIsLoading(false);

    // Atualizar URL
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (filters.category !== 'all') params.set('category', filters.category);
    if (filters.minPrice > 0) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice < 1000) params.set('maxPrice', filters.maxPrice);
    if (filters.minRating > 0) params.set('minRating', filters.minRating);
    if (filters.availability) params.set('availability', 'true');
    if (sortBy !== 'relevant') params.set('sort', sortBy);
    setSearchParams(params);
  }, [searchQuery, filters, sortBy, setSearchParams]);

  const paginatedResults = results.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 p-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar serviço, profissional..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-slate-300 text-slate-900 focus:border-cyan-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Limpar busca"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            size="icon"
            className="border-slate-300"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Filtros Colapsáveis */}
      {showFilters && (
        <div className="bg-slate-100 border-b border-slate-200 p-4">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Categoria */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Categoria</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFilters({ ...filters, category: 'all' })}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    filters.category === 'all'
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white text-slate-900 border border-slate-300 hover:border-slate-400'
                  }`}
                >
                  Todas
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilters({ ...filters, category: cat })}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      filters.category === cat
                        ? 'bg-cyan-500 text-white'
                        : 'bg-white text-slate-900 border border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Preço */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Preço: R$ {filters.minPrice} - R$ {filters.maxPrice}
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Avaliação Mínima</label>
              <select
                value={filters.minRating}
                onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:border-cyan-500 focus:outline-none"
              >
                <option value={0}>Todas as avaliações</option>
                <option value={4}>4+ estrelas</option>
                <option value={3}>3+ estrelas</option>
                <option value={2}>2+ estrelas</option>
              </select>
            </div>

            {/* Disponibilidade */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.availability}
                onChange={(e) => setFilters({ ...filters, availability: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-semibold text-slate-900">Apenas disponíveis agora</span>
            </label>

            {/* Ordenação */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Ordenar por</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:border-cyan-500 focus:outline-none"
              >
                <option value="relevant">Mais relevante</option>
                <option value="price_asc">Menor preço</option>
                <option value="price_desc">Maior preço</option>
                <option value="rating">Melhor avaliação</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Info de Resultados */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-900">
              {results.length} resultado{results.length !== 1 ? 's' : ''}
            </p>
            {searchQuery && (
              <p className="text-sm text-gray-600">para "{searchQuery}"</p>
            )}
          </div>

          {/* Tags de Filtros Ativos */}
          {(filters.category !== 'all' ||
            filters.minPrice > 0 ||
            filters.maxPrice < 1000 ||
            filters.minRating > 0 ||
            filters.availability) && (
            <button
              onClick={() =>
                setFilters({
                  category: 'all',
                  minPrice: 0,
                  maxPrice: 1000,
                  minRating: 0,
                  availability: false,
                })
              }
              className="text-xs font-bold text-cyan-600 hover:text-cyan-700"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* Resultados */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-200 rounded-lg h-48 animate-pulse" />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            {paginatedResults.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex gap-4 p-4 md:flex-row flex-col">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full md:w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.provider}</p>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Badge className="bg-cyan-100 text-cyan-900">{item.category}</Badge>
                      <Badge variant="outline">{item.location}</Badge>
                      {item.available ? (
                        <Badge className="bg-green-100 text-green-900">Disponível</Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600">Indisponível</Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500 font-bold">★ {item.rating}</span>
                        <span className="text-xs text-gray-600">({item.reviews})</span>
                      </div>
                      <p className="text-lg font-bold text-slate-900">
                        R$ {item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                >
                  Anterior
                </Button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    variant={currentPage === i + 1 ? 'default' : 'outline'}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                >
                  Próximo
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 font-semibold mb-4">Nenhum resultado encontrado</p>
            <p className="text-sm text-gray-500">Tente ajustar seus filtros ou buscar outro termo</p>
          </div>
        )}
      </div>
    </div>
  );
}