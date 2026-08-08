// @ts-nocheck
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const src = readFileSync(
  resolve(process.cwd(), 'base44/functions/enviarMensagemWhatsApp/entry.ts'),
  'utf-8'
);

describe('enviarMensagemWhatsApp — segurança (KAN-14)', () => {
  describe('autenticação obrigatória', () => {
    it('verifica auth.me() e rejeita com 401 se não autenticado', () => {
      assert.match(src, /base44\.auth\.me\(\)/);
      assert.match(src, /status:\s*401/);
    });

    it('bloqueia chamadas sem user antes de processar o body', () => {
      const authIdx = src.indexOf('base44.auth.me()');
      const bodyIdx = src.indexOf('await req.json()');
      assert.ok(authIdx < bodyIdx, 'auth.me() deve ser verificado antes de req.json()');
    });

    it('usa .catch() para evitar que erro de auth vire 500', () => {
      assert.match(src, /base44\.auth\.me\(\)\.catch\(\(\) => null\)/);
    });
  });

  describe('validação de tipo (allowlist)', () => {
    it('define TIPOS_VALIDOS como const', () => {
      assert.match(src, /const TIPOS_VALIDOS\s*=/);
    });

    it('inclui todos os tipos esperados', () => {
      const expectedTipos = [
        'novo_pedido', 'confirmacao', 'cancelamento', 'lembrete',
        'mensagem', 'verificacao', 'pagamento', 'avaliacao', 'notificacao',
      ];
      for (const tipo of expectedTipos) {
        assert.ok(src.includes(`'${tipo}'`), `tipo '${tipo}' deve estar em TIPOS_VALIDOS`);
      }
    });

    it('valida tipo contra TIPOS_VALIDOS e retorna 400 se inválido', () => {
      assert.match(src, /TIPOS_VALIDOS\.includes\(tipo\)/);
      // Deve haver um 400 logo após a validação de tipo
      const tipoIdx = src.indexOf('TIPOS_VALIDOS.includes(tipo)');
      const slice400 = src.slice(tipoIdx, tipoIdx + 300);
      assert.match(slice400, /status:\s*400/);
    });
  });

  describe('limite de tamanho da mensagem', () => {
    it('define MAX_MENSAGEM_CHARS', () => {
      assert.match(src, /const MAX_MENSAGEM_CHARS\s*=\s*4000/);
    });

    it('verifica comprimento e retorna 400 se exceder', () => {
      assert.match(src, /mensagem\.length\s*>\s*MAX_MENSAGEM_CHARS/);
      const lenIdx = src.indexOf('mensagem.length > MAX_MENSAGEM_CHARS');
      const slice = src.slice(lenIdx, lenIdx + 300);
      assert.match(slice, /status:\s*400/);
    });
  });

  describe('validação e normalização do telefone', () => {
    it('remove caracteres não numéricos', () => {
      assert.match(src, /replace\(\/\\D\/g,\s*''\)/);
    });

    it('adiciona prefixo 55 para números sem DDI', () => {
      assert.match(src, /startsWith\('55'\)/);
    });

    it('rejeita telefones com comprimento inválido (< 12 ou > 13 dígitos) com 400', () => {
      assert.match(src, /tel\.length\s*<\s*12\s*\|\|\s*tel\.length\s*>\s*13/);
      const phoneIdx = src.indexOf('tel.length < 12');
      const slice = src.slice(phoneIdx, phoneIdx + 300);
      assert.match(slice, /status:\s*400/);
    });

    it('normaliza para formato E.164 com +', () => {
      assert.match(src, /telE164\s*=\s*`\+\$\{tel\}`/);
    });
  });

  describe('rate limiting', () => {
    it('define RATE_LIMIT_POR_HORA', () => {
      assert.match(src, /const RATE_LIMIT_POR_HORA\s*=\s*10/);
    });

    it('consulta LogWhatsApp para contagem de envios recentes', () => {
      assert.match(src, /LogWhatsApp\.filter/);
    });

    it('filtra envios na última hora', () => {
      assert.match(src, /umaHoraAtras/);
      assert.match(src, /60 \* 60 \* 1000/);
    });

    it('retorna 429 quando rate limit atingido', () => {
      assert.match(src, /status:\s*429/);
    });

    it('compara com RATE_LIMIT_POR_HORA na verificação', () => {
      assert.match(src, /enviosNaHora\.length\s*>=\s*RATE_LIMIT_POR_HORA/);
    });

    it('usa asServiceRole para consultar logs (bypass RLS para leitura)', () => {
      assert.match(src, /asServiceRole\.entities\.LogWhatsApp/);
    });
  });

  describe('logging e rastreabilidade', () => {
    it('registra caller por ID interno (não por e-mail — PII)', () => {
      // Deve usar user.id, jamais user.email diretamente no log
      assert.match(src, /caller=\$\{user\.id\}/);
      assert.ok(!src.includes('caller=${user.email}'), 'e-mail não deve aparecer no log');
    });

    it('persiste log com asServiceRole', () => {
      assert.match(src, /asServiceRole\.entities\.LogWhatsApp\.create/);
    });

    it('registra status do envio no log', () => {
      assert.match(src, /status.*enviado|enviado.*status/);
    });
  });

  describe('campos obrigatórios', () => {
    it('valida presença de telefone, mensagem e tipo', () => {
      assert.match(src, /!telefone\s*\|\|\s*!mensagem\s*\|\|\s*!tipo/);
      const reqIdx = src.indexOf('!telefone');
      const slice = src.slice(reqIdx, reqIdx + 200);
      assert.match(slice, /status:\s*400/);
    });
  });
});
