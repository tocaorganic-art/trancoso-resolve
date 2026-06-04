import ServicoLocalPage from '@/components/servicos/ServicoLocalPage';

export default function PiscineiroPortoSeguro() {
  return (
    <ServicoLocalPage
      title="Piscineiro em Porto Seguro | Trancoso Resolve"
      metaDescription="Encontre piscineiro verificado em Porto Seguro, BA. Profissionais avaliados, atendimento rápido. Solicite agora pela Trancoso Resolve."
      h1="Piscineiro em Porto Seguro"
      intro="Mantenha a piscina da sua residência ou pousada em Porto Seguro sempre limpa e equilibrada. A Trancoso Resolve conecta você com piscineiros verificados e avaliados por clientes reais."
      servicesTitle="Serviços de piscineiro em Porto Seguro"
      services={[
        'Limpeza e tratamento de piscina residencial e de pousadas',
        'Controle de pH, cloro e produtos químicos',
        'Manutenção de bombas, filtros e equipamentos',
        'Limpeza de fundo, paredes e borda de piscina',
        'Tratamento para piscinas com algas ou água turva',
        'Manutenção periódica para imóveis de temporada',
      ]}
      howTitle="Por que contratar piscineiro pela Trancoso Resolve em Porto Seguro?"
      howText="Piscineiros verificados, com histórico de avaliações e análise de antecedentes. Agende a manutenção diretamente pelo WhatsApp, sem intermediários, com profissionais que conhecem as condições climáticas de Porto Seguro."
      cta="Descreva a situação da sua piscina e receba contato de piscineiros verificados em Porto Seguro."
      ctaButton="Contratar piscineiro em Porto Seguro"
      category="Piscineiro"
      heroEmoji="🏊"
    />
  );
}