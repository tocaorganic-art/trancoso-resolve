import TocaTrIAPremium from '@/components/assistente/TocaTrIAPremium';
import { OG_IMAGE, useSEO } from '@/hooks/useSEO';

export default function AssistentevirtualPage() {
  useSEO({
    title: 'TryA — Assistente de IA da Trancoso Resolve',
    description: 'Converse com o TryA, o assistente inteligente da Trancoso Resolve. Encontre o profissional certo para sua necessidade em segundos.',
    canonical: '/Assistentevirtual',
    ogImage: OG_IMAGE,
  });

  return <TocaTrIAPremium />;
}