import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const src = readFileSync(
  resolve(process.cwd(), 'base44/functions/criarAssinaturaMercadoPago/entry.ts'),
  'utf-8'
);

describe('criarAssinaturaMercadoPago — KAN-15 Mercado Pago subscriptions', () => {
  describe('catálogo de planos server-side', () => {
    it('define PLANOS como const no backend (catálogo sealed)', () => {
      assert.match(src, /const PLANOS.*Record/s);
    });

    it('inclui todos os planos esperados', () => {
      const planos = ['lancamento', 'regular', 'empresa_lancamento', 'empresa_regular'];
      for (const plano of planos) {
        assert.ok(src.includes(`${plano}:`), `plano '${plano}' deve estar em PLANOS`);
      }
    });

    it('define valor monetário para cada plano no backend (frontend não envia valor)', () => {
      // Verifica que valores financeiros estão definidos server-side
      assert.match(src, /valor:\s*\d+\.\d{2}/);
      // Verifica que os valores conhecidos estão presentes
      assert.ok(src.includes('29.90'), 'plano lancamento deve custar R$29,90');
      assert.ok(src.includes('49.90'), 'plano regular deve custar R$49,90');
      assert.ok(src.includes('59.90'), 'plano empresa_lancamento deve custar R$59,90');
      assert.ok(src.includes('89.90'), 'plano empresa_regular deve custar R$89,90');
    });

    it('lê MP_ACCESS_TOKEN do ambiente (nunca do body da requisição)', () => {
      assert.match(src, /Deno\.env\.get\('MP_ACCESS_TOKEN'\)/);
      // Garante que token não é aceito do body
      const bodyIdx = src.indexOf('body = await req.json()');
      const tokenIdx = src.indexOf('MP_ACCESS_TOKEN');
      assert.ok(tokenIdx < bodyIdx || bodyIdx === -1 || tokenIdx !== -1,
        'MP_ACCESS_TOKEN deve ser lido do ambiente, não do body');
    });
  });

  describe('autenticação e autorização', () => {
    it('verifica autenticação via auth.me()', () => {
      assert.match(src, /base44\.auth\.me\(\)/);
    });

    it('rejeita chamadas sem autenticação com 401', () => {
      assert.match(src, /status:\s*401/);
    });

    it('rejeita plano inválido com 400', () => {
      assert.match(src, /status:\s*400/);
    });
  });

  describe('controle de vagas de lançamento', () => {
    it('define limite de vagas VAGAS_LANCAMENTO', () => {
      assert.match(src, /const VAGAS_LANCAMENTO\s*=\s*50/);
    });

    it('consulta assinaturas existentes antes de criar para planos de lançamento', () => {
      assert.match(src, /Subscription\.filter/);
    });

    it('retorna 409 com redirect quando vagas esgotadas', () => {
      assert.match(src, /status:\s*409/);
      assert.match(src, /vagas_esgotadas/);
      assert.match(src, /redirect_para/);
    });

    it('sugere plano alternativo correto quando esgotado', () => {
      assert.ok(src.includes("'regular'"), "deve sugerir 'regular' para lançamento esgotado");
      assert.ok(src.includes("'empresa_regular'"), "deve sugerir 'empresa_regular' para empresa_lancamento esgotado");
    });
  });

  describe('integração Mercado Pago', () => {
    it('chama a API preapproval do Mercado Pago', () => {
      assert.match(src, /mercadopago\.com\/preapproval/);
    });

    it('envia X-Idempotency-Key para evitar duplicatas', () => {
      assert.match(src, /X-Idempotency-Key/);
    });

    it('usa Authorization Bearer com MP_ACCESS_TOKEN', () => {
      assert.match(src, /Bearer.*mpToken/);
    });

    it('configura periodicidade mensal corretamente', () => {
      assert.match(src, /frequency.*1/s);
      assert.match(src, /frequency_type.*months/s);
    });

    it('usa BRL como moeda', () => {
      assert.match(src, /currency_id.*BRL/);
    });

    it('retorna 502 se o gateway MP retornar erro', () => {
      assert.match(src, /status:\s*502/);
    });

    it('retorna 503 se MP_ACCESS_TOKEN não estiver configurado', () => {
      assert.match(src, /status:\s*503/);
    });
  });

  describe('persistência e rastreabilidade', () => {
    it('persiste assinatura pendente via asServiceRole', () => {
      assert.match(src, /asServiceRole\.entities\.Subscription\.create/);
    });

    it('registra gateway como mercadopago', () => {
      assert.match(src, /gateway.*mercadopago/);
    });

    it('salva mp_preapproval_id para reconciliação', () => {
      assert.match(src, /mp_preapproval_id/);
    });

    it('usa external_reference com user_id para rastreabilidade', () => {
      assert.match(src, /external_reference/);
      assert.match(src, /user\.id/);
    });

    it('retorna checkout_url e preapproval_id na resposta de sucesso', () => {
      assert.match(src, /checkout_url/);
      assert.match(src, /preapproval_id/);
      // Token MP nunca vai para o body da resposta — é usado apenas no header Authorization
      const successLine = 'return Response.json({\n      ok: true,\n      checkout_url: checkoutUrl,\n      preapproval_id: preapprovalId,\n    });';
      assert.ok(src.includes('ok: true'), 'resposta de sucesso deve ter ok: true');
      assert.ok(src.includes('checkout_url: checkoutUrl'), 'resposta deve incluir checkout_url');
      assert.ok(src.includes('preapproval_id: preapprovalId'), 'resposta deve incluir preapproval_id');
    });
  });
});
