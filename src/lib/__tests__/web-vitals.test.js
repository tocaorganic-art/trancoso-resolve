import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildVitalsParams, APP_VERSION } from '../performance.js';

test('web vitals params incluem métrica, valor arredondado, rota e versão', () => {
  const params = buildVitalsParams('INP', 125.6, 'v3-1', 'good', '/servicos/eletricista');
  assert.equal(params.metric_name, 'INP');
  assert.equal(params.metric_value, 126);
  assert.equal(params.metric_id, 'v3-1');
  assert.equal(params.metric_rating, 'good');
  assert.equal(params.route, '/servicos/eletricista');
  assert.ok(typeof APP_VERSION === 'string' && APP_VERSION.length > 0);
});

test('sem rota explícita e sem window, route cai em string vazia (sem PII)', () => {
  const params = buildVitalsParams('LCP', 2000, 'id-1', 'needs-improvement');
  assert.equal(params.route, '');
  // Versão de build nunca expõe segredo; fallback para dev
  assert.equal(params.app_version, APP_VERSION);
});
