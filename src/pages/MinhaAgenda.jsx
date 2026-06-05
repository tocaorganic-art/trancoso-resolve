import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, AlertCircle, Inbox, CheckCircle, Clock, XCircle, AlertTriangle, Settings2, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RequestDetailsModal from "@/components/agenda/RequestDetailsModal";
import DisponibilidadeEditor from "@/components/agenda/DisponibilidadeEditor";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import PermissionChecker from "../components/auth/PermissionChecker";
import { motion } from "framer-motion";

const RequestCard = ({ request, service, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(16px)',
        borderRadius: 16,
        padding: 20,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
        marginBottom: 12
      }}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="hidden sm:flex flex-col items-center justify-center rounded-xl p-3 w-16 shrink-0" style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.08))',
              border: '1px solid rgba(251, 191, 36, 0.2)'
            }}>
              <span className="text-xs font-bold text-amber-300 uppercase">{format(new Date(request.date), 'MMM', { locale: ptBR })}</span>
              <span className="text-2xl font-extrabold text-white">{format(new Date(request.date), 'dd')}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-base truncate">{service?.title || 'Serviço não encontrado'}</h3>
              <p className="text-sm text-slate-400 mt-0.5">Cliente: <span className="text-slate-300 font-medium">{request.client_name}</span></p>
              <p className="text-xs text-slate-500 sm:hidden mt-1">{format(new Date(request.date), "dd/MM/yyyy")}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              R$ {service?.price?.toFixed(2) || '0.00'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">por serviço</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

function MinhaAgendaContent() {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: myProvider, isLoading: isProviderLoading } = useQuery({
    queryKey: ['myProviderProfile', user?.email],
    queryFn: async () => {
      const results = await base44.entities.ServiceProvider.filter({ created_by: user.email });
      return results[0] || null;
    },
    enabled: !!user?.email,
  });

  const providerId = myProvider?.id;

  const { data: serviceRequests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['serviceRequests', providerId],
    queryFn: () => base44.entities.ServiceRequest.filter({ provider_id: providerId }, '-created_date'),
    enabled: !!providerId,
    refetchInterval: 5000, // Refresh a cada 5 segundos para atualizações em tempo real
  });

  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ['allProviderServices', providerId],
    queryFn: async () => {
      const providerServices = await base44.entities.ServiceListing.filter({ provider_id: providerId });
      const serviceMap = {};
      providerServices.forEach(s => {
        serviceMap[s.id] = s;
      });
      return serviceMap;
    },
    enabled: !!providerId,
  });

  const updateRequestMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ServiceRequest.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['serviceRequests', user?.id] });
      const previous = queryClient.getQueryData(['serviceRequests', user?.id]);
      queryClient.setQueryData(['serviceRequests', user?.id], (old) =>
        (old || []).map((r) => r.id === id ? { ...r, ...data } : r)
      );
      return { previous };
    },
    onSuccess: (updatedRequest) => {
      toast.success(`Solicitação ${updatedRequest.status.toLowerCase()} com sucesso!`);
      setIsModalOpen(false);
      setSelectedRequest(null);
    },
    onError: (error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['serviceRequests', user?.id], context.previous);
      }
      toast.error("Erro ao atualizar solicitação.", { description: error.message });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    },
  });

  const handleConfirm = (id) => {
    updateRequestMutation.mutate({ id, data: { status: 'Confirmado' } });
  };

  const handleReject = (id, reason) => {
    updateRequestMutation.mutate({ id, data: { status: 'Rejeitado', provider_response: reason } });
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Delay closing to allow for animation
    setTimeout(() => setSelectedRequest(null), 300);
  };

  const requestsByStatus = useMemo(() => {
    const statuses = {
      Pendente: [],
      Confirmado: [],
      Concluído: [],
      Rejeitado: [],
      Cancelado: []
    };
    (serviceRequests || []).forEach(req => {
      if (statuses[req.status]) {
        statuses[req.status].push(req);
      }
    });
    return statuses;
  }, [serviceRequests]);

  const isLoading = isUserLoading || isProviderLoading || (!!providerId && (isLoadingRequests || isLoadingServices));

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-12 h-12 animate-spin text-amber-600" /></div>;
  }

  const renderRequestList = (requests, status) => {
    if (!requests || requests.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center py-16 rounded-2xl border"
          style={{
            background: 'rgba(251, 191, 36, 0.05)',
            border: '1px solid rgba(251, 191, 36, 0.15)',
            backdropFilter: 'blur(12px)'
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div 
              className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.1))',
                border: '1px solid rgba(251, 191, 36, 0.25)'
              }}
            >
              <Calendar className="w-10 h-10 text-amber-400" />
            </div>
          </motion.div>
          <h3 className="text-xl font-bold text-white mb-2">Nenhum agendamento {status === 'Pendente' ? 'pendente' : 'nesta categoria'}</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            {status === 'Pendente' 
              ? 'Quando clientes solicitarem seus serviços, eles aparecerão aqui em tempo real.'
              : 'Esta categoria está vazia no momento.'}
          </p>
          {status === 'Pendente' && (
            <Link to={createPageUrl("MeusServicos")}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg"
                >
                  Ver meus serviços
                </Button>
              </motion.div>
            </Link>
          )}
        </motion.div>
      );
    }
    return (
      <div className="space-y-4">
        {requests.map((req, index) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <RequestCard
              request={req}
              service={services?.[req.service_id]}
              onClick={() => openModal(req)}
            />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Minha Agenda</h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Gerencie suas solicitações e configure sua disponibilidade</p>
            </div>
          </div>
        </div>

      <Tabs defaultValue="Pendente">
        <TabsList 
          className="grid w-full grid-cols-3 md:grid-cols-6 gap-2 mb-6 p-1.5"
          style={{
            background: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(12px)',
            borderRadius: 16,
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <TabsTrigger 
            value="Pendente" 
            className="gap-1.5 relative overflow-hidden transition-all duration-300"
            style={{
              borderRadius: 12,
              minHeight: 44
            }}
          >
            <Clock className="w-4 h-4"/>
            <span className="hidden sm:inline">Pendentes</span>
            <Badge className="ml-1" style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.3)' }}>{requestsByStatus.Pendente.length}</Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="Confirmado" 
            className="gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 hover:text-white transition-all"
          >
            <CheckCircle className="w-4 h-4"/>
            <span className="hidden sm:inline">Confirmados</span>
          </TabsTrigger>
          <TabsTrigger 
            value="Concluído" 
            className="gap-1.5 hidden md:flex data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 hover:text-white transition-all"
          >
            <Calendar className="w-4 h-4"/>
            <span className="hidden sm:inline">Concluídos</span>
          </TabsTrigger>
          <TabsTrigger 
            value="Rejeitado" 
            className="gap-1.5 hidden md:flex data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-rose-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 hover:text-white transition-all"
          >
            <XCircle className="w-4 h-4"/>
            <span className="hidden sm:inline">Rejeitados</span>
          </TabsTrigger>
          <TabsTrigger 
            value="Cancelado" 
            className="gap-1.5 hidden md:flex data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-500 data-[state=active]:to-gray-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 hover:text-white transition-all"
          >
            <AlertTriangle className="w-4 h-4"/>
            <span className="hidden sm:inline">Cancelados</span>
          </TabsTrigger>
          <TabsTrigger 
            value="Disponibilidade" 
            className="gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 hover:text-white transition-all"
          >
            <Settings2 className="w-4 h-4"/>
            <span className="hidden sm:inline">Horários</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Pendente">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderRequestList(requestsByStatus.Pendente, 'Pendente')}
          </motion.div>
        </TabsContent>
        <TabsContent value="Confirmado">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            {renderRequestList(requestsByStatus.Confirmado, 'Confirmado')}
          </motion.div>
        </TabsContent>
        <TabsContent value="Concluído">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {renderRequestList(requestsByStatus.Concluído, 'Concluído')}
          </motion.div>
        </TabsContent>
        <TabsContent value="Rejeitado">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            {renderRequestList(requestsByStatus.Rejeitado, 'Rejeitado')}
          </motion.div>
        </TabsContent>
        <TabsContent value="Cancelado">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {renderRequestList(requestsByStatus.Cancelado, 'Cancelado')}
          </motion.div>
        </TabsContent>

        <TabsContent value="Disponibilidade">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <Card 
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 20
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Settings2 className="w-5 h-5 text-amber-400" />
                  Configurar Minha Disponibilidade
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Defina os dias e horários em que você está disponível. Clientes só poderão agendar nos horários que você liberar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DisponibilidadeEditor providerId={providerId} />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {selectedRequest && services && (
        <RequestDetailsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          request={selectedRequest}
          service={services[selectedRequest.service_id]}
          onConfirm={handleConfirm}
          onReject={handleReject}
        />
      )}
    </div>
  );
}

export default function MinhaAgendaPage() {
  return (
    <PermissionChecker requiredUserType="prestador">
      <MinhaAgendaContent />
    </PermissionChecker>
  );
}