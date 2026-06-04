import ServicoLocalPage from '@/components/servicos/ServicoLocalPage';

export default function EletricistaPortoSeguro() {
  return (
    <ServicoLocalPage
      title="Eletricista em Porto Seguro | Trancoso Resolve"
      metaDescription="Encontre eletricista verificado em Porto Seguro, BA. Profissionais avaliados, atendimento rápido. Solicite agora pela Trancoso Resolve."
      h1="Eletricista em Porto Seguro"
      intro="Para instalações e reparos elétricos em Porto Seguro com segurança e agilidade. A Trancoso Resolve conecta você com eletricistas verificados, prontos para atender residências, pousadas e empreendimentos na região."
      servicesTitle="Serviços de eletricista em Porto Seguro"
      services={[
        'Instalação e manutenção elétrica residencial e comercial',
        'Atendimento de emergências elétricas em Porto Seguro',
        'Instalação de ar-condicionado, chuveiros elétricos e equipamentos',
        'Rede de tomadas e iluminação para reformas e novas construções',
        'Vistoria e laudo elétrico para imóveis e pousadas',
        'Instalação de quadros de distribuição e disjuntores',
      ]}
      howTitle="Por que contratar eletricista pela Trancoso Resolve em Porto Seguro?"
      howText="Eletricistas com verificação de identidade e avaliações de clientes anteriores. Você agenda diretamente e recebe profissionais habilitados — com segurança e sem complicações."
      cta="Descreva o problema elétrico e receba contato de eletricistas verificados em Porto Seguro."
      ctaButton="Contratar eletricista em Porto Seguro"
      category="Eletricista"
      heroEmoji="⚡"
    />
  );
}