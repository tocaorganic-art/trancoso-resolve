import ServicoLocalPage from '@/components/servicos/ServicoLocalPage';

export default function PedreiroCaraiva() {
  return (
    <ServicoLocalPage
      title="Pedreiro em Caraíva | Trancoso Resolve"
      metaDescription="Encontre pedreiro verificado em Caraíva, BA. Profissionais avaliados para sua pousada ou villa. Solicite agora pela Trancoso Resolve."
      h1="Pedreiro em Caraíva"
      intro="Reformas e construções em Caraíva exigem profissionais que conhecem as especificidades locais — materiais, logística e o estilo arquitetônico da região. A Trancoso Resolve conecta você com pedreiros verificados e experientes."
      servicesTitle="Serviços de pedreiro em Caraíva"
      services={[
        'Pequenas reformas em pousadas, villas e residências de temporada',
        'Assentamento de cerâmica, porcelanato e revestimentos',
        'Reparos em paredes, reboco e acabamento',
        'Construção de muros, calçadas e áreas externas',
        'Reforma de banheiros e áreas molhadas',
        'Manutenção preventiva para imóveis de temporada desocupados',
      ]}
      howTitle="Por que contratar pedreiro pela Trancoso Resolve em Caraíva?"
      howText="Todos os pedreiros passam por verificação de identidade e análise de antecedentes. Com avaliações públicas de clientes anteriores, você contrata com segurança. Profissionais que conhecem a logística e as particularidades de construir em Caraíva."
      cta="Descreva a reforma ou reparo que precisa e receba contato de pedreiros verificados em Caraíva."
      ctaButton="Contratar pedreiro em Caraíva"
      category="Pedreiro"
      heroEmoji="🏗️"
    />
  );
}