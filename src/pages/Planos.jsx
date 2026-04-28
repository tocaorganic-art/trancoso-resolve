import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Zap, Tag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import { createSubscriptionCheckout } from "@/functions/createSubscriptionCheckout";
import CancelSubscriptionButton from "@/components/dashboard/CancelSubscriptionButton";

const beneficios = [
  "Perfil verificado e listagem ativa",
  "Agenda e gestão de solicitações",
  "Receba contratações direto na plataforma",
  "Suporte por e-mail",
  "Estatísticas de desempenho",
  "Acesso completo a todos os recursos",
];

export default function PlanosPage() {
  const [loadingPlan, setLoadingPlan] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: providers } = useQuery({
    queryKey: ['totalProviders'],
    queryFn: () => base44.entities.ServiceProvider.list('-created_date', 200),
    initialData: [],
  });

  const { data: mySubscription } = useQuery({
    queryKey: ['mySubscription', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const subs = await base44.entities.Subscription.filter({ user_email: user.email });
      return subs?.[0] || null;
    },
    enabled: !!user,
  });

  const totalProviders = providers?.length || 0;
  const PROMO_LIMIT = 100;
  const vagasRestantes = Math.max(0, PROMO_LIMIT - totalProviders);
  const isPromoActive = vagasRestantes > 0;

  const handleCheckout = async (plan) => {
    // Bloquear se em iframe
    if (window.self !== window.top) {
      toast.error('O checkout só funciona no app publicado. Acesse trancosoresolve.base44.app');
      return;
    }
    if (!user) {
      base44.auth.redirectToLogin(window.location.pathname);
      return;
    }
    setLoadingPlan(plan);
    try {
      const res = await createSubscriptionCheckout({ plan, user_email: user.email });
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (e) {
      toast.error('Erro ao iniciar pagamento. Tente novamente.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Planos e Preços
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Uma mensalidade simples. Acesso completo. Sem comissão sobre seus serviços.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Plano Lançamento */}
          <Card className={`shadow-2xl overflow-hidden relative ${isPromoActive ? 'border-2 border-amber-400' : 'border border-slate-200 opacity-60'}`}>
            {isPromoActive && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-amber-400 text-amber-900 font-bold">
                  <Tag className="w-3 h-3 mr-1" /> Lançamento
                </Badge>
              </div>
            )}
            <div className={`p-8 text-center text-white ${isPromoActive ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-slate-400'}`}>
              <Zap className="w-10 h-10 mx-auto mb-3 opacity-90" />
              <h2 className="text-2xl font-bold mb-1">Plano Lançamento</h2>
              <p className="text-4xl font-extrabold mt-2">R$ 29,90<span className="text-base font-normal">/mês</span></p>
              <p className="text-sm opacity-80 mt-1">Apenas para os 100 primeiros prestadores</p>
            </div>
            <CardContent className="p-6">
              {isPromoActive ? (
                <div className="mb-4 text-center">
                  <p className="text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    🎉 Restam <strong>{vagasRestantes}</strong> {vagasRestantes === 1 ? 'vaga' : 'vagas'} com preço promocional!
                  </p>
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center mb-4">Vagas promocionais esgotadas.</p>
              )}
              <ul className="space-y-3 mb-6">
                {beneficios.map(item => (
                  <li key={item} className="flex items-center gap-2 text-slate-700 text-sm">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              {isPromoActive && (
                <Button
                  className="w-full bg-amber-500 hover:bg-amber-600"
                  onClick={() => handleCheckout('lancamento')}
                  disabled={loadingPlan === 'lancamento'}
                >
                  {loadingPlan === 'lancamento' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Garantir minha vaga — R$ 29,90/mês
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Plano Regular */}
          <Card className="shadow-2xl border-2 border-blue-500 overflow-hidden">
            {!isPromoActive && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-blue-600 text-white">Plano Atual</Badge>
              </div>
            )}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-8 text-center text-white">
              <Check className="w-10 h-10 mx-auto mb-3 opacity-90" />
              <h2 className="text-2xl font-bold mb-1">Plano Regular</h2>
              <p className="text-4xl font-extrabold mt-2">R$ 49,90<span className="text-base font-normal">/mês</span></p>
              <p className="text-sm opacity-80 mt-1">A partir do 101º prestador</p>
            </div>
            <CardContent className="p-6">
              <ul className="space-y-3 mb-6">
                {beneficios.map(item => (
                  <li key={item} className="flex items-center gap-2 text-slate-700 text-sm">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                onClick={() => handleCheckout('regular')}
                disabled={loadingPlan === 'regular'}
              >
                {loadingPlan === 'regular' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Assinar — R$ 49,90/mês
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 text-center mb-6">
          <strong>Transparência total:</strong> Sem comissão sobre seus serviços. Você negocia diretamente com o cliente e fica com 100% do valor.
        </div>

        <p className="text-center text-slate-500 text-sm mb-6">
          Dúvidas? Entre em contato: <strong>contato@tocaexperience.com.br</strong>
        </p>

        {/* Gerenciar assinatura existente */}
        {mySubscription && mySubscription.status === 'active' && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
            <p className="text-sm text-slate-600 mb-1">
              Sua assinatura está ativa
              {mySubscription.next_billing_date && ` — próxima cobrança em ${new Date(mySubscription.next_billing_date + 'T00:00:00').toLocaleDateString('pt-BR')}`}.
            </p>
            <div className="flex justify-center mt-3">
              <CancelSubscriptionButton accessUntil={mySubscription.next_billing_date} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}