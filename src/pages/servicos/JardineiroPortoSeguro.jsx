import ServicoLocalPage from '@/components/servicos/ServicoLocalPage';

export default function JardineiroPortoSeguro() {
  return (
    <ServicoLocalPage
      title="Jardineiro em Porto Seguro | Trancoso Resolve"
      metaDescription="Encontre jardineiro verificado em Porto Seguro, BA. Profissionais avaliados, atendimento rápido. Solicite agora pela Trancoso Resolve."
      h1="Jardineiro em Porto Seguro"
      intro="Mantenha o jardim da sua residência ou pousada em Porto Seguro sempre impecável. A Trancoso Resolve conecta você com jardineiros verificados, especializados na flora tropical da Costa do Descobrimento."
      servicesTitle="Serviços de jardineiro em Porto Seguro"
      services={[
        'Manutenção e poda de jardins residenciais e de pousadas',
        'Paisagismo e plantio de espécies nativas e ornamentais',
        'Limpeza de terreno e capina de mato',
        'Irrigação e adubação de jardins tropicais',
        'Cuidado com plantas ornamentais e frutíferas',
        'Manutenção periódica para imóveis desocupados de temporada',
      ]}
      howTitle="Por que contratar jardineiro pela Trancoso Resolve em Porto Seguro?"
      howText="Jardineiros verificados, com experiência na flora e no clima da Costa do Descobrimento. Avaliações de clientes anteriores garantem tranquilidade. Você combina frequência e valores diretamente, sem intermediários."
      cta="Descreva o jardim que precisa de cuidados e receba contato de jardineiros verificados em Porto Seguro."
      ctaButton="Contratar jardineiro em Porto Seguro"
      category="Jardinagem"
      heroEmoji="🌿"
    />
  );
}