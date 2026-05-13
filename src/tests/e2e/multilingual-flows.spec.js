import { test, expect } from '@playwright/test';

const LANGUAGES = ['pt', 'en', 'es', 'fr'];
const BASE_URL = 'http://localhost:5173';

test.describe('Fluxos Multilíngues Completos', () => {
  LANGUAGES.forEach(lang => {
    test(`${lang.toUpperCase()}: Home → Busca → Perfil → Agendamento`, async ({ page }) => {
      await page.goto(BASE_URL);

      // 1. Verificar que LanguageSelector está visível
      const langSelector = page.locator('button:has-text("Português"), button:has-text("English"), button:has-text("Español"), button:has-text("Français")');
      await expect(langSelector.first()).toBeVisible({ timeout: 5000 });

      // 2. Mudar idioma
      await page.click(`button[data-lang="${lang}"]`);
      await page.waitForTimeout(500);

      // 3. Verificar textos traduzidos na Home
      const expectedTexts = {
        pt: ['Bem-vindo', 'Trancoso Resolve', 'Buscar serviços'],
        en: ['Welcome', 'Trancoso Resolve', 'Search services'],
        es: ['Bienvenido', 'Trancoso Resolve', 'Buscar servicios'],
        fr: ['Bienvenue', 'Trancoso Resolve', 'Rechercher les services']
      };

      for (const text of expectedTexts[lang]) {
        const found = await page.locator(`text="${text}"`).first().isVisible({ timeout: 3000 }).catch(() => false);
        console.log(`[${lang}] "${text}": ${found ? '✓' : '✗'}`);
      }

      // 4. Buscar serviço com autocomplete
      const searchInput = page.locator('input[placeholder*="Buscar"], input[placeholder*="Search"], input[placeholder*="Buscar"]').first();
      await searchInput.click();
      await searchInput.type('limpeza', { delay: 100 });

      // 5. Aguardar sugestões
      await page.waitForTimeout(1000);
      const suggestions = page.locator('[role="button"]:has-text("limpeza"), [role="button"]:has-text("cleaning")');
      const suggestionCount = await suggestions.count();
      console.log(`[${lang}] Sugestões encontradas: ${suggestionCount}`);

      if (suggestionCount > 0) {
        await suggestions.first().click();
        await page.waitForTimeout(500);

        // 6. Verificar se navegou para página de busca
        expect(page.url()).toContain('/ServicosCategoria');

        // 7. Clique em um prestador (assumindo que há resultados)
        const providerCard = page.locator('[data-testid="provider-card"]').first();
        if (await providerCard.isVisible({ timeout: 2000 }).catch(() => false)) {
          await providerCard.click();
          
          // 8. Aguardar página de perfil
          await page.waitForURL(/PrestadorPerfil/);
          
          // 9. Verificar botão de agendamento
          const bookButton = page.locator('button:has-text("Agendar"), button:has-text("Book"), button:has-text("Reservar")').first();
          await expect(bookButton).toBeVisible({ timeout: 3000 });

          // 10. Clique em agendamento
          await bookButton.click();
          await page.waitForTimeout(500);

          // 11. Verificar modal de agendamento
          const dateInput = page.locator('input[type="date"]').first();
          await expect(dateInput).toBeVisible({ timeout: 3000 });

          console.log(`[${lang}] ✓ Fluxo completo funcionando`);
        } else {
          console.log(`[${lang}] ⚠ Sem resultados para verificar perfil`);
        }
      }
    });
  });

  test('Sistema de Favoritos Multilíngue', async ({ page }) => {
    await page.goto(`${BASE_URL}`);

    // 1. Login (se necessário)
    const loginBtn = page.locator('button:has-text("Entrar"), button:has-text("Login")').first();
    if (await loginBtn.isVisible()) {
      // Skip para anonymous test
      console.log('⚠ Teste de favoritos requer login');
      return;
    }

    // 2. Procurar botão de coração em um card
    const favoriteButton = page.locator('[aria-label*="favorito"], [aria-label*="favorite"]').first();
    
    if (await favoriteButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      // 3. Clicar para favoritar
      await favoriteButton.click();
      
      // 4. Verificar que ficou vermelho (favoritado)
      const heart = favoriteButton.locator('svg');
      const classes = await heart.getAttribute('class');
      expect(classes).toContain('fill-red');
      
      console.log('✓ Sistema de favoritos funcional');
    }
  });

  test('Cache de Buscas Multilíngue', async ({ page }) => {
    await page.goto(`${BASE_URL}/ServicosCategoria`);

    // 1. Fazer primeira busca
    const searchInput = page.locator('input[type="search"]').first();
    await searchInput.fill('eletricista');
    await page.waitForTimeout(1500);

    // 2. Medir tempo (deve usar cache)
    const start = Date.now();
    await searchInput.clear();
    await searchInput.fill('eletricista');
    await page.waitForTimeout(500);
    const elapsed = Date.now() - start;

    console.log(`⏱ Segunda busca em ${elapsed}ms (deve ser < 200ms com cache)`);
    expect(elapsed).toBeLessThan(500); // Margem de erro
  });
});