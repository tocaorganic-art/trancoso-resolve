import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, X, RotateCcw, Check, Loader2, Lightbulb, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * LiveCameraCapture
 * Captura foto de corpo inteiro ao vivo (sem acesso à galeria).
 * Props:
 *  - onCapture(file): chamado com o File capturado
 *  - onClose(): fechar o modal
 */
export default function LiveCameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [phase, setPhase] = useState('instructions'); // instructions | camera | preview | uploading
  const [countdown, setCountdown] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [facingMode, setFacingMode] = useState('user');
  const [cameraError, setCameraError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async (mode = facingMode) => {
    stopStream();
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1080 }, height: { ideal: 1920 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setPhase('camera');
    } catch (err) {
      setCameraError('Não foi possível acessar a câmera. Verifique as permissões do navegador.');
    }
  }, [facingMode, stopStream]);

  useEffect(() => {
    return () => stopStream();
  }, [stopStream]);

  const flipCamera = () => {
    const next = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(next);
    startCamera(next);
  };

  const startCountdown = () => {
    setCountdown(3);
    let c = 3;
    const interval = setInterval(() => {
      c -= 1;
      if (c <= 0) {
        clearInterval(interval);
        setCountdown(null);
        capturePhoto();
      } else {
        setCountdown(c);
      }
    }, 1000);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    // Mirror se câmera frontal
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setPreviewUrl(dataUrl);
    stopStream();
    setPhase('preview');
  };

  const retake = () => {
    setPreviewUrl(null);
    startCamera(facingMode);
  };

  const confirmCapture = async () => {
    setPhase('uploading');
    // Converter dataUrl para File
    const res = await fetch(previewUrl);
    const blob = await res.blob();
    const file = new File([blob], `corpo_inteiro_${Date.now()}.jpg`, { type: 'image/jpeg' });
    onCapture(file);
  };

  // Verificação simples de ambiente escuro analisando canvas em tempo real
  useEffect(() => {
    if (phase !== 'camera') return;
    const interval = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) return;
      canvas.width = 80;
      canvas.height = 80;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, 80, 80);
      const data = ctx.getImageData(0, 0, 80, 80).data;
      let brightness = 0;
      for (let i = 0; i < data.length; i += 4) {
        brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
      }
      brightness /= (80 * 80);
      if (brightness < 50) setFeedback('⚠️ Muito escuro — busque um local com mais luz');
      else if (brightness > 220) setFeedback('⚠️ Excesso de luz — evite contraluz');
      else setFeedback(null);
    }, 1500);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/80 text-white">
        <span className="font-semibold text-sm">Foto de Corpo Inteiro</span>
        <button onClick={() => { stopStream(); onClose(); }} className="p-2 rounded-full hover:bg-white/10">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Instructions */}
      {phase === 'instructions' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-white">
          <div className="w-24 h-40 border-4 border-white/50 rounded-xl mb-6 flex items-center justify-center">
            <div className="text-5xl">🧍</div>
          </div>
          <h2 className="text-xl font-bold mb-4 text-center">Posicione-se para a foto</h2>
          <ul className="space-y-3 text-sm text-white/80 mb-8 w-full max-w-xs">
            <li className="flex items-start gap-2"><Lightbulb className="w-4 h-4 shrink-0 text-yellow-400 mt-0.5" /> Busque boa iluminação natural — evite sombras fortes</li>
            <li className="flex items-start gap-2"><span className="shrink-0">🧍</span> Fique de pé, de frente, com o corpo inteiro visível</li>
            <li className="flex items-start gap-2"><span className="shrink-0">🔲</span> Prefira um fundo neutro e liso (parede branca ou bege)</li>
            <li className="flex items-start gap-2"><span className="shrink-0">📵</span> Imagens da galeria não são aceitas — somente captura ao vivo</li>
          </ul>
          <Button className="w-full max-w-xs" onClick={() => startCamera()}>
            <Camera className="w-4 h-4 mr-2" /> Abrir câmera
          </Button>
        </div>
      )}

      {/* Camera */}
      {phase === 'camera' && (
        <div className="flex-1 relative overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
          />

          {/* Overlay guia corpo inteiro */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="border-4 border-white/60 rounded-2xl"
              style={{ width: '55%', height: '85%', boxShadow: '0 0 0 9999px rgba(0,0,0,0.35)' }}
            />
          </div>
          <div className="absolute top-4 left-0 right-0 text-center">
            <span className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">
              Enquadre seu corpo inteiro dentro do guia
            </span>
          </div>

          {/* Feedback de brilho */}
          {feedback && (
            <div className="absolute top-14 left-0 right-0 flex justify-center">
              <span className="bg-yellow-500/90 text-black text-xs px-3 py-1.5 rounded-full font-medium">{feedback}</span>
            </div>
          )}

          {/* Countdown */}
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-white font-bold drop-shadow-lg" style={{ fontSize: '6rem', lineHeight: 1 }}>{countdown}</span>
            </div>
          )}

          {/* Controles */}
          <div className="absolute bottom-0 left-0 right-0 pb-8 flex items-center justify-center gap-8 bg-gradient-to-t from-black/70 to-transparent pt-6">
            <button onClick={flipCamera} className="p-3 rounded-full bg-white/20 text-white">
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={startCountdown}
              disabled={countdown !== null}
              className="w-16 h-16 rounded-full bg-white border-4 border-white/50 flex items-center justify-center disabled:opacity-50"
            >
              <span className="w-12 h-12 rounded-full bg-white block" />
            </button>
            <div className="w-11 h-11" /> {/* spacer */}
          </div>
        </div>
      )}

      {/* Camera error */}
      {cameraError && phase === 'instructions' && (
        <div className="absolute inset-x-0 bottom-20 px-6">
          <div className="bg-red-600 text-white p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{cameraError}</p>
          </div>
        </div>
      )}

      {/* Preview */}
      {phase === 'preview' && previewUrl && (
        <div className="flex-1 relative flex flex-col">
          <img src={previewUrl} alt="Preview" className="flex-1 object-contain w-full bg-black" />
          <div className="flex gap-4 p-6 bg-black/80 justify-center">
            <Button variant="outline" className="text-white border-white/40 hover:bg-white/10 gap-2" onClick={retake}>
              <RotateCcw className="w-4 h-4" /> Refazer
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 gap-2" onClick={confirmCapture}>
              <Check className="w-4 h-4" /> Usar esta foto
            </Button>
          </div>
        </div>
      )}

      {/* Uploading */}
      {phase === 'uploading' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white">
            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3" />
            <p className="text-sm">Enviando foto...</p>
          </div>
        </div>
      )}

      {/* Canvas oculto para captura */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}