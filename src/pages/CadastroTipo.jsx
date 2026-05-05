import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Briefcase, Shield } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { criarTrialPrestador } from '@/functions/criarTrialPrestador';
import { verificarAntecedentes } from '@/functions/verificarAntecedentes';

export default function CadastroTipoPage() {
  const queryClient = useQueryClient();
  const [autorizouVerificacao, setAutorizouVerificacao] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const updateUserMutation = useMutation({
    mutationFn: (userType) => base44.auth.updateMe({ user_type: userType }),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      await queryClient.refetchQueries({ queryKey: ['currentUser'] });
      if (data.user_type === 'prestador') {
        // Cria trial — aguarda para garantir que exista antes de entrar no Dashboard
        try {
          await criarTrialPrestador({ user_email: data.email, user_name: data.full_name });
        } catch (e) {
          localStorage.setItem('trial_pendente', 'true');
        }
        // Inicia verificação de antecedentes em background (não bloqueia o cadastro)
        try {
          const providers = await base44.entities.ServiceProvider.filter({ created_by: data.email });
          if (providers && providers.length > 0) {
            verificarAntecedentes({ service_provider_id: providers[0].id }).catch(() => {});
          }
        } catch (e) {
          // Silencioso — verificação será retomada manualmente pelo admin
        }
        window.location.replace('/Dashboard');
      } else {
        window.location.replace('/');
      }
    },
  });

  const handleSelectType = (type) => {
    if (type === 'prestador' && !autorizouVerificacao) {
      alert('Para se cadastrar como prestador, você precisa autorizar a verificação de antecedentes criminais.');
      return;
    }
    updateUserMutation.mutate(type);
  };

  if (isLoading) {
    return <div className="text-center py-12">Carregando...</div>;
  }
  
  // Não redireciona automaticamente — permite trocar o tipo

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl text-center shadow-2xl border-none">
        <CardContent className="p-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            {user?.user_type && user.user_type !== 'indefinido' ? 'Alterar tipo de conta' : 'Bem-vindo(a) ao Trancoso Resolve!'}
          </h1>
          <p className="text-slate-600 mb-10 text-lg">
            {user?.user_type && user.user_type !== 'indefinido'
              ? `Você está usando como ${user.user_type === 'cliente' ? 'Cliente' : 'Prestador'}. Deseja trocar?`
              : 'Para começar, nos diga como você gostaria de usar a plataforma.'}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card 
              className="border-2 border-transparent hover:border-cyan-500 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => handleSelectType('cliente')}
            >
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-cyan-700" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Sou Cliente</h2>
                <p className="text-slate-500">Quero encontrar e contratar os melhores serviços em Trancoso.</p>
              </CardContent>
            </Card>

            <Card 
              className="border-2 border-transparent hover:border-orange-500 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => handleSelectType('prestador')}
            >
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-orange-700" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Sou Prestador</h2>
                <p className="text-slate-500">Quero oferecer meus serviços e encontrar novos clientes.</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Checkbox LGPD para prestadores */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl text-left">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autorizouVerificacao}
                onChange={(e) => setAutorizouVerificacao(e.target.checked)}
                className="mt-1 accent-blue-600 w-4 h-4 shrink-0"
              />
              <span className="text-xs text-slate-700 leading-relaxed">
                <span className="font-semibold text-slate-800 flex items-center gap-1 mb-1">
                  <Shield className="w-3 h-3 text-blue-600" /> Autorização de Verificação (obrigatória para prestadores)
                </span>
                Ao continuar como prestador, autorizo a Trancoso Resolve a realizar consultas de antecedentes criminais em bases oficiais (incluindo Polícia Federal e órgãos estaduais, via Infosimples), usando meus dados pessoais exclusivamente para fins de prevenção à fraude, validação cadastral e cumprimento de obrigações legais, em conformidade com a LGPD.
              </span>
            </label>
          </div>

          {updateUserMutation.isPending && (
            <p className="mt-8 text-slate-500">Salvando sua escolha...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}