import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, ArrowRight, Shield } from 'lucide-react';

export default function LeadCaptureForm({ serviceInterest, serviceLabel }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const lead = await base44.entities.LeadPreLancamento.create({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        message: form.message,
        service_interest: serviceInterest,
        source: 'pagina-servico',
        type: 'cliente',
      });
      // Dispara notificação em background (não bloqueia o UX)
      if (lead?.id) {
        base44.functions.invoke('notifyNewLead', { leadId: lead.id }).catch(() => {});
      }
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-green-800 mb-2">Pedido recebido! 🎉</h3>
        <p className="text-green-700 leading-relaxed">
          Em breve você receberá contato de {serviceLabel || serviceInterest} verificados em Trancoso diretamente pelo seu WhatsApp.
        </p>
        {form.email && (
          <p className="text-green-600 text-sm mt-2">Enviamos uma confirmação para {form.email}.</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-1">
        <Shield className="w-5 h-5 text-cyan-500" />
        <span className="text-xs font-semibold text-cyan-600 uppercase tracking-wide">Profissionais verificados</span>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        Receba contato de {serviceLabel || serviceInterest} em Trancoso
      </h2>
      <p className="text-slate-500 text-sm mb-6">
        Preencha abaixo e profissionais locais verificados entrarão em contato direto com você — sem intermediários.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email (opcional — para confirmação)</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="seu@email.com"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">O que você precisa? (opcional)</label>
          <textarea
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            placeholder="Descreva brevemente o serviço, a propriedade ou a urgência..."
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
            <>Quero receber contato de profissionais <ArrowRight className="w-4 h-4 ml-2" /></>
          )}
        </Button>
        <p className="text-xs text-slate-400 text-center">
          🔒 Seus dados são usados somente para conectar com prestadores locais verificados. Sem spam.
        </p>
      </form>
    </div>
  );
}