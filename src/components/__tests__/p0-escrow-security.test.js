import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const src = readFileSync(
  resolve(process.cwd(), 'base44/functions/autoCapturaEscrow/entry.ts'),
  'utf-8'
);

describe('autoCapturaEscrow — segurança financeira', () => {
  describe('CRON_SECRET obrigatório', () => {
    it('lê CRON_SECRET do ambiente', () => {
      assert.match(src, /Deno\.env\.get\('CRON_SECRET'\)/);
    });

    it('verifica cabeçalho Authorization: Bearer <CRON_SECRET>', () => {
      assert.match(src, /Authorization/);
      assert.match(src, /Bearer \$\{cronSecret\}/);
    });

    it('define variável isCron para sinalizar chamada de cron autenticada', () => {
      assert.match(src, /isCron/);
    });
  });

  describe('bloqueio de chamadas não autorizadas', () => {
    it('rejeita chamadas sem CRON_SECRET E sem user admin com 403', () => {
      assert.match(src, /status:\s*403/);
    });

    it('NÃO permite que user === null passe pela verificação de autorização', () => {
      // O bug original era: if (user && user.role !== 'admin') — null passava
      // O fix correto é: if (!user || user.role !== 'admin')
      assert.match(src, /!user\s*\|\|\s*user\.role\s*!==\s*'admin'/);
      // Garante que o padrão vulnerável antigo não está presente
      const oldPattern = /if \(user && user\.role !== 'admin'\)/;
      assert.ok(!oldPattern.test(src), 'padrão vulnerável "if (user && ...)" não deve existir');
    });

    it('bloqueia chamadas sem token de cron e sem autenticação de usuário', () => {
      // Deve existir verificação: !isCron → checar auth do usuário
      assert.match(src, /if\s*\(!isCron\)/);
    });
  });

  describe('caminho feliz para cron autorizado', () => {
    it('processa pagamentos sem verificar auth de usuário quando isCron é verdadeiro', () => {
      // A verificação de auth do usuário deve estar dentro do bloco !isCron
      const isCronIdx = src.indexOf('if (!isCron)');
      const meIdx = src.indexOf('auth.me()');
      assert.ok(meIdx > isCronIdx, 'auth.me() deve estar dentro do bloco if (!isCron)');
    });

    it('continua com lógica de captura após autorização bem-sucedida', () => {
      assert.match(src, /Payment\.filter/);
      assert.match(src, /stripe\.paymentIntents\.capture/);
    });
  });

  describe('integridade das operações financeiras', () => {
    it('usa asServiceRole para operações financeiras (bypass RLS)', () => {
      assert.match(src, /asServiceRole\.entities\.Payment/);
    });

    it('registra resultado (captured, errors) na resposta', () => {
      assert.match(src, /captured.*errors|errors.*captured/);
    });

    it('só captura pagamentos após prazo auto_capture_after', () => {
      assert.match(src, /auto_capture_after/);
      assert.match(src, /autoCaptureTime/);
    });
  });
});
