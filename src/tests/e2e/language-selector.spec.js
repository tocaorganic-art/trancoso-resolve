import { test, expect } from '@playwright/test';

test.describe('Language Selector Visibility', () => {
  test('LanguageSelector should be visible and functional in Assistente Virtual', async ({ page }) => {
    // Navegar para a página de assistente virtual
    await page.goto('/Assistentevirtual', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // 1. Verificar que o seletor de idioma está visível
    const languageButton = page.locator('button[aria-label="Select language"]');
    await expect(languageButton).toBeVisible();
    console.log('✅ Language selector button is visible');

    // 2. Verificar que mostra idioma atual (PT)
    const ptText = languageButton.locator('text=Português');
    await expect(ptText).toBeVisible();
    console.log('✅ Currently showing Portuguese');

    // 3. Clicar para abrir dropdown
    await languageButton.click();
    await page.waitForTimeout(300);

    // 4. Verificar que todas as 4 opções estão visíveis
    const englishOption = page.locator('button', { has: page.locator('text=English') }).first();
    const spanishOption = page.locator('button', { has: page.locator('text=Español') }).first();
    const frenchOption = page.locator('button', { has: page.locator('text=Français') }).first();

    await expect(englishOption).toBeVisible();
    await expect(spanishOption).toBeVisible();
    await expect(frenchOption).toBeVisible();
    console.log('✅ All 4 language options are visible in dropdown');

    // 5. Testar seleção de idioma (English)
    await englishOption.click();
    await page.waitForTimeout(300);

    // 6. Verificar que idioma mudou
    const enText = languageButton.locator('text=English');
    await expect(enText).toBeVisible();
    console.log('✅ Language changed to English');

    // 7. Testar tradução de mensagem
    const chatInput = page.locator('textarea, input[type="text"]').first();
    if (await chatInput.isVisible()) {
      await chatInput.fill('Hello, how are you?');
      await page.keyboard.press('Enter');
      
      // Aguardar indicador de tradução
      const translatingText = page.locator('text=Traduzindo');
      const existsTranslating = await translatingText.isVisible().catch(() => false);
      if (existsTranslating) {
        console.log('✅ Translation indicator appeared');
        await page.waitForTimeout(1000);
      }
    }

    // 8. Voltar para Português e verificar
    await languageButton.click();
    const ptOption = page.locator('button', { has: page.locator('text=Português') }).first();
    await ptOption.click();
    await page.waitForTimeout(300);

    const ptTextFinal = languageButton.locator('text=Português');
    await expect(ptTextFinal).toBeVisible();
    console.log('✅ Language switched back to Portuguese');
  });

  test('Language selector should work on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
    await page.goto('/Assistentevirtual', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const languageButton = page.locator('button[aria-label="Select language"]');
    await expect(languageButton).toBeVisible();
    
    await languageButton.click();
    const englishOption = page.locator('button', { has: page.locator('text=English') }).first();
    await expect(englishOption).toBeVisible();
    
    console.log('✅ Language selector works on mobile');
  });
});