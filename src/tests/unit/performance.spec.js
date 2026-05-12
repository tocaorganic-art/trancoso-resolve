/* global describe, it, expect, require */
/**
 * Performance Unit Tests
 */

describe('Performance Utilities', () => {
  describe('Image Optimization', () => {
    it('should generate optimized image URLs', () => {
      const { getOptimizedImageUrl } = require('../../src/lib/imageOptimization');
      
      const url = getOptimizedImageUrl('https://example.com/image.jpg', {
        width: 800,
        quality: 80
      });
      
      expect(typeof url).toBe('string');
    });

    it('should generate srcset for responsive images', () => {
      const { getSrcSet } = require('../../src/lib/imageOptimization');
      
      const srcset = getSrcSet('https://example.com/image.jpg');
      expect(srcset).toContain('640w');
      expect(srcset).toContain('1920w');
    });
  });

  describe('Error Tracking', () => {
    it('should capture exceptions', () => {
      const { errorTracker } = require('../../src/components/optimization/SentryInit');
      
      expect(() => {
        errorTracker.captureException(new Error('Test error'), { test: true });
      }).not.toThrow();
    });

    it('should capture messages with context', () => {
      const { errorTracker } = require('../../src/components/optimization/SentryInit');
      
      expect(() => {
        errorTracker.captureMessage('Test message', 'info', { action: 'test' });
      }).not.toThrow();
    });
  });
});