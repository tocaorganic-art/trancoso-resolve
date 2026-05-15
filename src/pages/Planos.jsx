import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Zap, Tag, Loader2, Building2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
// Chamado via SDK: base44.functions.invoke('createSubscriptionCheckout', {})
import CancelSubscriptionButton from "@/components/dashboard/CancelSubscriptionButton";
import PositionamentoEstrategico from "@/components/plans/PositionamentoEstrategico";

// ─── Benefícios ────────────────────────────────────────────────────────────────

const BENEFICIOS_LANCAMENTO_PRESTADOR = [
  "Perfil verificado e listagem ativa na Trancoso Resolve",
  "Agenda e gestão de solicitações de serviços",
  "Receba novos clientes direto pela plataforma",
  "Suporte por e-mail para configuração do seu perfil",
  "Estatísticas de desempenho: veja quantas pessoas viram seu perfil e clicaram para falar com você",
  "Acesso completo a todos os recursos para prestadores",
  "Acesso ao Toca TrIA: seu agente de IA para automatizar agendamentos, responder clientes e otimizar seu negócio 24h por dia",
  "Acesso ao Toca Vision: crie imagens exclusivas de alta qualidade para redes sociais, portfólio e divulgação dos seus serviços",
  "Dashboard Financeiro Integrado: controle receitas, despesas e fluxo de caixa do seu negócio e da sua vida pessoal em um só lugar",
];

const BENEFICIOS_REGULAR_PRESTADOR = [
  "Perfil verificado e listagem ativa na Trancoso Resolve",
  "Agenda e gestão de solicitações de serviços",
  "Receba novos clientes direto pela plataforma",
  "Suporte por e-mail para otimizar o seu perfil",
  "Estatísticas de desempenho: veja quantas pessoas viram seu perfil e clicaram para falar com você",
  "Acesso completo a todos os recursos para prestadores",
  "Acesso ao Toca TrIA: agente de IA para automação de agendamentos, qualificação de leads e otimização do seu negócio",
  "Acesso ao Toca Vision: geração de imagens exclusivas em alta qualidade para divulgação e identidade visual",
  "Dashboard Financeiro Integrado: visão completa do seu negócio e da sua vida financeira pessoal em um único painel",
];

const BENEFICIOS_LANCAMENTO_EMPRESA = [
  "Perfil empresarial verificado e destacado na Trancoso Resolve",
  "Exibição do endereço físico, mapa, horário de funcionamento e canais de contato",
  "Receba novos clientes, pedidos, orçamentos e reservas direto pela plataforma",
  "Botão de contato rápido (WhatsApp e telefone) para novos clientes",
  "Espaço para fotos do estabelecimento, cardápio ou portfólio",
  "Estatísticas de desempenho: veja quantas pessoas viram seu perfil e clicaram para falar com você",
  "Suporte por e-mail para configurar e otimizar o perfil da empresa",
  "Acesso ao Toca TrIA: agente de IA para atender clientes, qualificar pedidos e automatizar processos do seu negócio 24h por dia",
  "Acesso ao Toca Vision: criação de imagens exclusivas em alta qualidade para posts, cardápios, promoções e identidade visual da sua empresa",
  "Dashboard Financeiro Integrado: controle completo de receitas, despesas e fluxo de caixa do seu negócio e da sua vida financeira pessoal",
];

const BENEFICIOS_REGULAR_EMPRESA = [
  "Perfil empresarial verificado e ativo na Trancoso Resolve",
  "Exibição do endereço físico, mapa, horário de funcionamento e canais de contato",
  "Receba novos clientes, pedidos, orçamentos e reservas direto pela plataforma",
  "Botão de contato rápido (WhatsApp e telefone) para novos clientes",
  "Espaço para fotos do estabelecimento, cardápio ou portfólio",
  "Estatísticas de desempenho: visualizações, cliques em contato e origem dos acessos ao seu perfil",
  "Suporte por e-mail para melhorar a performance do perfil da empresa",
  "Acesso ao Toca TrIA: agente de IA completo para automação, atendimento e otimização do seu negócio",
  "Acesso ao Toca Vision: geração de imagens exclusivas em alta qualidade para todas as necessidades visuais da sua empresa",
  "Dashboard Financeiro Integrado: gestão 360º do seu negócio e da sua vida financeira pessoal em um único lugar",
];

// ─── Lógica de tipo de pessoa ──────────────────────────────────────────────────

