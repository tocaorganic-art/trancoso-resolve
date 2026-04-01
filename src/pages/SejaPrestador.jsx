import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, BarChart2, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Testimonials from '@/components/home/Testimonials';
import HeroSection from '@/components/sejaprestador/HeroSection';
import SelosQualidade from '@/components/sejaprestador/SelosQualidade';
import TabelaComparativa from '@/components/sejaprestador/TabelaComparativa';
import ChatOnboarding from '@/components/sejaprestador/ChatOnboarding';

const beneficios = [
  {
    icon: <Users className="w-8 h-8 text-blue-600" />,
    title: "Alcance Mais Clientes",
    description: "Tenha seu perfil divulgado para turistas e moradores de Trancoso que buscam profissionais qualificados e de confiança."
  },
  {
    icon: <BarChart2 className="w-8 h-8 text-green-600" />,
    title: "Gestão Simplificada",
    description: "Painel completo para gerenciar agenda, confirmar serviços e acompanhar seu desempenho financeiro de forma fácil."
  },
  {
    icon: <Star className="w-8 h-8 text-yellow-500" />,
    title: "Construa sua Reputação",
    description: "Receba avaliações dos clientes e construa uma reputação sólida que atrai cada vez mais oportunidades de alto padrão."
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
  return (
    <div className="bg-slate-50">
      {/* Hero */}
      <HeroSection />

      {/* Benefícios */}
      <section className="container mx-auto py-20 px-4 max-w-5xl">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Vantagens exclusivas</span>
          <h2 className="text-3xl font-bold text-slate-800 mt-2">Por que ser um Parceiro Toca?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {beneficios.map((item, index) => (
            <Card key={index} className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
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

      {/* Como Funciona */}
      <section id="como-funciona" className="container mx-auto py-20 px-4 max-w-2xl">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Simples e rápido</span>
          <h2 className="text-3xl font-bold text-slate-800 mt-2">Como funciona</h2>
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

      {/* CTA Final */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 py-20">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pronto para começar?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto text-lg">
            Faça parte da comunidade de profissionais que está prosperando em Trancoso.
          </p>
          <Link to={createPageUrl('CadastroTipo')}>
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold text-lg px-10 py-6 shadow-xl">
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