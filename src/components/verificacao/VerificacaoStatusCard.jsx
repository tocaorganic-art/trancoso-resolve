import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { BadgeCheck, ShieldCheck, Clock, XCircle, AlertTriangle, ChevronRight } from "lucide-react";
import VerificarIdentidadeModal from "./VerificarIdentidadeModal";

const statusConfig = {
  "Em Análise": {
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    label: "Em Análise",
    description: "Seu documento está sendo analisado. Em breve você receberá uma resposta.",
  },
  "Verificado": {
    icon: BadgeCheck,
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    label: "Verificado",
    description: "Sua identidade foi verificada com sucesso! O selo já aparece no seu perfil.",
  },
  "Rejeitado": {
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
    label: "Rejeitado",
    description: "Seu documento foi rejeitado. Você pode enviar um novo.",
  },
  "Pendente": {
    icon: AlertTriangle,
    color: "text-orange-600",
    bg: "bg-orange-50 border-orange-200",
    label: "Pendente",
    description: "Encontramos uma divergência no documento. Aguarde análise manual ou envie um novo.",
  },
};

export default function VerificacaoStatusCard({ user }) {
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: verificacoes, isLoading } = useQuery({
    queryKey: ["minhaVerificacao", user?.email],
    queryFn: () => base44.entities.Verificacao.filter({ user_email: user.email }, "-submission_date", 1),
    enabled: !!user?.email,
  });

  const latest = verificacoes?.[0];
  const config = latest ? statusConfig[latest.status] : null;
  const canResubmit = !latest || latest.status === "Rejeitado";
  const StatusIcon = config?.icon;

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["minhaVerificacao"] });
    queryClient.invalidateQueries({ queryKey: ["myServiceProvider"] });
  };

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-500" />
          Verificação de Identidade
        </h3>

        {isLoading ? (
          <div className="h-16 rounded-xl bg-slate-100 animate-pulse" />
        ) : latest && config ? (
          <div className={`rounded-xl border p-4 ${config.bg}`}>
            <div className="flex items-start gap-3">
              <StatusIcon className={`w-5 h-5 mt-0.5 shrink-0 ${config.color}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${config.color}`}>{config.label}</p>
                <p className="text-xs text-slate-600 mt-0.5">{config.description}</p>
                {latest.admin_notes && latest.status !== "Verificado" && (
                  <p className="text-xs text-slate-500 mt-1.5 bg-white/60 rounded p-2 border border-white/80">
                    {latest.admin_notes}
                  </p>
                )}
              </div>
              {canResubmit && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setModalOpen(true)}
                  className="shrink-0 text-xs"
                >
                  Reenviar
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-700">Verificar minha identidade</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Envie um documento (CNH ou RG) para receber o selo azul de identidade verificada.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
              >
                <BadgeCheck className="w-4 h-4 mr-1.5" />
                Verificar
              </Button>
            </div>
          </div>
        )}
      </div>

      <VerificarIdentidadeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        user={user}
        onSuccess={handleSuccess}
      />
    </>
  );
}