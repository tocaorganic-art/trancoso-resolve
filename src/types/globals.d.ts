// Global type declarations for window extensions and missing modules

interface Window {
  gtag?: (...args: any[]) => void;
  logErrorToService?: (...args: any[]) => void;
  webkitAudioContext?: typeof AudioContext;
  google?: any;
  fbq?: (...args: any[]) => void;
}

interface Navigator {
  connection?: any;
  mozConnection?: any;
  webkitConnection?: any;
}

interface Performance {
  memory?: any;
}

interface Element {
  content?: string;
  name?: string;
  href?: string;
  rel?: string;
  loading?: string;
}

interface PerformanceEntry {
  hadRecentInput?: boolean;
  value?: number;
  responseStart?: number;
  requestStart?: number;
  loadEventEnd?: number;
  fetchStart?: number;
  domContentLoadedEventStart?: number;
  transferSize?: number;
  initiatorType?: string;
}

interface ImportMeta {
  env: Record<string, string | undefined>;
}

declare module "leaflet" {
  const L: any;
  export default L;
  export const Icon: any;
  export const Marker: any;
  export const TileLayer: any;
  export const Map: any;
  export const map: any;
  export const latLng: any;
  export const latLngBounds: any;
  export const divIcon: any;
  export const popup: any;
  export const Control: any;
}

declare module "react-leaflet" {
  export const MapContainer: any;
  export const TileLayer: any;
  export const Marker: any;
  export const Popup: any;
  export const useMap: any;
  export const useMapEvents: any;
  export const Circle: any;
  export const Polyline: any;
  export const Polygon: any;
  export const LayersControl: any;
}

declare module "@/functions/logPerformance" {
  export function logPerformance(...args: any[]): any;
}
declare module "@/functions/cancelarAssinatura" {
  export function cancelarAssinatura(...args: any[]): any;
}
declare module "@/functions/criarTrialPrestador" {
  export function criarTrialPrestador(...args: any[]): any;
}
declare module "@/functions/callClaude" {
  export function callClaude(...args: any[]): any;
}
declare module "@/functions/chamarPrestador" {
  export function chamarPrestador(...args: any[]): any;
}
declare module "@/functions/verificarAntecedentes" {
  export function verificarAntecedentes(...args: any[]): any;
}
