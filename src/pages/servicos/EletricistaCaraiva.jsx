import ServicoLocalPage from '@/components/servicos/ServicoLocalPage';

export default function EletricistaCaraiva() {
  return (
    <ServicoLocalPage
      title="Eletricista em Caraíva | Trancoso Resolve"
      metaDescription="Encontre eletricista verificado em Caraíva, BA. Profissionais avaliados para sua pousada ou villa. Solicite agora pela Trancoso Resolve."
      h1="Eletricista em Caraíva"
      intro="Problemas elétricos em Caraíva exigem solução rápida e profissional. Nossa plataforma conecta você com eletricistas verificados, experientes em instalações residenciais, pousadas e imóveis de temporada na região."
      servicesTitle="Serviços de eletricista em Caraíva"
      services={[
        'Instalação e manutenção elétrica residencial em pousadas e villas',
        'Atendimento de emergências elétricas: curtos, disjuntores, queda de energia',
        'Instalação de ar-condicionado, chuveiros elétricos e equipamentos',
        'Rede de tomadas e iluminação para reformas e construções',
        'Vistoria e laudo elétrico para imóveis de aluguel por temporada',
        'Instalação de sistemas de segurança e câmeras',
      ]}
      howTitle="Por que contratar eletricista pela Trancoso Resolve em Caraíva?"
      howText="Todos os eletricistas da plataforma passam por verificação de identidade e têm avaliações de clientes anteriores. Você agenda diretamente e recebe profissionais habilitados para atuar em Caraíva e região — com segurança e agilidade."
      cta="Descreva o problema elétrico e receba contato de eletricistas verificados em Caraíva, BA."
      ctaButton="Contratar eletricista em Caraíva"
      category="Eletricista"
      heroEmoji="⚡"
    />
  );
}