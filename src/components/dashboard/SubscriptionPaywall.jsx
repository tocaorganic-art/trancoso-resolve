import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { LockKeyhole, CreditCard, Zap } from "lucide-react";

export default function SubscriptionPaywall({ subscriptionStatus }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <LockKeyhole className="w-8 h-8 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          Painel Bloqueado
        </h1>

        <p className="text-slate-600 mb-4 leading-relaxed">
          Para usar seu painel, receber pedidos e ser encontrado pelos clientes no Trancoso Resolve, você precisa ter uma assinatura ativa.
        </p>

        {subscriptionStatus && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-6 inline-block">
            <p className="text-sm text-amber-800 font-medium">
              Status atual:{" "}
              <span className="font-bold">
                {subscriptionStatus === "expired"
                  ? "Trial expirado"
                  : subscriptionStatus === "cancelled"
                  ? "Assinatura cancelada"
                  : "Sem assinatura ativa"}
              </span>
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link to={createPageUrl("Planos")} className="block">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 font-bold h-12 text-base">
              <CreditCard className="w-5 h-5 mr-2" />
              Ativar assinatura
            </Button>
          </Link>

          <div className="bg-blue-50 rounded-lg p-3 text-left">
            <p className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1">
              <Zap className="w-3 h-3" /> O que você terá ao assinar:
            </p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>✓ Perfil visível para turistas e moradores</li>
              <li>✓ Receba pedidos de agendamento</li>
              <li>✓ Clientes podem chamar via WhatsApp</li>
              <li>✓ Agenda, financeiro e painel completo</li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-5">
          Dúvidas? contato@tocaexperience.com.br
        </p>
      </div>
    </div>
  );
}