import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const BASE_URL = 'https://trancosoresolve.com.br';

const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/ServicosCategoria', priority: '0.9', changefreq: 'daily' },
  { path: '/SejaPrestador', priority: '0.8', changefreq: 'weekly' },
  { path: '/ComoFunciona', priority: '0.7', changefreq: 'monthly' },
  { path: '/Seguranca', priority: '0.6', changefreq: 'monthly' },
  { path: '/Planos', priority: '0.7', changefreq: 'weekly' },
  { path: '/Manual', priority: '0.5', changefreq: 'monthly' },
  { path: '/PoliticaPrivacidade', priority: '0.3', changefreq: 'yearly' },
];

function formatDate(dateStr) {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  return new Date(dateStr).toISOString().split('T')[0];
}

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const [providers, services] = await Promise.all([
    base44.asServiceRole.entities.ServiceProvider.list('-updated_date', 200),
    base44.asServiceRole.entities.ServiceListing.filter({ active: true }, '-updated_date', 500),
  ]);

  const urls = [];

  // Páginas estáticas
  for (const page of staticPages) {
    urls.push(`
  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`);
  }

  // Perfis de prestadores
  for (const provider of (providers || [])) {
    urls.push(`
  <url>
    <loc>${BASE_URL}/PrestadorPerfil?id=${escapeXml(provider.id)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${formatDate(provider.updated_date)}</lastmod>
  </url>`);
  }

  // Páginas de serviços individuais
  for (const service of (services || [])) {
    urls.push(`
  <url>
    <loc>${BASE_URL}/ServicoDetalhes?id=${escapeXml(service.id)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <lastmod>${formatDate(service.updated_date)}</lastmod>
  </url>`);
  }

  // Categorias únicas
  const categories = [...new Set((services || []).map(s => s.category).filter(Boolean))];
  for (const cat of categories) {
    urls.push(`
  <url>
    <loc>${BASE_URL}/ServicosCategoria?cat=${escapeXml(encodeURIComponent(cat))}</loc>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
});