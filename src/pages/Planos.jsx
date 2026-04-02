import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Percent } from "lucide-react";

const beneficios = [
  "Acesso completo à plataforma",
  "Perfil verificado e listagem ativa",
  "Agenda e gestão de solicitações",
  "Suporte por e-mail",
  "Estatísticas de desempenho",
  "Sem mensalidade fixa",
];

export default function PlanosPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Simples e Transparente
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Sem mensalidade. Sem surpresas. Você só paga quando realiza um serviço.
          </p>
        </div>

        <Card className="shadow-2xl border-2 border-blue-500 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-10 text-center text-white">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-4">
              <Percent className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-5xl font-extrabold mb-1">20%</h2>
            <p className="text-xl text-blue-100">de comissão por serviço realizado</p>
          </div>

          <CardContent className="p-8">
            <p className="text-slate-600 text-center mb-8">
              Cadastre-se gratuitamente e comece a receber clientes agora. A plataforma retém 20% do valor do serviço somente após a conclusão.
            </p>

            <ul className="space-y-4 mb-8">
              {beneficios.map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-700">
                  <Check className="w-5 h-5 text-green-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 text-center">
              <strong>Exemplo:</strong> Serviço de R$200 → você recebe R$160 e a plataforma retém R$40.
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-slate-500 text-sm mt-8">
          Dúvidas? Entre em contato com nossa equipe pelo e-mail <strong>contato@trancosoresolve.com.br</strong>
        </p>
      </div>
    </div>
  );
}