import React from 'react';
import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

const items = [
  { label: 'Clientes de alto padrão', solo: false, toca: true },
  { label: 'Marketing e divulgação global', solo: false, toca: true },
  { label: 'Gestão de agenda integrada', solo: false, toca: true },
  { label: 'Avaliações e reputação online', solo: false, toca: true },
  { label: 'Suporte e assistência 24h', solo: false, toca: true },
  { label: 'Pagamento garantido e seguro', solo: false, toca: true },
  { label: 'Visibilidade em buscas locais', solo: 'Parcial', toca: true },
  { label: 'Zero custo de marketing', solo: false, toca: true },
];

export default function TabelaComparativa() {
  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Por que escolher a Toca?</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-3">Trabalhar Sozinho vs. Ser Parceiro Toca</h2>
          <p className="text-slate-500">Veja a diferença que a nossa plataforma faz para o seu negócio.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-3 bg-slate-800 text-white text-center">
            <div className="p-4 text-left pl-6 font-medium text-slate-300">Benefício</div>
            <div className="p-4 font-semibold text-slate-400">Por conta própria</div>
            <div className="p-4 font-bold text-cyan-400 bg-gradient-to-b from-blue-700 to-blue-800">
              Parceiro Toca 🌴
            </div>
          </div>

          {/* Rows */}
          {items.map((item, i) => (
            <div key={i} className={`grid grid-cols-3 text-center border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
              <div className="p-4 pl-6 text-left text-sm font-medium text-slate-700">{item.label}</div>
              <div className="p-4 flex items-center justify-center">
                {item.solo === true ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : item.solo === 'Parcial' ? (
                  <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full">Parcial</span>
                ) : (
                  <X className="w-5 h-5 text-red-400" />
                )}
              </div>
              <div className="p-4 flex items-center justify-center bg-blue-50/50">
                <Check className="w-5 h-5 text-blue-600 stroke-[2.5]" />
              </div>
            </div>
          ))}

          {/* CTA row */}
          <div className="grid grid-cols-3 text-center bg-slate-50 p-4">
            <div />
            <div />
            <div className="flex justify-center">
              <Link to={createPageUrl('CadastroTipo')}>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-sm font-bold">
                  Quero ser Parceiro
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}