import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check, Zap, Star, Calendar, Lock, Users,
  Building2, ChevronDown, ChevronUp, Loader2, Shield
} from "lucide-react";
import { toast } from "sonner";
import CancelSubscriptionButton from "@/components/dashboard/CancelSubscriptionButton";

// ─── Dados dos planos ────────────────────────────────────────────────────────

const PLANOS_PRESTADOR = [
  {
    id: "gratuito",
    nome: "Gratuito",
    preco: 0,
    precoAnual: null,
    trial: null,
    trialLabel: "30 dias grátis · sem cartão",
    destaque: false,
    cor: "from-neutral-700 to-neutral-600",
    borda: "border-border",
    icone: Shield,
    badge: null,
    features: [
      "Perfil na plataforma por 30 dias",
      "Recebimento de pedidos de clientes",
      "Chat direto com clientes",
      "1 serviço ativo",
    ],
    ctaLabel: "Começar grátis",
    ctaKey: null,
  },
  {
    id: "profissional",
    nome: "Prestador Lançamento",
    preco: 29.90,
    precoAnual: null,
    trial: 60,
    trialLabel: "60 dias grátis · vagas limitadas",
    destaque: true,
    cor: "from-orange-600 to-orange-500",
    borda: "border-orange-400",
    icone: Zap,
    badge: "Mais Popular",
    features: [
      "Tudo do Gratuito, sem limite de tempo",
      "Até 10 serviços ativos simultâneos",
      "Destaque nas buscas da região",
      "Agenda integrada de atendimentos",
      "Selo de prestador verificado",
      "Suporte por WhatsApp",
    ],
    ctaLabel: "Assinar — R$29,90/mês",
    ctaKey: "lancamento",
  },
  {
    id: "regular",
    nome: "Prestador Mensal",
    preco: 49.90,
    precoAnual: null,
    trial: 7,
    trialLabel: "7 dias grátis",
    destaque: false,
    cor: "from-amber-700 to-amber-600",
    borda: "border-amber-600",
    icone: Zap,
    badge: null,
    features: [
      "Perfil ativo sem limite de lançamento",
      "Até 10 serviços ativos simultâneos",
      "Destaque nas buscas da região",
      "Agenda integrada de atendimentos",
      "Selo de prestador verificado",
      "Suporte por WhatsApp",
    ],
    ctaLabel: "Assinar — R$49,90/mês",
    ctaKey: "regular",
  },
];

const PLANOS_LOJISTA = [
  {
    id: "empresa_lancamento",
    nome: "Empresa Lançamento",
    preco: 59.90,
    precoAnual: null,
    trial: 7,
    trialLabel: "7 dias grátis",
    destaque: false,
    cor: "from-olive-600 to-olive-500",
    borda: "border-border",
    icone: Building2,
    badge: null,
    features: [
      "Perfil completo do estabelecimento",
      "Catálogo / cardápio de até 30 itens",
      "Aparece nas buscas da região",
      "Botão WhatsApp integrado",
      "Selo de negócio verificado",
      "1 usuário gestor",
    ],
    ctaLabel: "Assinar — R$59,90/mês",
    ctaKey: "empresa_lancamento",
  },
  {
    id: "empresa_regular",
    nome: "Empresa Mensal",
    preco: 89.90,
    precoAnual: null,
    trial: 7,
    trialLabel: "7 dias grátis",
    destaque: true,
    cor: "from-orange-600 to-orange-500",
    borda: "border-orange-400",
    icone: Zap,
    badge: "Mais Popular",
    features: [
      "Tudo do Essencial",
      "Catálogo / cardápio ilimitado",
      "Destaque nas buscas locais",
      "Sistema de reservas / agendamento integrado",
      "Painel de analytics (acessos, cliques, contatos)",
      "Suporte por WhatsApp",
      "Até 3 usuários gestores",
    ],
    ctaLabel: "Assinar — R$89,90/mês",
    ctaKey: "empresa_regular",
  },
];

