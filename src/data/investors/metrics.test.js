import { describe, expect, it } from 'vitest';
import {
  DENSITY_SCENARIOS,
  INVESTOR_METRICS,
  OFFICIAL_SCENARIO,
  PLAN_PHASE_STATUS,
  PRICING,
  SCENARIO_ARR,
  SCENARIO_MRR,
  arrFor,
  formatBRL,
  formatMetric,
  formatNumber,
  mrrFor,
} from './metrics';
import { investorContent } from './content';

describe('fórmulas do modelo financeiro', () => {
  it('MRR é prestadores × preço', () => {
    expect(mrrFor(500, 59)).toBe(29500);
    expect(mrrFor(100, 19.9)).toBeCloseTo(1990, 6);
    expect(mrrFor(0, 59)).toBe(0);
  });

  it('ARR é o MRR anualizado', () => {
    expect(arrFor(500, 59)).toBe(354000);
    expect(arrFor(500, 59)).toBe(mrrFor(500, 59) * 12);
  });

  it('reproduz o cenário oficial do pacote de investidores', () => {
    expect(OFFICIAL_SCENARIO.providers).toBe(500);
    expect(OFFICIAL_SCENARIO.price).toBe(59);
    expect(SCENARIO_MRR).toBe(29500);
    expect(SCENARIO_ARR).toBe(354000);
  });

  it('preserva exatamente os preços hipotéticos publicados', () => {
    expect(PRICING.fundador).toBe(19.9);
    expect(PRICING.profissional).toBe(59);
    expect(PRICING.commissionMinPct).toBe(8);
    expect(PRICING.commissionMaxPct).toBe(12);
  });
});

describe('formatação em pt-BR', () => {
  it('formata moeda com o padrão brasileiro', () => {
    expect(formatBRL(29500).replace(/ /g, ' ')).toBe('R$ 29.500');
    expect(formatBRL(19.9, { decimals: 2 }).replace(/ /g, ' ')).toBe('R$ 19,90');
  });

  it('usa a forma compacta esperada na página', () => {
    expect(formatBRL(29500, { compact: true })).toBe('R$ 29,5 mil');
    expect(formatBRL(354000, { compact: true })).toBe('R$ 354 mil');
  });

  it('não quebra com valores inválidos', () => {
    expect(formatBRL(NaN)).toBe('—');
    expect(formatNumber(undefined)).toBe('—');
  });

  it('formata milhares com separador de ponto', () => {
    expect(formatNumber(1000)).toBe('1.000');
  });
});

describe('classificação de evidência dos indicadores', () => {
  const permitidas = ['fato', 'hipotese', 'hipoteseFutura', 'cenario', 'faltante', 'recomendacao', 'fonteExterna'];

  it('todo indicador declara unidade, período, classificação e fonte', () => {
    INVESTOR_METRICS.forEach((m) => {
      expect(m.unit, m.id).toBeTruthy();
      expect(m.period, m.id).toBeTruthy();
      expect(m.classification, m.id).toBeTruthy();
      expect(m.sourceKey, m.id).toBeTruthy();
    });
  });

  it('nenhum indicador é apresentado como fato comprovado', () => {
    INVESTOR_METRICS.forEach((m) => {
      expect(permitidas, m.id).toContain(m.classification);
      expect(m.classification, `${m.id} não pode ser "fato" sem tração comprovada`).not.toBe('fato');
    });
  });

  it('MRR e ARR são cenários ilustrativos, nunca resultado', () => {
    const mrr = INVESTOR_METRICS.find((m) => m.id === 'scenarioMrr');
    const arr = INVESTOR_METRICS.find((m) => m.id === 'scenarioArr');
    expect(mrr.classification).toBe('cenario');
    expect(arr.classification).toBe('cenario');
  });

  it('cada classificação usada tem rótulo nos três idiomas', () => {
    ['pt', 'es', 'en'].forEach((lang) => {
      INVESTOR_METRICS.forEach((m) => {
        expect(investorContent[lang].classification[m.classification], `${lang}/${m.id}`).toBeTruthy();
      });
    });
  });

  it('formatMetric devolve os valores exibidos na página', () => {
    const byId = Object.fromEntries(INVESTOR_METRICS.map((m) => [m.id, m]));
    expect(formatMetric(byId.scenarioProviders)).toBe('500');
    expect(formatMetric(byId.scenarioMrr)).toBe('R$ 29,5 mil');
    expect(formatMetric(byId.scenarioArr)).toBe('R$ 354 mil');
  });
});

describe('plano de 18 meses', () => {
  it('nenhuma janela é marcada como concluída sem evidência', () => {
    expect(PLAN_PHASE_STATUS).not.toContain('concluido');
    expect(PLAN_PHASE_STATUS).not.toContain('atual');
  });

  it('cobre todas as janelas do roadmap nos três idiomas', () => {
    ['pt', 'es', 'en'].forEach((lang) => {
      expect(investorContent[lang].plan18.roadmap.length, lang).toBe(PLAN_PHASE_STATUS.length);
    });
  });

  it('todo status usado tem rótulo traduzido', () => {
    ['pt', 'es', 'en'].forEach((lang) => {
      PLAN_PHASE_STATUS.forEach((status) => {
        expect(investorContent[lang].viz.planStatus[status], `${lang}/${status}`).toBeTruthy();
      });
    });
  });
});

describe('sensibilidade do gráfico', () => {
  it('usa as densidades do modelo oficial', () => {
    expect(DENSITY_SCENARIOS).toEqual([100, 250, 500, 1000]);
  });

  it('a densidade de 500 bate com o cenário destacado nos cards', () => {
    expect(mrrFor(500, PRICING.profissional)).toBe(SCENARIO_MRR);
  });
});
