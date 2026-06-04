import ServicoLocalPage from '@/components/servicos/ServicoLocalPage';

export default function DiaristaPortoSeguro() {
  return (
    <ServicoLocalPage
      title="Diarista em Porto Seguro | Trancoso Resolve"
      metaDescription="Encontre diarista verificada em Porto Seguro, BA. Profissionais avaliados para sua pousada ou villa. Solicite agora pela Trancoso Resolve."
      h1="Diarista em Porto Seguro"
      intro="Porto Seguro recebe milhares de turistas e tem um mercado exigente para serviços de limpeza. Na Trancoso Resolve, cada diarista passa por verificação de antecedentes e é avaliada por clientes reais — para que você contrate com total segurança."
      servicesTitle="Serviços de diarista em Porto Seguro"
      services={[
        'Limpeza residencial completa para casas, apartamentos e pousadas',
        'Limpeza pós-hospedagem para imóveis de aluguel por temporada em Porto Seguro',
        'Passagem e organização de roupas de cama, toalhas e enxoval',
        'Limpeza de condomínios e residências de temporada no Centro Histórico',
        'Limpeza pós-evento para propriedades e espaços de festas',
        'Plano de manutenção periódica para imóveis desocupados',
      ]}
      howTitle="Por que contratar diarista pela Trancoso Resolve em Porto Seguro?"
      howText="Todas as diaristas da plataforma passam por verificação de identidade e análise de antecedentes criminais, com avaliações públicas de clientes anteriores. Você combina diretamente valores, frequência e horário — sem intermediários nem taxas ocultas."
      cta="Descreva sua necessidade e receba contato de diaristas verificadas em Porto Seguro, BA."
      ctaButton="Contratar diarista em Porto Seguro"
      category="Limpeza"
      heroEmoji="🧹"
    />
  );
}