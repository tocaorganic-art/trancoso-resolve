// KAN-13: RLS, autoverificação e PII — testes de análise estática
// Verificam que o código-fonte não expõe PII publicamente e não permite
// que prestadores atualizem campos protegidos via SDK direto.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '../../..');

function readFile(rel) {
  return readFileSync(join(ROOT, rel), 'utf-8');
}

function readJson(rel) {
  const txt = readFile(rel);
  // Remover comentários estilo // antes de parsear
  const clean = txt.replace(/\/\/[^\n]*/g, '');
  return JSON.parse(clean);
}

// ---------------------------------------------------------------------------
// 1. ServiceProvider entity: campos PII foram removidos
// ---------------------------------------------------------------------------
describe('ServiceProvider entity — campos PII removidos', () => {
  const entity = readJson('base44/entities/ServiceProvider.jsonc');
  const props = Object.keys(entity.properties || {});

  it('cpf não deve estar em ServiceProvider', () => {
    assert.ok(!props.includes('cpf'), 'cpf encontrado em ServiceProvider — deve estar em ServiceProviderPrivate');
  });

  it('cnpj não deve estar em ServiceProvider', () => {
    assert.ok(!props.includes('cnpj'), 'cnpj encontrado em ServiceProvider — deve estar em ServiceProviderPrivate');
  });

  it('verification_document_url não deve estar em ServiceProvider', () => {
    assert.ok(!props.includes('verification_document_url'), 'verification_document_url ainda em ServiceProvider');
  });

  it('full_body_photo_url não deve estar em ServiceProvider', () => {
    assert.ok(!props.includes('full_body_photo_url'), 'full_body_photo_url ainda em ServiceProvider');
  });

  it('autorizou_verificacao não deve estar em ServiceProvider', () => {
    assert.ok(!props.includes('autorizou_verificacao'), 'autorizou_verificacao ainda em ServiceProvider');
  });

  it('campos de status de verificação (admin-only) ainda presentes para leitura controlada', () => {
    assert.ok(props.includes('verified'), 'verified deve existir em ServiceProvider');
    assert.ok(props.includes('status_verificacao'), 'status_verificacao deve existir em ServiceProvider');
    assert.ok(props.includes('relatorio_verificacao'), 'relatorio_verificacao deve existir');
  });
});

// ---------------------------------------------------------------------------
// 2. ServiceProviderPrivate entity: existe e contém campos PII corretos
// ---------------------------------------------------------------------------
describe('ServiceProviderPrivate entity — criada e com campos PII', () => {
  it('arquivo ServiceProviderPrivate.jsonc existe', () => {
    const path = join(ROOT, 'base44/entities/ServiceProviderPrivate.jsonc');
    assert.ok(existsSync(path), 'ServiceProviderPrivate.jsonc não encontrado');
  });

  const entity = readJson('base44/entities/ServiceProviderPrivate.jsonc');
  const props = Object.keys(entity.properties || {});

  it('contém campo provider_id como chave de ligação', () => {
    assert.ok(props.includes('provider_id'), 'provider_id não encontrado em ServiceProviderPrivate');
  });

  it('contém campo cpf', () => {
    assert.ok(props.includes('cpf'), 'cpf não encontrado em ServiceProviderPrivate');
  });

  it('contém campo cnpj', () => {
    assert.ok(props.includes('cnpj'), 'cnpj não encontrado em ServiceProviderPrivate');
  });

  it('RLS leitura restrita a created_by ou admin', () => {
    const rls = entity.rls || {};
    const readRule = rls.read;
    assert.ok(readRule !== true, 'ServiceProviderPrivate não pode ter read: true (leitura pública)');
    const ruleStr = JSON.stringify(readRule);
    assert.ok(ruleStr.includes('created_by') || ruleStr.includes('admin'), 'RLS de leitura deve incluir created_by ou admin');
  });

  it('RLS escrita restrita ao criador (não pública)', () => {
    const rls = entity.rls || {};
    const createRule = rls.create;
    assert.ok(createRule !== true, 'create não pode ser true sem restrição');
  });
});

// ---------------------------------------------------------------------------
// 3. AdminAntecedentes.jsx: não chama ServiceProvider.update com campos admin
// ---------------------------------------------------------------------------
describe('AdminAntecedentes.jsx — não usa SDK direto para campos protegidos', () => {
  const src = readFile('src/pages/AdminAntecedentes.jsx');

  it('não chama ServiceProvider.update com status_verificacao', () => {
    const pattern = /ServiceProvider\.update\s*\([^)]*status_verificacao/;
    assert.ok(!pattern.test(src), 'AdminAntecedentes ainda atualiza status_verificacao via SDK direto');
  });

  it('não chama ServiceProvider.update com verified:', () => {
    const pattern = /ServiceProvider\.update\s*\([^)]*verified\s*:/;
    assert.ok(!pattern.test(src), 'AdminAntecedentes ainda atualiza verified via SDK direto');
  });

  it('chama atualizarStatusVerificacao via functions.invoke', () => {
    assert.ok(
      src.includes("functions.invoke('atualizarStatusVerificacao'") ||
      src.includes('functions.invoke("atualizarStatusVerificacao"'),
      'AdminAntecedentes deve chamar atualizarStatusVerificacao via functions.invoke'
    );
  });
});

