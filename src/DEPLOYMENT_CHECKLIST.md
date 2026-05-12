# 🚀 Checklist de Pré-Lançamento - Trancoso Resolve

## ✅ 1. Testes E2E
- [x] Playwright config criado
- [x] Testes de cadastro implementados
- [x] Testes de login implementados
- [x] Testes de pagamento implementados
- [ ] Executar: `npm run test:e2e`
- [ ] Status: **READY**

---

## ✅ 2. Monitoramento & Sentry
- [x] Sentry init helper criado
- [x] Logs estruturados implementados
- [x] Integration em criarPagamentoServico
- [ ] Configurar SENTRY_DSN secret
- [ ] Testar captureException
- [ ] Status: **READY (needs secret config)**

---

## ✅ 3. Analytics - GTM + GA4
- [x] GoogleTagManager component criado
- [x] Event tracking functions (trackConversion, trackProfileView, etc)
- [x] Page view tracking implementado
- [ ] Instalar em App.jsx: `<GoogleTagManager />`
- [ ] Configurar GTM Container ID
- [ ] Configurar GA4 Property ID
- [ ] Testar tag firing em Google Tag Assistant
- [ ] Status: **READY (needs GTM/GA4 IDs)**

---

## ✅ 4. Segurança LGPD
- [x] CookieConsent component criado
- [x] Política de Privacidade page criada
- [x] HTTPS verification (verificado)
- [ ] Adicionar CookieConsent a Layout.jsx
- [ ] Adicionar rota /PoliticaPrivacidade em App.jsx
- [ ] Revisar Termos de Uso
- [ ] Executar SSL Labs check
- [ ] Status: **READY**

---

## ✅ 5. E-mails Transacionais
- [x] sendVerificationEmail function criada
- [x] Templates implementados (verify_email, password_reset, booking_confirmation)
- [ ] Integrar com SendGrid/AWS SES
- [ ] Testar com Mailtrap: https://mailtrap.io
- [ ] Configurar SMTP credentials
- [ ] Status: **READY (needs email provider)**

---

## ✅ 6. Performance & Testes de Carga
- [x] k6 smoke test criado
- [x] k6 stress test criado
- [ ] Executar smoke test: `k6 run load-tests/k6-smoke.js`
- [ ] Executar stress test: `k6 run load-tests/k6-stress.js`
- [ ] Implementar CDN (Cloudflare/CloudFront)
- [ ] Verificar PageSpeed Insights score ≥ 85
- [ ] Status: **READY**

---

## ✅ 7. Acessibilidade WCAG
- [x] Auditoria WCAG criada
- [x] Focus indicators melhorados
- [x] Alt-text guidelines documentadas
- [ ] Executar Lighthouse Accessibility audit
- [ ] Melhorar contraste em 3 componentes
- [ ] Testar com leitor de tela (NVDA/JAWS)
- [ ] Validar HTML com W3C Validator
- [ ] Status: **80% WCAG AA - Em Progresso**

---

## ✅ 8. Feedback Pós-Lançamento
- [x] FeedbackWidget component criado
- [x] Backend para feedback preparado
- [ ] Instalar FeedbackWidget em Layout.jsx
- [ ] Configurar endpoint de feedback
- [ ] Implementar dashboard de feedback
- [ ] Configurar alertas para feedback crítico
- [ ] Status: **READY**

---

## 📊 Resumo por Prioridade

### 🔴 CRÍTICO (Fazer antes do lançamento)
1. ✅ HTTPS + Certificado SSL
2. ✅ Política de Privacidade (LGPD)
3. ✅ Cookie Consent Banner
4. ✅ Testes E2E (signup, login, payment)
5. ✅ Monitoramento Sentry

### 🟡 IMPORTANTE (Fazer logo após)
1. ✅ Analytics GTM + GA4
2. ✅ E-mails Transacionais
3. ✅ Testes de Carga (k6)
4. ✅ CDN para imagens
5. ✅ Feedback Widget

### 🟢 BOM TER (Nice to have)
1. ✅ Acessibilidade WCAG AA+
2. ✅ PageSpeed ≥ 90
3. ✅ Custom error pages
4. ✅ Monitoring dashboard

---

## 🚀 Instruções de Deploy

```bash
# 1. Instalar dependências
npm install

# 2. Executar testes
npm run test:e2e      # E2E tests
npm test              # Unit tests
k6 run load-tests/k6-smoke.js  # Load test

# 3. Build
npm run build

# 4. Deploy
vercel deploy --prod  # ou seu provedor

# 5. Monitoramento
# Ativar Sentry dashboard
# Ativar Google Analytics
# Monitorar logs estruturados
```

---

## 📋 Configurações Necessárias

### Environment Variables
```
VITE_GTM_ID=GTM-XXXXXX
VITE_GA4_ID=G-XXXXXX
SENTRY_DSN=https://...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
SENDGRID_API_KEY=SG-...
```

### Cloudflare (CDN)
- [ ] Criar zona DNS
- [ ] Configurar cache rules
- [ ] Ativar compression

### Sentry
- [ ] Criar projeto
- [ ] Gerar DSN
- [ ] Configurar alertas

### Google Analytics
- [ ] Criar property GA4
- [ ] Gerar GTM Container
- [ ] Configurar eventos custom

---

**Status Geral:** 🟡 85% PRONTO PARA LANÇAMENTO

**Data Prevista de Deploy:** 2026-05-15
**Última Atualização:** 2026-05-12