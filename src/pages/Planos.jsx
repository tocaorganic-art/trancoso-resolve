import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Check, Zap, Loader2, Calendar, ChevronDown, ChevronUp,
  Lock, Users, Star, Megaphone, Crown, Store, Sun
} from "lucide-react";
import CancelSubscriptionButton from "@/components/dashboard/CancelSubscriptionButton";
import PositionamentoEstrategico from "@/components/plans/PositionamentoEstrategico";

const PROMO_LIMIT = 50;

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        className="w-full text-left px-5 py-4 flex justify-between items-center bg-card hover:bg-muted transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-foreground text-sm pr-4">{q}</span>
        {open
          ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
          : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <div className="px-5 py-4 bg-muted text-sm text-muted-foreground border-t border-border leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

// ─── Tab Toggle ───────────────────────────────────────────────────────────────
function TabToggle({ active, onChange }) {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="inline-flex rounded-full border border-border bg-muted p-1 gap-1">
        <button
          onClick={() => onChange('prestador')}
          className={`rounded-full px-6 py-2 text-sm font-semibold transition-all ${
            active === 'prestador'
              ? 'bg-brand-primary text-white shadow'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Sou Prestador
        </button>
        <button
          onClick={() => onChange('lojista')}
          className={`rounded-full px-6 py-2 text-sm font-semibold transition-all ${
            active === 'lojista'
              ? 'bg-brand-primary text-white shadow'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Sou Lojista
        </button>
      </div>
    </div>
  );
}

// ─── Plan Card ────────────────────────────────────────────────────────────────
function PlanCard({
  badge, badgeColor, headerColor, icon, name, price,
  trialLabel, vagasLabel, benefits,
  ctaLabel, ctaNote, onCta,
  onCtaAvulso, ctaAvulsoLabel,
  loading, loadingAvulso, disabled, popular, isFree,
}) {
  return (
    <div className={popular ? 'relative pt-4' : 'relative'}>
      {popular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
          <Badge className="bg-orange-500 text-white font-bold text-xs px-3 py-1 shadow">
            <Star className="w-3 h-3 mr-1" /> Mais popular
          </Badge>
        </div>
      )}
      <Card className={`shadow-2xl overflow-hidden relative flex flex-col ${popular ? 'border-2 border-orange-400' : 'border border-border'} ${disabled ? 'opacity-60' : ''}`}>
        {badge && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className={`font-bold text-xs ${badgeColor}`}>{badge}</Badge>
          </div>
        )}
        <div className={`p-6 text-center text-white ${headerColor}`}>
          {icon}
          <h2 className="text-xl font-bold mb-1 mt-2">{name}</h2>
          {isFree
            ? <p className="text-3xl font-extrabold mt-1">Grátis</p>
            : <p className="text-3xl font-extrabold mt-1">R$ {price}<span className="text-sm font-normal opacity-90">/mês</span></p>
          }
          {trialLabel && (
            <p className="text-xs mt-1 flex items-center justify-center gap-1" style={{ color: 'rgba(255,255,255,0.95)' }}>
              <Calendar className="w-3 h-3" /> {trialLabel}
            </p>
          )}
          {vagasLabel && (
            <span className="inline-flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 text-xs font-semibold text-white mt-2">
              {vagasLabel}
            </span>
          )}
        </div>

        <CardContent className="p-5 flex flex-col flex-1">
          <ul className="space-y-2 mb-5">
            {benefits.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#5DCAA5' }} />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-auto space-y-2">
            {!disabled ? (
              <>
                <Button
                  className={`w-full text-sm ${popular ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}
                  onClick={onCta}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {ctaLabel}
                </Button>

                {onCtaAvulso && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full text-xs text-white border-none hover:opacity-90"
                      style={{ background: '#0d9488' }}
                      onClick={onCtaAvulso}
                      disabled={loadingAvulso}
                    >
                      {loadingAvulso ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                      {ctaAvulsoLabel}
                    </Button>
                    <p className="text-center text-xs font-medium flex items-center justify-center gap-1" style={{ color: '#9FE1CB' }}>
                      🏖 Ideal para alta temporada
                    </p>
                  </>
                )}

                {trialLabel && !isFree && (
                  <div className="flex items-center gap-2 mt-3 p-2 rounded-lg text-xs text-muted-foreground"
                    style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <Lock className="w-3 h-3 shrink-0" style={{ color: '#5DCAA5' }} />
                    Cartão salvo no cadastro — sem cobrança no período grátis.
                  </div>
                )}

                {ctaNote && <p className="text-xs text-center text-muted-foreground">{ctaNote}</p>}
              </>
            ) : (
              <p className="text-sm text-center py-2 text-muted-foreground">Vagas esgotadas.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Boost Alta Temporada ─────────────────────────────────────────────────────
function BoostCard({ onCta, loading }) {
  return (
    <div className="mt-10 rounded-2xl overflow-hidden border-2 border-amber-500"
      style={{ background: 'linear-gradient(135deg, #78350f 0%, #92400e 50%, #b45309 100%)' }}>
      <div className="p-6 md:p-8 text-white flex flex-col md:flex-row items-start gap-6">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <Sun className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <Badge className="bg-white/20 text-white border-none mb-2 text-xs">Complemento opcional</Badge>
          <h3 className="text-xl font-extrabold mb-2">Boost Alta Temporada</h3>
          <p className="text-white/80 text-sm leading-relaxed mb-5">
            De <strong>dezembro a março e em julho</strong>, Trancoso recebe um fluxo de clientes muito acima da média.
            O Boost garante posição máxima em todas as listagens durante a temporada, com banner exclusivo no topo do feed — perfeito para pousadas, restaurantes e lojas que querem saturar a temporada.
            Disponível apenas para assinantes de qualquer plano pago.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div>
              <span className="text-3xl font-extrabold">R$ 297,00</span>
              <span className="text-white/70 text-sm ml-1">/temporada</span>
            </div>
            <Button
              className="bg-white text-amber-800 hover:bg-amber-50 font-bold rounded-pill shadow"
              onClick={onCta}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Ativar Boost
            </Button>
          </div>
          <p className="text-white/50 text-xs mt-3">
            Requer plano Vitrine, Destaque ou Premium ativo. Não disponível avulso.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Dados dos planos ─────────────────────────────────────────────────────────

const PRESTADOR_GRATUITO = [
  "1 serviço ativo na plataforma",
  "Receba pedidos de orçamento",
  "Chat com clientes",
  "Perfil público básico",
  "Sem destaque na busca",
];

const PRESTADOR_PRO = [
  "Até 10 serviços ativos",
  "Destaque na busca de clientes",
  "Agenda integrada de atendimentos",
  "WhatsApp e chat direto",
  "Selo \"Prestador Verificado\"",
  "Painel completo de pedidos",
  "Suporte prioritário",
];

const PRESTADOR_ELITE = [
  "Serviços ilimitados",
  "Prioridade máxima na busca",
  "Toca TrIA — IA para mensagens e orçamentos",
  "Toca Vision — gerador de imagens exclusivas",
  "Dashboard financeiro avançado",
  "Relatórios mensais de desempenho",
  "Suporte VIP com gerente dedicado",
];

const LOJISTA_VITRINE = [
  "1 anúncio ativo na plataforma",
  "Badge \"Parceiro Local\"",
  "Métricas de impressões e cliques",
  "CTA personalizado (link para seu site ou WhatsApp)",
  "Alcance: todos os visitantes da plataforma",
];

const LOJISTA_DESTAQUE = [
  "3 anúncios ativos simultâneos",
  "Posição privilegiada no feed",
  "Imagem em destaque no topo de cada anúncio",
  "Relatórios semanais de performance",
  "CTA personalizado por anúncio",
  "Badge \"Parceiro Verificado\"",
  "Suporte prioritário",
];

const LOJISTA_PREMIUM = [
  "Anúncios ilimitados",
  "Posição prioritária em todas as listagens",
  "Toca TrIA — IA para criar copy dos anúncios",
  "Toca Vision — imagens exclusivas para cada anúncio",
  "Relatórios mensais completos com insights",
  "Gerente de conta dedicado",
  "Integração com Instagram e WhatsApp Business",
];

const FAQ_PRESTADOR = [
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim. Nos planos mensais você cancela quando quiser, sem multa. No uso avulso não há renovação automática.",
  },
  {
    q: "Como funciona o período gratuito?",
    a: "Seu cartão é salvo no cadastro mas nenhuma cobrança é feita durante o período grátis. Você pode cancelar antes do fim sem pagar nada.",
  },
  {
    q: "Qual a diferença entre o Gratuito e o Profissional?",
    a: "No plano Gratuito você pode manter 1 serviço ativo e receber pedidos. No Profissional você tem até 10 serviços, destaque na busca, agenda integrada e o selo Verificado.",
  },
  {
    q: "O que é o Uso Avulso?",
    a: "Ideal para quem trabalha só na alta temporada. Você paga apenas os meses que precisar, sem mensalidade fixa e sem renovação automática.",
  },
];

const FAQ_LOJISTA = [
  {
    q: "O que é um anúncio na plataforma?",
    a: "Um card com foto, título, descrição e botão de ação (link para seu site, WhatsApp ou telefone) exibido para os visitantes da plataforma que buscam serviços em Trancoso.",
  },
  {
    q: "Posso trocar meu anúncio a qualquer momento?",
    a: "Sim. Você pode editar o conteúdo, pausar ou ativar seus anúncios a qualquer momento pelo painel de lojista.",
  },
  {
    q: "O que é o Boost Alta Temporada?",
    a: "Um complemento vendido por temporada (dez–mar e julho) que garante posição de destaque máximo para o seu negócio durante o pico de movimento em Trancoso. Disponível apenas para assinantes de qualquer plano pago.",
  },
  {
    q: "Posso ser Prestador e Lojista ao mesmo tempo?",
    a: "Por enquanto os planos são separados por tipo de conta. Se você presta serviços E tem um negócio físico, entre em contato para entendermos o melhor encaixe.",
  },
];

// ─── Página Principal ──────────────────────────────────────────────────────────
export default function PlanosPage() {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('prestador');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  useEffect(() => {
    if (user?.user_type === 'lojista') setActiveTab('lojista');
  }, [user?.user_type]);

  const { data: allProviders } = useQuery({
    queryKey: ['allProviders'],
    queryFn: () => base44.entities.ServiceProvider.list('-created_date', 500),
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

  // Contadores de vagas
  const totalPrestadores = allProviders?.filter(p =>
    p.tipo_pessoa === 'pf' ||
    (p.tipo_pessoa === 'mei' && !p.tem_ponto_fisico_em_trancoso) ||
    (p.tipo_pessoa === 'pj' && !p.tem_ponto_fisico_em_trancoso)
  ).length || 0;

  const totalVerificados = allProviders?.filter(p =>
    p.verificado === true || p.status === 'ativo'
  ).length || 0;

  const vagasPrestador = Math.max(0, PROMO_LIMIT - totalPrestadores);
  const isPromoAtivaPrestador = vagasPrestador > 0;

  const vagasBadgePrestador = vagasPrestador <= 10
    ? `⚠️ ${vagasPrestador} vagas restantes de 50`
    : `🔒 ${vagasPrestador} vagas restantes de 50`;

  // Checkout
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
        setTimeout(() => handleCheckout(plan.includes('lojista') ? 'lojista_destaque' : 'regular'), 1500);
        return;
      }
      if (res.data?.url) window.location.href = res.data.url;
    } catch {
      toast.error('Erro ao iniciar pagamento. Tente novamente.');
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleFreeSignup = () => {
    if (!user) {
      base44.auth.redirectToLogin(window.location.pathname);
    } else {
      toast.success('Você já está no plano gratuito! Explore a plataforma.');
    }
  };

  const faqItems = activeTab === 'lojista' ? FAQ_LOJISTA : FAQ_PRESTADOR;

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto max-w-5xl px-4">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
            Planos Trancoso Resolve
          </h1>
          <p className="text-muted-foreground text-base max-w-lg mx-auto">
            Sem comissão. Você negocia diretamente com o cliente e fica com 100% do valor.
          </p>
          {totalVerificados > 0 && (
            <p className="mt-3 text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Users className="w-4 h-4 text-orange-500" />
              Junte-se a <strong className="text-foreground">&nbsp;{totalVerificados}&nbsp;</strong> profissionais verificados em Trancoso
            </p>
          )}
        </div>

        {/* Toggle */}
        <TabToggle active={activeTab} onChange={setActiveTab} />

        {/* ── TAB PRESTADOR ───────────────────────────────────────────────── */}
        {activeTab === 'prestador' && (
          <>
            {isPromoAtivaPrestador && (
              <div className="mb-6 text-center">
                <span className="inline-block bg-orange-900/30 border border-orange-600 text-orange-200 text-sm font-semibold rounded-full px-4 py-1.5">
                  🎉 Restam <strong>{vagasPrestador}</strong> vagas com preço de lançamento — depois sobe para R$49,90
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {/* Gratuito */}
              <PlanCard
                headerColor="bg-gradient-to-br from-slate-600 to-slate-700"
                icon={<Check className="w-9 h-9 mx-auto opacity-90" />}
                name="Gratuito"
                isFree
                trialLabel="Para sempre grátis"
                benefits={PRESTADOR_GRATUITO}
                ctaLabel="Começar grátis"
                onCta={handleFreeSignup}
                loading={false}
              />

              {/* Profissional */}
              <PlanCard
                badge={isPromoAtivaPrestador ? "🚀 Lançamento" : null}
                badgeColor="bg-orange-400 text-orange-900"
                headerColor="bg-gradient-to-br from-orange-500 to-orange-600"
                icon={<Zap className="w-9 h-9 mx-auto opacity-90" />}
                name="Profissional"
                price={isPromoAtivaPrestador ? "29,90" : "49,90"}
                trialLabel={isPromoAtivaPrestador ? "30 dias grátis inclusos" : "7 dias grátis"}
                vagasLabel={isPromoAtivaPrestador ? vagasBadgePrestador : null}
                benefits={PRESTADOR_PRO}
                ctaLabel={isPromoAtivaPrestador ? "Garantir — R$ 29,90/mês" : "Assinar — R$ 49,90/mês"}
                ctaNote={isPromoAtivaPrestador ? "✅ 30 dias grátis · Oferta dos primeiros 50" : null}
                onCta={() => handleCheckout(isPromoAtivaPrestador ? 'lancamento' : 'regular')}
                onCtaAvulso={() => handleCheckout('avulso_prestador')}
                ctaAvulsoLabel="Usar por 1 mês — R$ 69,90"
                loading={loadingPlan === 'lancamento' || loadingPlan === 'regular'}
                loadingAvulso={loadingPlan === 'avulso_prestador'}
                popular
              />

              {/* Elite */}
              <PlanCard
                badge="Elite"
                badgeColor="bg-amber-500 text-white"
                headerColor="bg-gradient-to-br from-amber-700 to-amber-900"
                icon={<Crown className="w-9 h-9 mx-auto opacity-90" />}
                name="Elite"
                price="147,00"
                trialLabel="7 dias grátis"
                benefits={PRESTADOR_ELITE}
                ctaLabel="Assinar Elite — R$ 147/mês"
                onCta={() => handleCheckout('elite')}
                loading={loadingPlan === 'elite'}
              />
            </div>

            {/* Uso avulso */}
            <div className="border border-border rounded-2xl p-6 mb-8 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(13,148,136,0.15)' }}>
                <Calendar className="w-5 h-5" style={{ color: '#0d9488' }} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground mb-1">Trabalha só na temporada?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Pague apenas os meses de alta temporada (dezembro–março e julho). Sem renovação automática, sem compromisso.
                </p>
                <Button
                  className="text-white rounded-pill font-semibold"
                  style={{ background: '#0d9488' }}
                  onClick={() => handleCheckout('avulso_prestador')}
                  disabled={loadingPlan === 'avulso_prestador'}
                >
                  {loadingPlan === 'avulso_prestador' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Uso avulso — R$ 69,90 / mês único
                </Button>
              </div>
            </div>
          </>
        )}

        {/* ── TAB LOJISTA ─────────────────────────────────────────────────── */}
        {activeTab === 'lojista' && (
          <>
            <div className="mb-6 text-center">
              <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                Anuncie seu negócio para moradores, turistas e donos de imóvel que buscam serviços em Trancoso.
                Alcance real, métricas transparentes e 100% do resultado fica com você.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {/* Vitrine */}
              <PlanCard
                headerColor="bg-gradient-to-br from-olive-600 to-olive-800"
                icon={<Store className="w-9 h-9 mx-auto opacity-90" />}
                name="Vitrine"
                price="89,90"
                trialLabel="7 dias grátis"
                benefits={LOJISTA_VITRINE}
                ctaLabel="Assinar — R$ 89,90/mês"
                onCta={() => handleCheckout('lojista_vitrine')}
                loading={loadingPlan === 'lojista_vitrine'}
              />

              {/* Destaque */}
              <PlanCard
                headerColor="bg-gradient-to-br from-orange-500 to-orange-700"
                icon={<Megaphone className="w-9 h-9 mx-auto opacity-90" />}
                name="Destaque"
                price="197,00"
                trialLabel="7 dias grátis"
                benefits={LOJISTA_DESTAQUE}
                ctaLabel="Assinar — R$ 197/mês"
                onCta={() => handleCheckout('lojista_destaque')}
                loading={loadingPlan === 'lojista_destaque'}
                popular
              />

              {/* Premium */}
              <PlanCard
                badge="Premium"
                badgeColor="bg-amber-500 text-white"
                headerColor="bg-gradient-to-br from-amber-700 to-amber-900"
                icon={<Crown className="w-9 h-9 mx-auto opacity-90" />}
                name="Premium"
                price="397,00"
                trialLabel="7 dias grátis"
                benefits={LOJISTA_PREMIUM}
                ctaLabel="Assinar — R$ 397/mês"
                onCta={() => handleCheckout('lojista_premium')}
                loading={loadingPlan === 'lojista_premium'}
              />
            </div>

            {/* Boost Alta Temporada */}
            <BoostCard
              onCta={() => handleCheckout('boost_temporada')}
              loading={loadingPlan === 'boost_temporada'}
            />
          </>
        )}

        {/* Transparência */}
        <div className="bg-orange-900/20 border border-orange-700/50 rounded-lg p-4 text-sm text-orange-200 text-center mt-8 mb-8">
          <strong>Transparência total:</strong> Sem comissão sobre seus serviços ou vendas. Você negocia diretamente com o cliente e fica com 100% do valor.
        </div>

        {/* Recursos */}
        <section id="recursos" className="mb-10">
          <PositionamentoEstrategico />
        </section>

        <p className="text-center text-muted-foreground text-sm mb-8">
          Dúvidas? <a href="mailto:suporte@trancosoresolve.com.br" className="underline text-foreground"><strong>suporte@trancosoresolve.com.br</strong></a>
        </p>

        {/* Assinatura ativa */}
        {mySubscription && mySubscription.status === 'active' && (
          <div className="bg-card border border-border rounded-lg p-4 text-center mb-8">
            <p className="text-sm text-muted-foreground mb-1">
              Sua assinatura está ativa
              {mySubscription.next_billing_date && ` — próxima cobrança em ${new Date(mySubscription.next_billing_date + 'T00:00:00').toLocaleDateString('pt-BR')}`}.
            </p>
            <div className="flex justify-center mt-3">
              <CancelSubscriptionButton accessUntil={mySubscription.next_billing_date} />
            </div>
          </div>
        )}

        {/* FAQ */}
        <section className="max-w-2xl mx-auto mb-12">
          <h2 className="text-xl font-bold text-center text-foreground mb-6">Perguntas Frequentes</h2>
          <div className="space-y-3">
            {faqItems.map(({ q, a }) => (
              <FaqItem key={q} q={q} a={a} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
