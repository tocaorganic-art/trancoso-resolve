import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const FASES = [
  { id: 1, nome: 'Debug inicial (6 bugs)', status: 'concluida', obs: 'PR #14-17 merged', prs: ['#14', '#15', '#16', '#17'] },
  { id: 2, nome: '20 páginas SEO', status: 'concluida', obs: '25 rotas em produção', prs: ['#15'] },
  { id: 3, nome: 'Docs operacionais', status: 'concluida', obs: '4 documentos gerados', prs: [] },
  { id: 4, nome: 'Fluxos TrIA', status: 'parcial', obs: 'UI ok, ativar automações', prs: [] },
  { id: 5, nome: 'Performance & Analytics', status: 'parcial', obs: '0/15 checks no deploy dashboard', prs: ['#18'] },
  { id: 6, nome: 'Bug fix pós-auditoria', status: 'parcial', obs: '2 itens manuais pendentes', prs: ['#20'] },
  { id: 7, nome: 'Checklist in-app + Automações', status: 'em_andamento', obs: 'Esta fase', prs: [] },
];

const BUGS_MANUAIS = [
  {
    id: 1,
    titulo: '🔴 CPF do admin exposto',
    descricao: 'Local: /AdminAntecedentes → registro "antonio monteiro"',
    acao: 'Limpar campo de nota interna manualmente no Base44',
    responsavel: 'Tony',
    urgencia: 'HOJE',
  },
  {
    id: 2,
    titulo: '🔴 Receita R$50.100 placeholder no Dashboard',
    descricao: 'Local: /Dashboard → "Receita Total"',
    acao: 'Localizar e remover dado seed no banco Base44',
    responsavel: 'Tony',
    urgencia: 'HOJE',
  },
];

const CHECKLIST_ITENS = {
  tecnico: [
    { id: 'tria-chat', label: 'TrIA responde no chat', categoria: 'Técnico' },
    { id: 'dados-teste', label: 'Dados de teste removidos', categoria: 'Técnico' },
    { id: 'aviso-ilustrativo', label: 'Aviso "Perfil ilustrativo" removido', categoria: 'Técnico' },
    { id: 'fila-nomes', label: 'FilaVerificacao exibindo nomes corretos', categoria: 'Técnico' },
    { id: 'metricas-servicos', label: 'Métricas exibindo nomes de serviço', categoria: 'Técnico' },
    { id: 'pr20', label: 'PR #20 merged (datas)', categoria: 'Técnico' },
    { id: 'cpf-removido', label: 'CPF removido (manual)', categoria: 'Técnico' },
    { id: 'receita-corrigida', label: 'Receita corrigida (manual)', categoria: 'Técnico' },
    { id: 'deploy-dashboard', label: 'Deploy Dashboard: ≥ 10/15 checks', categoria: 'Técnico' },
    { id: 'lighthouse', label: 'Lighthouse score ≥ 80', categoria: 'Técnico' },
  ],
  seo: [
    { id: 'rotas-criadas', label: '25 rotas criadas', categoria: 'SEO' },
    { id: 'sitemap', label: 'sitemap.xml em produção', categoria: 'SEO' },
    { id: 'robots', label: 'robots.txt configurado', categoria: 'SEO' },
    { id: 'meta-tags', label: 'Meta tags configuradas', categoria: 'SEO' },
    { id: 'gsc', label: 'Google Search Console: sitemap submetido', categoria: 'SEO' },
    { id: 'depoimentos', label: '20 depoimentos reais publicados', categoria: 'SEO' },
    { id: 'gmb', label: 'GMB configurado (4 destinos)', categoria: 'SEO' },
  ],
  automacoes: [
    { id: 'fluxo1', label: 'Fluxo 1 (Descoberta) ativo', categoria: 'Automações TrIA' },
    { id: 'fluxo2', label: 'Fluxo 2 (Matching) ativo', categoria: 'Automações TrIA' },
    { id: 'fluxo3', label: 'Fluxo 3 (Notificação) ativo', categoria: 'Automações TrIA' },
    { id: 'fluxo4', label: 'Fluxo 4 (Pós-serviço) ativo', categoria: 'Automações TrIA' },
  ],
  tracao: [
    { id: 'leads', label: 'Primeiros 5 leads capturados', categoria: 'Tração' },
    { id: 'resposta', label: 'Taxa resposta prestador > 70%', categoria: 'Tração' },
    { id: 'depoimentos-reais', label: 'Primeiros 5 depoimentos reais', categoria: 'Tração' },
  ],
};

const PROXIMOS_PASSOS = [
  { urgencia: 'URGENTE (hoje)', itens: [
    '1. Limpar CPF do admin (manual)',
    '2. Corrigir receita placeholder (manual)',
    '3. Ativar Fluxo TrIA 1 (Descoberta)',
  ] },
  { urgencia: 'ESTA SEMANA', itens: [
    '4. Submeter sitemap ao Google Search Console',
    '5. Ativar Fluxo TrIA 2 (Matching)',
    '6. Ativar Fluxo TrIA 3 (Notificação)',
    '7. Rodar Lighthouse e validar score ≥ 80',
  ] },
  { urgencia: 'SEMANA 2', itens: [
    '8. 20 depoimentos reais publicados',
    '9. GMB configurado para 4 destinos',
    '10. Primeiros 5 leads via formulário',
  ] },
];

