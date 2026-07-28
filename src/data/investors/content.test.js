import { describe, expect, it } from 'vitest';
import { LANGS, investorContent } from './content';

const LANG_CODES = LANGS.map((l) => l.code);

function keyPaths(obj, prefix = '') {
  return Object.entries(obj).flatMap(([key, value]) =>
    value && typeof value === 'object' && !Array.isArray(value) ? keyPaths(value, `${prefix}${key}.`) : [`${prefix}${key}`]
  );
}

describe('conteúdo multilíngue', () => {
  it('expõe os três idiomas declarados', () => {
    expect(LANG_CODES).toEqual(['pt', 'es', 'en']);
    LANG_CODES.forEach((code) => expect(investorContent[code], code).toBeTruthy());
  });

  it('ES e EN têm exatamente as mesmas chaves que PT', () => {
    const base = keyPaths(investorContent.pt).sort();
    ['es', 'en'].forEach((lang) => {
      const current = keyPaths(investorContent[lang]).sort();
      expect(current, `chaves divergentes em ${lang}`).toEqual(base);
    });
  });

  it('nenhum texto está vazio', () => {
    LANG_CODES.forEach((lang) => {
      keyPaths(investorContent[lang]).forEach((path) => {
        const value = path.split('.').reduce((acc, k) => acc[k], investorContent[lang]);
        if (typeof value === 'string') expect(value.trim(), `${lang}.${path}`).not.toBe('');
      });
    });
  });
});

describe('disciplina de evidência do conteúdo', () => {
  it('o hero avisa que a tese está em validação e não promete retorno', () => {
    expect(investorContent.pt.hero.stripe).toContain('Sem promessa de retorno');
    expect(investorContent.pt.hero.badge.toLowerCase()).toContain('validar');
  });

  it('o FAQ nega explicitamente que o MRR ilustrativo já exista', () => {
    const item = investorContent.pt.faq.items.find((i) => i.q.includes('29,5'));
    expect(item).toBeTruthy();
    expect(item.a.startsWith('Não')).toBe(true);
  });

  it('os planos de receita são hipóteses, nunca fatos', () => {
    LANG_CODES.forEach((lang) => {
      investorContent[lang].revenueModel.plans.forEach((plan) => {
        expect(['hipotese', 'hipoteseFutura'], `${lang}/${plan.name}`).toContain(plan.classification);
      });
    });
  });

  it('preserva os preços publicados em todos os idiomas', () => {
    // Cada idioma tem sua própria formatação de número (pt-BR usa vírgula decimal
    // e espaço antes do R$; en usa ponto decimal e sem espaço) — o valor numérico
    // e a faixa de comissão são os mesmos nos três.
    const expected = {
      pt: ['R$ 19,90', 'R$ 59'],
      es: ['R$ 19,90', 'R$ 59'],
      en: ['R$19.90', 'R$59'],
    };
    LANG_CODES.forEach((lang) => {
      const prices = investorContent[lang].revenueModel.plans.map((p) => p.price);
      expected[lang].forEach((price) => expect(prices, lang).toContain(price));
      expect(prices, lang).toContain('8–12%');
    });
  });

  it('o uso de capital soma 100% e não inventa valor de rodada', () => {
    LANG_CODES.forEach((lang) => {
      const items = investorContent[lang].useOfFunds.items;
      expect(items.reduce((sum, i) => sum + i.pct, 0), lang).toBe(100);
      items.forEach((item) => expect(item, `${lang}/${item.label}`).not.toHaveProperty('amount'));
    });
  });

  it('o rodapé mantém o aviso de que projeções não são tração', () => {
    LANG_CODES.forEach((lang) => {
      expect(investorContent[lang].footer.disclaimer.length, lang).toBeGreaterThan(80);
    });
  });

  it('as métricas de KPI seguem sem resultado atribuído', () => {
    const statuses = investorContent.pt.metrics.groups.flatMap((g) => g.items.map((i) => i.status));
    statuses.forEach((s) => expect(['A medir', 'A definir', 'A instrumentar', 'Sem dado']).toContain(s));
  });
});
