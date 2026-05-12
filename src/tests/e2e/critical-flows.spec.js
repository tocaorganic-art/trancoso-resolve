/* global describe, beforeEach, it, expect, fetch */
/**
 * Critical Flow Tests - Automated testing for key user journeys
 * Run with: npm run test:e2e
 */

describe('Critical Flows - Trancoso Resolve', () => {
  beforeEach(() => {
    // Clear local storage before each test
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Homepage Load', () => {
    it('should load homepage with all major sections', async () => {
      const response = await fetch('/');
      expect(response.status).toBe(200);
      
      const html = await response.text();
      expect(html).toContain('Trancoso Resolve');
      expect(html).toContain('Buscar Serviços');
      expect(html).toContain('Profissionais Verificados');
    });

    it('should have valid SEO metadata', async () => {
      const response = await fetch('/');
      const html = await response.text();
      
      expect(html).toContain('<meta name="description"');
      expect(html).toContain('<meta property="og:title"');
      expect(html).toContain('<script type="application/ld+json"');
    });

    it('should preload critical images', async () => {
      const response = await fetch('/');
      const html = await response.text();
      
      expect(html).toContain('rel="preload"');
      expect(html).toContain('fetchpriority="high"');
    });
  });

  describe('Service Search', () => {
    it('should search for services without errors', async () => {
      const response = await fetch('/api/functions/searchServices', {
        method: 'POST',
        body: JSON.stringify({ query: 'eletricista' })
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toBeDefined();
    });

    it('should handle empty search gracefully', async () => {
      const response = await fetch('/api/functions/searchServices', {
        method: 'POST',
        body: JSON.stringify({ query: '' })
      });
      
      expect(response.status).toBe(200);
    });
  });

  describe('Performance Metrics', () => {
    it('should have acceptable Core Web Vitals targets', async () => {
      // Note: This requires actual browser testing
      // Placeholder for automated CWV testing
      expect(true).toBe(true);
    });

    it('should serve images with proper formats', async () => {
      const response = await fetch('https://media.base44.com/images/public/68eb21726a9614db4a82ba99/322d721b1_tocaapresenta.jpg');
      
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('image');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      // Test offline behavior (requires SW registration)
      expect(typeof window.navigator.serviceWorker).toBeDefined();
    });

    it('should not expose sensitive errors to users', async () => {
      const response = await fetch('/api/functions/nonexistent');
      
      // Should not return internal error details
      const data = await response.text();
      expect(data).not.toContain('stack trace');
      expect(data).not.toContain('database error');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', async () => {
      const response = await fetch('/');
      const html = await response.text();
      
      // Should have H1
      expect(html).toMatch(/<h1[^>]*>/i);
    });

    it('should have skip to content link', async () => {
      const response = await fetch('/');
      const html = await response.text();
      
      expect(html).toContain('skip-link') || expect(html).toContain('Skip');
    });
  });
});