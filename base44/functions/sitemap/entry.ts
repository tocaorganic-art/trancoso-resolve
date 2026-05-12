import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const BASE_URL = 'https://trancosoresolve.com.br';

const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/ServicosCategoria', priority: '0.9', changefreq: 'daily' },
  { path: '/SejaPrestador', priority: '0.8', changefreq: 'weekly' },
  { path: '/ComoFunciona', priority: '0.7', changefreq: 'monthly' },
  { path: '/Seguranca', priority: '0.7', changefreq: 'monthly' },
  { path: '/Planos', priority: '0.8', changefreq: 'weekly' },
  { path: '/Manual', priority: '0.5', changefreq: 'monthly' },
  { path: '/PoliticaPrivacidade', priority: '0.3', changefreq: 'yearly' },
];

// Landing pages SEO por categoria de serviço
const servicoSlugs = [
  'limpeza-trancoso',
  'eletricista-trancoso',
  'encanador-trancoso',
  'jardinagem-trancoso',
  'cozinheiro-trancoso',
  'pedreiro-trancoso',
  'pintor-trancoso',
  'baba-trancoso',
  'garcom-trancoso',
];

const categoryOccupations = [
  'Limpeza', 'Eletricista', 'Encanador', 'Jardinagem',
  'Cozinheiro', 'Pedreiro', 'Pintor', 'Babá', 'Garçom'
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
  try {
    const base44 = createClientFromRequest(req);

    const [providers, services] = await Promise.all([
      base44.asServiceRole.entities.ServiceProvider.list('-updated_date', 200),
      base44.asServiceRole.entities.ServiceListing.filter({ active: true }, '-updated_date', 500),
    ]);

    const today = new Date().toISOString().split('T')[0];
    const urls = [];

    // Páginas estáticas
    for (const page of staticPages) {
      urls.push(`
  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${today}</lastmod>
  </url>`);
    }

    // Landing pages SEO por slug (alta prioridade - conteúdo evergreen)
    for (const slug of servicoSlugs) {
      urls.push(`
  <url>
    <loc>${BASE_URL}/ServicoLanding?slug=${escapeXml(slug)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
    <lastmod>${today}</lastmod>
  </url>`);
    }

    // Páginas de categoria por ocupação
    for (const occ of categoryOccupations) {
      urls.push(`
  <url>
    <loc>${BASE_URL}/ServicosCategoria?cat=${escapeXml(encodeURIComponent(occ))}</loc>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
    <lastmod>${today}</lastmod>
  </url>`);
    }

    // Categorias únicas de ServiceListing (pode ter outras além das ocupações)
    const extraCats = [...new Set((services || []).map(s => s.category).filter(Boolean))]
      .filter(c => !categoryOccupations.includes(c));
    for (const cat of extraCats) {
      urls.push(`
  <url>
    <loc>${BASE_URL}/ServicosCategoria?cat=${escapeXml(encodeURIComponent(cat))}</loc>
    <changefreq>daily</changefreq>
    <priority>0.80</priority>
    <lastmod>${today}</lastmod>
  </url>`);
    }

    // Perfis de prestadores verificados (maior prioridade para verificados)
    for (const provider of (providers || [])) {
      if (provider.status_verificacao === 'reprovado') continue;
      const priority = provider.verified ? '0.85' : '0.75';
      urls.push(`
  <url>
    <loc>${BASE_URL}/PrestadorPerfil?id=${escapeXml(provider.id)}</loc>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
    <lastmod>${formatDate(provider.updated_date)}</lastmod>
  </url>`);
    }

    // Páginas de serviços individuais
    for (const service of (services || [])) {
      urls.push(`
  <url>
    <loc>${BASE_URL}/ServicoDetalhes?id=${escapeXml(service.id)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.70</priority>
    <lastmod>${formatDate(service.updated_date)}</lastmod>
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
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch (error) {
    console.error('Sitemap error:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
});