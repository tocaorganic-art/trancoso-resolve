// @ts-nocheck
// KAN-18: SEO head authority — testes de análise estática
// Garantem que Layout.jsx não sobrescreve SEO de rotas desconhecidas
// e que ServicoLocalPage.jsx faz cleanup completo dos meta tags.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '../../..');

function read(rel) {
  return readFileSync(join(ROOT, rel), 'utf-8');
}

// ---------------------------------------------------------------------------
// 1. Layout.jsx — guarda de autoridade SEO
// ---------------------------------------------------------------------------
describe('Layout.jsx — não sobrescreve SEO de rotas desconhecidas', () => {
  const src = read('src/Layout.jsx');

  it('contém early return quando path não está no dicionário pageTitles', () => {
    assert.ok(
      src.includes('!(currentPath in pageTitles)') ||
      src.includes('pageTitles[currentPath]') && src.includes('return'),
      'Layout deve pular atualização de SEO para rotas não listadas'
    );
  });

  it('não usa fallback || para título quando path é desconhecido', () => {
    const hasBadFallback = /pageTitles\[currentPath\]\s*\|\|\s*['"]Trancoso Resolve['"]/.test(src);
    assert.ok(!hasBadFallback, 'Layout não deve usar || fallback que sobrescreve títulos de páginas próprias');
  });

  it('usa in operator ou verificação explícita antes de sobrescrever document.title', () => {
    assert.ok(
      src.includes('in pageTitles') || src.includes('pageTitles[currentPath]'),
      'Layout deve verificar se o caminho existe antes de sobrescrever o título'
    );
  });
});

// ---------------------------------------------------------------------------
// 2. ServicoLocalPage.jsx — cleanup completo de meta tags
// ---------------------------------------------------------------------------
describe('ServicoLocalPage.jsx — cleanup restaura meta tags anteriores', () => {
  const src = read('src/components/servicos/ServicoLocalPage.jsx');

  it('salva document.title anterior antes de sobrescrever', () => {
    assert.ok(src.includes('prev'), 'ServicoLocalPage deve salvar valores anteriores (prev)');
  });

  it('cleanup restaura document.title para o valor anterior', () => {
    assert.ok(
      src.includes('document.title = prev.title'),
      'cleanup deve restaurar document.title = prev.title'
    );
  });

  it('cleanup remove JSON-LD schemas ao desmontar', () => {
    assert.ok(
      src.includes('page-schema-ld') && src.includes('remove()'),
      'cleanup deve remover page-schema-ld'
    );
    assert.ok(
      src.includes('page-faq-ld'),
      'cleanup deve remover page-faq-ld'
    );
    assert.ok(
      src.includes('page-breadcrumb-ld'),
      'cleanup deve remover page-breadcrumb-ld'
    );
  });

  it('cleanup restaura meta description anterior', () => {
    assert.ok(
      src.includes("prev.desc") || src.includes("prev['desc']"),
      'cleanup deve restaurar meta description'
    );
  });
});

// ---------------------------------------------------------------------------
// 3. useSEO.js — já possui cleanup correto (regressão)
// ---------------------------------------------------------------------------
describe('useSEO.js — cleanup correto não regrediu', () => {
  const src = read('src/hooks/useSEO.js');

  it('salva valores anteriores antes de aplicar novos', () => {
    assert.ok(src.includes('const prev ='), 'useSEO deve salvar prev');
  });

  it('cleanup restaura document.title para prev.title', () => {
    assert.ok(src.includes('document.title = prev.title'), 'useSEO cleanup deve restaurar title');
  });

  it('retorna função de cleanup', () => {
    assert.ok(src.includes('return () =>'), 'useSEO deve retornar cleanup');
  });
});
