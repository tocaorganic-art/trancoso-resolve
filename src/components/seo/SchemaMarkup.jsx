import { useEffect } from 'react';

/**
 * Injeta um bloco JSON-LD no <head> e o remove ao desmontar.
 * Ideal para schema markup dinâmico por página (WebPage, Service, FAQPage, etc.).
 */
export function SchemaMarkup({ schema, id = 'schema-markup' }) {
  useEffect(() => {
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, [schema, id]);

  return null;
}
