import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CheckCircle, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LeadCaptureForm from '@/components/servicos/LeadCaptureForm';

export default function ServicoLocalPage({
  title,
  metaDescription,
  h1,
  intro,
  servicesTitle,
  services,
  howTitle,
  howText,
  cta,
  ctaButton,
  category,
  heroEmoji,
  serviceLabel,
}) {
  useEffect(() => {
    // Padrão: "[Nome do Serviço] em Trancoso | Trancoso Resolve"
    const seoTitle = title.includes('| Trancoso Resolve') ? title : `${title} | Trancoso Resolve`;
    const seoDesc = metaDescription || `Encontre ${serviceLabel || category} verificado em Trancoso, Bahia. Profissionais avaliados, atendimento rápido e seguro.`;

    document.title = seoTitle;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = seoDesc;

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) { ogTitle = document.createElement('meta'); ogTitle.setAttribute('property', 'og:title'); document.head.appendChild(ogTitle); }
    ogTitle.content = seoTitle;

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) { ogDesc = document.createElement('meta'); ogDesc.setAttribute('property', 'og:description'); document.head.appendChild(ogDesc); }
    ogDesc.content = seoDesc;
  }, [title, metaDescription, serviceLabel, category]);

  const searchUrl = createPageUrl('ServicosCategoria', `?cat=${encodeURIComponent(category)}`);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-14 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium mb-4">
            <MapPin className="w-4 h-4" />
            <span>Trancoso, Bahia</span>
          </div>
          <span className="text-5xl mb-4 block" aria-hidden="true">{heroEmoji}</span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-5">{h1}</h1>
          <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">{intro}</p>
          <Link to={searchUrl}>
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-base px-8 py-3">
              {ctaButton} <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4 py-12 space-y-16">
        {/* Serviços */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">{servicesTitle}</h2>
          <ul className="space-y-3">
            {services.map((item, i) => (
              <li key={i} className="flex items-start gap-3 bg-white rounded-xl px-5 py-4 shadow-sm border border-slate-100">
                <CheckCircle className="w-5 h-5 text-cyan-500 mt-0.5 shrink-0" />
                <span className="text-slate-700 text-base">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Como funciona */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">{howTitle}</h2>
          <p className="text-slate-600 text-base leading-relaxed">{howText}</p>
        </section>

        {/* Lead Capture Form */}
        <LeadCaptureForm serviceInterest={category} serviceLabel={serviceLabel || category} />

        {/* CTA */}
        <section className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-3xl p-8 md:p-12 text-center">
          <p className="text-white text-lg font-medium mb-6 max-w-xl mx-auto">{cta}</p>
          <Link to={searchUrl}>
            <Button className="bg-white text-blue-700 hover:bg-blue-50 font-bold text-base px-8">
              {ctaButton} <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
}