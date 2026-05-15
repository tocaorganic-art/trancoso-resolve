import ServicoLocalPage from '@/components/servicos/ServicoLocalPage';

export default function EletricistaTrancoso() {
  return (
    <ServicoLocalPage
      title="Eletricista em Trancoso – Instalações, Manutenção e Emergências | Trancoso Resolve"
      metaDescription="Encontre eletricista em Trancoso para instalações elétricas, manutenção, troca de disjuntores e emergências. Peça orçamento rápido e receba contatos de prestadores locais pela Trancoso Resolve."
      h1="Eletricista em Trancoso: Instalações, Manutenção e Atendimento Rápido"
      intro="Está precisando de eletricista em Trancoso para resolver um problema urgente ou fazer uma instalação com segurança? Pela Trancoso Resolve você encontra profissionais locais preparados para atender casas, comércios e imóveis de temporada."
      servicesTitle="Serviços de eletricista mais buscados em Trancoso"
      services={[
        'Instalação e troca de tomadas, interruptores e luminárias',
        'Manutenção em quadros de energia e disjuntores',
        'Identificação e correção de curtos e quedas de energia',
        'Instalação de chuveiro elétrico e aquecedores',
        'Atendimento para imóveis de temporada e comércio local',
      ]}
      howTitle="Como pedir eletricista pela Trancoso Resolve"
      howText="Você descreve o problema elétrico ou o serviço que precisa, informa a localização em Trancoso e a urgência do atendimento. Seu pedido é encaminhado para eletricistas locais, e você recebe contato direto para combinar valores e horários."
      cta="Peça agora um eletricista em Trancoso descrevendo o que você precisa e receba retorno de prestadores locais de confiança."
      ctaButton="Pedir orçamento de eletricista em Trancoso"
      category="Eletricista"
      heroEmoji="⚡"
    />
  );
}