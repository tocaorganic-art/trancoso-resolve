Deno.serve(() => Response.json(
  {
    error: 'Endpoint desativado',
    message: 'Use createSubscriptionCheckout com um plano permitido.',
  },
  { status: 410 },
));
