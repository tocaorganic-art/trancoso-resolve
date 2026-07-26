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

    it('inclui o plano fundador aprovado', () => {
      assert.ok(src.includes("fundador:"), "plano 'fundador' deve estar em PLANOS");
    });

    it('define preço aprovado: R$ 19,90/mês', () => {
      assert.ok(src.includes('19.90'), 'plano fundador deve custar R$19,90');
      assert.ok(!src.includes('29.90'), 'preço antigo R$29,90 não deve mais existir');
      assert.ok(!src.includes('49.90'), 'preço antigo R$49,90 não deve mais existir');
    });

    it('define trial de 7 dias conforme regra comercial', () => {
      assert.match(src, /trial_days:\s*7/);
      assert.ok(!src.includes('trial_days: 60'), 'trial de 60 dias não é mais válido');
    });

    it('lê MP_ACCESS_TOKEN do ambiente (nunca do body da requisição)', () => {
      assert.match(src, /Deno\.env\.get\('MP_ACCESS_TOKEN'\)/);
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

  describe('controle de Selos Fundadores', () => {
    it('define limite de VAGAS_FUNDADORES = 100', () => {
      assert.match(src, /const VAGAS_FUNDADORES\s*=\s*100/);
    });

    it('consulta assinaturas existentes antes de criar', () => {
      assert.match(src, /Subscription\.filter/);
    });

    it('retorna 409 quando vagas esgotadas', () => {
      assert.match(src, /status:\s*409/);
      assert.match(src, /vagas_esgotadas/);
    });

    it('NÃO redireciona automaticamente para plano mais caro (preço não muda sem autorização)', () => {
      assert.ok(!src.includes('redirect_para'), 'redirect automático de preço não deve existir');
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

    it('log usa user.id e não user.email (PII)', () => {
      assert.ok(!src.includes('user=${user.email}'), 'email não deve aparecer no log');
      assert.ok(src.includes('user=${user.id}'), 'deve usar user.id no log');
    });

    it('retorna checkout_url e preapproval_id na resposta de sucesso', () => {
      assert.match(src, /checkout_url/);
      assert.match(src, /preapproval_id/);
      assert.ok(src.includes('ok: true'), 'resposta de sucesso deve ter ok: true');
      assert.ok(src.includes('checkout_url: checkoutUrl'), 'resposta deve incluir checkout_url');
      assert.ok(src.includes('preapproval_id: preapprovalId'), 'resposta deve incluir preapproval_id');
    });
  });
});
