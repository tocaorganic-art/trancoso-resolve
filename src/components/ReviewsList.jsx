import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating }) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-400'}`}
      />
    ))}
  </div>
);

export default function ReviewsList({ reviews = [], averageRating = 0, totalReviews = 0 }) {
  const [filterRating, setFilterRating] = useState(0);
  const [sortBy, setSortBy] = useState('recent');

  const filteredReviews = reviews.filter((review) => filterRating === 0 || review.rating === filterRating);

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.date) - new Date(a.date);
    }
    return b.rating - a.rating;
  });

  const getRatingCounts = () => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      counts[review.rating]++;
    });
    return counts;
  };

  const ratingCounts = getRatingCounts();

  return (
    <div className="space-y-6">
      {/* Resumo de Avaliações */}
      <div className="bg-slate-900 rounded-lg p-6 space-y-4">
        <div className="flex items-baseline gap-3">
          <div className="text-4xl font-bold text-white">{averageRating.toFixed(1)}</div>
          <div className="space-y-1">
            <StarRating rating={Math.round(averageRating)} />
            <p className="text-sm text-gray-300 font-semibold">{totalReviews} avaliações</p>
          </div>
        </div>

        {/* Distribuição de Ratings */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-3">
              <button
                onClick={() => setFilterRating(filterRating === rating ? 0 : rating)}
                className={`text-sm font-semibold min-w-fit px-2 py-1 rounded transition-colors ${
                  filterRating === rating
                    ? 'bg-cyan-500 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {rating}★
              </button>
              <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-yellow-400 h-full transition-all"
                  style={{ width: `${(ratingCounts[rating] / totalReviews) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 min-w-fit">{ratingCounts[rating]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filtros e Ordenação */}
      {sortedReviews.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded bg-slate-800 text-white text-sm font-semibold border border-slate-700 focus:border-cyan-500 focus:outline-none"
            aria-label="Ordenar avaliações"
          >
            <option value="recent">Mais Recentes</option>
            <option value="rating">Melhor Avaliação</option>
          </select>

          {filterRating > 0 && (
            <button
              onClick={() => setFilterRating(0)}
              className="px-3 py-2 rounded bg-cyan-500 text-white text-sm font-semibold hover:bg-cyan-600 transition-colors"
            >
              Limpar Filtro ({filterRating}★)
            </button>
          )}
        </div>
      )}

      {/* Lista de Avaliações */}
      {sortedReviews.length > 0 ? (
        <div className="space-y-4">
          {sortedReviews.map((review, idx) => (
            <div key={idx} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex justify-between items-start mb-2">
                <div className="space-y-1">
                  <p className="font-bold text-white">{review.name}</p>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-xs text-gray-400 font-semibold">
                  {new Date(review.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <p className="font-semibold">Nenhuma avaliação encontrada</p>
        </div>
      )}
    </div>
  );
}