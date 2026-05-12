import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { CheckCircle, PartyPopper, ArrowRight, Home } from 'lucide-react';

export default function SolicitacaoConfirmadaPage() {
  useEffect(() => {
    document.title = "Solicitação Enviada com Sucesso! — Trancoso Resolve";

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = 'https://www.trancosoresolve.com.br/SolicitacaoConfirmada';

    const schemaId = 'schema-solicitacao-confirmada';
    const existing = document.getElementById(schemaId);
    if (existing) existing.remove();
    const schema = document.createElement('script');
    schema.id = schemaId;
    schema.type = 'application/ld+json';
    schema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Solicitação de Serviço Confirmada — Trancoso Resolve",
      "description": "Sua solicitação de serviço foi enviada com sucesso. Em breve o prestador entrará em contato.",
      "url": "https://www.trancosoresolve.com.br/SolicitacaoConfirmada",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://www.trancosoresolve.com.br" },
          { "@type": "ListItem", "position": 2, "name": "Solicitação Confirmada", "item": "https://www.trancosoresolve.com.br/SolicitacaoConfirmada" }
        ]
      }
    });
    document.head.appendChild(schema);
    return () => { const s = document.getElementById(schemaId); if (s) s.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Ícone de sucesso */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-14 h-14 text-green-600" />
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <PartyPopper className="w-8 h-8 text-amber-500" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
          Solicitação enviada com sucesso!
        </h1>

        <p className="text-lg text-slate-600 mb-2">
          Em breve o prestador entrará em contato pelo WhatsApp ou telefone informado.
        </p>

        <p className="text-slate-500 mb-8 leading-relaxed">
          Enquanto aguarda, confira outros profissionais verificados disponíveis em Trancoso.
        </p>

        {/* Indicador de progresso */}
        <div className="flex items-center justify-center gap-3 mb-8 text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Solicitação enviada</span>
          </div>
          <div className="w-8 h-px bg-slate-300" />
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <span>Aguardando confirmação</span>
          </div>
          <div className="w-8 h-px bg-slate-300" />
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-slate-300 rounded-full" />
            <span>Serviço realizado</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={createPageUrl("ServicosCategoria")}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 font-bold w-full sm:w-auto"
            >
              Ver mais prestadores
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Home className="w-4 h-4 mr-2" />
              Voltar para o início
            </Button>
          </Link>
        </div>

        {/* Dica */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
          💡 <strong>Dica:</strong> Salve o contato do prestador no seu celular para facilitar a comunicação durante o serviço.
        </div>
      </div>
    </div>
  );
}