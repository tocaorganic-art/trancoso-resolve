import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, TrendingUp, Calendar, Scissors, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { callClaude } from '@/functions/callClaude';
import { toast } from "sonner";
import { Card, CardContent } from '@/components/ui/card';

const jsonSchema = {
    type: "object",
    properties: {
        receitaProjetada: { type: "number", description: "Projeção de receita para o próximo mês." },
        crescimentoProjetado: { type: "number", description: "Porcentagem de crescimento projetado em relação ao mês atual." },
        melhorDia: { type: "string", description: "O dia da semana com maior faturamento médio." },
        receitaMelhorDia: { type: "number", description: "O valor médio faturado nesse dia." },
        servicoMaisLucrativo: { type: "string", description: "A categoria de serviço que gerou mais receita." },
        margemLucro: { type: "number", description: "Simulação de margem de lucro sobre a categoria mais lucrativa." },
        recomendacoes: { type: "array", items: { type: "string" }, description: "Lista com 3 recomendações acionáveis." }
    },
    required: ["receitaProjetada", "crescimentoProjetado", "melhorDia", "receitaMelhorDia", "servicoMaisLucrativo", "margemLucro", "recomendacoes"]
};

export default function AssistenteFinanceiro({ transacoes }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quickInsight, setQuickInsight] = useState(null);

  // Gera insight rápido ao carregar
  React.useEffect(() => {
    if (transacoes && transacoes.length > 0) {
      const now = new Date();
      const currentMonth = now.getMonth();
      const lastMonth = now.getMonth() - 1;

      const currentMonthExpenses = transacoes
        .filter(t => t.type === 'Despesa' && new Date(t.date).getMonth() === currentMonth)
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      const lastMonthExpenses = transacoes
        .filter(t => t.type === 'Despesa' && new Date(t.date).getMonth() === lastMonth)
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      if (lastMonthExpenses > 0) {
        const variation = ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
        if (Math.abs(variation) > 10) {
          setQuickInsight({
            text: variation > 0 
              ? `⚠️ Suas despesas aumentaram ${variation.toFixed(0)}% este mês`
              : `✅ Suas despesas diminuíram ${Math.abs(variation).toFixed(0)}% este mês`,
            type: variation > 0 ? 'warning' : 'success'
          });
        }
      }
    }
  }, [transacoes]);

  const analisarFinancas = async () => {
    if (!transacoes || transacoes.length === 0) {
      toast.info("Não há transações suficientes para análise.");
      return;
    }

    setLoading(true);
    setInsights(null);

    const prompt = `
      Analise os seguintes dados de transações de um prestador de serviços em Trancoso e forneça insights.

      Dados das Transações (JSON):
      ${JSON.stringify(transacoes.slice(0, 50), null, 2)}

      Com base nesses dados, calcule e retorne as seguintes informações em um objeto JSON:
      - receitaProjetada: Uma projeção de receita para o próximo mês.
      - crescimentoProjetado: A porcentagem de crescimento projetado em relação ao mês atual.
      - melhorDia: O dia da semana com maior faturamento médio.
      - receitaMelhorDia: O valor médio faturado nesse dia.
      - servicoMaisLucrativo: A categoria de serviço que gerou mais receita.
      - margemLucro: Simule uma margem de lucro de 60% sobre a categoria mais lucrativa.
      - recomendacoes: Uma lista (array) com 3 recomendações acionáveis.
    `;

    try {
       const response = await callClaude({
         messages: [{ role: 'user', content: prompt }],
         response_json_schema: jsonSchema,
         systemPrompt: 'Você é um assistente financeiro especializado em análise de dados. Retorne insights acionáveis em português do Brasil.'
       });

       setInsights(response.data);
       toast.success("Análise financeira concluída!");

    } catch (error) {
       console.error('Erro ao analisar finanças:', error);
       toast.error("Ocorreu um erro ao gerar a análise.", { description: error.message || "Tente novamente mais tarde." });
    } finally {
       setLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 rounded-lg shadow-md p-5 my-6 border border-slate-700">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5 text-blue-400"/>
            Assistente Financeiro
          </h3>
          {quickInsight && (
            <p className={`text-sm mt-2 ${quickInsight.type === 'warning' ? 'text-red-400' : 'text-green-400'}`}>
              {quickInsight.text}
            </p>
          )}
        </div>
        <Button
          onClick={analisarFinancas}
          disabled={loading || !transacoes?.length}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analisando...</>
          ) : (
            'Analisar Finanças com IA'
          )}
        </Button>
      </div>
      
      {loading && (
          <div className="text-center py-8">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-500" />
              <p className="mt-2 text-slate-500">Aguarde, nossa IA está processando seus dados...</p>
          </div>
      )}

      {insights && (
        <div className="animate-in fade-in-50 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card className="bg-blue-50 p-4 border-blue-200">
              <CardContent>
                  <h4 className="text-sm font-medium text-blue-800 mb-1 flex items-center gap-1.5"><TrendingUp className="w-4 h-4"/>Receita Projetada</h4>
                  <p className="text-2xl font-bold text-blue-900">R$ {insights.receitaProjetada?.toLocaleString('pt-BR')}</p>
                  <p className={`text-xs font-semibold mt-1 ${insights.crescimentoProjetado > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {insights.crescimentoProjetado > 0 ? '+' : ''}{insights.crescimentoProjetado?.toFixed(1)}% vs. mês anterior
                  </p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 p-4 border-green-200">
              <CardContent>
                  <h4 className="text-sm font-medium text-green-800 mb-1 flex items-center gap-1.5"><Calendar className="w-4 h-4"/>Melhor Dia</h4>
                  <p className="text-xl font-bold text-green-900">{insights.melhorDia}</p>
                  <p className="text-xs text-green-700 mt-1">
                    R$ {insights.receitaMelhorDia?.toLocaleString('pt-BR')} em média
                  </p>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 p-4 border-purple-200">
               <CardContent>
                  <h4 className="text-sm font-medium text-purple-800 mb-1 flex items-center gap-1.5"><Scissors className="w-4 h-4"/>Serviço Mais Rentável</h4>
                  <p className="text-xl font-bold text-purple-900">{insights.servicoMaisLucrativo}</p>
                  <p className="text-xs text-purple-700 mt-1">
                    {insights.margemLucro?.toFixed(0)}% de margem estimada
                  </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium text-slate-800 mb-3">Recomendações para Aumentar sua Receita:</h4>
            <ul className="list-disc pl-5 space-y-2">
              {insights.recomendacoes.map((rec, index) => (
                <li key={index} className="text-slate-700">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Card>
  );
};