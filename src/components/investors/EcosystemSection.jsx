import Section from './Section';
import EcosystemGraph from './EcosystemGraph';
import { useInvestorLang } from './InvestorLangContext';
import { ECOSYSTEM_NODE_IDS } from '@/data/investors/metrics';

export default function EcosystemSection() {
  const { t } = useInvestorLang();
  const e = t.viz.ecosystem;

  const nodes = ECOSYSTEM_NODE_IDS.map((id) => ({ id, ...e.nodes[id] }));

  return (
    <Section id="ecossistema" eyebrow={e.eyebrow} title={e.title} subtitle={e.description} tone="sand">
      <EcosystemGraph centerLabel={e.centerLabel} nodes={nodes} hint={e.hint} />
    </Section>
  );
}
