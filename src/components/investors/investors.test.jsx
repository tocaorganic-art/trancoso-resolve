import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { setReducedMotion } from '@/test/setup';
import { InvestorLangProvider } from './InvestorLangContext';
import FinancialCalculator, { computeScenario, sanitizePrice } from './FinancialCalculator';
import ScenarioChartSection from './ScenarioChartSection';
import ProblemSection from './ProblemSection';
import EcosystemSection from './EcosystemSection';
import Plan18MonthsSection from './Plan18MonthsSection';
import UseOfFundsSection from './UseOfFundsSection';
import AnimatedCounter from './AnimatedCounter';
import { investorContent } from '@/data/investors/content';

const renderWithLang = (ui) => render(<InvestorLangProvider>{ui}</InvestorLangProvider>);
const pt = investorContent.pt;

describe('lógica da calculadora', () => {
  it('sanitizePrice rejeita negativos e entradas inválidas', () => {
    expect(sanitizePrice(-1)).toBe(0);
    expect(sanitizePrice(-0.01)).toBe(0);
    expect(sanitizePrice('abc')).toBe(0);
    expect(sanitizePrice('')).toBe(0);
    expect(sanitizePrice(59)).toBe(59);
    expect(sanitizePrice('19.9')).toBe(19.9);
  });

  it('computeScenario soma os dois planos', () => {
    expect(computeScenario({ fundadorProviders: 0, profissionalProviders: 500, fundadorPrice: 19.9, profissionalPrice: 59 })).toEqual({
      mrr: 29500,
      arr: 354000,
      totalProviders: 500,
    });
  });

  it('computeScenario combina planos diferentes', () => {
    const r = computeScenario({ fundadorProviders: 100, profissionalProviders: 100, fundadorPrice: 19.9, profissionalPrice: 59 });
    expect(r.mrr).toBeCloseTo(7890, 6);
    expect(r.arr).toBeCloseTo(94680, 6);
    expect(r.totalProviders).toBe(200);
  });

  it('zera com base vazia', () => {
    const r = computeScenario({ fundadorProviders: 0, profissionalProviders: 0, fundadorPrice: 19.9, profissionalPrice: 59 });
    expect(r.mrr).toBe(0);
    expect(r.arr).toBe(0);
  });
});

describe('calculadora na tela', () => {
  it('abre no cenário oficial de 500 × R$ 59', () => {
    renderWithLang(<FinancialCalculator />);
    expect(screen.getByText('R$ 29.500'.replace(/ /g, ' '))).toBeInTheDocument();
    expect(screen.getByText('R$ 354.000'.replace(/ /g, ' '))).toBeInTheDocument();
  });

  it('recalcula ao mover o slider', () => {
    renderWithLang(<FinancialCalculator />);
    fireEvent.change(screen.getByLabelText(pt.calculator.profissionalLabel), { target: { value: '1000' } });
    expect(screen.getByText('R$ 59.000'.replace(/ /g, ' '))).toBeInTheDocument();
  });

  it('avisa e não aceita preço negativo', () => {
    renderWithLang(<FinancialCalculator />);
    const price = screen.getByLabelText(pt.calculator.profissionalPriceLabel);
    fireEvent.change(price, { target: { value: '-10' } });
    expect(screen.getByRole('alert')).toHaveTextContent(pt.viz.calculator.invalidPrice);
    expect(price).toHaveAttribute('aria-invalid', 'true');
    // MRR e ARR não podem ficar negativos — ambos zeram e aparecem como "R$ 0".
    expect(screen.getAllByText('R$ 0'.replace(/ /g, ' ')).length).toBeGreaterThanOrEqual(2);
  });

  it('o botão de restaurar volta ao cenário oficial', () => {
    renderWithLang(<FinancialCalculator />);
    fireEvent.change(screen.getByLabelText(pt.calculator.profissionalLabel), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: new RegExp(pt.calculator.resetLabel.slice(0, 20), 'i') }));
    expect(screen.getByText('R$ 29.500'.replace(/ /g, ' '))).toBeInTheDocument();
  });

  it('mostra as premissas do cálculo', () => {
    renderWithLang(<FinancialCalculator />);
    expect(screen.getByText(pt.viz.calculator.assumptionsTitle)).toBeInTheDocument();
    pt.viz.calculator.assumptions.forEach((a) => expect(screen.getByText(a)).toBeInTheDocument());
  });

  it('anuncia os resultados por aria-live', () => {
    const { container } = renderWithLang(<FinancialCalculator />);
    expect(container.querySelector('[aria-live="polite"]')).toBeTruthy();
  });
});

