import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const checkoutSrc = readFileSync(
  resolve(process.cwd(), 'base44/functions/createCheckoutSession/entry.ts'),
  'utf-8'
);

const criarPagamentoSrc = readFileSync(
  resolve(process.cwd(), 'base44/functions/criarPagamentoServico/entry.ts'),
  'utf-8'
);

describe('Phase J — desativação de endpoints Stripe inseguros', () => {
  describe('createCheckoutSession', () => {
    it('retorna 410 Gone (endpoint desativado)', () => {
      assert.match(checkoutSrc, /status:\s*410/);
    });

    it('não aceita req.json() — sem parsing do body de requisição', () => {
      // Endpoint desativado não deve processar o body
      assert.ok(!checkoutSrc.includes('req.json()'), 'endpoint desativado não deve chamar req.json()');
    });

    it('não inicializa Stripe SDK (sem chamadas externas possíveis)', () => {
      assert.ok(!checkoutSrc.includes('new Stripe'), 'Stripe SDK não deve ser instanciado');
      assert.ok(!checkoutSrc.includes('STRIPE_SECRET_KEY'), 'chave Stripe não deve ser usada');
    });

    it('documenta o substituto ativo', () => {
      assert.match(checkoutSrc, /createSubscriptionCheckout/);
      assert.match(checkoutSrc, /substituto/);
    });

    it('tem comentário de desativação documentando a razão', () => {
      assert.match(checkoutSrc, /DESATIVADO/);
    });
  });

  describe('criarPagamentoServico', () => {
    it('retorna 410 Gone (endpoint desativado)', () => {
      assert.match(criarPagamentoSrc, /status:\s*410/);
    });

    it('não aceita req.json() — sem parsing do body de requisição', () => {
      assert.ok(!criarPagamentoSrc.includes('req.json()'), 'endpoint desativado não deve chamar req.json()');
    });

    it('não inicializa Stripe SDK', () => {
      assert.ok(!criarPagamentoSrc.includes('new Stripe'), 'Stripe SDK não deve ser instanciado');
    });

    it('documenta o substituto (criarPagamentoServicoMercadoPago)', () => {
      assert.match(criarPagamentoSrc, /criarPagamentoServicoMercadoPago/);
    });

    it('tem comentário de desativação documentando a razão', () => {
      assert.match(criarPagamentoSrc, /DESATIVADO/);
    });
  });

  describe('inventário Stripe ativo (funções que devem permanecer)', () => {
    const activeStripeFunctions = [
      'createSubscriptionCheckout',
      'stripeWebhook',
      'autoCapturaEscrow',
      'cancelarAssinatura',
      'cancelarPagamento',
      'confirmarServicoConcluido',
      'onboardingStripeConnect',
    ];

    for (const fnName of activeStripeFunctions) {
      it(`${fnName} ainda existe (não foi removido)`, () => {
        const path = resolve(process.cwd(), `base44/functions/${fnName}/entry.ts`);
        assert.ok(existsSync(path), `${fnName}/entry.ts deve existir`);
      });
    }
  });
});
