import { test, expect } from '@playwright/test';

test.describe('Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login primeiro
    await page.goto('/');
    await page.click('button:has-text("Entrar")');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Test@123456');
    await page.click('button:has-text("Entrar")');
    await page.waitForURL('**/Home', { timeout: 5000 });
  });

  test('should create payment intent for service booking', async ({ page }) => {
    // Navigate to service
    await page.goto('/ServicosCategoria');
    await page.click('[data-testid="provider-card"]:first-child');
    
    // Book service
    await page.click('button:has-text("Contratar")');
    await page.fill('input[name="date"]', '2026-06-01');
    await page.fill('input[name="time"]', '14:00');
    await page.click('button:has-text("Agendar")');
    
    // Payment
    await expect(page).toHaveURL(/.*Pagamento/);
    expect(page.locator('text=Valor total')).toBeVisible();
  });

  test('should handle payment with card token', async ({ page }) => {
    await page.goto('/Financeiro');
    await page.click('button:has-text("Pagar Plano")');
    
    const frameHandle = await page.$('iframe[title*="Stripe"]');
    const frame = await frameHandle.contentFrame();
    
    await frame.fill('[name="cardnumber"]', '4242424242424242');
    await frame.fill('[name="exp-date"]', '12/26');
    await frame.fill('[name="cvc"]', '123');
    
    await page.click('button:has-text("Confirmar Pagamento")');
    await page.waitForURL('**/sucesso', { timeout: 10000 });
    
    expect(page.url()).toContain('sucesso');
  });

  test('should display payment errors correctly', async ({ page }) => {
    await page.goto('/Financeiro');
    await page.click('button:has-text("Pagar Plano")');
    
    const frameHandle = await page.$('iframe[title*="Stripe"]');
    const frame = await frameHandle.contentFrame();
    
    // Use test card that declines
    await frame.fill('[name="cardnumber"]', '4000000000000002');
    await frame.fill('[name="exp-date"]', '12/26');
    await frame.fill('[name="cvc"]', '123');
    
    await page.click('button:has-text("Confirmar Pagamento")');
    
    const errorMsg = page.locator('text=Cartão recusado');
    await expect(errorMsg).toBeVisible();
  });
});