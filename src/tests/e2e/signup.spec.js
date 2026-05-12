import { test, expect } from '@playwright/test';

test.describe('Signup Flow', () => {
  test('should register new client user successfully', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Entrar")');
    await page.waitForURL('**/login', { timeout: 5000 });
    
    await page.fill('input[type="email"]', `client${Date.now()}@test.com`);
    await page.fill('input[type="password"]', 'Test@123456');
    await page.click('button:has-text("Criar")');
    
    await page.waitForURL('**/CadastroTipo', { timeout: 10000 });
    expect(page.url()).toContain('CadastroTipo');
  });

  test('should register new provider user successfully', async ({ page }) => {
    await page.goto('/SejaPrestador');
    await page.click('button:has-text("Começar")');
    await page.waitForURL('**/login', { timeout: 5000 });
    
    await page.fill('input[type="email"]', `provider${Date.now()}@test.com`);
    await page.fill('input[type="password"]', 'Test@123456');
    await page.click('button:has-text("Criar")');
    
    await page.waitForURL('**/CadastroTipo', { timeout: 10000 });
    await page.click('button:has-text("Prestador")');
    
    await expect(page).toHaveURL(/.*Dashboard/);
  });

  test('should show validation errors on invalid input', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Entrar")');
    
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', '123');
    await page.click('button:has-text("Criar")');
    
    const error = page.locator('text=Email inválido');
    await expect(error).toBeVisible();
  });
});