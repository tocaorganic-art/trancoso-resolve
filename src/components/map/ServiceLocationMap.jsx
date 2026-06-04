import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LocateFixed, MapPin } from 'lucide-react';

// Token público do Mapbox - substitua pelo seu em mapbox.com (gratuito)
const MAPBOX_TOKEN = "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";

const trancosoDefault = [-39.0931, -16.5925]; // [lng, lat] para Mapbox
const landmarks = [
  { id: 1, name: "Quadrado",          coords: [-39.0931, -16.5925] },
  { id: 2, name: "Praia dos Nativos", coords: [-39.0881, -16.5931] },
  { id: 3, name: "Praia dos Coqueiros", coords: [-39.0911, -16.5966] },
];

function loadMapboxScript() {
  return new Promise((resolve) => {
    if (window.mapboxgl) { resolve(); return; }

    if (!document.getElementById('mapbox-css')) {
      const link = document.createElement('link');
      link.id = 'mapbox-css';
      link.rel = 'stylesheet';
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css';
      document.head.appendChild(link);
    }

    if (document.getElementById('mapbox-js')) {
      const check = setInterval(() => {
        if (window.mapboxgl) { clearInterval(check); resolve(); }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.id = 'mapbox-js';
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js';
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

export default function ServiceLocationMap({ initialPosition, onLocationSelect }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const initialCoords = initialPosition
    ? [initialPosition[1], initialPosition[0]]
    : trancosoDefault;

  const [coords, setCoords] = useState(initialCoords);

  useEffect(() => {
    loadMapboxScript().then(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded || !mapRef.current || mapInstanceRef.current) return;

    window.mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new window.mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12', // Satélite com ruas
      center: coords,
      zoom: 15,
      pitch: 45,    // Inclinação 3D
      bearing: -17,
      antialias: true,
    });

    mapInstanceRef.current = map;

    // Controles de navegação e rotação
    map.addControl(new window.mapboxgl.NavigationControl(), 'top-right');

    // Marcador arrastável
    const marker = new window.mapboxgl.Marker({ draggable: true, color: '#3b82f6' })
      .setLngLat(coords)
      .addTo(map);

    markerRef.current = marker;

    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      const newCoords = [lngLat.lng, lngLat.lat];
      setCoords(newCoords);
      if (onLocationSelect) onLocationSelect([lngLat.lat, lngLat.lng]);
    });

    map.on('click', (e) => {
      const newCoords = [e.lngLat.lng, e.lngLat.lat];
      marker.setLngLat(newCoords);
      setCoords(newCoords);
      if (onLocationSelect) onLocationSelect([e.lngLat.lat, e.lngLat.lng]);
    });

    // Edifícios 3D após carregamento
    map.on('load', () => {
      map.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 14,
        paint: {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': ['get', 'min_height'],
          'fill-extrusion-opacity': 0.7,
        },
      });
    });

    return () => { map.remove(); mapInstanceRef.current = null; };
  }, [loaded]);

  const flyTo = (newCoords) => {
    setCoords(newCoords);
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.flyTo({ center: newCoords, zoom: 16, pitch: 45, speed: 1.2 });
      markerRef.current.setLngLat(newCoords);
      if (onLocationSelect) onLocationSelect([newCoords[1], newCoords[0]]);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) { alert("Geolocalização não suportada."); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => flyTo([pos.coords.longitude, pos.coords.latitude]),
      () => alert("Não foi possível obter sua localização.")
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="h-[350px] w-full relative bg-slate-800">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm z-10">
              Carregando mapa 3D…
            </div>
          )}
          <div ref={mapRef} className="h-full w-full" />
        </div>
        <div className="p-4 bg-slate-50 border-t space-y-3">
          <p className="text-sm text-slate-600">Clique no mapa para definir sua localização principal ou use os atalhos abaixo.</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleUseCurrentLocation}>
              <LocateFixed className="w-4 h-4 mr-2" />
              Usar minha localização
            </Button>
            {landmarks.map(lm => (
              <Button key={lm.id} variant="outline" size="sm" onClick={() => flyTo(lm.coords)}>
                <MapPin className="w-4 h-4 mr-2" />
                {lm.name}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}