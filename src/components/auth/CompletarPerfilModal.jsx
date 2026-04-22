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
      toast.error('Informe um telefone válido.');
      return;
    }
    if (!form.birth_date) {
      toast.error('Informe sua data de nascimento.');
      return;
    }

    // Validar idade mínima 18 anos
    const hoje = new Date();
    const nasc = new Date(form.birth_date);
    const idade = hoje.getFullYear() - nasc.getFullYear();
    const mesPassou = hoje.getMonth() > nasc.getMonth() || (hoje.getMonth() === nasc.getMonth() && hoje.getDate() >= nasc.getDate());
    if (idade < 18 || (idade === 18 && !mesPassou)) {
      toast.error('É necessário ter pelo menos 18 anos.');
      return;
    }

    mutation.mutate({
      phone: form.phone,
      birth_date: form.birth_date,
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
      <DialogContent className="max-w-md p-0 overflow-hidden" onInteractOutside={handleClose}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-5 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-1">
            <img
              src="https://media.base44.com/images/public/68eb21726a9614db4a82ba99/866729f3e_trancoso_resolve_logo_principal.png"
              alt="Logo"
              className="h-8 w-8"
            />
            <span className="font-bold text-lg">Trancoso Resolve</span>
          </div>
          <h2 className="text-xl font-bold mt-2">Complete seu cadastro</h2>
          <p className="text-blue-100 text-sm mt-1">
            Preencha seus dados para acessar as ferramentas exclusivas Toca TrIA e Toca Vision.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Nome (somente leitura — vem do login social) */}
          <div className="space-y-1">
            <Label>Nome completo</Label>
            <Input value={user?.full_name || ''} disabled className="bg-slate-50 text-slate-500" />
          </div>

          {/* E-mail (somente leitura) */}
          <div className="space-y-1">
            <Label>Endereço de e-mail</Label>
            <Input value={user?.email || ''} disabled className="bg-slate-50 text-slate-500" />
          </div>

          {/* Telefone */}
          <div className="space-y-1">
            <Label htmlFor="phone">Número de telefone <span className="text-red-500">*</span></Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(__) _____-____"
              value={form.phone}
              onChange={handlePhone}
              required
            />
          </div>

          {/* Data de nascimento */}
          <div className="space-y-1">
            <Label htmlFor="birth_date">Data de nascimento <span className="text-red-500">*</span></Label>
            <Input
              id="birth_date"
              type="date"
              value={form.birth_date}
              onChange={(e) => setForm(f => ({ ...f, birth_date: e.target.value }))}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 font-bold h-11"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</>
            ) : (
              <><CheckCircle className="w-4 h-4 mr-2" /> Concluir cadastro</>
            )}
          </Button>

          <p className="text-xs text-slate-500 text-center">
            Ao concluir seu cadastro, você terá acesso às ferramentas exclusivas da plataforma Trancoso Resolve.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}