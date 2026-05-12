import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function ServiceGallery({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-video bg-slate-200 rounded-lg flex items-center justify-center">
        <p className="text-slate-500 font-semibold">Sem imagens disponíveis</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full aspect-video bg-slate-900 rounded-lg overflow-hidden group">
        <img
          src={images[currentIndex]}
          alt={`Imagem ${currentIndex + 1} do serviço`}
          className="w-full h-full object-cover cursor-zoom-in"
          onClick={() => setIsFullscreen(true)}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="w-6 h-6 text-slate-900" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="w-6 h-6 text-slate-900" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'bg-white w-6' : 'bg-white/50'
                  }`}
                  aria-label={`Ir para imagem ${idx + 1}`}
                  aria-current={idx === currentIndex}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute top-4 right-4 bg-white/80 px-3 py-1 rounded-full text-sm font-semibold text-slate-900">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full"
            aria-label="Fechar"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <img
            src={images[currentIndex]}
            alt={`Imagem ${currentIndex + 1} ampliada`}
            className="max-w-full max-h-[90vh] object-contain"
          />

          {images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
              <button
                onClick={handlePrevious}
                className="pointer-events-auto bg-white/20 hover:bg-white/30 p-3 rounded-full"
                aria-label="Imagem anterior"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>

              <button
                onClick={handleNext}
                className="pointer-events-auto bg-white/20 hover:bg-white/30 p-3 rounded-full"
                aria-label="Próxima imagem"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}