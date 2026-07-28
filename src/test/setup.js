import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom não implementa nenhuma das APIs que as animações e os gráficos usam.
let motionPreference = 'no-preference';

export function setReducedMotion(reduce) {
  motionPreference = reduce ? 'reduce' : 'no-preference';
}

if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', { writable: true, value: () => ({}) });
}

window.matchMedia = (query) => ({
  matches: query.includes('prefers-reduced-motion') && motionPreference === 'reduce',
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  // Entra em vista imediatamente, para que os gráficos montem nos testes.
  observe(target) {
    this.callback([{ isIntersecting: true, target, intersectionRatio: 1 }], this);
  }

  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

window.IntersectionObserver = MockIntersectionObserver;
global.IntersectionObserver = MockIntersectionObserver;

window.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

window.scrollTo = vi.fn();
Element.prototype.scrollIntoView = vi.fn();

// jsdom expõe navigator.language como "en-US" por padrão, o que fazia
// InvestorLangProvider detectar inglês em vez de português nos testes.
Object.defineProperty(window.navigator, 'language', { value: 'pt-BR', configurable: true });

afterEach(() => {
  cleanup();
  setReducedMotion(false);
  // InvestorLangProvider persiste o idioma escolhido em localStorage; sem limpar,
  // um teste que troca de idioma vaza a preferência para os testes seguintes.
  window.localStorage.clear();
});
