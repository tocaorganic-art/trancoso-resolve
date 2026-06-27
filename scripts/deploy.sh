#!/usr/bin/env bash
# deploy.sh — script de deploy do Trancoso Resolve (Linux/macOS)
set -euo pipefail

echo ""
echo "========================================"
echo "  Trancoso Resolve — Deploy"
echo "========================================"
echo ""

# 1. Instalar dependências
echo "[1/4] Instalando dependências..."
npm install

# 2. Build de produção
echo "[2/4] Gerando build de produção..."
npm run build
echo "  ✓ Build gerado em dist/"

# 3. Lint
echo "[3/4] Verificando lint..."
npm run lint
echo "  ✓ Lint OK"

# 4. Guia de deploy manual
echo ""
echo "[4/4] Próximos passos manuais:"
echo ""
echo "  VERCEL"
echo "  ------"
echo "  1. Acesse vercel.com/dashboard"
echo "  2. O deploy automático já ocorre a cada push para 'main'"
echo "  3. Verifique as variáveis de ambiente em Settings > Environment Variables:"
echo "     - WHATSAPP_PROVIDER"
echo "     - ZAPI_INSTANCE_ID / ZAPI_TOKEN"
echo "     - WABA_TOKEN / WABA_PHONE_ID (se usar WABA)"
echo "     - STRIPE_SECRET_KEY"
echo "     - STRIPE_WEBHOOK_SECRET"
echo ""
echo "  BASE44 — Functions"
echo "  ------------------"
echo "  1. Acesse o app 68eb21726a9614db4a82ba99 no painel Base44"
echo "  2. Functions > enviarMensagemWhatsApp"
echo "     Conteúdo: base44/functions/enviarMensagemWhatsApp/entry.ts"
echo "  3. Functions > stripeWebhook"
echo "     Conteúdo: base44/functions/stripeWebhook/entry.ts"
echo "  4. Configure as variáveis de ambiente em cada function"
echo ""
echo "  BASE44 — Entidade LogWhatsApp"
echo "  -----------------------------"
echo "  1. Entities > New Entity"
echo "  2. Colar conteúdo de: base44/entities/LogWhatsApp.jsonc"
echo ""
echo "  STRIPE — Webhook"
echo "  ----------------"
echo "  1. dashboard.stripe.com/webhooks > Add endpoint"
echo "  2. URL: https://trancosoresolve.com.br/api/functions/stripeWebhook"
echo "  3. Eventos:"
echo "     checkout.session.completed"
echo "     invoice.paid / invoice.payment_failed"
echo "     customer.subscription.deleted"
echo "     payment_intent.* / charge.dispute.created / account.updated"
echo "  4. Copiar Signing secret > adicionar como STRIPE_WEBHOOK_SECRET"
echo ""
echo "  TESTE LOCAL COM STRIPE CLI"
echo "  --------------------------"
echo "  stripe listen --forward-to http://localhost:5173/api/functions/stripeWebhook"
echo "  stripe trigger checkout.session.completed"
echo ""
echo "========================================"
echo "  Deploy concluído! A gente resolve. ✅"
echo "========================================"
