import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const FOUNDER_LIMIT = 50;

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const active = await base44.asServiceRole.entities.Subscription.filter({
      plan: 'lancamento',
      status: 'active',
    });
    const trials = await base44.asServiceRole.entities.Subscription.filter({
      plan: 'lancamento',
      status: 'trial',
    });
    const taken = Math.min(FOUNDER_LIMIT, (active?.length || 0) + (trials?.length || 0));

    return Response.json(
      { limit: FOUNDER_LIMIT, taken, remaining: FOUNDER_LIMIT - taken },
      { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=60' } },
    );
  } catch (error) {
    console.error('[getFounderStats]', error?.message || error);
    return Response.json({ error: 'Unable to load founder availability' }, { status: 500 });
  }
});
