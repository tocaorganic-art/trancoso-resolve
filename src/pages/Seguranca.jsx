import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, UserCheck, Star, Lock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

const SecurityFeature = ({ icon, title, description }) => (
  <Card className="border-none shadow-lg text-center">
    <CardContent className="p-6">
      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </CardContent>
  </Card>
);

export default function SegurancaPage() {
  useEffect(() => {
    document.title = "Segurança em Trancoso Resolve — Prestadores Verificados e Proteção de Dados";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = "Todos os prestadores do Trancoso Resolve passam por verificação de identidade e consulta de antecedentes criminais. Sua segurança é nossa prioridade.";

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = 'https://www.trancosoresolve.com.br/Seguranca';

    // OG tags
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) { ogUrl = document.createElement('meta'); ogUrl.setAttribute('property', 'og:url'); document.head.appendChild(ogUrl); }
    ogUrl.content = 'https://www.trancosoresolve.com.br/Seguranca';

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) { ogTitle = document.createElement('meta'); ogTitle.setAttribute('property', 'og:title'); document.head.appendChild(ogTitle); }
    ogTitle.content = 'Segurança em Trancoso Resolve — Prestadores Verificados e Proteção de Dados';

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) { ogDesc = document.createElement('meta'); ogDesc.setAttribute('property', 'og:description'); document.head.appendChild(ogDesc); }
    ogDesc.content = 'Todos os prestadores do Trancoso Resolve passam por verificação de identidade e consulta de antecedentes criminais. Sua segurança é nossa prioridade.';

    const schemaId = 'schema-seguranca';
    const existing = document.getElementById(schemaId);
    if (existing) existing.remove();
    const schema = document.createElement('script');
    schema.id = schemaId;
    schema.type = 'application/ld+json';
    schema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Segurança — Trancoso Resolve",
      "description": "Saiba como garantimos a segurança de clientes e prestadores em Trancoso. Verificação de identidade, antecedentes criminais, avaliações e proteção LGPD.",
      "url": "https://www.trancosoresolve.com.br/Seguranca",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://www.trancosoresolve.com.br" },
          { "@type": "ListItem", "position": 2, "name": "Segurança", "item": "https://www.trancosoresolve.com.br/Seguranca" }
        ]
      },
      "mainEntity": {
        "@type": "ItemList",
        "name": "Medidas de Segurança",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Perfis Verificados", "description": "Análise de documentos e verificação de identidade de todos os prestadores." },
          { "@type": "ListItem", "position": 2, "name": "Consulta de Antecedentes", "description": "Prestadores passam por consulta de antecedentes criminais antes de serem listados." },
          { "@type": "ListItem", "position": 3, "name": "Sistema de Avaliações", "description": "Avaliações reais de clientes após cada serviço para garantir qualidade." },
          { "@type": "ListItem", "position": 4, "name": "Proteção LGPD", "description": "Dados pessoais protegidos seguindo todas as diretrizes da Lei Geral de Proteção de Dados." }
        ]
      }
    });
    document.head.appendChild(schema);
    return () => { const s = document.getElementById(schemaId); if (s) s.remove(); };
  }, []);

  return (
    <div className="bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <ShieldCheck className="w-16 h-16 mx-auto text-blue-600 mb-4" />
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Sua Segurança é Nossa Prioridade</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Construímos uma comunidade de confiança em Trancoso. Veja as medidas que tomamos para garantir uma experiência segura para todos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SecurityFeature
            icon={<UserCheck className="w-8 h-8" />}
            title="Identidade Verificada"
            description="Todos os prestadores passam por análise de documentos e verificação de identidade antes de aparecerem na plataforma."
          />
          <SecurityFeature
            icon={<ShieldCheck className="w-8 h-8" />}
            title="Antecedentes Criminais"
            description="Consultamos antecedentes criminais de cada prestador com autorização expressa (LGPD), garantindo uma comunidade mais segura."
          />
          <SecurityFeature
            icon={<Star className="w-8 h-8" />}
            title="Avaliações Reais"
            description="Após cada serviço, clientes avaliam os prestadores. Feedbacks reais para você escolher com confiança."
          />
          <SecurityFeature
            icon={<Lock className="w-8 h-8" />}
            title="Proteção de Dados"
            description="Seus dados são protegidos conforme a LGPD (Lei Geral de Proteção de Dados). Nunca vendemos ou compartilhamos seus dados com terceiros."
          />
        </div>

        {/* Selos de confiança */}
        <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-center text-green-900 mb-6">O que significa o Selo Verificado?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <CheckCircle className="w-5 h-5 text-green-600" />, title: "Documento Confirmado", desc: "RG ou CPF conferido e autêntico." },
              { icon: <CheckCircle className="w-5 h-5 text-green-600" />, title: "Sem Antecedentes", desc: "Consulta de antecedentes limpa." },
              { icon: <CheckCircle className="w-5 h-5 text-green-600" />, title: "Aprovado pela Equipe", desc: "Análise manual pela equipe Trancoso Resolve." },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                {item.icon}
                <div>
                  <p className="font-semibold text-green-900 text-sm">{item.title}</p>
                  <p className="text-green-700 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <Card className="mt-10 bg-white border-none shadow-xl">
           <CardHeader>
             <CardTitle className="text-2xl text-center">Nossas Diretrizes de Confiança</CardTitle>
           </CardHeader>
           <CardContent className="space-y-6 text-slate-700">
               <div>
                  <h4 className="font-semibold text-lg text-slate-800">Pagamentos Seguros</h4>
                  <p>Atualmente, os pagamentos são diretos entre cliente e prestador. Recomendamos o uso de métodos rastreáveis como PIX ou transferência. Futuramente, integraremos um sistema de pagamento interno para centralizar e proteger ainda mais suas transações.</p>
               </div>
               <div>
                  <h4 className="font-semibold text-lg text-slate-800">Resolução de Disputas</h4>
                  <p>Incentivamos a comunicação aberta para resolver qualquer problema. Caso não seja possível um acordo, nossa equipe de suporte está disponível para mediar a situação. O histórico de conversas e avaliações são ferramentas importantes nesse processo.</p>
               </div>
               <div>
                  <h4 className="font-semibold text-lg text-slate-800">Dicas para uma Boa Experiência</h4>
                  <p><strong>Para Clientes:</strong> Seja claro sobre suas necessidades ao solicitar um serviço. Comunique-se abertamente e não hesite em perguntar.<br/>
                  <strong>Para Prestadores:</strong> Mantenha seu perfil e agenda atualizados. Seja pontual e profissional para garantir boas avaliações.</p>
               </div>
           </CardContent>
        </Card>

      </div>

      {/* Link Building Interno */}
      <div className="container mx-auto px-4 mt-12">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Profissionais Verificados por Categoria</h2>
          <p className="text-sm text-slate-600 mb-4">Todos os prestadores abaixo passaram pela nossa verificação de antecedentes:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { slug: 'limpeza-trancoso', label: 'Diarista verificada' },
              { slug: 'eletricista-trancoso', label: 'Eletricista verificado' },
              { slug: 'encanador-trancoso', label: 'Encanador verificado' },
              { slug: 'jardinagem-trancoso', label: 'Jardineiro verificado' },
              { slug: 'cozinheiro-trancoso', label: 'Cozinheiro verificado' },
            ].map(item => (
              <Link key={item.slug} to={`/ServicoLanding?slug=${item.slug}`}>
                <span className="inline-flex items-center gap-1 bg-green-50 hover:bg-green-100 border border-green-200 rounded-full px-3 py-1.5 text-xs font-medium text-green-800 transition-colors cursor-pointer">
                  ✅ {item.label}
                </span>
              </Link>
            ))}
          </div>
          <Link to={createPageUrl("ServicosCategoria")} className="text-sm text-cyan-600 hover:underline font-medium">
            Ver todos os profissionais verificados →
          </Link>
        </div>
      </div>

      {/* CTA Final */}
      <div className="container mx-auto px-4 mt-16 mb-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Contrate com Confiança em Trancoso</h2>
        <p className="text-slate-600 mb-6 max-w-lg mx-auto">Todos os profissionais listados passaram por verificação. Você tem a segurança que merece.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={createPageUrl("ServicosCategoria")}>
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 font-bold w-full sm:w-auto">
              Ver Profissionais Verificados
            </Button>
          </Link>
          <Link to={createPageUrl("SejaPrestador")}>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Seja um Prestador
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}