import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Check, Zap, Loader2, Building2, Calendar, Wrench,
  ChevronDown, ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import CancelSubscriptionButton from "@/components/dashboard/CancelSubscriptionButton";
import PositionamentoEstrategico from "@/components/plans/PositionamentoEstrategico";

// ─── Benefícios ────────────────────────────────────────────────────────────────

const BENEFICIOS_LANCAMENTO_PRESTADOR = [
  "Perfil verificado e listagem ativa na Trancoso Resolve",
  "Agenda e gestão de solicitações de serviços",
  "Receba novos clientes direto pela plataforma",
  "Suporte por e-mail para configuração do seu perfil",
  "Estatísticas de desempenho: visualizações e cliques no perfil",
  "Acesso completo a todos os recursos para prestadores",
  "Acesso ao Toca TrIA: agente de IA para automação e atendimento 24h",
  "Acesso ao Toca Vision: imagens exclusivas para redes sociais e portfólio",
  "Dashboard Financeiro Integrado",
];

const BENEFICIOS_REGULAR_PRESTADOR = [
  "Perfil verificado e listagem ativa na Trancoso Resolve",
  "Agenda e gestão de solicitações de serviços",
  "Receba novos clientes direto pela plataforma",
  "Suporte por e-mail para otimizar o seu perfil",
  "Estatísticas de desempenho: visualizações e cliques no perfil",
  "Acesso completo a todos os recursos para prestadores",
  "Acesso ao Toca TrIA: agente de IA para automação e atendimento",
  "Acesso ao Toca Vision: imagens exclusivas em alta qualidade",
  "Dashboard Financeiro Integrado",
];

const BENEFICIOS_LANCAMENTO_EMPRESA = [
  "Perfil empresarial verificado e destacado na Trancoso Resolve",
  "Exibição do endereço físico, mapa, horário e canais de contato",
  "Receba novos clientes, pedidos, orçamentos e reservas",
  "Botão de contato rápido (WhatsApp e telefone)",
  "Espaço para fotos do estabelecimento, cardápio ou portfólio",
  "Estatísticas de desempenho do perfil",
  "Suporte por e-mail para configurar e otimizar o perfil",
  "Acesso ao Toca TrIA: agente de IA para atendimento 24h",
  "Acesso ao Toca Vision: imagens para posts, cardápios e identidade visual",
  "Dashboard Financeiro Integrado",
];

const BENEFICIOS_REGULAR_EMPRESA = [
  "Perfil empresarial verificado e ativo na Trancoso Resolve",
  "Exibição do endereço físico, mapa, horário e canais de contato",
  "Receba novos clientes, pedidos, orçamentos e reservas",
  "Botão de contato rápido (WhatsApp e telefone)",
  "Espaço para fotos do estabelecimento, cardápio ou portfólio",
  "Estatísticas de desempenho: visualizações, cliques e origem dos acessos",
  "Suporte por e-mail para melhorar a performance",
  "Acesso ao Toca TrIA: agente de IA completo para automação e atendimento",
  "Acesso ao Toca Vision: imagens exclusivas para todas as necessidades visuais",
  "Dashboard Financeiro Integrado",
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: "Posso cancelar meu plano após a alta temporada?",
    a: "Sim. Você pode cancelar a qualquer momento pelo painel. O acesso continua até o fim do período pago.",
  },
  {
    q: "O uso avulso renova automaticamente?",
    a: "Não. O uso avulso é uma cobrança única de 1 mês. Para continuar, você precisa ativar novamente.",
  },
  {
    q: "Posso migrar do uso avulso para um plano mensal depois?",
    a: "Sim. A qualquer momento você pode assinar um plano mensal e aproveitar os benefícios de continuidade.",
  },
  {
    q: "Qual é a diferença entre o Plano Lançamento e o Plano Mensal?",
    a: "O Plano Lançamento tem preço reduzido (R$ 29,90) e inclui 2 meses grátis, mas é limitado a 50 vagas. O Plano Mensal (R$ 49,90) está sempre disponível com 7 dias grátis.",
  },
];

// ─── Tipo de perfil ────────────────────────────────────────────────────────────

function isEmpresaComPontoFisico(provider) {
  if (!provider) return false;
  const tipo = provider.tipo_pessoa;
  return (tipo === "mei" || tipo === "pj") && provider.tem_ponto_fisico_em_trancoso === true;
}

function isPrestadorMode(provider) {
  if (!provider) return true;
  const tipo = provider.tipo_pessoa;
  if (tipo === "pf") return true;
  if (tipo === "mei" && !provider.tem_ponto_fisico_em_trancoso) return true;
  if (tipo === "pj" && !provider.tem_ponto_fisico_em_trancoso) return true;
  return false;
}

// ─── Card de Plano ─────────────────────────────────────────────────────────────

