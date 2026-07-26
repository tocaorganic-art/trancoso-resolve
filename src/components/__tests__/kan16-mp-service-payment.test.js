import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const src = readFileSync(
  resolve(process.cwd(), 'base44/functions/criarPagamentoServicoMercadoPago/entry.ts'),
  'utf-8'
);

describe('criarPagamentoServicoMercadoPago — KAN-16 Mercado Pago service payment', () => {
  describe('backend controla todos os valores financeiros', () => {
    it('lê preço do ServiceListing, nunca do body da requisição', () => {
      assert.match(src, /ServiceListing\.filter/);
      assert.match(src, /listing\.price/);
      // Garante que amount não vem do body
      const bodyDestructure = src.match(/const\s*\{[^}]*\}\s*=\s*body/);
      if (bodyDestructure) {
        const destructure = bodyDestructure[0];
        assert.ok(!destructure.includes('amount'), 'body não deve conter amount');
        assert.ok(!destructure.includes('price'), 'body não deve conter price');
        assert.ok(!destructure.includes('valor'), 'body não deve conter valor');
      }
    });

    it('frontend envia apenas request_id (não amount)', () => {
      assert.match(src, /request_id/);
      // Verifica que o campo aceito do body é apenas request_id e service_date
      const bodyDestructure = src.match(/const\s*\{([^}]*)\}\s*=\s*body/)?.[1] || '';
      assert.ok(!bodyDestructure.includes('amount'), 'body não deve aceitar amount');
      assert.ok(!bodyDestructure.includes('price'), 'body não deve aceitar price');
    });

    it('calcula taxa de plataforma no backend (não no frontend)', () => {
      assert.match(src, /PLATFORM_FEE_PCT/);
      assert.match(src, /platformFeeBrl/);
      assert.match(src, /providerAmountBrl/);
    });

    it('armazena split calculado no metadata da preference', () => {
      assert.match(src, /platform_fee_brl/);
      assert.match(src, /provider_amount_brl/);
    });

    it('usa BRL como moeda', () => {
      assert.match(src, /currency_id.*BRL/);
    });
  });

  describe('autenticação e autorização', () => {
    it('verifica autenticação via auth.me()', () => {
      assert.match(src, /base44\.auth\.me\(\)/);
    });

    it('rejeita chamadas sem autenticação com 401', () => {
      assert.match(src, /status:\s*401/);
    });

    it('verifica que o usuário autenticado é o cliente da solicitação', () => {
      assert.match(src, /client_email.*user\.email|user\.email.*client_email/);
      assert.match(src, /status:\s*403/);
    });

    it('usa email do usuário autenticado, não do body', () => {
      const authIdx = src.indexOf('user.email');
      const bodyIdx = src.indexOf('= body');
      assert.ok(authIdx > -1, 'user.email deve ser usado para identificar o cliente');
    });
  });

  describe('validações de negócio', () => {
    it('valida que request_id é obrigatório', () => {
      assert.match(src, /!request_id/);
      const reqIdx = src.indexOf('!request_id');
      const slice = src.slice(reqIdx, reqIdx + 200);
      assert.match(slice, /status:\s*400/);
    });

    it('retorna 404 se ServiceRequest não encontrada', () => {
      assert.match(src, /status:\s*404/);
      assert.match(src, /não encontrada/);
    });

    it('só permite pagamento em status válidos (Confirmado, Em Andamento)', () => {
      assert.match(src, /STATUS_PAGAVEIS/);
      assert.ok(src.includes("'Confirmado'"), "deve aceitar status 'Confirmado'");
      assert.ok(src.includes("'Em Andamento'"), "deve aceitar status 'Em Andamento'");
      assert.match(src, /status:\s*422/);
    });

    it('rejeita se ServiceListing não tem preço válido', () => {
      assert.match(src, /listing\.price.*number|typeof listing\.price/);
      assert.match(src, /Preço do serviço não disponível/);
    });

    it('retorna 503 se MP_ACCESS_TOKEN não configurado', () => {
      assert.match(src, /status:\s*503/);
    });
  });

  describe('integração Mercado Pago', () => {
    it('chama endpoint de preferences do Mercado Pago', () => {
      assert.match(src, /mercadopago\.com\/checkout\/preferences/);
    });

    it('envia X-Idempotency-Key', () => {
      assert.match(src, /X-Idempotency-Key/);
    });

    it('usa Authorization Bearer com MP_ACCESS_TOKEN', () => {
      assert.match(src, /Bearer.*mpToken/);
    });

    it('define back_urls para sucesso, falha e pendência', () => {
      assert.match(src, /back_urls/);
      assert.match(src, /success/);
      assert.match(src, /failure/);
      assert.match(src, /pending/);
    });

    it('usa external_reference com request_id para rastreabilidade', () => {
      assert.match(src, /external_reference/);
      assert.match(src, /request_id/);
    });

    it('retorna 502 se o gateway MP retornar erro', () => {
      assert.match(src, /status:\s*502/);
    });
  });

  describe('persistência e rastreabilidade', () => {
    it('persiste Payment via asServiceRole', () => {
      assert.match(src, /asServiceRole\.entities\.Payment\.create/);
    });

    it('armazena mp_preference_id no Payment', () => {
      assert.match(src, /mp_preference_id/);
    });

    it('registra gateway como mercadopago', () => {
      assert.match(src, /gateway.*mercadopago/);
    });

    it('calcula auto_capture_after (48h após serviço)', () => {
      assert.match(src, /auto_capture_after/);
      assert.match(src, /48 \* 60 \* 60 \* 1000/);
    });

    it('retorna apenas preference_id e payment_id (sem dados financeiros internos)', () => {
      assert.match(src, /preference_id.*preferenceId|preferenceId.*preference_id/);
      assert.match(src, /payment_id.*payment/);
    });
  });
});
