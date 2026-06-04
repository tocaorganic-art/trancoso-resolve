import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LocateFixed, MapPin } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = "SUA_CHAVE_API_AQUI"; // Substitua pela sua chave do Google Cloud Console

const trancosoDefault = { lat: -16.5925, lng: -39.0931 };

const landmarks = [
  { id: 1, name: "Quadrado", position: { lat: -16.5925, lng: -39.0931 } },
  { id: 2, name: "Praia dos Nativos", position: { lat: -16.5931, lng: -39.0881 } },
  { id: 3, name: "Praia dos Coqueiros", position: { lat: -16.5966, lng: -39.0911 } }
];

function loadGoogleMapsScript() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }
    if (document.getElementById('google-maps-loader')) {
      // Script já sendo carregado, aguarda
      const check = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(check);
          resolve();
        }
      }, 100);
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-maps-loader';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function ServiceLocationMap({ initialPosition, onLocationSelect }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  const initialLatLng = initialPosition
    ? { lat: initialPosition[0], lng: initialPosition[1] }
    : trancosoDefault;

  const [position, setPosition] = useState(initialLatLng);

  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => setLoaded(true))
      .catch(() => setError("Erro ao carregar o Google Maps. Verifique a chave de API."));
  }, []);

  useEffect(() => {
    if (!loaded || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: position,
      zoom: 16,
      mapTypeId: 'hybrid', // Satélite com rótulos
      tilt: 45,            // Visão 3D inclinada
      heading: 0,
      mapId: undefined,
      mapTypeControl: true,
      mapTypeControlOptions: {
        mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain']
      },
      fullscreenControl: true,
      streetViewControl: true,
      zoomControl: true,
    });

    mapInstanceRef.current = map;

    // Marcador arrastável
    const marker = new window.google.maps.Marker({
      position,
      map,
      draggable: true,
      title: 'Localização selecionada',
      animation: window.google.maps.Animation.DROP,
    });
    markerRef.current = marker;

    // Clique no mapa move o marcador
    map.addListener('click', (e) => {
      const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      marker.setPosition(newPos);
      setPosition(newPos);
      if (onLocationSelect) onLocationSelect([newPos.lat, newPos.lng]);
    });

    // Arrastar marcador
    marker.addListener('dragend', () => {
      const newPos = marker.getPosition();
      const pos = { lat: newPos.lat(), lng: newPos.lng() };
      setPosition(pos);
      if (onLocationSelect) onLocationSelect([pos.lat, pos.lng]);
    });
  }, [loaded]);

  const flyTo = (pos) => {
    setPosition(pos);
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.panTo(pos);
      mapInstanceRef.current.setZoom(17);
      markerRef.current.setPosition(pos);
      if (onLocationSelect) onLocationSelect([pos.lat, pos.lng]);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não é suportada por este navegador.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => flyTo({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert("Não foi possível obter sua localização. Verifique as permissões do navegador.")
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="h-[350px] w-full relative">
          {error ? (
            <div className="flex items-center justify-center h-full bg-slate-100 text-slate-500 text-sm p-4 text-center">
              {error}
            </div>
          ) : !loaded ? (
            <div className="flex items-center justify-center h-full bg-slate-100 text-slate-500 text-sm">
              Carregando mapa 3D...
            </div>
          ) : null}
          <div ref={mapRef} className="h-full w-full" />
        </div>
        <div className="p-4 bg-slate-50 border-t space-y-3">
          <p className="text-sm text-slate-600">Clique no mapa para definir sua localização principal ou use os atalhos abaixo.</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleUseCurrentLocation}>
              <LocateFixed className="w-4 h-4 mr-2" />
              Usar minha localização
            </Button>
            {landmarks.map(landmark => (
              <Button
                key={landmark.id}
                variant="outline"
                size="sm"
                onClick={() => flyTo(landmark.position)}
              >
                <MapPin className="w-4 h-4 mr-2" />
                {landmark.name}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}