// ---------------------------------------------------------------------------
// 4. FilaVerificacao.jsx: não chama ServiceProvider.update com campos admin
// ---------------------------------------------------------------------------
describe('FilaVerificacao.jsx — não usa SDK direto para campos protegidos', () => {
  const src = readFile('src/pages/FilaVerificacao.jsx');

  it('não chama ServiceProvider.update com status_verificacao', () => {
    const pattern = /ServiceProvider\.update\s*\([^)]*status_verificacao/;
    assert.ok(!pattern.test(src), 'FilaVerificacao ainda atualiza status_verificacao via SDK direto');
  });

  it('não chama ServiceProvider.update com verified:', () => {
    const pattern = /ServiceProvider\.update\s*\([^)]*verified\s*:/;
    assert.ok(!pattern.test(src), 'FilaVerificacao ainda atualiza verified via SDK direto');
  });

  it('chama atualizarStatusVerificacao via functions.invoke', () => {
    assert.ok(
      src.includes("functions.invoke('atualizarStatusVerificacao'") ||
      src.includes('functions.invoke("atualizarStatusVerificacao"'),
      'FilaVerificacao deve chamar atualizarStatusVerificacao via functions.invoke'
    );
  });

  it('carrega PII de ServiceProviderPrivate', () => {
    assert.ok(
      src.includes('ServiceProviderPrivate'),
      'FilaVerificacao deve carregar PII de ServiceProviderPrivate'
    );
  });
});

// ---------------------------------------------------------------------------
// 5. PrestadorPerfil.jsx: página pública não exibe campos PII
// ---------------------------------------------------------------------------
describe('PrestadorPerfil.jsx — página pública não expõe PII', () => {
  const src = readFile('src/pages/PrestadorPerfil.jsx');

  it('não renderiza cpf no perfil público', () => {
    assert.ok(!src.includes('provider.cpf') && !src.includes('.cpf}'), 'PrestadorPerfil expõe cpf publicamente');
  });

  it('não renderiza cnpj no perfil público', () => {
    assert.ok(!src.includes('provider.cnpj') && !src.includes('.cnpj}'), 'PrestadorPerfil expõe cnpj publicamente');
  });

  it('não renderiza verification_document_url no perfil público', () => {
    assert.ok(!src.includes('verification_document_url'), 'PrestadorPerfil expõe documento de verificação publicamente');
  });
});

// ---------------------------------------------------------------------------
// 6. function atualizarStatusVerificacao existe
// ---------------------------------------------------------------------------
describe('function atualizarStatusVerificacao — existe e tem proteção admin', () => {
  it('arquivo entry.ts existe', () => {
    const path = join(ROOT, 'base44/functions/atualizarStatusVerificacao/entry.ts');
    assert.ok(existsSync(path), 'atualizarStatusVerificacao/entry.ts não encontrado');
  });

  const src = readFile('base44/functions/atualizarStatusVerificacao/entry.ts');

  it('verifica role admin antes de processar', () => {
    assert.ok(src.includes("role !== 'admin'") || src.includes('role === "admin"'), 'function não verifica role admin');
  });

  it('usa asServiceRole para atualizar ServiceProvider', () => {
    assert.ok(src.includes('asServiceRole'), 'function deve usar asServiceRole para atualizar campos protegidos');
  });

  it('rejeita campos admin enviados diretamente no payload', () => {
    assert.ok(src.includes('CAMPOS_ADMIN') || src.includes('camposProibidos'), 'function deve bloquear campos admin no payload');
  });
});

// ---------------------------------------------------------------------------
// 7. Script de migração existe
// ---------------------------------------------------------------------------
describe('Script de migração PII existe', () => {
  it('scripts/migrar-pii-service-provider.js existe', () => {
    const path = join(ROOT, 'scripts/migrar-pii-service-provider.js');
    assert.ok(existsSync(path), 'script de migração não encontrado');
  });

  const src = readFile('scripts/migrar-pii-service-provider.js');

  it('suporta modo dry-run', () => {
    assert.ok(src.includes('dry-run') || src.includes('DRY_RUN'), 'script deve suportar dry-run');
  });

  it('não apaga dados do ServiceProvider original', () => {
    assert.ok(!src.includes('.delete(') && !src.includes('ServiceProvider.update'), 'script não deve deletar ou alterar ServiceProvider durante migração');
  });
});
