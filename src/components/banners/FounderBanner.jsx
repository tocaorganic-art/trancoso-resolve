import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Rocket, X } from "lucide-react";

const FOUNDER_LIMIT = 100;

export default function FounderBanner({ user, subscription }) {
  const [dismissed, setDismissed] = useState(() =>
    localStorage.getItem('founder_banner_dismissed') === 'true'
  );

  const { data: allProviders } = useQuery({
    queryKey: ['allProviders'],
    queryFn: () => base44.entities.ServiceProvider.list('-created_date', 500),
    initialData: [],
    staleTime: 5 * 60 * 1000,
  });

  const { data: recentProviders } = useQuery({
    queryKey: ['recentProviders'],
    queryFn: () => base44.entities.ServiceProvider.list('-created_date', 3),
    initialData: [],
    staleTime: 2 * 60 * 1000,
  });

  const totalVerificados = allProviders?.filter(p =>
    p.verificado === true || p.status === 'ativo'
  ).length || 0;

  const slotsRemaining = Math.max(0, FOUNDER_LIMIT - totalVerificados);
  const progressPct = Math.min(100, (totalVerificados / FOUNDER_LIMIT) * 100);

  const hasActivePlan = subscription && ['active', 'trial'].includes(subscription.status);
  const isLojista = user?.user_type === 'lojista';

  // Não exibir para lojistas, usuários com plano ativo, sem login, sem vagas ou se dispensado
  if (dismissed || hasActivePlan || !user || slotsRemaining === 0 || isLojista) return null;

  const handleDismiss = () => {
    localStorage.setItem('founder_banner_dismissed', 'true');
    setDismissed(true);
  };

  const recentName = recentProviders?.[0]?.full_name;

  return (
    <div className="relative rounded-2xl overflow-hidden border-2 border-orange-500 mb-6"
      style={{ background: 'linear-gradient(135deg, rgba(124,45,18,0.4) 0%, rgba(154,52,18,0.25) 100%)' }}>
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors z-10"
        aria-label="Fechar banner"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="p-5 md:p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(234,88,12,0.2)' }}>
            <Rocket className="w-5 h-5 text-orange-400" />
          </div>
          <div className="flex-1 min-w-0 pr-6">
            <p className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-1">
              Oferta de Fundador
            </p>
            <h3 className="text-lg font-extrabold text-foreground leading-tight mb-1">
              🔥 Restam <span className="text-orange-400">{slotsRemaining}</span> vagas de Prestador Fundador em Trancoso
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Os primeiros <strong className="text-foreground">{FOUNDER_LIMIT}</strong> prestadores verificados ganham o{" "}
              <strong className="text-orange-300">Selo Fundador</strong> para sempre — e o preço de lançamento de{" "}
              <strong className="text-orange-400">R$29,90/mês</strong> com 30 dias grátis não vai voltar assim.
            </p>

            {/* Barra de progresso */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>{totalVerificados} de {FOUNDER_LIMIT} vagas preenchidas</span>
                <span className="text-orange-400 font-semibold">{slotsRemaining} restantes</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${progressPct}%`,
                    background: 'linear-gradient(90deg, #f97316, #ea580c)',
                  }}
                />
              </div>
            </div>

            {/* Prova social dinâmica */}
            {recentName && (
              <p className="text-xs text-muted-foreground mb-4">
                <span className="text-emerald-400 font-semibold">{recentName.split(' ')[0]}</span>
                {' '}acaba de se cadastrar na plataforma
              </p>
            )}

            <Link to={`${createPageUrl('Planos')}#profissional`}>
              <Button className="bg-brand-primary hover:bg-orange-700 text-white rounded-pill font-bold shadow-brand">
                Garantir meu Selo Fundador →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
