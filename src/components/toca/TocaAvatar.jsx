import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, Square, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ROTEIRO_TOCA = "Oi! Eu sou a Toca, sua anfitriã aqui em Trancoso. Vou te mostrar como é fácil resolver seu corre. Primeiro, é só encontrar o serviço: navegue pelas categorias ou use a busca pra achar exatamente o que você precisa, de uma faxina a um passeio exclusivo. Depois, agende com facilidade: escolha o melhor profissional pelas avaliações, veja os detalhes, marque a data e envie sua solicitação em poucos cliques. E pronto, problema resolvido: o prestador confirma, faz o serviço, e no final você avalia e ajuda nossa comunidade a crescer. Se você é prestador, também é simples: crie seu perfil de graça, receba as propostas e faça seu negócio crescer aqui na vila. Bora resolver?";

export default function TocaAvatar() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const synth = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);

  // Carregar vozes disponíveis
  useEffect(() => {
    if (!synth.current) return;

    const loadVoices = () => {
      const availableVoices = synth.current.getVoices();
      setVoices(availableVoices);

      // Buscar voz feminina em português do Brasil
      const ptVoices = availableVoices.filter(v => v.lang.startsWith('pt'));
      
      // Priorizar vozes com nomes femininos ou "Google português do Brasil"
      const femaleVoice = ptVoices.find(v => 
        v.name.includes('Luciana') || 
        v.name.includes('Maria') || 
        v.name.includes('Francisca') ||
        v.name.includes('Google português do Brasil') ||
        v.name.includes('Microsoft Maria') ||
        v.name.includes('Brazilian Portuguese') ||
        v.name.includes('Vitoria')
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
      } else if (ptVoices.length > 0) {
        setSelectedVoice(ptVoices[0]);
      }
      
      setVoicesLoaded(true);
    };

    loadVoices();

    // Alguns navegadores carregam vozes assincronamente
    if (synth.current.onvoiceschanged !== undefined) {
      synth.current.onvoiceschanged = loadVoices;
    }

    return () => {
      if (synth.current) {
        synth.current.cancel();
      }
    };
  }, []);

  const falar = useCallback(() => {
    if (!synth.current || !selectedVoice) return;

    // Cancelar fala anterior se existir
    synth.current.cancel();

    const newUtterance = new SpeechSynthesisUtterance(ROTEIRO_TOCA);
    newUtterance.voice = selectedVoice;
    newUtterance.lang = 'pt-BR';
    newUtterance.rate = 1.0;
    newUtterance.pitch = 1.1; // Tom mais feminino
    newUtterance.volume = 1.0;

    newUtterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    newUtterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    newUtterance.onpause = () => {
      setIsPaused(true);
    };

    newUtterance.onresume = () => {
      setIsPaused(false);
    };

    newUtterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    synth.current.speak(newUtterance);
  }, [selectedVoice]);

  const handlePlayPause = () => {
    if (!voicesLoaded) return;
    
    if (isSpeaking && !isPaused) {
      synth.current?.pause();
      setIsPaused(true);
    } else if (isPaused) {
      synth.current?.resume();
    } else {
      falar();
    }
  };

  const handleStop = () => {
    synth.current?.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return (
    <div className="rounded-2xl overflow-hidden bg-[#0a1628]/90 backdrop-blur-md border border-white/10 shadow-2xl p-6 md:p-8">
      <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
        {/* Avatar da Toca - figura feminina acolhedora */}
        <div className="relative flex-shrink-0">
          {/* Imagem do avatar - mulher acolhedora estilo tropical */}
          <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-amber-400 shadow-xl relative ${isSpeaking && !isPaused ? 'animate-pulse' : ''}`}>
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
              alt="Toca - Anfitriã Virtual de Trancoso"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Indicador de falando - ondas sonoras */}
          {isSpeaking && !isPaused && (
            <div className="absolute -bottom-2 -right-2 flex gap-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-2 bg-amber-400 rounded-full animate-bounce"
                  style={{
                    height: `${12 + i * 4}px`,
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: '0.6s'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Balão de fala com roteiro */}
        <div className="flex-1 w-full">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/20 relative">
            {/* Triângulo do balão */}
            <div className="absolute -left-2 top-6 w-4 h-4 bg-white/10 border-l border-b border-white/20 transform rotate-45 hidden lg:block" />
            
            <div className="flex items-start gap-3">
              <Volume2 className={`w-5 h-5 text-amber-400 flex-shrink-0 mt-1 ${isSpeaking && !isPaused ? 'animate-pulse' : ''}`} />
              <div className="flex-1">
                <p className="text-white text-sm md:text-base leading-relaxed">
                  {ROTEIRO_TOCA}
                </p>
              </div>
            </div>
          </div>

          {/* Controles de áudio */}
          <div className="flex items-center gap-3 mt-4">
            <Button
              onClick={handlePlayPause}
              disabled={!voicesLoaded}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={isSpeaking && !isPaused ? 'Pausar narração' : 'Ouvir explicação'}
            >
              {isSpeaking && !isPaused ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {isPaused ? 'Continuar' : '▶ Ouça a Toca explicar'}
                </>
              )}
            </Button>

            {isSpeaking && (
              <Button
                onClick={handleStop}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                aria-label="Parar narração"
              >
                <Square className="w-4 h-4" />
                Parar
              </Button>
            )}

            {isSpeaking && !isPaused && (
              <span className="text-amber-300 text-sm font-medium animate-pulse">
                ✨ falando...
              </span>
            )}
          </div>

          {!voicesLoaded && (
            <p className="text-slate-400 text-xs mt-2">
              Carregando vozes...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}