function PlanCard({ badge, badgeColor, headerColor, icon, name, price, subtitle, benefits, ctaLabel, ctaNote, onCta, loading, disabled, highlighted, avulsoLabel, trialLabel, isLancamento }) {
  return (
    <Card className={`shadow-2xl overflow-hidden relative ${highlighted ? 'border-2 border-amber-400' : 'border-2 border-blue-500'} ${disabled ? 'opacity-60' : ''}`}>
      {badge && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className={`font-bold text-xs ${badgeColor}`}>{badge}</Badge>
        </div>
      )}
      <div className={`p-6 text-center text-white ${headerColor}`}>
        {icon}
        <h2 className="text-xl font-bold mb-1 mt-2">{name}</h2>
        <p className="text-3xl font-extrabold mt-2">R$ {price}<span className="text-sm font-normal">/mês</span></p>
        {trialLabel && (
          <p className="text-xs mt-1 flex items-center justify-center gap-1 opacity-90">
            <Calendar className="w-3 h-3" /> {trialLabel}
          </p>
        )}
        {isLancamento && (
          <Badge className="mt-2 bg-red-500/80 text-white text-xs">🔒 Limitado a 50 vagas</Badge>
        )}
        {avulsoLabel && (
          <p className="text-xs mt-2 opacity-80 bg-white/10 rounded px-2 py-1 inline-block">
            🏖 Uso avulso (1 mês): <strong>{avulsoLabel}</strong>{" "}
            <span className="text-yellow-300 font-semibold">— Ideal para alta temporada</span>
          </p>
        )}
        <p className="text-xs opacity-70 mt-1">{subtitle}</p>
      </div>
      <CardContent className="p-5">
        <ul className="space-y-2 mb-5">
          {benefits.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
              <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
        {!disabled ? (
          <>
            <p className="text-xs text-slate-500 text-center mb-2">
              🔒 Seu cartão será salvo agora, mas nenhuma cobrança será feita durante o período gratuito.
            </p>
            <Button
              className={`w-full text-sm ${highlighted ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
              onClick={onCta}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {ctaLabel}
            </Button>
            {ctaNote && <p className="text-xs text-slate-500 text-center mt-2">{ctaNote}</p>}
          </>
        ) : (
          <p className="text-sm text-slate-500 text-center">Vagas esgotadas.</p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Card Avulso ──────────────────────────────────────────────────────────────

function AvulsoCard({ icon, title, price, onCta, loading }) {
  return (
    <Card className="border-2 border-teal-500 bg-slate-800 text-white overflow-hidden">
      <div className="p-6 text-center bg-gradient-to-br from-teal-600 to-cyan-600">
        {icon}
        <h3 className="text-lg font-bold mt-2">{title}</h3>
        <p className="text-3xl font-extrabold mt-2">R$ {price}<span className="text-sm font-normal"> / mês</span></p>
      </div>
      <CardContent className="p-5 space-y-3">
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> 1 mês de acesso completo</li>
          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Sem assinatura, sem renovação automática</li>
          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Todos os recursos da plataforma</li>
        </ul>
        <Button
          className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold"
          onClick={onCta}
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Ativar por 1 mês
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        className="w-full text-left px-5 py-4 flex justify-between items-center bg-white hover:bg-slate-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-slate-800 text-sm">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 py-4 bg-slate-50 text-sm text-slate-600 border-t border-slate-200">
          {a}
        </div>
      )}
    </div>
  );
}

// ─── Página Principal ──────────────────────────────────────────────────────────

export default function PlanosPage() {
  const [loadingPlan, setLoadingPlan] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: myProvider } = useQuery({
    queryKey: ['myProvider', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const res = await base44.entities.ServiceProvider.filter({ created_by: user.email });
      return res?.[0] || null;
    },
    enabled: !!user,
  });

  const { data: allProviders } = useQuery({
    queryKey: ['allProviders'],
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

  const PROMO_LIMIT = 50;
  const totalPrestadores = allProviders?.filter(p =>
    p.tipo_pessoa === 'pf' ||
    (p.tipo_pessoa === 'mei' && !p.tem_ponto_fisico_em_trancoso) ||
    (p.tipo_pessoa === 'pj' && !p.tem_ponto_fisico_em_trancoso)
  ).length || 0;
  const totalEmpresas = allProviders?.filter(p =>
    ((p.tipo_pessoa === 'mei' || p.tipo_pessoa === 'pj') && p.tem_ponto_fisico_em_trancoso)
  ).length || 0;

  const isPromoAtivaPrestador = totalPrestadores < PROMO_LIMIT;
  const isPromoAtivaEmpresa = totalEmpresas < PROMO_LIMIT;
  const vagasPrestador = Math.max(0, PROMO_LIMIT - totalPrestadores);
  const vagasEmpresa = Math.max(0, PROMO_LIMIT - totalEmpresas);

  const empresaComPonto = isEmpresaComPontoFisico(myProvider);
  const prestadorMode = isPrestadorMode(myProvider);

  const handleCheckout = async (plan) => {
    if (window.self !== window.top) {
      toast.error('O checkout só funciona no app publicado. Acesse trancosoresolve.com.br');
      return;
    }
    if (!user) {
      base44.auth.redirectToLogin(window.location.pathname);
      return;
    }
    setLoadingPlan(plan);
    try {
      const res = await base44.functions.invoke('createSubscriptionCheckout', { plan, user_email: user.email });
      if (res.data?.error === 'vagas_esgotadas') {
        toast.error(res.data.message);
        // Redirecionar para regular automaticamente
        setTimeout(() => handleCheckout('regular'), 1500);
        return;
      }
      if (res.data?.url) window.location.href = res.data.url;
    } catch {
      toast.error('Erro ao iniciar pagamento. Tente novamente.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto max-w-4xl px-4">

        {/* Aviso empresa com ponto físico */}
        {empresaComPonto && (
          <div className="mb-8 bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
            <Building2 className="w-10 h-10 text-amber-600 shrink-0" />
            <div>
              <h3 className="font-bold text-amber-900 text-lg mb-1">Você é uma empresa com CNPJ e ponto físico em Trancoso</h3>
              <p className="text-amber-800 text-sm">
                Para negócios locais, o plano correto é o <strong>Plano Empresas</strong>, com recursos específicos para o seu negócio.
              </p>
            </div>
          </div>
        )}

        {/* ─── BANNER SAZONALIDADE ──────────────────────────────────────────── */}
        <div className="mb-10 border-2 border-teal-400 bg-teal-50 rounded-2xl p-6 flex flex-col md:flex-row items-start gap-4">
          <div className="w-12 h-12 bg-teal-400/20 rounded-xl flex items-center justify-center shrink-0">
            <Calendar className="w-7 h-7 text-teal-600" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-teal-900 mb-1">Trancoso tem temporada. Seu plano também pode ter.</h2>
            <p className="text-teal-800 text-sm leading-relaxed">
              <strong>Alta temporada: dezembro a março e julho</strong> — quando a demanda por serviços dispara.<br />
              Se você trabalha por temporada, o <strong>Uso Avulso</strong> é a escolha certa: pague só quando precisar, sem compromisso anual.
            </p>
          </div>
        </div>

        {/* ─── PLANOS DE PRESTADOR ──────────────────────────────── */}
        {prestadorMode && (
          <>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Para Prestadores Individuais</p>

            {isPromoAtivaPrestador && (
              <div className="mb-4 text-center">
                <span className="inline-block bg-amber-50 border border-amber-300 text-amber-800 text-sm font-semibold rounded-full px-4 py-1.5">
                  🎉 Restam <strong>{vagasPrestador}</strong> {vagasPrestador === 1 ? 'vaga' : 'vagas'} com preço de lançamento!
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <PlanCard
                badge="🚀 Lançamento"
                badgeColor="bg-amber-400 text-amber-900"
                headerColor={isPromoAtivaPrestador ? "bg-gradient-to-br from-amber-500 to-orange-500" : "bg-slate-400"}
                icon={<Zap className="w-9 h-9 mx-auto opacity-90" />}
                name="Plano Prestador"
                price="29,90"
                trialLabel="2 meses grátis inclusos"
                isLancamento={true}
                avulsoLabel="R$ 69,90"
                subtitle="Apenas para os 50 primeiros"
                benefits={BENEFICIOS_LANCAMENTO_PRESTADOR}
                ctaLabel="Garantir — R$ 29,90/mês"
                ctaNote="✅ 2 meses grátis · Oferta exclusiva dos 50 primeiros"
                onCta={() => handleCheckout('lancamento')}
                loading={loadingPlan === 'lancamento'}
                disabled={!isPromoAtivaPrestador}
                highlighted={true}
              />
              <PlanCard
                badge="Mensal"
                badgeColor="bg-blue-400 text-white"
                headerColor="bg-gradient-to-br from-blue-600 to-cyan-500"
                icon={<Check className="w-9 h-9 mx-auto opacity-90" />}
                name="Plano Prestador Mensal"
                price="49,90"
                trialLabel="7 dias grátis"
                avulsoLabel="R$ 69,90"
                subtitle="Disponível a qualquer momento"
                benefits={BENEFICIOS_REGULAR_PRESTADOR}
                ctaLabel="Assinar — R$ 49,90/mês"
                onCta={() => handleCheckout('regular')}
                loading={loadingPlan === 'regular'}
                highlighted={false}
              />
            </div>
          </>
        )}

        {/* ─── PLANOS DE EMPRESA ────────────────────────────────── */}
        {!prestadorMode && (
          <>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Para Empresas</p>

            {isPromoAtivaEmpresa && (
              <div className="mb-4 text-center">
                <span className="inline-block bg-amber-50 border border-amber-300 text-amber-800 text-sm font-semibold rounded-full px-4 py-1.5">
                  🎉 Restam <strong>{vagasEmpresa}</strong> {vagasEmpresa === 1 ? 'vaga' : 'vagas'} no preço de lançamento para empresas!
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <PlanCard
                badge="🚀 Lançamento"
                badgeColor="bg-amber-400 text-amber-900"
                headerColor={isPromoAtivaEmpresa ? "bg-gradient-to-br from-amber-500 to-orange-500" : "bg-slate-400"}
                icon={<Building2 className="w-9 h-9 mx-auto opacity-90" />}
                name="Plano Empresas"
                price="59,90"
                trialLabel="7 dias grátis"
                isLancamento={true}
                avulsoLabel="R$ 99,99"
                subtitle="Apenas para as 50 primeiras empresas"
                benefits={BENEFICIOS_LANCAMENTO_EMPRESA}
                ctaLabel="Garantir — R$ 59,90/mês"
                ctaNote="✅ 7 dias grátis · Oferta exclusiva das 50 primeiras"
                onCta={() => handleCheckout('empresa_lancamento')}
                loading={loadingPlan === 'empresa_lancamento'}
                disabled={!isPromoAtivaEmpresa}
                highlighted={true}
              />
              <PlanCard
                badge="Mensal"
                badgeColor="bg-blue-400 text-white"
                headerColor="bg-gradient-to-br from-blue-600 to-cyan-500"
                icon={<Check className="w-9 h-9 mx-auto opacity-90" />}
                name="Plano Empresas Mensal"
                price="89,90"
                trialLabel="7 dias grátis"
                avulsoLabel="R$ 99,99"
                subtitle="Para empresas após o lançamento"
                benefits={BENEFICIOS_REGULAR_EMPRESA}
                ctaLabel="Assinar — R$ 89,90/mês"
                onCta={() => handleCheckout('empresa_regular')}
                loading={loadingPlan === 'empresa_regular'}
                highlighted={false}
              />
            </div>
          </>
        )}

        {/* ─── SEÇÃO USO AVULSO ─────────────────────────────────── */}
        <div className="mb-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
              Trabalha só na temporada? Temos a opção certa para você.
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl mx-auto">
              Em Trancoso, a alta temporada concentra boa parte do movimento do ano. Se você é prestador ou empresa que atua de dezembro a março (verão) ou em julho (inverno), o uso avulso permite ativar seu perfil apenas nos meses que importam — sem pagar o ano todo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AvulsoCard
              icon={<Wrench className="w-9 h-9 mx-auto opacity-90" />}
              title="Avulso Prestador"
              price="69,90"
              onCta={() => handleCheckout('avulso_prestador')}
              loading={loadingPlan === 'avulso_prestador'}
            />
            <AvulsoCard
              icon={<Building2 className="w-9 h-9 mx-auto opacity-90" />}
              title="Avulso Empresa"
              price="99,99"
              onCta={() => handleCheckout('avulso_empresa')}
              loading={loadingPlan === 'avulso_empresa'}
            />
          </div>

          <p className="text-center text-slate-500 text-xs mt-4">
            💡 Você pode renovar manualmente a cada mês que precisar. Nenhuma cobrança automática.
          </p>
        </div>

        {/* Transparência */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 text-center mb-6">
          <strong>Transparência total:</strong> Sem comissão sobre seus serviços. Você negocia diretamente com o cliente e fica com 100% do valor.
        </div>

        <p className="text-center text-slate-500 text-sm mb-8">
          Dúvidas? Entre em contato: <a href="mailto:suporte@trancosoresolve.com.br" className="underline"><strong>suporte@trancosoresolve.com.br</strong></a>
        </p>

        {/* Assinatura ativa */}
        {mySubscription && mySubscription.status === 'active' && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center mb-8">
            <p className="text-sm text-slate-600 mb-1">
              Sua assinatura está ativa
              {mySubscription.next_billing_date && ` — próxima cobrança em ${new Date(mySubscription.next_billing_date + 'T00:00:00').toLocaleDateString('pt-BR')}`}.
            </p>
            <div className="flex justify-center mt-3">
              <CancelSubscriptionButton accessUntil={mySubscription.next_billing_date} />
            </div>
          </div>
        )}

        {/* ─── FAQ ──────────────────────────────────────────────── */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 text-center mb-5">Perguntas Frequentes</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>

        {/* Posicionamento estratégico */}
        <PositionamentoEstrategico />
      </div>
    </div>
  );
}