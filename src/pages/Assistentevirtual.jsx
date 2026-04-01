import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ChatInterface from '@/components/chat/ChatInterface';
import PublicAssistant from '@/components/assistant/PublicAssistant';
import { Loader2, PlusCircle, MessageSquare, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AssistentevirtualPage() {
  const queryClient = useQueryClient();

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: conversations, isLoading: isConversationsLoading } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: () => base44.agents.listConversations({ agent_name: 'toca' }),
    enabled: !!user,
    initialData: [],
  });

  const [activeConversationId, setActiveConversationId] = useState(null);
  const [mobileView, setMobileView] = useState('list');

  useEffect(() => {
    if (!activeConversationId && conversations && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);
  
  const createConversationMutation = useMutation({
    mutationFn: () => base44.agents.createConversation({
      agent_name: 'toca',
      metadata: { name: `Conversa de ${user.full_name || user.email}` }
    }),
    onSuccess: (newConversation) => {
      queryClient.invalidateQueries({ queryKey: ['conversations', user?.id] });
      setActiveConversationId(newConversation.id);
    },
  });

  const isLoading = isUserLoading || isConversationsLoading;

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  }

  // Usuário não logado — exibe assistente público limitado
  if (!user) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6" aria-hidden="true" />
            <div>
              <h1 className="text-lg font-bold">Assistente Virtual Toca</h1>
              <p className="text-blue-200 text-xs">Modo visitante · Respostas básicas</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => base44.auth.redirectToLogin()}
            className="border-white text-white hover:bg-white hover:text-blue-600 gap-2"
            aria-label="Fazer login para acesso completo"
          >
            <LogIn className="w-4 h-4" />
            Entrar
          </Button>
        </div>
        <div className="flex-1 overflow-hidden">
          <PublicAssistant />
        </div>
        <div className="bg-blue-50 border-t border-blue-100 px-4 py-2 text-center">
          <p className="text-xs text-slate-500">
            <button onClick={() => base44.auth.redirectToLogin()} className="text-blue-600 font-medium underline underline-offset-2">
              Faça login
            </button>
            {" "}para salvar conversas e acessar recursos completos
          </p>
        </div>
      </div>
    );
  }
  
  const handleSelectConversation = (id) => {
    setActiveConversationId(id);
    setMobileView('chat');
  };

  const handleNewConversation = () => {
    createConversationMutation.mutate();
    setMobileView('chat');
  };

  const SidebarContent = (
    <>
      <div className="p-4 border-b border-slate-200 flex justify-between items-center shrink-0 bg-gradient-to-r from-blue-600 to-blue-700">
        <h2 className="text-lg font-bold text-white">Minhas Conversas</h2>
        <Button size="icon" variant="ghost" onClick={handleNewConversation} disabled={createConversationMutation.isPending} aria-label="Iniciar nova conversa" className="hover:bg-white/20 text-white">
          {createConversationMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations && conversations.length > 0 ? (
          <ul>
            {conversations.map(convo => (
              <li key={convo.id}
                  className={`p-4 cursor-pointer border-l-4 transition-all hover:bg-slate-50 ${activeConversationId === convo.id ? 'bg-blue-50 border-blue-600' : 'border-transparent'}`}
                  onClick={() => handleSelectConversation(convo.id)}>
                  <p className="font-semibold text-slate-900 truncate text-sm mb-0.5">
                      Conversa de {format(new Date(convo.created_date), "dd/MM/yy 'às' HH:mm", { locale: ptBR })}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{convo.lastMessage || 'Nenhuma mensagem ainda'}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6 text-center text-slate-500 flex flex-col items-center justify-center h-full">
             <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
             <p className="font-semibold text-slate-700 mb-1 text-sm">Nenhuma conversa ainda.</p>
             <p className="text-xs text-slate-500">Toque em + para começar.</p>
          </div>
        )}
      </div>
    </>
  );

  const ChatContent = (
    <>
      {/* Mobile back button */}
      <div className="md:hidden flex items-center gap-2 px-4 py-3 bg-blue-600 border-b border-blue-700">
        <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 gap-1 px-2" onClick={() => setMobileView('list')}>
          ← Conversas
        </Button>
      </div>
      {activeConversationId ? (
        <ChatInterface conversationId={activeConversationId} key={activeConversationId} />
      ) : (
        <div className="flex items-center justify-center h-full text-slate-500 p-8 text-center">
          <div>
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-blue-300" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Selecione uma conversa</h3>
            <p className="text-slate-500 text-sm">Ou crie uma nova com o botão +</p>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans overflow-hidden">
      {/* Desktop: sidebar sempre visível */}
      <div className="hidden md:flex w-80 bg-white border-r border-slate-200 flex-col shadow-sm">
        {SidebarContent}
      </div>

      {/* Mobile: alterna entre lista e chat */}
      <div className="flex md:hidden flex-col w-full">
        {mobileView === 'list' ? (
          <div className="flex flex-col h-full bg-white">{SidebarContent}</div>
        ) : (
          <div className="flex flex-col h-full">{ChatContent}</div>
        )}
      </div>

      {/* Desktop: área de chat */}
      <main className="hidden md:flex flex-1 flex-col overflow-hidden">
        {activeConversationId ? (
          <ChatInterface conversationId={activeConversationId} key={activeConversationId} />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500 p-8 text-center bg-gradient-to-br from-white to-slate-50">
            <div>
              <MessageSquare className="w-20 h-20 mx-auto mb-6 text-blue-300" />
              <h3 className="text-2xl font-semibold text-slate-800 mb-2">Selecione ou crie uma conversa</h3>
              <p className="text-slate-500 max-w-md mx-auto text-sm">Use o botão + para começar a conversar com a Toca.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}