const FAQ_ITEMS = [
  {
    q: "Posso cancelar a qualquer momento?",
    r: "Sim. Em todos os planos você cancela quando quiser, sem multa. Seu acesso continua até o fim do período já pago.",
  },
  {
    q: "Como funciona o período gratuito?",
    r: "Seu cartão é salvo no cadastro, mas nenhuma cobrança é feita durante o período grátis. Você pode cancelar antes do fim sem pagar nada.",
  },
  {
    q: "Como funciona o plano de lançamento?",
    r: "As primeiras 50 assinaturas ativas do plano Prestador Lançamento recebem 60 dias grátis. Depois do limite, o plano Prestador Mensal continua disponível com 7 dias grátis.",
  },
  {
    q: "Existe comissão sobre os serviços prestados?",
    r: "Não. Você negocia diretamente com o cliente e fica com 100% do valor. Cobramos apenas a assinatura da plataforma.",
  },
];

// ─── Subcomponentes ──────────────────────────────────────────────────────────

function FaqItem({ q, r }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
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
          {r}
        </div>
      )}
    </div>
  );
}

function PlanCard({ plano, anual, onCta, loading }) {
  const preco = anual && plano.precoAnual
    ? (plano.precoAnual / 12).toFixed(2).replace(".", ",")
    : plano.preco === 0
      ? "0"
      : plano.preco.toFixed(2).replace(".", ",");

  const Icon = plano.icone;

  return (
    <div className={`relative flex flex-col ${plano.destaque ? "pt-5" : "pt-0"}`}>
      {plano.destaque && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
          <Badge className="bg-orange-500 text-white font-bold text-xs px-3 py-1 shadow-md">
            <Star className="w-3 h-3 mr-1" /> {plano.badge}
          </Badge>
        </div>
      )}

      <Card
        className={`flex flex-col flex-1 overflow-hidden shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 ${
          plano.destaque
            ? `border-2 ${plano.borda}`
            : `border ${plano.borda}`
        }`}
      >
        {/* Header */}
        <div className={`p-6 text-center text-white bg-gradient-to-br ${plano.cor}`}>
          <Icon className="w-9 h-9 mx-auto opacity-90" />
          <h2 className="text-xl font-extrabold mb-1 mt-2">{plano.nome}</h2>

          {plano.preco === 0 ? (
            <>
              <p className="text-3xl font-extrabold mt-1">Grátis</p>
              <p className="text-xs mt-1 text-white/90">por 30 dias · sem cartão de crédito</p>
            </>
          ) : (
            <>
              <p className="text-3xl font-extrabold mt-1">
                R${preco}
                <span className="text-sm font-normal opacity-90">/mês</span>
              </p>
              {anual && plano.precoAnual && (
                <p className="text-xs mt-0.5 text-white/80">
                  R${plano.precoAnual}/ano · 2 meses grátis
                </p>
              )}
              <p className="text-xs mt-1 flex items-center justify-center gap-1 text-white/95">
                <Calendar className="w-3 h-3" /> {plano.trialLabel}
              </p>
            </>
          )}
        </div>

        {/* Features */}
        <CardContent className="p-5 flex flex-col flex-1">
          <ul className="space-y-2 mb-5 flex-1">
            {plano.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 shrink-0 mt-0.5 text-green-500" />
                {f}
              </li>
            ))}
          </ul>

          <div className="space-y-2 mt-auto">
            {plano.preco === 0 ? (
              <Link to="/CadastroTipo">
                <Button variant="outline" className="w-full font-semibold">
                  {plano.ctaLabel}
                </Button>
              </Link>
            ) : (
              <>
                <Button
                  className={`w-full font-bold ${
                    plano.destaque
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : ""
                  }`}
                  onClick={() => onCta(plano.ctaKey, anual)}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {plano.ctaLabel}
                </Button>
                {plano.preco > 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 px-1">
                    <Lock className="w-3 h-3 text-green-500 shrink-0" />
                    Cartão salvo · sem cobrança no período grátis
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Página principal ────────────────────────────────────────────────────────

export default function PlanosPage() {
  const [aba, setAba] = useState("prestador");
  const [loadingPlan, setLoadingPlan] = useState(null);

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
  });

  const { data: mySubscription } = useQuery({
    queryKey: ["mySubscription", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const subs = await base44.entities.Subscription.filter({ user_email: user.email });
      return subs?.[0] || null;
    },
    enabled: !!user,
  });

  // Contagem de vagas Fundador (prestadores ativos)
  const { data: founderStats } = useQuery({
    queryKey: ["founderProgress"],
    queryFn: async () => {
      const response = await base44.functions.invoke("getFounderStats", {});
      return response.data;
    },
    staleTime: 60000,
  });

  const handleCheckout = async (planKey, isAnual = false) => {
    if (window.self !== window.top) {
      toast.error("O checkout só funciona no app publicado. Acesse trancosoresolve.com.br");
      return;
    }
    if (!user) {
      base44.auth.redirectToLogin(window.location.pathname);
      return;
    }
    setLoadingPlan(planKey);
    try {
      const res = await base44.functions.invoke("createSubscriptionCheckout", {
        plan: planKey,
        billing: isAnual ? "annual" : "monthly",
        user_email: user.email,
      });
      if (res.data?.error === "vagas_esgotadas") {
        toast.error(res.data.message);
        return;
      }
      if (res.data?.url) window.location.href = res.data.url;
    } catch {
      toast.error("Erro ao iniciar pagamento. Tente novamente.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const planos = aba === "prestador" ? PLANOS_PRESTADOR : PLANOS_LOJISTA;
  const founderRestam = founderStats?.remaining ?? null;

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto max-w-5xl px-4">

        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-3">
            Escolha seu plano
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto text-base">
            Sem comissão sobre serviços. Você negocia direto com o cliente e fica com 100% do valor.
          </p>
          {aba === "prestador" && founderRestam !== null && founderRestam > 0 && founderRestam <= 50 && (
            <div className="mt-3 inline-flex items-center gap-2 bg-orange-900/30 border border-orange-600 text-orange-200 text-sm font-semibold rounded-full px-4 py-1.5">
              <Shield className="w-4 h-4 text-orange-400" />
              {founderRestam === 50
                ? "Seja um dos 50 primeiros Prestadores Fundadores de Trancoso"
                : `Restam ${founderRestam} vagas de Prestador Fundador — R$29,90/mês`}
            </div>
          )}
        </div>

        {/* Toggle Prestador / Lojista */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex bg-muted p-1 rounded-full gap-1">
            <button
              onClick={() => setAba("prestador")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                aba === "prestador"
                  ? "bg-orange-500 text-white shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sou Prestador
            </button>
            <button
              onClick={() => setAba("lojista")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                aba === "lojista"
                  ? "bg-orange-500 text-white shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sou Lojista
            </button>
          </div>
        </div>

        {/* Cards de plano */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
          {planos.map(plano => (
            <PlanCard
              key={plano.id}
              plano={plano}
              anual={false}
              onCta={handleCheckout}
              loading={loadingPlan === plano.ctaKey}
            />
          ))}
        </div>

        {/* Nota de pagamento */}
        <p className="text-center text-muted-foreground text-xs mb-4">
          Pagamento seguro por cartão — cancele quando quiser, sem multa.
        </p>

        {/* Transparência */}
        <div className="bg-orange-900/20 border border-orange-700/50 rounded-xl p-4 text-sm text-orange-200 text-center mb-2">
          <strong>Transparência total:</strong> Sem comissão sobre seus serviços. Você negocia diretamente com o cliente e fica com 100% do valor.
        </div>

        {/* Prova social */}
        <div className="text-center mb-12">
          <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
            <Users className="w-5 h-5 text-orange-500" />
            Junte-se aos primeiros prestadores verificados de Trancoso, Caraíva e Arraial d'Ajuda
          </p>
        </div>

        {/* Assinatura ativa */}
        {mySubscription?.status === "active" && (
          <div className="bg-card border border-border rounded-xl p-4 text-center mb-8">
            <p className="text-sm text-muted-foreground mb-1">
              Sua assinatura está ativa
              {mySubscription.next_billing_date &&
                ` — próxima cobrança em ${new Date(
                  mySubscription.next_billing_date + "T00:00:00"
                ).toLocaleDateString("pt-BR")}`}.
            </p>
            <div className="flex justify-center mt-3">
              <CancelSubscriptionButton accessUntil={mySubscription.next_billing_date} />
            </div>
          </div>
        )}

        {/* FAQ */}
        <section className="max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl font-extrabold text-foreground text-center mb-6">
            Perguntas frequentes
          </h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map(item => (
              <FaqItem key={item.q} q={item.q} r={item.r} />
            ))}
          </div>
        </section>

        <p className="text-center text-muted-foreground text-sm pb-8">
          Dúvidas?{" "}
          <a href="mailto:suporte@trancosoresolve.com.br" className="underline text-foreground font-semibold">
            suporte@trancosoresolve.com.br
          </a>
        </p>
      </div>
    </div>
  );
}
