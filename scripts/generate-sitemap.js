import { writeFileSync } from 'fs';

const BASE_URL = 'https://www.trancosoresolve.com.br';
const TODAY = new Date().toISOString().split('T')[0];

const routes = [
  // Páginas principais
  { path: '/',                priority: '1.0', changefreq: 'weekly' },
  { path: '/ServicosCategoria', priority: '0.9', changefreq: 'weekly' },
  { path: '/SejaPrestador',   priority: '0.9', changefreq: 'monthly' },
  { path: '/ComoFunciona',    priority: '0.8', changefreq: 'monthly' },
  { path: '/Planos',          priority: '0.8', changefreq: 'monthly' },
  { path: '/About',           priority: '0.7', changefreq: 'monthly' },
  { path: '/Contact',         priority: '0.7', changefreq: 'monthly' },
  { path: '/cadastro',        priority: '0.7', changefreq: 'monthly' },

  // Páginas legais
  { path: '/TermosDeServico',         priority: '0.4', changefreq: 'yearly' },
  { path: '/PoliticaPrivacidade',     priority: '0.4', changefreq: 'yearly' },
  { path: '/PoliticaDevolucoes',      priority: '0.4', changefreq: 'yearly' },

  // Hubs de destino (rotas canônicas)
  { path: '/trancoso',        priority: '0.9', changefreq: 'monthly' },
  { path: '/arraial-dajuda',  priority: '0.8', changefreq: 'monthly' },
  { path: '/porto-seguro',    priority: '0.8', changefreq: 'monthly' },
  { path: '/caraiva',         priority: '0.8', changefreq: 'monthly' },

  // Serviços em Trancoso
  { path: '/servicos/diarista-trancoso',    priority: '0.9', changefreq: 'monthly' },
  { path: '/servicos/eletricista-trancoso', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicos/piscineiro-trancoso',  priority: '0.8', changefreq: 'monthly' },
  { path: '/servicos/pedreiro-trancoso',    priority: '0.8', changefreq: 'monthly' },
  { path: '/servicos/pintor-trancoso',      priority: '0.8', changefreq: 'monthly' },
  { path: '/servicos/jardineiro-trancoso',  priority: '0.8', changefreq: 'monthly' },
  { path: '/servicos/encanador-trancoso',   priority: '0.8', changefreq: 'monthly' },
  { path: '/servicos/chef-trancoso',        priority: '0.8', changefreq: 'monthly' },
  { path: '/servicos/seguranca-trancoso',   priority: '0.7', changefreq: 'monthly' },
  { path: '/servicos/motorista-trancoso',   priority: '0.7', changefreq: 'monthly' },

  // Bairros de Trancoso
  { path: '/servicos/quadrado-trancoso',    priority: '0.8', changefreq: 'monthly' },
  { path: '/servicos/rio-verde-trancoso',   priority: '0.7', changefreq: 'monthly' },
  { path: '/servicos/pitinga-trancoso',     priority: '0.7', changefreq: 'monthly' },

  // Serviços em Porto Seguro
  { path: '/servicos/diarista-porto-seguro',    priority: '0.8', changefreq: 'monthly' },
  { path: '/servicos/eletricista-porto-seguro', priority: '0.8', changefreq: 'monthly' },
  { path: '/servicos/piscineiro-porto-seguro',  priority: '0.7', changefreq: 'monthly' },
  { path: '/servicos/cozinheiro-porto-seguro',  priority: '0.7', changefreq: 'monthly' },
  { path: '/servicos/jardineiro-porto-seguro',  priority: '0.7', changefreq: 'monthly' },
  { path: '/servicos/pedreiro-porto-seguro',    priority: '0.7', changefreq: 'monthly' },

  // Serviços em Caraíva
  { path: '/servicos/diarista-caraiva',    priority: '0.8', changefreq: 'monthly' },
  { path: '/servicos/eletricista-caraiva', priority: '0.8', changefreq: 'monthly' },
  { path: '/servicos/piscineiro-caraiva',  priority: '0.7', changefreq: 'monthly' },
  { path: '/servicos/cozinheiro-caraiva',  priority: '0.7', changefreq: 'monthly' },
  { path: '/servicos/jardineiro-caraiva',  priority: '0.7', changefreq: 'monthly' },
  { path: '/servicos/pedreiro-caraiva',    priority: '0.7', changefreq: 'monthly' },

  // Páginas categoria × destino (dinâmicas via ServicoDestino)
  { path: '/trancoso/eletricista',  priority: '0.7', changefreq: 'monthly' },
  { path: '/trancoso/diarista',     priority: '0.7', changefreq: 'monthly' },
  { path: '/trancoso/encanador',    priority: '0.7', changefreq: 'monthly' },
  { path: '/trancoso/jardineiro',   priority: '0.7', changefreq: 'monthly' },
  { path: '/trancoso/chef',         priority: '0.7', changefreq: 'monthly' },
  { path: '/trancoso/piscineiro',   priority: '0.7', changefreq: 'monthly' },
  { path: '/arraial-dajuda/eletricista',  priority: '0.6', changefreq: 'monthly' },
  { path: '/arraial-dajuda/diarista',     priority: '0.6', changefreq: 'monthly' },
  { path: '/arraial-dajuda/encanador',    priority: '0.6', changefreq: 'monthly' },
  { path: '/arraial-dajuda/jardineiro',   priority: '0.6', changefreq: 'monthly' },
  { path: '/arraial-dajuda/chef',         priority: '0.6', changefreq: 'monthly' },
  { path: '/porto-seguro/eletricista',    priority: '0.6', changefreq: 'monthly' },
  { path: '/porto-seguro/diarista',       priority: '0.6', changefreq: 'monthly' },
  { path: '/porto-seguro/encanador',      priority: '0.6', changefreq: 'monthly' },
  { path: '/porto-seguro/jardineiro',     priority: '0.6', changefreq: 'monthly' },
  { path: '/porto-seguro/chef',           priority: '0.6', changefreq: 'monthly' },
  { path: '/caraiva/eletricista',   priority: '0.6', changefreq: 'monthly' },
  { path: '/caraiva/diarista',      priority: '0.6', changefreq: 'monthly' },
  { path: '/caraiva/encanador',     priority: '0.6', changefreq: 'monthly' },
  { path: '/caraiva/jardineiro',    priority: '0.6', changefreq: 'monthly' },
  { path: '/caraiva/chef',          priority: '0.6', changefreq: 'monthly' },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(r => `  <url>
    <loc>${BASE_URL}${r.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

writeFileSync('public/sitemap.xml', xml);
console.log(`sitemap.xml gerado com ${routes.length} URLs em public/sitemap.xml`);
