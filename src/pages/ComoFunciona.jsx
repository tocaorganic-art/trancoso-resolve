import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Calendar, Smile, UserCheck, Briefcase, BarChart, Shield, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

const ProcessStep = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="font-bold text-lg mb-2 text-slate-800">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

export default function ComoFuncionaPage() {
  useEffect(() => {
    document.title = "Como Funciona o Trancoso Resolve — Contrate Profissionais em Trancoso, BA";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = "Entenda como contratar profissionais em Trancoso em 3 passos simples. Busque, agende e resolve — com profissionais verificados e avaliados pela comunidade.";

    const schemaId = 'schema-como-funciona';
    const existing = document.getElementById(schemaId);
    if (existing) existing.remove();
    const schema = document.createElement('script');
    schema.id = schemaId;
    schema.type = 'application/ld+json';
    schema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Como o pagamento é feito?", "acceptedAnswer": { "@type": "Answer", "text": "O pagamento é combinado e realizado diretamente entre o cliente e o prestador. A plataforma facilita o contato e agendamento, e em breve teremos opções de pagamento integradas." } },
        { "@type": "Question", "name": "O que acontece se eu tiver um problema com o serviço?", "acceptedAnswer": { "@type": "Answer", "text": "Recomendamos que você entre em contato com o prestador para resolver. Se não for possível, nossa equipe de suporte pode mediar a situação. A avaliação após o serviço também é uma ferramenta importante." } },
        { "@type": "Question", "name": "Como sei que um prestador é de confiança?", "acceptedAnswer": { "@type": "Answer", "text": "Procure por prestadores com o selo Verificado. Leia também as avaliações e comentários de outros clientes, que são um ótimo termômetro da qualidade do serviço." } },
        { "@type": "Question", "name": "Como contratar um serviço em Trancoso?", "acceptedAnswer": { "@type": "Answer", "text": "1. Encontre o serviço navegando por categorias ou usando a busca inteligente. 2. Escolha o profissional e envie sua solicitação. 3. Aguarde a confirmação e problema resolvido!" } }
      ]
    });
    document.head.appendChild(schema);
    return () => { const s = document.getElementById(schemaId); if (s) s.remove(); };
  }, []);

  const faqs = [
    {
      q: "Como o pagamento é feito?",
      a: "O pagamento é combinado e realizado diretamente entre o cliente e o prestador. A plataforma facilita o contato e agendamento, e em breve teremos opções de pagamento integradas."
    },
    {
      q: "O que acontece se eu tiver um problema com o serviço?",
      a: "Recomendamos que você entre em contato com o prestador para resolver. Se não for possível, nossa equipe de suporte pode mediar a situação. A avaliação após o serviço também é uma ferramenta importante."
    },
    {
      q: "Como sei que um prestador é de confiança?",
      a: "Procure por prestadores com o selo 'Verificado'. Leia também as avaliações e comentários de outros clientes, que são um ótimo termômetro da qualidade do serviço."
    },
    {
      q: "Quanto custa usar o Trancoso Resolve para contratar?",
      a: "Para clientes, a plataforma é totalmente gratuita. Você navega, compara e contrata sem pagar nada à plataforma. O valor é negociado diretamente com o prestador."
    },
    {
      q: "Posso contratar serviços para uma villa ou pousada em Trancoso?",
      a: "Sim! Muitos prestadores têm experiência em pousadas, villas e imóveis de temporada. Ao solicitar o serviço, informe o endereço e detalhes do local para facilitar o atendimento."
    },
  ];

  return (
    <div className="bg-slate-50">
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Simples, Rápido e Confiável</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Conectamos você aos melhores profissionais de Trancoso. Entenda como transformamos suas necessidades em soluções.
          </p>
        </div>

        {/* Para Clientes */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-800">Para Clientes: Sua Solução em 3 Passos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <ProcessStep 
              icon={<Search className="w-8 h-8" />} 
              title="1. Encontre o Serviço" 
              description="Navegue por nossas categorias ou use a busca inteligente para encontrar exatamente o que você precisa, de uma faxina a um passeio exclusivo." 
            />
            <ProcessStep 
              icon={<Calendar className="w-8 h-8" />} 
              title="2. Agende com Facilidade" 
              description="Escolha o melhor profissional com base em avaliações, veja os detalhes do serviço, escolha a data e envie sua solicitação com poucos cliques." 
            />
            <ProcessStep 
              icon={<Smile className="w-8 h-8" />} 
              title="3. Problema Resolvido" 
              description="Receba a confirmação do prestador e aguarde o serviço ser realizado. Após a conclusão, avalie a experiência e ajude nossa comunidade." 
            />
          </div>
        </section>

        {/* Para Prestadores */}
        <section className="mb-20 bg-white p-12 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-800">Para Prestadores: Transforme seu Talento em Negócio</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <ProcessStep 
              icon={<UserCheck className="w-8 h-8" />} 
              title="1. Crie seu Perfil" 
              description="Cadastre-se gratuitamente, adicione seus serviços, fotos e defina seus preços. Um perfil completo atrai mais clientes." 
            />
            <ProcessStep 
              icon={<Briefcase className="w-8 h-8" />} 
              title="2. Receba Propostas" 
              description="Seja notificado sobre novas solicitações de serviço. Gerencie sua agenda, confirme os trabalhos e comunique-se com os clientes." 
            />
            <ProcessStep 
              icon={<BarChart className="w-8 h-8" />} 
              title="3. Cresça seu Negócio" 
              description="Receba pagamentos diretamente dos clientes, construa uma reputação com boas avaliações e use nosso painel para acompanhar seu desempenho." 
            />
          </div>
          <div className="text-center mt-12">
             <Link to={createPageUrl("SejaPrestador")}>
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600">Quero ser um Prestador</Button>
            </Link>
          </div>
        </section>
        
        {/* Diferenciais rápidos */}
        <section className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { emoji: '✅', label: 'Verificados', sub: 'Identidade + Antecedentes' },
              { emoji: '⭐', label: 'Avaliados', sub: 'Feedbacks reais de clientes' },
              { emoji: '📍', label: 'Locais', sub: 'Profissionais de Trancoso' },
              { emoji: '💬', label: 'Ágeis', sub: 'Contato direto via WhatsApp' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <span className="text-3xl block mb-2">{item.emoji}</span>
                <p className="font-bold text-slate-800">{item.label}</p>
                <p className="text-xs text-slate-500 mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
           <h2 className="text-3xl font-bold text-center mb-10 text-slate-800">Dúvidas Frequentes sobre Contratar em Trancoso</h2>
           <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-base">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
           </div>
        </section>

        {/* CTA Final */}
        <section className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl p-10 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Pronto para Resolver?</h2>
          <p className="text-blue-100 mb-6 max-w-md mx-auto">Encontre profissionais verificados em Trancoso agora mesmo.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={createPageUrl("ServicosCategoria")}>
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold w-full sm:w-auto">
                <Search className="w-5 h-5 mr-2" />
                Buscar Profissional
              </Button>
            </Link>
            <Link to={createPageUrl("SejaPrestador")}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 w-full sm:w-auto">
                Seja um Prestador
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}