const STATUS_STYLES = {
  concluida: { bg: 'bg-green-50', border: 'border-green-200', icon: '✅', cor: 'text-green-600' },
  parcial: { bg: 'bg-yellow-50', border: 'border-yellow-200', icon: '⚠️', cor: 'text-yellow-600' },
  em_andamento: { bg: 'bg-blue-50', border: 'border-blue-200', icon: '🔄', cor: 'text-blue-600' },
  pendente: { bg: 'bg-gray-50', border: 'border-gray-200', icon: '⏳', cor: 'text-gray-600' },
};

export default function AdminProgressoProjeto() {
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem('tr-checklist-fase7');
    return saved ? JSON.parse(saved) : {};
  });
  const [expandedFase, setExpandedFase] = useState(null);

  const toggleItem = (key) => {
    const novo = { ...checklist, [key]: !checklist[key] };
    setChecklist(novo);
    localStorage.setItem('tr-checklist-fase7', JSON.stringify(novo));
  };

  // Calcular progresso total
  const todosFases = FASES.length;
  const fasesConcluidas = FASES.filter(f => f.status === 'concluida').length;
  const percFases = Math.round((fasesConcluidas / todosFases) * 100);

  const todosChecklistItems = Object.values(CHECKLIST_ITENS).flat().length;
  const checklistConcluidos = Object.values(checklist).filter(Boolean).length;
  const percChecklist = todosChecklistItems > 0 ? Math.round((checklistConcluidos / todosChecklistItems) * 100) : 0;

  const percGeral = Math.round((percFases * 0.4 + percChecklist * 0.6));

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Painel de Progresso</h1>
        <p className="text-lg text-slate-600 mb-6">Trancoso Resolve — Plano de ação de otimização</p>

        <div className="flex items-center gap-6 mb-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700">Progresso Geral</span>
              <span className="text-2xl font-bold text-slate-900">{percGeral}%</span>
            </div>
            <Progress value={percGeral} className="h-3" />
          </div>
          <div className={`px-4 py-2 rounded-lg font-bold text-white ${percGeral === 100 ? 'bg-green-500' : 'bg-amber-500'}`}>
            {percGeral === 100 ? '🚀 PRONTO!' : `${percGeral}% Concluído`}
          </div>
        </div>
      </div>

      {/* Seção 1: Status por Fase */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Status por Fase ({fasesConcluidas}/{todosFases})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {FASES.map((fase) => {
            const style = STATUS_STYLES[fase.status];
            return (
              <div key={fase.id} className={`p-4 rounded-lg border-2 ${style.bg} ${style.border} cursor-pointer transition-all hover:shadow-md`}
                onClick={() => setExpandedFase(expandedFase === fase.id ? null : fase.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-2xl">{style.icon}</span>
                      <div>
                        <p className="font-bold text-slate-900">Fase {fase.id} — {fase.nome}</p>
                        {fase.obs && <p className="text-sm text-slate-600">{fase.obs}</p>}
                      </div>
                    </div>
                  </div>
                  {expandedFase === fase.id ? <ChevronUp /> : <ChevronDown />}
                </div>

                {expandedFase === fase.id && fase.prs.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-300/50">
                    <p className="text-xs font-semibold text-slate-600 mb-2">PRs:</p>
                    <div className="flex gap-2 flex-wrap">
                      {fase.prs.map(pr => <span key={pr} className="px-2 py-1 bg-slate-200 text-xs rounded">{pr}</span>)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Seção 2: Bugs Pendentes (manuais) */}
      <Card className="mb-8 border-red-300 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">🔴 Ação Manual Necessária (Hoje)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {BUGS_MANUAIS.map((bug) => (
            <div key={bug.id} className="p-4 bg-white rounded-lg border-2 border-red-200">
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">{bug.titulo}</p>
                  <p className="text-sm text-slate-600">{bug.descricao}</p>
                </div>
              </div>
              <div className="ml-8 space-y-2 text-sm">
                <p><strong>Ação:</strong> {bug.acao}</p>
                <p><strong>Responsável:</strong> {bug.responsavel} · <span className="font-bold text-red-600">{bug.urgencia}</span></p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Seção 3: Checklist Interativo */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Checklist de Lançamento ({checklistConcluidos}/{todosChecklistItems})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            { titulo: 'Técnico (Código)', itens: CHECKLIST_ITENS.tecnico },
            { titulo: 'SEO & Conteúdo', itens: CHECKLIST_ITENS.seo },
            { titulo: 'Automações TrIA', itens: CHECKLIST_ITENS.automacoes },
            { titulo: 'Tração', itens: CHECKLIST_ITENS.tracao },
          ].map(({ titulo, itens }) => (
            <div key={titulo}>
              <h3 className="font-bold text-slate-900 mb-3">{titulo}</h3>
              <div className="space-y-2 ml-4">
                {itens.map(item => (
                  <label key={item.id} className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={checklist[item.id] || false}
                      onChange={() => toggleItem(item.id)}
                      className="w-5 h-5 rounded cursor-pointer"
                    />
                    <span className={checklist[item.id] ? 'line-through text-slate-500' : 'text-slate-700'}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Seção 4: Próximos Passos */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Passos Prioritários</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {PROXIMOS_PASSOS.map(({ urgencia, itens }) => (
            <div key={urgencia}>
              <h3 className="font-bold text-slate-900 mb-3">{urgencia}</h3>
              <ul className="space-y-2 ml-4">
                {itens.map((item, idx) => (
                  <li key={idx} className="text-slate-700 flex items-start gap-3">
                    <span className="text-slate-400 flex-shrink-0">{item.split('.')[0]}.</span>
                    <span>{item.substring(item.indexOf('.') + 2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
