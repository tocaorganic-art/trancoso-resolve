/**
 * KAN-19 — Contenção temporária do login social inseguro
 *
 * Testes estáticos que verificam o código-fonte dos componentes de
 * autenticação para garantir que:
 *   1. Nenhum botão social (Google/Microsoft/Facebook) é renderizado.
 *   2. O fluxo seguro de e-mail/senha permanece intacto.
 *   3. A mensagem informativa ao usuário está presente.
 *   4. Nenhuma chamada a loginWithProvider() existe na UI acessível.
 *
 * Por que análise estática?
 * O projeto usa Vite + JSX sem @babel/preset-react instalado para Jest.
 * Análise de fonte cobre todos os cenários exigidos sem novas dependências.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pagesDir = join(__dirname, '..');

const readPage = (filename) =>
  readFileSync(join(pagesDir, filename), 'utf8');

const collectSrcFiles = (dir, extensions) => {
  const result = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const isDir = statSync(full).isDirectory();
    if (isDir && entry !== 'node_modules' && entry !== '__tests__') {
      result.push(...collectSrcFiles(full, extensions));
    } else if (!isDir && extensions.some((e) => entry.endsWith(e))) {
      result.push(full);
    }
  }
  return result;
};

// ────────────────────────────────────────────────────────────
// Login.jsx
// ────────────────────────────────────────────────────────────
describe('Login.jsx — contenção social', () => {
  const src = readPage('Login.jsx');

  test('página não chama loginWithProvider', () => {
    assert.ok(
      !src.includes('loginWithProvider'),
      'Login.jsx não deve conter chamadas a loginWithProvider()',
    );
  });

  test('não existe botão Google', () => {
    assert.ok(
      !src.includes('Continuar com Google'),
      'Não deve haver botão "Continuar com Google"',
    );
    assert.ok(
      !src.includes('GoogleIcon'),
      'Não deve importar ou usar GoogleIcon',
    );
  });

  test('não existe botão Microsoft', () => {
    assert.ok(
      !src.includes('Continuar com Microsoft'),
      'Não deve haver botão "Continuar com Microsoft"',
    );
    assert.ok(
      !src.includes('MicrosoftIcon'),
      'Não deve haver componente MicrosoftIcon',
    );
  });

  test('não existe botão Facebook', () => {
    assert.ok(
      !src.includes('Continuar com Facebook'),
      'Não deve haver botão "Continuar com Facebook"',
    );
    assert.ok(
      !src.includes('FacebookIcon'),
      'Não deve haver componente FacebookIcon',
    );
  });

  test('não existe botão Apple', () => {
    assert.ok(
      !src.includes('loginWithProvider("apple"') &&
        !src.includes("loginWithProvider('apple'"),
      'Não deve haver referência a Apple login',
    );
  });

  test('divisor "ou continue com" foi removido', () => {
    assert.ok(
      !src.includes('ou continue com'),
      'Divisor social órfão deve ter sido removido',
    );
  });

  test('mensagem temporária de segurança está presente', () => {
    assert.ok(
      src.includes('temporariamente indisponível por segurança'),
      'Mensagem informativa de segurança deve aparecer na página',
    );
  });

  test('botão principal de e-mail permanece', () => {
    assert.ok(
      src.includes('Entrar com Email'),
      'Botão "Entrar com Email" deve permanecer disponível',
    );
    assert.ok(
      src.includes('redirectToLogin'),
      'Handler de login por e-mail (redirectToLogin) deve permanecer',
    );
  });

  test('fluxo de redirecionamento pós-login permanece', () => {
    assert.ok(
      src.includes('redirectAfterLogin'),
      'Função redirectAfterLogin deve permanecer',
    );
  });

  test('fluxo de 2FA permanece', () => {
    assert.ok(
      src.includes('TwoFactorVerification'),
      'Componente TwoFactorVerification deve permanecer importado e usado',
    );
    assert.ok(
      src.includes('twoFAState'),
      'Estado de 2FA deve permanecer',
    );
  });

  test('mensagem tem semântica acessível (role=note)', () => {
    assert.ok(
      src.includes('role="note"'),
      'A mensagem informativa deve ter role="note" para semântica adequada',
    );
  });

  test('ícone da mensagem tem aria-hidden para leitores de tela', () => {
    assert.ok(
      src.includes('aria-hidden="true"'),
      'Ícone decorativo da mensagem deve ter aria-hidden="true"',
    );
  });

  test('aria-label da mensagem está presente', () => {
    assert.ok(
      src.includes('aria-label="Aviso sobre login social"'),
      'Contêiner da mensagem deve ter aria-label descritivo',
    );
  });

  test('imports de ícones sociais foram removidos', () => {
    assert.ok(
      !src.includes('import GoogleIcon'),
      'Import de GoogleIcon deve ter sido removido',
    );
  });

  test('handlers de login social foram removidos', () => {
    assert.ok(
      !src.includes('handleGoogle') &&
        !src.includes('handleMicrosoft') &&
        !src.includes('handleFacebook'),
      'Todos os handlers sociais devem ter sido removidos',
    );
  });
});

// ────────────────────────────────────────────────────────────
// Register.jsx
// ────────────────────────────────────────────────────────────
describe('Register.jsx — contenção social', () => {
  const src = readPage('Register.jsx');

  test('página não chama loginWithProvider', () => {
    assert.ok(
      !src.includes('loginWithProvider'),
      'Register.jsx não deve conter chamadas a loginWithProvider()',
    );
  });

  test('não existe botão Google', () => {
    assert.ok(
      !src.includes('Continuar com Google'),
      'Não deve haver botão "Continuar com Google"',
    );
    assert.ok(
      !src.includes('GoogleIcon'),
      'Não deve importar ou usar GoogleIcon',
    );
  });

  test('não existe botão de qualquer outro provedor social', () => {
    assert.ok(
      !src.includes('MicrosoftIcon') &&
        !src.includes('FacebookIcon') &&
        !src.includes('loginWithProvider("apple"'),
      'Nenhum outro provedor social deve aparecer',
    );
  });

  test('mensagem temporária de segurança está presente', () => {
    assert.ok(
      src.includes('temporariamente indisponível por segurança'),
      'Mensagem informativa de segurança deve aparecer na página de cadastro',
    );
  });

  test('formulário de e-mail permanece', () => {
    assert.ok(
      src.includes('type="email"'),
      'Campo de e-mail deve permanecer',
    );
    assert.ok(
      src.includes('type="password"'),
      'Campo de senha deve permanecer',
    );
  });

  test('labels de acessibilidade permanecem', () => {
    assert.ok(
      src.includes('htmlFor="email"'),
      'Label para campo de e-mail deve permanecer (acessibilidade)',
    );
    assert.ok(
      src.includes('htmlFor="password"'),
      'Label para campo de senha deve permanecer (acessibilidade)',
    );
  });

  test('fluxo de OTP permanece', () => {
    assert.ok(
      src.includes('InputOTP'),
      'Componente InputOTP deve permanecer para verificação por e-mail',
    );
    assert.ok(
      src.includes('handleVerify'),
      'Handler de verificação OTP deve permanecer',
    );
  });

  test('handler de reenvio de código permanece', () => {
    assert.ok(
      src.includes('handleResend'),
      'Handler de reenvio de código OTP deve permanecer',
    );
  });

  test('mensagem tem semântica acessível (role=note)', () => {
    assert.ok(
      src.includes('role="note"'),
      'A mensagem informativa deve ter role="note"',
    );
  });

  test('handler handleGoogle foi removido junto com o botão', () => {
    assert.ok(
      !src.includes('handleGoogle'),
      'Handler handleGoogle deve ter sido removido',
    );
  });

  test('fluxo normal de cadastro não foi alterado', () => {
    assert.ok(
      src.includes('handleSubmit'),
      'Handler de submit do formulário deve permanecer',
    );
    assert.ok(
      src.includes('base44.auth.register'),
      'Chamada base44.auth.register deve permanecer',
    );
  });
});

// ────────────────────────────────────────────────────────────
// ResetPassword.jsx — fluxo seguro não deve ser afetado
// ────────────────────────────────────────────────────────────
describe('ResetPassword.jsx — KAN-19 não interfere', () => {
  const src = readPage('ResetPassword.jsx');

  test('página usa useSearchParams para ler o token de reset, não loginWithProvider', () => {
    assert.ok(
      src.includes('useSearchParams'),
      'ResetPassword usa React Router useSearchParams para o token de redefinição',
    );
    assert.ok(
      !src.includes('loginWithProvider'),
      'ResetPassword não usa loginWithProvider',
    );
  });

  test('token de reset é lido como parâmetro dedicado ("token")', () => {
    assert.ok(
      src.includes('searchParams.get("token")'),
      'Token de redefinição lido via searchParams.get("token") — fluxo próprio',
    );
  });

  test('fluxo de redefinição usa auth.resetPassword', () => {
    assert.ok(
      src.includes('resetPassword'),
      'Handler de redefinição de senha deve permanecer intacto',
    );
  });

  test('redireciona para /login após sucesso', () => {
    assert.ok(
      src.includes('/login'),
      'Redirecionamento para /login após reset deve permanecer',
    );
  });
});

// ────────────────────────────────────────────────────────────
// ForgotPassword.jsx — link de recuperação permanece
// ────────────────────────────────────────────────────────────
describe('ForgotPassword.jsx — KAN-19 não interfere', () => {
  const src = readPage('ForgotPassword.jsx');

  test('página não usa loginWithProvider', () => {
    assert.ok(
      !src.includes('loginWithProvider'),
      'ForgotPassword não deve usar loginWithProvider',
    );
  });

  test('link de retorno para /login permanece', () => {
    assert.ok(
      src.includes('/login'),
      'Link de retorno para login deve permanecer na recuperação de senha',
    );
  });
});

// ────────────────────────────────────────────────────────────
// Varredura global — nenhum chamador oculto em src/
// ────────────────────────────────────────────────────────────
describe('Varredura global — loginWithProvider ausente em todos os arquivos de UI', () => {
  const srcDir = join(__dirname, '..', '..');
  const uiFiles = collectSrcFiles(srcDir, ['.jsx', '.js', '.tsx', '.ts']);

  test('nenhum arquivo em src/ chama loginWithProvider', () => {
    const violators = uiFiles.filter((f) => {
      const content = readFileSync(f, 'utf8');
      return content.includes('loginWithProvider');
    });
    assert.deepEqual(
      violators,
      [],
      `Arquivos com loginWithProvider ainda presentes: ${violators.join(', ')}`,
    );
  });
});
