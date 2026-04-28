import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

export default function CompletarPerfilModal({ user, open, onClose }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    phone: '',
    birth_date: '',
  });

  const mutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast.success('Perfil concluído! Bem-vindo(a) ao Trancoso Resolve.');
    },
    onError: () => {
      toast.error('Erro ao salvar. Tente novamente.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.phone || form.phone.replace(/\D/g, '').length < 10) {
      toast.error('Informe um telefone/WhatsApp válido.');
      return;
    }
    if (form.birth_date) {
      // Validar idade mínima 18 anos (apenas se preenchido)
      const hoje = new Date();
      const nasc = new Date(form.birth_date);
      const idade = hoje.getFullYear() - nasc.getFullYear();
      const mesPassou = hoje.getMonth() > nasc.getMonth() || (hoje.getMonth() === nasc.getMonth() && hoje.getDate() >= nasc.getDate());
      if (idade < 18 || (idade === 18 && !mesPassou)) {
        toast.error('É necessário ter pelo menos 18 anos.');
        return;
      }
    }

    mutation.mutate({
      phone: form.phone,
      ...(form.birth_date ? { birth_date: form.birth_date } : {}),
      profile_completed: true,
    });
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handlePhone = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    setForm(f => ({ ...f, phone: v }));
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
      <DialogContent
        className="max-w-[420px] w-[calc(100%-32px)] p-0 overflow-hidden rounded-2xl shadow-2xl border-0"
        style={{ backdropFilter: 'blur(3px)' }}
        onInteractOutside={handleClose}
      >
        {/* Header */}
        <div className="px-5 py-5 text-white relative" style={{ background: 'linear-gradient(135deg, #00AEEF, #0072FF)' }}>
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <img
              src="https://media.base44.com/images/public/68eb21726a9614db4a82ba99/866729f3e_trancoso_resolve_logo_principal.png"
              alt="Logo"
              className="h-8 w-8 rounded"
            />
            <span className="font-bold text-base">Trancoso Resolve</span>
          </div>
          <h2 className="text-xl font-bold leading-tight">Complete seu cadastro</h2>
          <p className="text-white/90 text-sm mt-1 leading-snug">
            Leva menos de 1 minuto e libera acesso às ferramentas exclusivas da Toca em Trancoso.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4 bg-white">
          {/* Nome (somente leitura) */}
          <div className="space-y-1">
            <Label className="text-sm font-semibold text-slate-700">Nome completo</Label>
            <Input value={user?.full_name || ''} disabled className="bg-slate-100 text-slate-500 border-slate-200 text-sm h-10" />
          </div>

          {/* E-mail (somente leitura) */}
          <div className="space-y-1">
            <Label className="text-sm font-semibold text-slate-700">Endereço de e-mail</Label>
            <Input value={user?.email || ''} disabled className="bg-slate-100 text-slate-500 border-slate-200 text-sm h-10" />
          </div>

          {/* Telefone / WhatsApp */}
          <div className="space-y-1">
            <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">
              WhatsApp <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(73) 99999-9999"
              value={form.phone}
              onChange={handlePhone}
              required
              className="border-slate-300 text-sm h-10 focus:border-blue-500"
            />
            <p className="text-xs text-slate-500 leading-snug">
              Seu número nunca será exibido publicamente — usado apenas para conectar você ao prestador escolhido.
            </p>
          </div>

          {/* Data de nascimento */}
          <div className="space-y-1">
            <Label htmlFor="birth_date" className="text-sm font-semibold text-slate-700">Data de nascimento</Label>
            <Input
              id="birth_date"
              type="date"
              value={form.birth_date}
              onChange={(e) => setForm(f => ({ ...f, birth_date: e.target.value }))}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
              className="border-slate-300 text-sm h-10"
            />
          </div>

          <Button
            type="submit"
            className="w-full font-bold h-12 rounded-full text-base mt-2"
            style={{ background: 'linear-gradient(135deg, #00AEEF, #00C853)', border: 'none' }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</>
            ) : (
              <><CheckCircle className="w-4 h-4 mr-2" /> Concluir cadastro e continuar</>
            )}
          </Button>

          <p className="text-xs text-slate-400 text-center leading-snug">
            Ao concluir, você terá acesso às ferramentas exclusivas da plataforma Trancoso Resolve.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}