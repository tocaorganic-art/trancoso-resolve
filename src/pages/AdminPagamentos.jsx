import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, DollarSign, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StatusPagamentoBadge from '@/components/pagamento/StatusPagamentoBadge';

export default function AdminPagamentosPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: payments, isLoading } = useQuery({
    queryKey: ['allPayments'],
    queryFn: () => base44.asServiceRole
      ? base44.entities.Payment.list('-created_date', 200)
      : Promise.resolve([]),
    initialData: [],
    staleTime: 0,
  });

  const { data: providers } = useQuery({
    queryKey: ['allProviders'],
    queryFn: () => base44.entities.ServiceProvider.list(),
    initialData: [],
  });

  // Aguarda usuário carregar (undefined = ainda carregando)
  if (user === undefined) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  // Usuário não autenticado → redireciona para login
  if (user === null) {
    base44.auth.redirectToLogin(window.location.pathname);
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  // Usuário autenticado mas sem role admin
  if (user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 text-center px-4">
        <AlertTriangle className="w-16 h-16 text-red-400" />
        <h2 className="text-2xl font-bold text-slate-800">Acesso Restrito</h2>
        <p className="text-slate-500 max-w-sm">Esta página é exclusiva para administradores da plataforma.</p>
        <button onClick={() => base44.auth.redirectToLogin()} className="text-sm text-blue-600 underline">Entrar com outra conta</button>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  const filtered = payments.filter(p => {
    const matchSearch = !search ||
      p.client_email?.toLowerCase().includes(search.toLowerCase()) ||
      p.request_id?.includes(search) ||
      p.stripe_payment_intent_id?.includes(search);
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Métricas
  const totalCaptured = filtered.filter(p => p.status === 'captured').reduce((s, p) => s + (p.amount_total || 0), 0);
  const totalPlatform = filtered.filter(p => p.status === 'captured').reduce((s, p) => s + (p.amount_platform || 0), 0);
  const pendingCapture = filtered.filter(p => p.status === 'requires_capture').length;
  const disputed = filtered.filter(p => p.status === 'disputed').length;

  const providerMap = Object.fromEntries(providers.map(p => [p.id, p]));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard de Pagamentos</h1>
          <p className="text-slate-500 text-sm">Monitoramento de transações e split</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Cards de métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-xs text-slate-500">Volume Capturado</span>
              </div>
              <p className="text-xl font-bold text-slate-800">R$ {(totalCaptured / 100).toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-slate-500">Comissão Plataforma (20%)</span>
              </div>
              <p className="text-xl font-bold text-slate-800">R$ {(totalPlatform / 100).toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-slate-500">Em Custódia</span>
              </div>
              <p className="text-xl font-bold text-slate-800">{pendingCapture}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-xs text-slate-500">Em Disputa</span>
              </div>
              <p className="text-xl font-bold text-red-600">{disputed}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar por email, ID da solicitação..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="requires_payment_method">Aguardando Pagamento</SelectItem>
              <SelectItem value="requires_capture">Em Custódia</SelectItem>
              <SelectItem value="captured">Capturado</SelectItem>
              <SelectItem value="canceled">Cancelado</SelectItem>
              <SelectItem value="disputed">Em Disputa</SelectItem>
              <SelectItem value="refunded">Reembolsado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabela */}
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">Data</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">Cliente</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">Prestador</th>
                  <th className="text-right px-4 py-3 text-slate-600 font-medium">Total</th>
                  <th className="text-right px-4 py-3 text-slate-600 font-medium">Prestador (80%)</th>
                  <th className="text-right px-4 py-3 text-slate-600 font-medium">Plataforma (20%)</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">Nenhum pagamento encontrado</td>
                  </tr>
                ) : filtered.map(payment => {
                  const provider = providerMap[payment.provider_id];
                  return (
                    <tr key={payment.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-600">
                        {format(new Date(payment.created_date), 'dd/MM/yy HH:mm', { locale: ptBR })}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{payment.client_email}</td>
                      <td className="px-4 py-3 text-slate-700">{provider?.full_name || payment.provider_id}</td>
                      <td className="px-4 py-3 text-right font-medium">R$ {((payment.amount_total || 0) / 100).toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-green-700">R$ {((payment.amount_provider || 0) / 100).toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-blue-700">R$ {((payment.amount_platform || 0) / 100).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <StatusPagamentoBadge status={payment.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}