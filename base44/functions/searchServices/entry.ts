import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const categoryAliases = {
  'faxina': 'Limpeza',
  'faxina-domestica': 'Limpeza',
  'diarista': 'Limpeza',
  'limpeza': 'Limpeza',
  'eletricista': 'Eletricista',
  'encanador': 'Encanador',
  'encanação': 'Encanador',
  'jardinagem': 'Jardinagem',
  'jardineiro': 'Jardinagem',
  'cozinheiro': 'Cozinheiro',
  'chef': 'Cozinheiro',
  'gastronomia': 'Cozinheiro',
  'babá': 'Babá',
  'nanny': 'Babá',
  'pedreiro': 'Pedreiro',
  'pedraria': 'Pedreiro',
  'pintor': 'Pintor',
  'pintura': 'Pintor',
  'garçom': 'Garçom',
  'garcom': 'Garçom',
  'passador': 'Outro',
};

function normalizeCategory(query) {
  const normalized = query.toLowerCase().trim();
  return categoryAliases[normalized] || normalized;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { query, limit = 10, offset = 0 } = body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return Response.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const normalizedCategory = normalizeCategory(query);
    
    // Busca serviços pela categoria normalizada
    const services = await base44.entities.ServiceListing.filter(
      {
        active: true,
        category: normalizedCategory
      },
      '-created_date',
      limit
    );

    if (!services || services.length === 0) {
      return Response.json({
        success: true,
        query: query,
        normalized_category: normalizedCategory,
        results: [],
        total: 0
      });
    }

    return Response.json({
      success: true,
      query: query,
      normalized_category: normalizedCategory,
      results: services,
      total: services.length
    });

  } catch (error) {
    console.error('[searchServices] Erro:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});