// Testes de análise estática — proteção de rotas admin (sem role check)
// Garantem que AdminRoute existe e é usado nos caminhos sensíveis.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '../../..');

function read(rel) {
  return readFileSync(join(ROOT, rel), 'utf-8');
}

// ---------------------------------------------------------------------------
// 1. AdminRoute component existe e verifica role admin
// ---------------------------------------------------------------------------
describe('AdminRoute — existe e verifica role admin', () => {
  it('arquivo src/components/AdminRoute.jsx existe', () => {
    assert.ok(existsSync(join(ROOT, 'src/components/AdminRoute.jsx')));
  });

  const src = read('src/components/AdminRoute.jsx');

  it('verifica user.role !== admin antes de renderizar', () => {
    assert.ok(
      src.includes("role !== 'admin'") || src.includes('role === "admin"'),
      'AdminRoute deve checar role admin'
    );
  });

  it('redireciona usuário não autenticado para /login', () => {
    assert.ok(src.includes('/login'), 'AdminRoute deve redirecionar para /login quando não autenticado');
  });

  it('renderiza Outlet para admin autenticado', () => {
    assert.ok(src.includes('Outlet'), 'AdminRoute deve renderizar <Outlet /> para admin');
  });

  it('usa useAuth para obter user e isAuthenticated', () => {
    assert.ok(src.includes('useAuth'), 'AdminRoute deve usar useAuth');
  });
});

// ---------------------------------------------------------------------------
// 2. App.jsx usa AdminRoute para rotas admin
// ---------------------------------------------------------------------------
describe('App.jsx — rotas admin protegidas por AdminRoute', () => {
  const src = read('src/App.jsx');

  it('importa AdminRoute', () => {
    assert.ok(src.includes("import AdminRoute"), 'App.jsx deve importar AdminRoute');
  });

  it('usa AdminRoute para /FilaVerificacao', () => {
    const adminRouteBlock = src.match(/<Route element=\{<AdminRoute[^>]*\/>\}>([\s\S]*?)<\/Route>/g) || [];
    const coversFilaVerificacao = adminRouteBlock.some(b => b.includes('/FilaVerificacao'));
    assert.ok(coversFilaVerificacao, '/FilaVerificacao deve estar dentro de um AdminRoute');
  });

  it('usa AdminRoute para /AdminPagamentos', () => {
    const adminRouteBlock = src.match(/<Route element=\{<AdminRoute[^>]*\/>\}>([\s\S]*?)<\/Route>/g) || [];
    const covers = adminRouteBlock.some(b => b.includes('/AdminPagamentos'));
    assert.ok(covers, '/AdminPagamentos deve estar dentro de um AdminRoute');
  });

  it('usa AdminRoute para /AdminAntecedentes', () => {
    const adminRouteBlock = src.match(/<Route element=\{<AdminRoute[^>]*\/>\}>([\s\S]*?)<\/Route>/g) || [];
    const covers = adminRouteBlock.some(b => b.includes('/AdminAntecedentes'));
    assert.ok(covers, '/AdminAntecedentes deve estar dentro de um AdminRoute');
  });

  it('usa AdminRoute para /admin/seo', () => {
    const adminRouteBlock = src.match(/<Route element=\{<AdminRoute[^>]*\/>\}>([\s\S]*?)<\/Route>/g) || [];
    const covers = adminRouteBlock.some(b => b.includes('/admin/seo'));
    assert.ok(covers, '/admin/seo deve estar dentro de um AdminRoute');
  });

  it('usa AdminRoute para /admin/marketing', () => {
    const adminRouteBlock = src.match(/<Route element=\{<AdminRoute[^>]*\/>\}>([\s\S]*?)<\/Route>/g) || [];
    const covers = adminRouteBlock.some(b => b.includes('/admin/marketing'));
    assert.ok(covers, '/admin/marketing deve estar dentro de um AdminRoute');
  });

  it('usa AdminRoute para /admin/metricas', () => {
    const adminRouteBlock = src.match(/<Route element=\{<AdminRoute[^>]*\/>\}>([\s\S]*?)<\/Route>/g) || [];
    const covers = adminRouteBlock.some(b => b.includes('/admin/metricas'));
    assert.ok(covers, '/admin/metricas deve estar dentro de um AdminRoute');
  });
});

// ---------------------------------------------------------------------------
// 3. pages.config.js exporta ADMIN_PAGE_NAMES com páginas admin
// ---------------------------------------------------------------------------
describe('pages.config.js — ADMIN_PAGE_NAMES exportado', () => {
  const src = read('src/pages.config.js');

  it('exporta ADMIN_PAGE_NAMES', () => {
    assert.ok(src.includes('export const ADMIN_PAGE_NAMES'), 'pages.config.js deve exportar ADMIN_PAGE_NAMES');
  });

  it('ADMIN_PAGE_NAMES inclui AdminAssinaturas', () => {
    assert.ok(src.includes("'AdminAssinaturas'") || src.includes('"AdminAssinaturas"'), 'AdminAssinaturas deve estar em ADMIN_PAGE_NAMES');
  });

  it('ADMIN_PAGE_NAMES inclui AdminUserManagement', () => {
    assert.ok(src.includes("'AdminUserManagement'") || src.includes('"AdminUserManagement"'), 'AdminUserManagement deve estar em ADMIN_PAGE_NAMES');
  });

  it('ADMIN_PAGE_NAMES inclui ManutencaoSistema', () => {
    assert.ok(src.includes("'ManutencaoSistema'") || src.includes('"ManutencaoSistema"'), 'ManutencaoSistema deve estar em ADMIN_PAGE_NAMES');
  });

  it('App.jsx filtra pages admin pelo ADMIN_PAGE_NAMES', () => {
    const appSrc = read('src/App.jsx');
    assert.ok(appSrc.includes('ADMIN_PAGE_NAMES'), 'App.jsx deve usar ADMIN_PAGE_NAMES para filtrar rotas');
  });
});
