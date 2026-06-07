import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Star, Utensils, Waves, Sun, Heart } from "lucide-react";
import LeadCaptureForm from "@/components/servicos/LeadCaptureForm";
import WhatsAppStickyBar from "@/components/servicos/WhatsAppStickyBar";

export default function DestinoTrancoso() {
  useEffect(() => {
    document.title = "Trancoso Bahia | Serviços e Profissionais Verificados — Trancoso Resolve";

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = "Encontre profissionais verificados em Trancoso, BA: diaristas, eletricistas, piscineiros, chefs, jardineiros e muito mais. Atendimento para villas, pousadas e casas no Quadrado.";

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = "https://www.trancosoresolve.com.br/destinos/trancoso";

    const existingSchema = document.getElementById('schema-destino-trancoso');
    if (existingSchema) existingSchema.remove();
    const schema = document.createElement('script');
    schema.id = 'schema-destino-trancoso';
    schema.type = 'application/ld+json';
    schema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Trancoso Resolve — Serviços em Trancoso",
      "description": "Marketplace de serviços locais em Trancoso, Bahia. Profissionais verificados para villas, pousadas e residências.",
      "url": "https://www.trancosoresolve.com.br/destinos/trancoso",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Trancoso",
        "addressRegion": "BA",
        "addressCountry": "BR"
      },
      "geo": { "@type": "GeoCoordinates", "latitude": -16.5897, "longitude": -39.0828 },
      "areaServed": { "@type": "Place", "name": "Trancoso, Bahia, Brasil" }
    });
    document.head.appendChild(schema);
    return () => { const s = document.getElementById('schema-destino-trancoso'); if (s) s.remove(); };
  }, []);

  const servicos = [
    { slug: 'diarista-trancoso', label: 'Diarista', emoji: '🧹', path: '/servicos/diarista-trancoso' },
    { slug: 'eletricista-trancoso', label: 'Eletricista', emoji: '⚡', path: '/servicos/eletricista-trancoso' },
    { slug: 'piscineiro-trancoso', label: 'Piscineiro', emoji: '🏊', path: '/servicos/piscineiro-trancoso' },
    { slug: 'chef-trancoso', label: 'Chef Particular', emoji: '👨‍🍳', path: '/servicos/chef-trancoso' },
    { slug: 'jardineiro-trancoso', label: 'Jardineiro', emoji: '🌿', path: '/servicos/jardineiro-trancoso' },
    { slug: 'encanador-trancoso', label: 'Encanador', emoji: '🔧', path: '/servicos/encanador-trancoso' },
    { slug: 'pedreiro-trancoso', label: 'Pedreiro', emoji: '🏗️', path: '/servicos/pedreiro-trancoso' },
    { slug: 'pintor-trancoso', label: 'Pintor', emoji: '🖌️', path: '/servicos/pintor-trancoso' },
    { slug: 'seguranca-trancoso', label: 'Segurança', emoji: '🛡️', path: '/servicos/seguranca-trancoso' },
    { slug: 'motorista-trancoso', label: 'Motorista', emoji: '🚗', path: '/servicos/motorista-trancoso' },
  ];

  const bairros = [
    { nome: 'Quadrado de Trancoso', slug: 'quadrado-trancoso', path: '/servicos/quadrado-trancoso' },
    { nome: 'Rio Verde', slug: 'rio-verde-trancoso', path: '/servicos/rio-verde-trancoso' },
    { nome: 'Pitinga', slug: 'pitinga-trancoso', path: '/servicos/pitinga-trancoso' },
  ];

  return (
    <div className="bg-slate-50 overflow-x-hidden">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-amber-900 to-slate-800 text-white py-20 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')" }}
          aria-hidden="true"
        />
        <div className="relative container mx-auto max-w-5xl px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-700/40 border border-amber-400/30 rounded-full px-4 py-1.5 text-sm font-medium text-amber-200 mb-6">
            <MapPin className="w-4 h-4" /> Trancoso, Bahia
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Serviços Verificados<br />em <span className="text-amber-400">Trancoso</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            O charme rústico-chique e a exclusividade de um paraíso baiano — com profissionais de confiança para sua villa, pousada ou residência.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/ServicosCategoria">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 text-base">
                Encontrar Profissional <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/SejaPrestador">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-8 text-base">
                Seja Prestador em Trancoso
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-4 py-12 md:py-20">

        {/* Sobre Trancoso */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">O destino mais icônico da Bahia</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Trancoso é sinônimo de exclusividade. Com o famoso Quadrado repleto de casas coloridas, restaurantes de alto padrão e praias como Rio Verde e Pitinga, o destino atrai viajantes VIP do Brasil e do mundo.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                A Trancoso Resolve conecta proprietários de villas, gestores de pousadas e moradores a profissionais verificados e avaliados — da diarista ao chef particular, do eletricista ao piscineiro.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Star, label: 'Profissionais verificados' },
                  { icon: Heart, label: 'Avaliados pela comunidade' },
                  { icon: MapPin, label: 'Locais e conhecidos' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 bg-amber-50 rounded-full px-3 py-1.5 text-sm text-amber-800 font-medium">
                    <Icon className="w-4 h-4" /> {label}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Waves, title: 'Praias Exclusivas', desc: 'Rio Verde, Pitinga, Nativos e muito mais' },
                { icon: Utensils, title: 'Gastronomia Premium', desc: 'Os melhores chefs e restaurantes do Quadrado' },
                { icon: Sun, title: 'Lifestyle de Luxo', desc: 'Villas e pousadas de alto padrão' },
                { icon: Heart, title: 'Bem-estar', desc: 'Spas, retiros e experiências exclusivas' },
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
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Serviços Disponíveis em Trancoso</h2>
            <p className="text-slate-500">Profissionais verificados para cada necessidade da sua villa ou pousada</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {servicos.map((s) => (
              <Link key={s.slug} to={s.path}>
                <div className="bg-white rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition-all duration-200 border border-slate-100 hover:border-amber-300 group h-full flex flex-col items-center justify-center">
                  <span className="text-2xl block mb-2" aria-hidden="true">{s.emoji}</span>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-amber-700 transition-colors">{s.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Bairros e Regiões */}
        <section className="mb-16 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Atendemos em Todo Trancoso</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {bairros.map((b) => (
              <Link key={b.slug} to={b.path}>
                <div className="bg-white rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-all border border-amber-100 hover:border-amber-400 group">
                  <h3 className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors mb-1">{b.nome}</h3>
                  <p className="text-xs text-amber-600 font-medium flex items-center justify-center gap-1">
                    Ver profissionais <ArrowRight className="w-3 h-3" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Outros Destinos */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Explore Outros Destinos</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { nome: 'Porto Seguro', emoji: '⚓', desc: 'A maior cidade da região — hotéis, resorts e residências de alto padrão.', path: '/destinos/porto-seguro' },
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

        <LeadCaptureForm serviceInterest="Geral" serviceLabel="um profissional em Trancoso" source="destino-trancoso" />
      </div>

      <WhatsAppStickyBar serviceLabel="um profissional em Trancoso" />
    </div>
  );
}
