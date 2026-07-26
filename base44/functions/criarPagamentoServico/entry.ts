// DESATIVADO — endpoint legado inseguro.
//
// Este endpoint aceitava amount_brl diretamente do frontend, violando a regra P0
// de que o backend deve controlar todos os valores financeiros.
// Qualquer cliente autenticado podia forjar o valor do pagamento.
//
// Substituto ativo: criarPagamentoServicoMercadoPago
//   - Lê o preço de ServiceListing.price (banco de dados)
//   - Frontend envia apenas request_id
//   - Gateway: Mercado Pago (gateway oficial do produto)
//
// Não remova este arquivo — ele documenta a decisão de desativação.

Deno.serve(async (_req) => {
  console.warn('[criarPagamentoServico] endpoint desativado — use criarPagamentoServicoMercadoPago');
  return Response.json(
    {
      error: 'Este endpoint foi desativado. Use criarPagamentoServicoMercadoPago.',
      substituto: 'criarPagamentoServicoMercadoPago',
    },
    { status: 410 }
  );
});
