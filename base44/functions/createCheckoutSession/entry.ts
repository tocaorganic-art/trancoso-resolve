// DESATIVADO — endpoint legado inseguro.
//
// Este endpoint aceitava price_id diretamente do frontend, violando a regra P0
// de que o backend deve controlar todos os valores financeiros.
//
// Substituto ativo: createSubscriptionCheckout (catálogo server-side)
// Novo gateway: criarAssinaturaMercadoPago (Mercado Pago, gateway oficial)
//
// Não remova este arquivo — ele documenta a decisão de desativação.

Deno.serve(async (_req) => {
  console.warn('[createCheckoutSession] endpoint desativado — use createSubscriptionCheckout');
  return Response.json(
    {
      error: 'Este endpoint foi desativado. Use createSubscriptionCheckout.',
      substituto: 'createSubscriptionCheckout',
    },
    { status: 410 }
  );
});
