import { useEffect } from 'react';

export default function AboutPage() {
  useEffect(() => {
    document.title = 'Sobre Nós - Trancoso Resolve';
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = 'Conheça o Trancoso Resolve: a plataforma que conecta profissionais verificados com clientes em Trancoso. Nossa missão é facilitar a contratação de serviços confiáveis.';

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = 'Sobre Nós - Trancoso Resolve';

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.content = 'Conheça o Trancoso Resolve: a plataforma que conecta profissionais verificados com clientes em Trancoso.';

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = `${window.location.origin}/About`;
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary">Sobre o Trancoso Resolve</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-lg leading-relaxed">
          <p>
            O <strong>Trancoso Resolve</strong> é a plataforma digital que revoluciona a forma como você encontra e contrata serviços profissionais em Trancoso, Bahia. Nossa missão é conectar clientes com profissionais verificados e confiáveis, oferecendo transparência, segurança e qualidade em cada transação.
          </p>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4 text-accent">O Que Fazemos</h2>
            <p>
              Operamos como um marketplace de serviços que funciona como um intermediário confiável entre clientes que precisam de ajuda e prestadores de serviço qualificados. Oferecemos uma experiência simplificada para contratar profissionais em diversas categorias: limpeza, jardinagem, eletricista, encanador, pintor, cozinheiro, babá, pedreiro e muito mais.
            </p>
            <p>
              Cada profissional na plataforma passa por verificações de identidade, análise de antecedentes criminais e validação de dados cadastrais, garantindo que você está contratando alguém confiável. Clientes podem visualizar avaliações, portfólios, taxas e disponibilidade em tempo real.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4 text-accent">Para Quem É</h2>
            <p>
              <strong>Para Clientes:</strong> Se você mora em Trancoso ou está visitando a região e precisa de um eletricista, encanador, limpeza profissional, ou qualquer outro serviço, o Trancoso Resolve conecta você diretamente com profissionais verificados. Sem intermediários desnecessários, com preços claros e avaliações transparentes.
            </p>
            <p>
              <strong>Para Prestadores de Serviço:</strong> Se você é um profissional independente em Trancoso, nossa plataforma oferece a oportunidade de construir sua reputação, alcançar novos clientes e gerenciar seu trabalho de forma organizada. Com ferramentas de agendamento, portfólio digital, recebimento de pagamentos via Stripe e análise de ganhos, você tem tudo que precisa para crescer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4 text-accent">Quem Constrói o Trancoso Resolve</h2>
            <p>
              O Trancoso Resolve foi desenvolvido por uma equipe comprometida com a transformação digital de Trancoso. Utilizamos tecnologias modernas como React, Stripe para pagamentos seguros, e inteligência artificial para recomendações inteligentes de profissionais. Nosso foco é criar uma plataforma intuitiva, segura e que realmente resolva os problemas de falta de acesso a serviços confiáveis na região.
            </p>
            <p>
              Estamos constantemente evoluindo a plataforma com base em feedback de usuários, agregando novos recursos e expandindo as categorias de serviços disponíveis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4 text-accent">Por Que Usar o Trancoso Resolve</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Profissionais Verificados:</strong> Todos passam por verificação de identidade e análise de antecedentes.</li>
              <li><strong>Avaliações Transparentes:</strong> Veja o que outros clientes pensam antes de contratar.</li>
              <li><strong>Pagamentos Seguros:</strong> Integração com Stripe garante transações protegidas.</li>
              <li><strong>Sem Intermediários:</strong> Comunicação direta entre cliente e prestador.</li>
              <li><strong>Preços Claros:</strong> Sem taxas ocultas ou surpresas no orçamento.</li>
              <li><strong>Suporte Local:</strong> Atendimento dedicado à comunidade de Trancoso.</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 p-6 bg-accent/10 rounded-lg border border-accent/20">
          <h3 className="text-xl font-bold mb-3">Quer conhecer melhor?</h3>
          <p className="mb-4">Navegue por nossa plataforma, explore os profissionais disponíveis ou se registre como prestador para começar a ganhar.</p>
          <a href="/" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition">Voltar à Página Inicial</a>
        </div>
      </div>
    </div>
  );
}