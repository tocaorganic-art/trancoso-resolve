import { useEffect } from 'react';

const BASE_URL = 'https://www.trancosoresolve.com.br';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;

export default function MetaTags({
  title = 'Trancoso Resolve — Serviços Locais em Trancoso e Costa do Descobrimento',
  description = 'Encontre profissionais verificados em Trancoso: diaristas, eletricistas, piscineiros e mais. Orçamento grátis.',
  image = DEFAULT_IMAGE,
  url = typeof window !== 'undefined' ? window.location.href : BASE_URL,
  type = 'website',
}) {
  useEffect(() => {
    const fullTitle = title.includes('Trancoso Resolve') ? title : `${title} | Trancoso Resolve`;

    const prev = {
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.content,
      ogTitle: document.querySelector('meta[property="og:title"]')?.content,
      ogDesc: document.querySelector('meta[property="og:description"]')?.content,
      ogImage: document.querySelector('meta[property="og:image"]')?.content,
      ogUrl: document.querySelector('meta[property="og:url"]')?.content,
      twTitle: document.querySelector('meta[name="twitter:title"]')?.content,
      twDesc: document.querySelector('meta[name="twitter:description"]')?.content,
      twImage: document.querySelector('meta[name="twitter:image"]')?.content,
    };

    document.title = fullTitle;
    setMetaAttr('name', 'description', description);
    setMetaAttr('property', 'og:title', fullTitle);
    setMetaAttr('property', 'og:description', description);
    setMetaAttr('property', 'og:image', image);
    setMetaAttr('property', 'og:url', url);
    setMetaAttr('property', 'og:type', type);
    setMetaAttr('name', 'twitter:title', fullTitle);
    setMetaAttr('name', 'twitter:description', description);
    setMetaAttr('name', 'twitter:image', image);

    let canonical = document.querySelector('link[rel="canonical"]');
    const canonWasNew = !canonical;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    const prevCanonical = canonical.href;
    canonical.href = url;

    return () => {
      document.title = prev.title;
      if (prev.desc !== undefined) setMetaAttr('name', 'description', prev.desc);
      if (prev.ogTitle !== undefined) setMetaAttr('property', 'og:title', prev.ogTitle);
      if (prev.ogDesc !== undefined) setMetaAttr('property', 'og:description', prev.ogDesc);
      if (prev.ogImage !== undefined) setMetaAttr('property', 'og:image', prev.ogImage);
      if (prev.ogUrl !== undefined) setMetaAttr('property', 'og:url', prev.ogUrl);
      if (prev.twTitle !== undefined) setMetaAttr('name', 'twitter:title', prev.twTitle);
      if (prev.twDesc !== undefined) setMetaAttr('name', 'twitter:description', prev.twDesc);
      if (prev.twImage !== undefined) setMetaAttr('name', 'twitter:image', prev.twImage);
      if (canonWasNew) canonical.remove();
      else canonical.href = prevCanonical;
    };
  }, [title, description, image, url, type]);

  return null;
}

function setMetaAttr(attr, name, content) {
  const selector = attr === 'property' ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}
