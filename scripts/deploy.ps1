# deploy.ps1 — script de deploy do Trancoso Resolve (Windows PowerShell)
#Requires -Version 5.1
$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================"
Write-Host "  Trancoso Resolve — Deploy"
Write-Host "========================================"
Write-Host ""

# 1. Instalar dependências
Write-Host "[1/4] Instalando dependencias..."
npm install
if ($LASTEXITCODE -ne 0) { throw "npm install falhou" }

# 2. Build de produção
Write-Host "[2/4] Gerando build de producao..."
npm run build
if ($LASTEXITCODE -ne 0) { throw "npm run build falhou" }
Write-Host "  OK Build gerado em dist/"

# 3. Lint
Write-Host "[3/4] Verificando lint..."
npm run lint
if ($LASTEXITCODE -ne 0) { throw "npm run lint falhou" }
Write-Host "  OK Lint OK"

# 4. Guia de deploy manual
Write-Host ""
Write-Host "[4/4] Proximos passos manuais:"
Write-Host ""
Write-Host "  VERCEL"
Write-Host "  ------"
Write-Host "  1. Acesse vercel.com/dashboard"
Write-Host "  2. Deploy automatico ocorre a cada push para 'main'"
Write-Host "  3. Verifique variaveis de ambiente em Settings > Environment Variables:"
Write-Host "     - WHATSAPP_PROVIDER"
Write-Host "     - ZAPI_INSTANCE_ID / ZAPI_TOKEN"
Write-Host "     - WABA_TOKEN / WABA_PHONE_ID (se usar WABA)"
Write-Host "     - STRIPE_SECRET_KEY"
Write-Host "     - STRIPE_WEBHOOK_SECRET"
Write-Host ""
Write-Host "  BASE44 - Functions"
Write-Host "  ------------------"
Write-Host "  1. Acesse o app 68eb21726a9614db4a82ba99 no painel Base44"
Write-Host "  2. Functions > enviarMensagemWhatsApp"
Write-Host "     Conteudo: base44/functions/enviarMensagemWhatsApp/entry.ts"
Write-Host "  3. Functions > stripeWebhook"
Write-Host "     Conteudo: base44/functions/stripeWebhook/entry.ts"
Write-Host "  4. Configure variaveis de ambiente em cada function"
Write-Host ""
Write-Host "  BASE44 - Entidade LogWhatsApp"
Write-Host "  -----------------------------"
Write-Host "  1. Entities > New Entity"
Write-Host "  2. Colar conteudo de: base44/entities/LogWhatsApp.jsonc"
Write-Host ""
Write-Host "  STRIPE - Webhook"
Write-Host "  ----------------"
Write-Host "  1. dashboard.stripe.com/webhooks > Add endpoint"
Write-Host "  2. URL: https://trancosoresolve.com.br/api/functions/stripeWebhook"
Write-Host "  3. Eventos:"
Write-Host "     checkout.session.completed"
Write-Host "     invoice.paid / invoice.payment_failed"
Write-Host "     customer.subscription.deleted"
Write-Host "     payment_intent.* / charge.dispute.created / account.updated"
Write-Host "  4. Copiar Signing secret > adicionar como STRIPE_WEBHOOK_SECRET"
Write-Host ""
Write-Host "  TESTE LOCAL COM STRIPE CLI"
Write-Host "  --------------------------"
Write-Host "  stripe listen --forward-to http://localhost:5173/api/functions/stripeWebhook"
Write-Host "  stripe trigger checkout.session.completed"
Write-Host ""
Write-Host "========================================"
Write-Host "  Deploy concluido! A gente resolve."
Write-Host "========================================"
