import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react';

export default function LeadCaptureForm({ serviceInterest, serviceLabel }) {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    await base44.entities.LeadPreLancamento.create({
      name: form.name,
      phone: form.phone,
      message: form.message,
      service_interest: serviceInterest,
      source: 'pagina-servico',
      type: 'cliente',
    });
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-green-800 mb-2">Pedido recebido!</h3>
        <p className="text-green-700">
          Entraremos em contato em breve com {serviceLabel || serviceInterest} disponíveis em Trancoso.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        Receba contato de {serviceLabel || serviceInterest} em Trancoso
      </h2>
      <p className="text-slate-500 text-sm mb-6">
        Preencha abaixo e profissionais locais entrarão em contato direto com você.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Seu nome *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Ex: Maria Oliveira"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp *</label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            placeholder="(73) 99999-0000"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">O que você precisa? (opcional)</label>
          <textarea
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            placeholder="Descreva brevemente o serviço ou problema..."
            rows={3}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
          />
        </div>
        {status === 'error' && (
          <p className="text-red-600 text-sm">Erro ao enviar. Tente novamente.</p>
        )}
        <Button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-base py-3"
        >
          {status === 'loading' ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...</>
          ) : (
            <>Quero receber contato <ArrowRight className="w-4 h-4 ml-2" /></>
          )}
        </Button>
        <p className="text-xs text-slate-400 text-center">
          Sem spam. Seus dados são usados somente para conectar com prestadores locais.
        </p>
      </form>
    </div>
  );
}