function isEmpresaComPontoFisico(provider) {
  if (!provider) return false;
  const tipo = provider.tipo_pessoa;
  const temPonto = provider.tem_ponto_fisico_em_trancoso;
  return (tipo === "mei" || tipo === "pj") && temPonto === true;
}

function isPrestadorMode(provider) {
  // Retorna true se deve ver planos de prestador
  if (!provider) return true; // default
  const tipo = provider.tipo_pessoa;
  const temPonto = provider.tem_ponto_fisico_em_trancoso;
  if (tipo === "pf") return true;
  if (tipo === "mei" && !temPonto) return true;
  if (tipo === "pj" && !temPonto) return true;
  return false; // mei/pj com ponto físico → empresa
}

// ─── Card de Plano ─────────────────────────────────────────────────────────────

function PlanCard({ badge, badgeColor, headerColor, icon, name, price, subtitle, benefits, ctaLabel, ctaNote, onCta, loading, disabled, highlighted }) {
  return (
    <Card className={`shadow-2xl overflow-hidden relative ${highlighted ? 'border-2 border-amber-400' : 'border-2 border-blue-500'} ${disabled ? 'opacity-60' : ''}`}>
      {badge && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className={`font-bold ${badgeColor}`}>
            <Tag className="w-3 h-3 mr-1" /> {badge}
          </Badge>
        </div>
      )}
      <div className={`p-8 text-center text-white ${headerColor}`}>
        {icon}
        <h2 className="text-2xl font-bold mb-1 mt-2">{name}</h2>
        <p className="text-4xl font-extrabold mt-2">R$ {price}<span className="text-base font-normal">/mês</span></p>
        <p className="text-sm opacity-80 mt-1">{subtitle}</p>
      </div>
      <CardContent className="p-6">
        <ul className="space-y-3 mb-6">
          {benefits.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
              <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
        {!disabled && (
          <>
            <Button
              className={`w-full ${highlighted ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
              onClick={onCta}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {ctaLabel}
            </Button>
            {ctaNote && <p className="text-xs text-slate-500 text-center mt-2">{ctaNote}</p>}
          </>
        )}
        {disabled && <p className="text-sm text-slate-500 text-center">Vagas esgotadas.</p>}
      </CardContent>
    </Card>
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

  // Contar prestadores com plano lançamento
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

  // Contadores de vagas (50 por grupo)
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

  // Detectar modo
  const empresaComPonto = isEmpresaComPontoFisico(myProvider);
  const prestadorMode = isPrestadorMode(myProvider);

  const handleCheckout = async (plan) => {
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
      const res = await base44.functions.invoke('createSubscriptionCheckout', { plan, user_email: user.email });
      if (res.data?.url) window.location.href = res.data.url;
    } catch {
      toast.error('Erro ao iniciar pagamento. Tente novamente.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container mx-auto max-w-4xl px-4">

        {/* Aviso para empresa com ponto físico */}
        {empresaComPonto && (
          <div className="mb-8 bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
            <Building2 className="w-10 h-10 text-amber-600 shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-amber-900 text-lg mb-1">Você é uma empresa com CNPJ e ponto físico em Trancoso</h3>
              <p className="text-amber-800 text-sm">
                Para negócios locais — lojas, restaurantes, pousadas, bares, beach clubs, clínicas e similares — o plano correto é o <strong>Plano Empresas</strong>, que garante mais visibilidade e recursos específicos para o seu negócio.
              </p>
            </div>
          </div>
        )}

        {/* ─── PLANOS DE PRESTADOR ──────────────────────────────── */}
        {prestadorMode && (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">Planos para Prestadores</h1>
              <p className="text-lg text-slate-600 max-w-xl mx-auto">
                Uma mensalidade simples. Acesso completo. Sem comissão sobre seus serviços.
              </p>
            </div>

            {isPromoAtivaPrestador && (
              <div className="mb-6 text-center">
                <span className="inline-block bg-amber-50 border border-amber-300 text-amber-800 text-sm font-semibold rounded-full px-4 py-1.5">
                  🎉 Restam <strong>{vagasPrestador}</strong> {vagasPrestador === 1 ? 'vaga' : 'vagas'} com preço de lançamento!
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <PlanCard
                badge={isPromoAtivaPrestador ? "Lançamento" : null}
                badgeColor="bg-amber-400 text-amber-900"
                headerColor={isPromoAtivaPrestador ? "bg-gradient-to-br from-amber-500 to-orange-500" : "bg-slate-400"}
                icon={<Zap className="w-10 h-10 mx-auto opacity-90" />}
                name="Plano Lançamento"
                price="29,90"
                subtitle="Apenas para os 50 primeiros prestadores"
                benefits={BENEFICIOS_LANCAMENTO_PRESTADOR}
                ctaLabel="Garantir plano de lançamento — R$ 29,90/mês"
                ctaNote="Válido apenas para os 50 primeiros prestadores cadastrados."
                onCta={() => handleCheckout('lancamento')}
                loading={loadingPlan === 'lancamento'}
                disabled={!isPromoAtivaPrestador}
                highlighted={true}
              />
              <PlanCard
                headerColor="bg-gradient-to-br from-blue-600 to-cyan-500"
                icon={<Check className="w-10 h-10 mx-auto opacity-90" />}
                name="Plano Regular"
                price="49,90"
                subtitle="A partir do 51º prestador"
                benefits={BENEFICIOS_REGULAR_PRESTADOR}
                ctaLabel="Assinar Plano Regular — R$ 49,90/mês"
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
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">Planos para Empresas em Trancoso</p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                Sua vitrine digital oficial em Trancoso
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-2">
                Seja encontrado por moradores, hóspedes e empresários em poucos cliques. Sem comissão sobre seus serviços.
              </p>
              <p className="text-sm text-slate-500 max-w-2xl mx-auto">
                A Trancoso Resolve conecta o seu negócio a quem precisa de você agora. Lojas, restaurantes, pousadas, clínicas e negócios locais com perfil verificado, visibilidade constante e ferramentas de inteligência artificial de última geração.
              </p>
            </div>

            {isPromoAtivaEmpresa && (
              <div className="mb-6 text-center">
                <span className="inline-block bg-amber-50 border border-amber-300 text-amber-800 text-sm font-semibold rounded-full px-4 py-1.5">
                  🎉 Restam <strong>{vagasEmpresa}</strong> {vagasEmpresa === 1 ? 'vaga' : 'vagas'} no preço de lançamento para empresas!
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <PlanCard
                badge={isPromoAtivaEmpresa ? "Lançamento · Empresas" : null}
                badgeColor="bg-amber-400 text-amber-900"
                headerColor={isPromoAtivaEmpresa ? "bg-gradient-to-br from-amber-500 to-orange-500" : "bg-slate-400"}
                icon={<Building2 className="w-10 h-10 mx-auto opacity-90" />}
                name="Plano Empresas – Lançamento"
                price="59,90"
                subtitle="Preço promocional para as 50 primeiras empresas"
                benefits={BENEFICIOS_LANCAMENTO_EMPRESA}
                ctaLabel="Garantir plano de lançamento — R$ 59,90/mês"
                ctaNote="Válido apenas para as 50 primeiras empresas cadastradas."
                onCta={() => handleCheckout('empresa_lancamento')}
                loading={loadingPlan === 'empresa_lancamento'}
                disabled={!isPromoAtivaEmpresa}
                highlighted={true}
              />
              <PlanCard
                headerColor="bg-gradient-to-br from-blue-600 to-cyan-500"
                icon={<Check className="w-10 h-10 mx-auto opacity-90" />}
                name="Plano Empresas – Regular"
                price="89,90"
                subtitle="Para empresas após o encerramento do plano de lançamento"
                benefits={BENEFICIOS_REGULAR_EMPRESA}
                ctaLabel="Assinar Plano Empresas — R$ 89,90/mês"
                onCta={() => handleCheckout('empresa_regular')}
                loading={loadingPlan === 'empresa_regular'}
                highlighted={false}
              />
            </div>
          </>
        )}

        {/* Info transparência */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 text-center mb-6">
          <strong>Transparência total:</strong> Sem comissão sobre seus serviços. Você negocia diretamente com o cliente e fica com 100% do valor.
        </div>

        <p className="text-center text-slate-500 text-sm mb-6">
          Dúvidas? Entre em contato: <a href="mailto:suporte@trancosoresolve.com" className="underline"><strong>suporte@trancosoresolve.com</strong></a>
        </p>

        {/* Gerenciar assinatura existente */}
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

        {/* Seção de posicionamento estratégico */}
        <PositionamentoEstrategico />
      </div>
    </div>
  );
}