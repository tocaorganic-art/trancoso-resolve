import ServicoLocalPage from '@/components/servicos/ServicoLocalPage';

export default function PedreiroPortoSeguro() {
  return (
    <ServicoLocalPage
      title="Pedreiro em Porto Seguro | Trancoso Resolve"
      metaDescription="Encontre pedreiro verificado em Porto Seguro, BA. Profissionais avaliados, atendimento rápido. Solicite agora pela Trancoso Resolve."
      h1="Pedreiro em Porto Seguro"
      intro="Reformas e reparos em Porto Seguro com profissionais que conhecem a região. A Trancoso Resolve conecta você com pedreiros verificados, experientes em construção civil e reformas residenciais na Costa do Descobrimento."
      servicesTitle="Serviços de pedreiro em Porto Seguro"
      services={[
        'Pequenas e médias reformas em residências e pousadas',
        'Assentamento de cerâmica, porcelanato e revestimentos',
        'Reparos em paredes, reboco e acabamento',
        'Construção de muros, calçadas e áreas externas',
        'Reforma de banheiros e áreas molhadas',
        'Manutenção preventiva para imóveis de temporada desocupados',
      ]}
      howTitle="Por que contratar pedreiro pela Trancoso Resolve em Porto Seguro?"
      howText="Pedreiros com verificação de identidade, análise de antecedentes e avaliações públicas de clientes anteriores. Você contrata com segurança e obtém profissionais que conhecem a logística e as especificidades da construção em Porto Seguro."
      cta="Descreva a reforma ou reparo que precisa e receba contato de pedreiros verificados em Porto Seguro."
      ctaButton="Contratar pedreiro em Porto Seguro"
      category="Pedreiro"
      heroEmoji="🏗️"
    />
  );
}