import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

/* global __APP_VERSION__ */
export const APP_VERSION = typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : 'dev';

// Rota atual da SPA no momento da medição (contexto técnico mínimo, sem PII).
const getRoute = () => (typeof window !== 'undefined' ? window.location.pathname : '');

// Params enviados ao GA4 junto do evento web_vitals.
export function buildVitalsParams(name, value, id, rating, route = getRoute()) {
  return {
    metric_name: name,
    metric_value: Math.round(value),
    metric_id: id,
    metric_rating: rating,
    route,
    app_version: APP_VERSION,
  };
}

function reportMetric(metric) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', 'web_vitals', buildVitalsParams(
    metric.name,
    metric.value,
    metric.id,
    metric.rating,
  ));
}

// Core Web Vitals completos (LCP, CLS, INP, FCP, TTFB) via lib `web-vitals`.
export function reportWebVitals() {
  try {
    onLCP(reportMetric);
    onCLS(reportMetric);
    onINP(reportMetric);
    onFCP(reportMetric);
    onTTFB(reportMetric);
  } catch (e) {
    console.debug('Web Vitals measurement not supported', e);
  }
}

export function measurePageLoad() {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const connectTime = perfData.responseEnd - perfData.requestStart;
      const renderTime = perfData.domComplete - perfData.domLoading;

      if (window.gtag) {
        window.gtag('event', 'page_load_performance', {
          page_load_time: pageLoadTime,
          connect_time: connectTime,
          render_time: renderTime,
          route: getRoute(),
          app_version: APP_VERSION,
        });
      }
    }, 0);
  });
}
