import { base44 } from '@/api/base44Client';

async function fetchProviders({ filters = {}, sort = '-rating', limit = 50 } = {}) {
  const response = await base44.functions.invoke('listPublicProviders', {
    id: typeof filters.id === 'string' ? filters.id : undefined,
    occupation: typeof filters.occupation === 'string' ? filters.occupation : undefined,
    verified: typeof filters.verified === 'boolean' ? filters.verified : undefined,
    sort,
    limit,
  });
  let providers = response.data?.providers || [];

  if (filters.availability?.$ne) {
    providers = providers.filter(provider => provider.availability !== filters.availability.$ne);
  } else if (typeof filters.availability === 'string') {
    providers = providers.filter(provider => provider.availability === filters.availability);
  }

  return providers;
}

export const publicProviders = {
  list(sort = '-rating', limit = 50) {
    return fetchProviders({ sort, limit });
  },
  filter(filters = {}, sort = '-rating', limit = 50) {
    return fetchProviders({ filters, sort, limit });
  },
};
