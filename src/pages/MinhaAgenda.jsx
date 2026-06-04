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

const RequestCard = ({ request, service, onClick }) => {
  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-amber-500"
      onClick={onClick}
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <div className="flex flex-col items-center justify-center bg-slate-100 rounded-md p-2 w-16">
              <span className="text-sm font-bold text-slate-700">{format(new Date(request.date), 'MMM', { locale: ptBR })}</span>
              <span className="text-2xl font-bold text-slate-900">{format(new Date(request.date), 'dd')}</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{service?.title || 'Serviço não encontrado'}</h3>
            <p className="text-sm text-slate-600">Cliente: {request.client_name}</p>
            <p className="text-xs text-slate-500 sm:hidden">{format(new Date(request.date), "dd/MM/yyyy")}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-green-600">
            R$ {service?.price.toFixed(2) || '0.00'}
          </p>
        </div>
      </CardContent>
    </Card>
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
    queryFn: () => base44.entities.ServiceRequest.filter({ provider_id: providerId }, '-date'),
    enabled: !!providerId,
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

  const renderRequestList = (requests) => {
    if (requests.length === 0) {
    return (
      <div className="text-center py-16 bg-amber-50 rounded-lg border border-amber-200">
        <Calendar className="w-12 h-12 mx-auto text-amber-500 mb-4" />
        <h3 className="text-lg font-medium text-amber-900">Nenhum agendamento ainda</h3>
        <p className="text-sm text-amber-700 mb-4">Quando clientes solicitarem seus serviços, eles aparecerão aqui.</p>
        <Link to={createPageUrl("MeusServicos")}>
          <Button className="bg-amber-600 hover:bg-amber-700">Ver meus serviços</Button>
        </Link>
      </div>
    );
    }
    return (
      <div className="space-y-4">
        {requests.map(req => (
          <RequestCard
            key={req.id}
            request={req}
            service={services?.[req.service_id]}
            onClick={() => openModal(req)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3"><Calendar /> Minha Agenda</h1>
        <p className="text-slate-600">Gerencie suas solicitações de serviço e configure sua disponibilidade.</p>
      </div>

      <Tabs defaultValue="Pendente">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-6">
          <TabsTrigger value="Pendente" className="gap-1.5"><Clock className="w-4 h-4"/>Pendentes <Badge className="ml-1">{requestsByStatus.Pendente.length}</Badge></TabsTrigger>
          <TabsTrigger value="Confirmado" className="gap-1.5"><CheckCircle className="w-4 h-4"/>Confirmados</TabsTrigger>
          <TabsTrigger value="Concluído" className="gap-1.5 hidden md:flex"><Calendar className="w-4 h-4"/>Concluídos</TabsTrigger>
          <TabsTrigger value="Rejeitado" className="gap-1.5 hidden md:flex"><XCircle className="w-4 h-4"/>Rejeitados</TabsTrigger>
          <TabsTrigger value="Cancelado" className="gap-1.5 hidden md:flex"><AlertTriangle className="w-4 h-4"/>Cancelados</TabsTrigger>
          <TabsTrigger value="Disponibilidade" className="gap-1.5"><Settings2 className="w-4 h-4"/>Horários</TabsTrigger>
        </TabsList>

        <TabsContent value="Pendente">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações Pendentes</CardTitle>
              <CardDescription>Novas solicitações que aguardam sua confirmação ou rejeição.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderRequestList(requestsByStatus.Pendente)}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Confirmado">
          <Card>
            <CardHeader>
              <CardTitle>Serviços Confirmados</CardTitle>
              <CardDescription>Seus próximos serviços agendados.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderRequestList(requestsByStatus.Confirmado)}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Concluído">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Serviços</CardTitle>
              <CardDescription>Serviços que você já concluiu.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderRequestList(requestsByStatus.Concluído)}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Rejeitado">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações Rejeitadas</CardTitle>
              <CardDescription>Solicitações que você não pôde aceitar.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderRequestList(requestsByStatus.Rejeitado)}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Cancelado">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações Canceladas</CardTitle>
              <CardDescription>Solicitações canceladas pelo cliente.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderRequestList(requestsByStatus.Cancelado)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="Disponibilidade">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-amber-600" />
                Configurar Minha Disponibilidade
              </CardTitle>
              <CardDescription>
                Defina os dias e horários em que você está disponível. Clientes só poderão agendar nos horários que você liberar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DisponibilidadeEditor providerId={providerId} />
            </CardContent>
          </Card>
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