import ServicoLocalPage from '@/components/servicos/ServicoLocalPage';

export default function CozinheiroPortoSeguro() {
  return (
    <ServicoLocalPage
      title="Cozinheiro em Porto Seguro | Trancoso Resolve"
      metaDescription="Encontre cozinheiro verificado em Porto Seguro, BA. Profissionais avaliados, atendimento rápido. Solicite agora pela Trancoso Resolve."
      h1="Cozinheiro em Porto Seguro"
      intro="De refeições diárias a jantares especiais em Porto Seguro, a Trancoso Resolve conecta você com cozinheiros e chefs verificados, especializados na culinária baiana e nos frutos do mar frescos da Costa do Descobrimento."
      servicesTitle="Serviços de cozinheiro em Porto Seguro"
      services={[
        'Preparo de refeições diárias para residências e pousadas',
        'Culinária baiana tradicional e frutos do mar frescos',
        'Chef para jantares especiais e eventos privados em Porto Seguro',
        'Café da manhã e brunch para grupos de hóspedes',
        'Preparo de marmitas e refeições para equipes de trabalho',
        'Cozinheiro fixo para temporadas longas ou imóveis de aluguel',
      ]}
      howTitle="Por que contratar cozinheiro pela Trancoso Resolve em Porto Seguro?"
      howText="Todos os cozinheiros passam por verificação de identidade e têm avaliações de clientes. Você conversa diretamente sobre cardápio, frequência e valores — profissionais que conhecem os ingredientes e sabores locais de Porto Seguro."
      cta="Descreva o que precisa e receba contato de cozinheiros verificados em Porto Seguro, BA."
      ctaButton="Contratar cozinheiro em Porto Seguro"
      category="Cozinheiro"
      heroEmoji="👨‍🍳"
    />
  );
}