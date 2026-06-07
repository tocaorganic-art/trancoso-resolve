import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Star, Utensils, Anchor, Sun, Heart } from "lucide-react";
import LeadCaptureForm from "@/components/servicos/LeadCaptureForm";
import WhatsAppStickyBar from "@/components/servicos/WhatsAppStickyBar";

export default function DestinoPortoSeguro() {
  useEffect(() => {
    document.title = "Porto Seguro Bahia | Serviços e Profissionais Verificados — Trancoso Resolve";

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = "Encontre profissionais verificados em Porto Seguro, BA: diaristas, eletricistas, piscineiros, cozinheiros, jardineiros e muito mais. Atendimento para hotéis, resorts e residências de alto padrão.";

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = "https://www.trancosoresolve.com.br/destinos/porto-seguro";

    const existingSchema = document.getElementById('schema-destino-porto-seguro');
    if (existingSchema) existingSchema.remove();
    const schema = document.createElement('script');
    schema.id = 'schema-destino-porto-seguro';
    schema.type = 'application/ld+json';
    schema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Trancoso Resolve — Serviços em Porto Seguro",
      "description": "Marketplace de serviços locais em Porto Seguro, Bahia. Profissionais verificados para hotéis, resorts e residências.",
      "url": "https://www.trancosoresolve.com.br/destinos/porto-seguro",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Porto Seguro",
        "addressRegion": "BA",
        "addressCountry": "BR"
      },
      "geo": { "@type": "GeoCoordinates", "latitude": -16.4497, "longitude": -39.0648 },
      "areaServed": { "@type": "Place", "name": "Porto Seguro, Bahia, Brasil" }
    });
    document.head.appendChild(schema);
    return () => { const s = document.getElementById('schema-destino-porto-seguro'); if (s) s.remove(); };
  }, []);

  const servicos = [
    { label: 'Diarista', emoji: '🧹', path: '/servicos/diarista-porto-seguro' },
    { label: 'Eletricista', emoji: '⚡', path: '/servicos/eletricista-porto-seguro' },
    { label: 'Piscineiro', emoji: '🏊', path: '/servicos/piscineiro-porto-seguro' },
    { label: 'Cozinheiro', emoji: '👨‍🍳', path: '/servicos/cozinheiro-porto-seguro' },
    { label: 'Jardineiro', emoji: '🌿', path: '/servicos/jardineiro-porto-seguro' },
    { label: 'Pedreiro', emoji: '🏗️', path: '/servicos/pedreiro-porto-seguro' },
  ];

  return (
    <div className="bg-slate-50 overflow-x-hidden">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-20 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')" }}
          aria-hidden="true"
        />
        <div className="relative container mx-auto max-w-5xl px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-700/40 border border-blue-400/30 rounded-full px-4 py-1.5 text-sm font-medium text-blue-200 mb-6">
            <MapPin className="w-4 h-4" /> Porto Seguro, Bahia
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Serviços Verificados em<br /><span className="text-amber-400">Porto Seguro</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            A maior cidade da Costa do Descobrimento — hotéis, resorts e residências de alto padrão, com profissionais de confiança da Trancoso Resolve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/ServicosCategoria">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 text-base">
                Encontrar Profissional <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/SejaPrestador">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-8 text-base">
                Seja Prestador em Porto Seguro
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-4 py-12 md:py-20">

        {/* Sobre Porto Seguro */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">História, cultura e praias paradisíacas</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Porto Seguro é o berço do Brasil — um destino que combina história colonial, praias deslumbrantes e uma infraestrutura turística completa. Da Cidade Histórica às praias de Coroa Vermelha, Arraial d'Ajuda e Trancoso, a região é um polo de alto padrão.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                A Trancoso Resolve atua em Porto Seguro com os mesmos padrões de verificação e qualidade. Profissionais para hotéis, resorts, condomínios fechados e residências de luxo, com histórico verificado e avaliações reais.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Star, label: 'Profissionais verificados' },
                  { icon: Heart, label: 'Avaliados pela comunidade' },
                  { icon: Anchor, label: 'Especialistas locais' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 bg-amber-50 rounded-full px-3 py-1.5 text-sm text-amber-800 font-medium">
                    <Icon className="w-4 h-4" /> {label}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Anchor, title: 'Infraestrutura Completa', desc: 'Aeroporto, resorts e hotéis boutique de alto padrão' },
                { icon: Utensils, title: 'Gastronomia Diversa', desc: 'Frutos do mar, culinária baiana e restaurantes premiados' },
                { icon: Sun, title: 'Praias Para Todos', desc: 'Coroa Vermelha, Taperapuã, Itacimirim e muito mais' },
                { icon: Heart, title: 'Cultura e História', desc: 'Cidade Histórica tombada pelo patrimônio nacional' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                  <Icon className="w-6 h-6 text-amber-600 mb-2" />
                  <h3 className="font-bold text-sm text-slate-900 mb-1">{title}</h3>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Serviços Disponíveis */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Serviços Disponíveis em Porto Seguro</h2>
            <p className="text-slate-500">Profissionais verificados para cada necessidade do seu hotel, resort ou residência</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {servicos.map((s) => (
              <Link key={s.label} to={s.path}>
                <div className="bg-white rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition-all duration-200 border border-slate-100 hover:border-amber-300 group h-full flex flex-col items-center justify-center">
                  <span className="text-2xl block mb-2" aria-hidden="true">{s.emoji}</span>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-amber-700 transition-colors">{s.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Por que Porto Seguro */}
        <section className="mb-16 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Por que contratar pela Trancoso Resolve em Porto Seguro</h2>
          <ul className="space-y-3">
            {[
              'Prestadores verificados com antecedentes criminais checados em bases oficiais.',
              'Profissionais avaliados por outros clientes com histórico público.',
              'Atendimento prioritário para hotéis e resorts com contratos recorrentes.',
              'Rede local de prestadores que conhecem a região e seus desafios.',
              'Suporte via WhatsApp para urgências e demandas de último minuto.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">✓</span>
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Outros Destinos */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Explore Outros Destinos</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { nome: 'Trancoso', emoji: '🏄', desc: 'O destino mais icônico — villas de luxo, pousadas e o famoso Quadrado.', path: '/destinos/trancoso' },
              { nome: 'Caraíva', emoji: '🌊', desc: 'O paraíso preservado — sem asfalto, sem carros, só natureza e charme.', path: '/destinos/caraiva' },
            ].map((d) => (
              <Link key={d.nome} to={d.path}>
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-slate-100 hover:border-amber-300 group flex gap-4 items-start">
                  <span className="text-3xl">{d.emoji}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors mb-1">{d.nome}</h3>
                    <p className="text-sm text-slate-500">{d.desc}</p>
                    <span className="text-xs text-amber-600 font-medium mt-2 inline-flex items-center gap-1">
                      Ver serviços <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <LeadCaptureForm serviceInterest="Geral" serviceLabel="um profissional em Porto Seguro" source="destino-porto-seguro" />
      </div>

      <WhatsAppStickyBar serviceLabel="um profissional em Porto Seguro" />
    </div>
  );
}
