import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, BarChart2, Users, Star, Bot, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Testimonials from '@/components/home/Testimonials';
import HeroSection from '@/components/sejaprestador/HeroSection';
import SelosQualidade from '@/components/sejaprestador/SelosQualidade';
import TabelaComparativa from '@/components/sejaprestador/TabelaComparativa';
import ChatOnboarding from '@/components/sejaprestador/ChatOnboarding';
import CalculadoraGanhos from '@/components/sejaprestador/CalculadoraGanhos';

const beneficios = [
  {
    icon: <Users className="w-8 h-8 text-blue-600" />,
    title: "Alcance Mais Clientes",
    description: "Tenha seu perfil divulgado para turistas e moradores de Trancoso que buscam profissionais qualificados e de confiança. Amplie sua base de forma eficiente e direcionada."
  },
  {
    icon: <BarChart2 className="w-8 h-8 text-green-600" />,
    title: "Gestão Simplificada",
    description: "Painel completo para gerenciar agenda, confirmar serviços e acompanhar seu desempenho financeiro de forma intuitiva. Otimize seu tempo e foque no seu trabalho."
  },
  {
    icon: <Star className="w-8 h-8 text-yellow-500" />,
    title: "Construa sua Reputação",
    description: "Receba avaliações transparentes dos clientes e construa uma reputação online sólida. A credibilidade conquistada atrai continuamente novas oportunidades de negócio."
  },
  {
    icon: <Bot className="w-8 h-8 text-purple-600" />,
    title: "Toca TrIA: Agente de IA 24h",
    description: "Mais do que um assistente, o Toca TrIA automatiza agendamentos, responde a perguntas frequentes e qualifica leads — trabalhando por você enquanto você foca no serviço."
  },
  {
    icon: <Camera className="w-8 h-8 text-cyan-600" />,
    title: "Toca Vision: Imagens com IA",
    description: "Crie posts, cardápios, logos e materiais visuais impactantes em minutos. Gere imagens exclusivas em alta qualidade, fortalecendo sua identidade visual sem custos adicionais."
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-emerald-600" />,
    title: "Custo Zero de Marketing",
    description: "Esqueça o gasto com anúncios e divulgação. Na Trancoso Resolve, seu perfil é exibido gratuitamente para quem já está procurando exatamente o que você oferece."
  }
];

const steps = [
  {
    n: 1,
    title: "Crie seu Perfil",
    desc: "Cadastre-se, adicione seus serviços, fotos do portfólio e defina seus preços com facilidade."
  },
  {
    n: 2,
    title: "Receba Solicitações",
    desc: "Seja notificado quando um cliente solicitar seu serviço. Confirme disponibilidade diretamente pelo app."
  },
  {
    n: 3,
    title: "Realize e Receba",
    desc: "Execute o serviço com excelência, receba o pagamento e incentive avaliações para crescer na plataforma."
  }
];

export default function SejaPrestadorPage() {
  useEffect(() => {
    document.title = "Seja um Prestador de Serviços em Trancoso — Trancoso Resolve";

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = "Cadastre-se como prestador de serviços em Trancoso Resolve. Receba clientes verificados, custo zero de marketing, gestão com IA e construa sua reputação online.";

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = 'https://www.trancosoresolve.com.br/SejaPrestador';

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) { ogUrl = document.createElement('meta'); ogUrl.setAttribute('property', 'og:url'); document.head.appendChild(ogUrl); }
    ogUrl.content = 'https://www.trancosoresolve.com.br/SejaPrestador';

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) { ogTitle = document.createElement('meta'); ogTitle.setAttribute('property', 'og:title'); document.head.appendChild(ogTitle); }
    ogTitle.content = 'Seja um Prestador de Serviços em Trancoso — Trancoso Resolve';

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) { ogDesc = document.createElement('meta'); ogDesc.setAttribute('property', 'og:description'); document.head.appendChild(ogDesc); }
    ogDesc.content = 'Cadastre-se como prestador de serviços em Trancoso Resolve. Receba clientes verificados, custo zero de marketing, gestão com IA e construa sua reputação online.';

    const schemaId = 'schema-seja-prestador';
    const existing = document.getElementById(schemaId);
    if (existing) existing.remove();
    const schema = document.createElement('script');
    schema.id = schemaId;
    schema.type = 'application/ld+json';
    schema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "name": "Seja um Parceiro Trancoso Resolve",
          "url": "https://www.trancosoresolve.com.br/SejaPrestador",
          "description": "Cadastre-se como prestador de serviços verificado em Trancoso e comece a receber novos clientes pela plataforma."
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://www.trancosoresolve.com.br" },
            { "@type": "ListItem", "position": 2, "name": "Seja um Prestador", "item": "https://www.trancosoresolve.com.br/SejaPrestador" }
          ]
        }
      ]
    });
    document.head.appendChild(schema);
    return () => { const s = document.getElementById(schemaId); if (s) s.remove(); };
  }, []);

  return (
    <div className="bg-slate-50">
      {/* Hero */}
      <HeroSection />

      {/* Benefícios */}
      <section className="container mx-auto py-10 md:py-20 px-4 max-w-5xl">
        <div className="text-center mb-6 md:mb-12">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Vantagens exclusivas</span>
          <h2 className="text-xl md:text-3xl font-bold text-slate-800 mt-2">Por que ser um Parceiro Trancoso Resolve?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {beneficios.map((item, index) => (
            <Card key={index} className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 md:p-8">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm md:text-base text-slate-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Selos de Qualidade */}
      <SelosQualidade />

      {/* Tabela Comparativa */}
      <TabelaComparativa />

      {/* Testimonials */}
      <Testimonials />

      {/* Calculadora de Ganhos */}
      <CalculadoraGanhos />

      {/* Como Funciona */}
      <section id="como-funciona" className="container mx-auto py-10 md:py-20 px-4 max-w-2xl">
        <div className="text-center mb-6 md:mb-12">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Simples e rápido</span>
          <h2 className="text-xl md:text-3xl font-bold text-slate-800 mt-2">Como funciona</h2>
        </div>
        <ul className="space-y-6">
          {steps.map(s => (
            <li key={s.n} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                {s.n}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-900">{s.title}</h3>
                <p className="text-slate-600 mt-1">{s.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Links internos de suporte */}
      <section className="container mx-auto px-4 max-w-3xl pb-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border text-center">
          <p className="text-slate-700 font-medium mb-3">Quer saber mais antes de se cadastrar?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={createPageUrl("ComoFunciona")}>
              <Button variant="outline" className="w-full sm:w-auto gap-2">
                Como funciona a plataforma?
              </Button>
            </Link>
            <Link to={createPageUrl("ServicosCategoria")}>
              <Button variant="outline" className="w-full sm:w-auto gap-2">
                Ver prestadores já cadastrados
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 py-12 md:py-20">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">Pronto para começar?</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto text-base md:text-lg">
            Faça parte da comunidade de profissionais que está prosperando em Trancoso.
          </p>
          <Link to={createPageUrl('CadastroTipo')}>
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold text-lg px-8 py-4 md:py-6 shadow-xl min-h-[48px]">
              Cadastre-se Agora — É Grátis
            </Button>
          </Link>
        </div>
      </div>

      {/* Chat de Onboarding */}
      <ChatOnboarding />
    </div>
  );
}