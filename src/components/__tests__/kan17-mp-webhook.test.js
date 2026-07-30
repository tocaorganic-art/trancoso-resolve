import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const src = readFileSync(
  resolve(process.cwd(), 'base44/functions/mercadoPagoWebhook/entry.ts'),
  'utf-8'
);

const entitySrc = readFileSync(
  resolve(process.cwd(), 'base44/entities/MpWebhookLog.jsonc'),
  'utf-8'
);

describe('mercadoPagoWebhook — KAN-17 server-side validation & idempotency', () => {
  describe('validação de assinatura', () => {
    it('implementa validarAssinatura com HMAC-SHA256', () => {
      assert.match(src, /validarAssinatura/);
      assert.match(src, /HMAC.*SHA-256|SHA-256.*HMAC/s);
    });

    it('lê MP_WEBHOOK_SECRET do ambiente', () => {
      assert.match(src, /Deno\.env\.get\('MP_WEBHOOK_SECRET'\)/);
    });

    it('aceita quando não há secret configurado (modo permissivo)', () => {
      assert.match(src, /if \(!secret\) return true/);
    });

    it('rejeita com 400 se assinatura inválida', () => {
      assert.match(src, /Invalid signature/);
      assert.match(src, /status:\s*400/);
    });

    it('valida formato MP (ts=...,v1=...)', () => {
      assert.match(src, /x-signature/);
      assert.match(src, /ts.*v1|v1.*ts/s);
    });
  });

  describe('idempotência', () => {
    it('verifica MpWebhookLog antes de processar', () => {
      assert.match(src, /MpWebhookLog\.filter/);
      assert.match(src, /notification_id/);
    });

    it('ignora duplicados com 200 (não retorna erro)', () => {
      assert.match(src, /duplicado/);
      assert.ok(src.includes("acao: 'duplicado'"), "deve retornar acao: 'duplicado'");
    });

    it('grava log antes de processar (grava primeiro, processa depois)', () => {
      const logCreateIdx = src.indexOf('MpWebhookLog.create');
      const processarIdx = src.indexOf('processarPagamento');
      assert.ok(logCreateIdx < processarIdx, 'MpWebhookLog.create deve ocorrer antes de processar');
    });

    it('permite reprocessamento marcando log anterior como erro', () => {
      assert.match(src, /status.*erro|erro.*status/s);
      assert.match(src, /MpWebhookLog\.update/);
    });

    it('retorna 500 em erro para MP reenviar a notificação', () => {
      assert.match(src, /status:\s*500/);
    });
  });

  describe('tópicos suportados', () => {
    it('define TOPICS_SUPORTADOS como Set', () => {
      assert.match(src, /TOPICS_SUPORTADOS.*Set/s);
    });

    it('suporta tópico payment', () => {
      assert.ok(src.includes("'payment'"), "deve suportar tópico 'payment'");
    });

    it('suporta tópico preapproval', () => {
      assert.ok(src.includes("'preapproval'"), "deve suportar tópico 'preapproval'");
    });

    it('ignora tópicos desconhecidos com 200', () => {
      assert.match(src, /ignorado/);
      assert.ok(src.includes("acao: 'ignorado'"), "deve retornar acao: 'ignorado'");
    });
  });

  describe('processamento de pagamentos', () => {
    it('busca detalhes do payment via API MP (não confia no payload)', () => {
      assert.match(src, /buscarPagamentoMP/);
      assert.match(src, /mercadopago\.com\/v1\/payments\//);
    });

    it('mapeia status MP para status interno', () => {
      assert.match(src, /STATUS_PAYMENT_MAP/);
      assert.ok(src.includes("approved:"), "deve mapear 'approved'");
      assert.ok(src.includes("rejected:"), "deve mapear 'rejected'");
    });

    it('não reverte pagamento já pago (exceto reembolso/chargeback)', () => {
      assert.match(src, /status === 'pago'/);
      assert.match(src, /reembolsado.*chargeback|chargeback.*reembolsado/s);
    });

    it('usa external_reference para localizar ServiceRequest', () => {
      assert.match(src, /external_reference/);
      assert.match(src, /requestId/);
    });

    it('atualiza ServiceRequest para Em Andamento após pagamento aprovado', () => {
      assert.match(src, /Em Andamento/);
      assert.match(src, /ServiceRequest\.update/);
    });
  });

  describe('processamento de assinaturas (preapproval)', () => {
    it('busca preapproval via API MP', () => {
      assert.match(src, /buscarPreapprovalMP/);
      assert.match(src, /mercadopago\.com\/preapproval\//);
    });

    it('mapeia status MP de preapproval para status interno', () => {
      assert.match(src, /STATUS_PREAPPROVAL_MAP/);
      assert.ok(src.includes("authorized:"), "deve mapear 'authorized'");
      assert.ok(src.includes("cancelled:"), "deve mapear 'cancelled'");
    });

    it('localiza Subscription por mp_preapproval_id', () => {
      assert.match(src, /mp_preapproval_id/);
      assert.match(src, /Subscription\.filter/);
    });

    it('atualiza Subscription no banco', () => {
      assert.match(src, /Subscription\.update/);
    });
  });

  describe('schema MpWebhookLog (reconciliação)', () => {
    it('entidade MpWebhookLog existe', () => {
      assert.match(entitySrc, /MpWebhookLog/);
    });

    it('tem campo notification_id como chave de idempotência', () => {
      assert.match(entitySrc, /notification_id/);
    });

    it('tem campo status com enum de estados', () => {
      assert.match(entitySrc, /processado.*duplicado|duplicado.*processado/s);
    });

    it('tem campo payload_snapshot para auditoria', () => {
      assert.match(entitySrc, /payload_snapshot/);
    });

    it('RLS bloqueado: apenas admin pode ler, create/update/delete negados', () => {
      assert.match(entitySrc, /admin/);
      assert.ok(entitySrc.includes('"create": false'), 'create deve ser false');
      assert.ok(entitySrc.includes('"update": false'), 'update deve ser false');
      assert.ok(entitySrc.includes('"delete": false'), 'delete deve ser false');
    });
  });
});