describe('renderização das seções', () => {
  it('problema traz os cards e a representação conceitual', () => {
    renderWithLang(<ProblemSection />);
    expect(screen.getByRole('heading', { level: 2, name: pt.problem.title })).toBeInTheDocument();
    pt.problem.cards.forEach((c) => expect(screen.getByText(c.title)).toBeInTheDocument());
    expect(screen.getByRole('img', { name: pt.viz.flow.caption })).toBeInTheDocument();
  });

  it('ecossistema lista todos os participantes', () => {
    renderWithLang(<EcosystemSection />);
    Object.values(pt.viz.ecosystem.nodes).forEach((node) => {
      expect(screen.getAllByText(node.label).length).toBeGreaterThan(0);
    });
  });

  it('ecossistema é operável por teclado', () => {
    renderWithLang(<EcosystemSection />);
    const nodes = screen.getAllByRole('button');
    expect(nodes.length).toBeGreaterThan(0);
    // SVG renderiza o atributo em minúsculas ("tabindex"), diferente da prop React (tabIndex).
    nodes.forEach((n) => expect(n).toHaveAttribute('tabindex', '0'));
    fireEvent.focus(nodes[0]);
    expect(screen.getAllByText(pt.viz.ecosystem.nodes.prestadores.desc).length).toBeGreaterThan(0);
  });

  it('uso de capital soma 100% e declara a informação pendente', () => {
    renderWithLang(<UseOfFundsSection />);
    // "35%" aparece tanto no card visível quanto na tabela acessível (sr-only) do gráfico.
    pt.useOfFunds.items.forEach((i) => expect(screen.getAllByText(`${i.pct}%`).length).toBeGreaterThan(0));
    expect(screen.getByText(pt.viz.fundsPending)).toBeInTheDocument();
  });
});

describe('gráfico de cenário', () => {
  it('mostra cada indicador com classificação, período e fonte', () => {
    renderWithLang(<ScenarioChartSection />);
    expect(screen.getAllByText(pt.classification.cenario).length).toBeGreaterThanOrEqual(3);
    expect(screen.getAllByText(pt.viz.sources.modeloFinanceiro).length).toBe(4);
    expect(screen.getAllByText(pt.viz.periodLabel + ':').length).toBe(4);
  });

  it('nunca rotula um indicador como fato', () => {
    renderWithLang(<ScenarioChartSection />);
    expect(screen.queryByText(pt.classification.fato)).toBeNull();
  });

  it('oferece tabela equivalente com todas as densidades', () => {
    renderWithLang(<ScenarioChartSection />);
    const table = screen.getByRole('table');
    pt.viz.chartColumns.forEach((col) => expect(within(table).getByText(col)).toBeInTheDocument());
    ['100', '250', '500', '1000'].forEach((d) => expect(within(table).getByText(d)).toBeInTheDocument());
    expect(within(table).getByText('R$ 29.500'.replace(/ /g, ' '))).toBeInTheDocument();
  });

  it('permite desligar uma série por teclado', () => {
    renderWithLang(<ScenarioChartSection />);
    const toggle = screen.getByRole('button', { name: pt.scenarioChart.chartLegendProfissional });
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('timeline do plano de 18 meses', () => {
  it('não marca nenhuma janela como concluída', () => {
    renderWithLang(<Plan18MonthsSection />);
    expect(screen.queryByText(pt.viz.planStatus.concluido)).toBeNull();
    expect(screen.queryByText(pt.viz.planStatus.atual)).toBeNull();
  });

  it('navega pelas janelas com as setas do teclado', () => {
    renderWithLang(<Plan18MonthsSection />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(pt.plan18.roadmap.length);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });
    expect(screen.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'End' });
    expect(screen.getAllByRole('tab').at(-1)).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'Home' });
    expect(screen.getAllByRole('tab')[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('usa roving tabindex: só a janela ativa é focável', () => {
    renderWithLang(<Plan18MonthsSection />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('tabIndex', '0');
    tabs.slice(1).forEach((tab) => expect(tab).toHaveAttribute('tabIndex', '-1'));
  });

  it('o painel mostra o gate da janela selecionada', () => {
    renderWithLang(<Plan18MonthsSection />);
    expect(screen.getByRole('tabpanel')).toHaveTextContent(pt.plan18.roadmap[0].gate);
  });
});

describe('movimento reduzido', () => {
  it('o contador mostra o valor final de imediato', () => {
    setReducedMotion(true);
    render(<AnimatedCounter value={29500} format={(v) => String(Math.round(v))} />);
    expect(screen.getAllByText('29500').length).toBeGreaterThan(0);
  });

  it('as seções seguem com todo o conteúdo sob prefers-reduced-motion', () => {
    setReducedMotion(true);
    renderWithLang(<ScenarioChartSection />);
    expect(screen.getByRole('heading', { level: 2, name: pt.scenarioChart.title })).toBeInTheDocument();
    expect(screen.getAllByText(pt.viz.sources.modeloFinanceiro).length).toBe(4);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('a timeline continua navegável sob movimento reduzido', () => {
    setReducedMotion(true);
    renderWithLang(<Plan18MonthsSection />);
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });
    expect(screen.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true');
  });
});

describe('hierarquia semântica', () => {
  it('cada seção usa h2 para o título principal', () => {
    renderWithLang(
      <>
        <ProblemSection />
        <EcosystemSection />
      </>
    );
    const h2s = screen.getAllByRole('heading', { level: 2 });
    expect(h2s.length).toBe(2);
  });

  it('a alternativa textual do gráfico tem legenda', () => {
    renderWithLang(<UseOfFundsSection />);
    expect(screen.getByRole('table')).toHaveAccessibleName(pt.viz.fundsChartTitle);
  });
});
