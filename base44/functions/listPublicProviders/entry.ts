import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const MAX_RESULTS = 200;
const ALLOWED_SORTS = new Set(['-rating', 'rating', '-created_date', 'created_date', 'full_name']);

function toPublicProvider(provider) {
  return {
    id: provider.id,
    created_date: provider.created_date,
    full_name: provider.full_name,
    photo_url: provider.photo_url,
    cover_photo_url: provider.cover_photo_url,
    occupation: provider.occupation,
    tipo_pessoa: provider.tipo_pessoa,
    tem_ponto_fisico_em_trancoso: provider.tem_ponto_fisico_em_trancoso,
    nome_fantasia: provider.nome_fantasia,
    bio: provider.bio,
    experience_years: provider.experience_years,
    specialties: provider.specialties,
    price_range: provider.price_range,
    rates: provider.rates,
    location: provider.location ? {
      neighborhood: provider.location.neighborhood,
      city: provider.location.city,
      state: provider.location.state,
      coverage_radius_km: provider.location.coverage_radius_km,
    } : null,
    availability: provider.availability,
    rating: provider.rating,
    total_reviews: provider.total_reviews,
    verified: provider.verified,
    portfolio_images: provider.portfolio_images,
    payment_methods: provider.payment_methods,
  };
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const limit = Math.min(MAX_RESULTS, Math.max(1, Number(body.limit) || 50));
    const sort = ALLOWED_SORTS.has(body.sort) ? body.sort : '-rating';
    const filters = {};

    if (typeof body.id === 'string') filters.id = body.id;
    if (typeof body.occupation === 'string') filters.occupation = body.occupation;
    filters.verified = typeof body.verified === 'boolean' ? body.verified : true;

    const providers = await base44.asServiceRole.entities.ServiceProvider.filter(filters, sort, limit);
    return Response.json({ providers: (providers || []).map(toPublicProvider) }, {
      headers: { 'Cache-Control': 'public, max-age=30, s-maxage=60' },
    });
  } catch (error) {
    console.error('[listPublicProviders]', error?.message || error);
    return Response.json({ error: 'Unable to load providers' }, { status: 500 });
  }
});
