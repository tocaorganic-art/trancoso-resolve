import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ChatInterface from '@/components/chat/ChatInterface';
import PesquisaProfunda from '@/components/assistente/PesquisaProfunda';
import { Loader2, PlusCircle, MessageSquare, LogIn, Bot, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Sugestões de perguntas iniciais
const SUGGESTED_QUESTIONS = [
  "Sugira experiências VIP em Trancoso",
  "Monte um roteiro de 3 dias",
  "Me ajude a responder um cliente",
  "Quais são os melhores restaurantes?",
];

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
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'pesquisa'

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

  // Usuário não logado — bloqueio obrigatório
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-slate-900 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Toca TrIA</h1>
          <p className="text-slate-600 mb-2 text-sm font-medium">Seu assistente de IA em Trancoso</p>
          <p className="text-slate-500 text-sm mb-6">
            Para usar a <strong>Toca TrIA</strong>, é necessário ter cadastro e estar logado como prestador ou cliente.
          </p>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 mb-3"
            onClick={() => base44.auth.redirectToLogin(window.location.pathname)}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Entrar para usar a Toca TrIA
          </Button>
          <p className="text-xs text-slate-400">Não tem conta? Clique em Entrar e escolha "Cadastre-se".</p>
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
      <div className="p-4 border-b border-slate-200 shrink-0 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-lg font-bold text-white">Toca TrIA</h2>
            <p className="text-blue-200 text-xs">Assistente de IA em Trancoso</p>
          </div>
          {activeTab === 'chat' && (
            <Button size="icon" variant="ghost" onClick={handleNewConversation} disabled={createConversationMutation.isPending} aria-label="Nova conversa" className="hover:bg-white/20 text-white">
              {createConversationMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
            </Button>
          )}
        </div>
        {/* Tabs */}
        <div className="flex gap-1 bg-blue-700/50 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-md transition-colors ${activeTab === 'chat' ? 'bg-white text-blue-700' : 'text-blue-100 hover:text-white'}`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Chat
          </button>
          <button
            onClick={() => setActiveTab('pesquisa')}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-md transition-colors ${activeTab === 'pesquisa' ? 'bg-white text-purple-700' : 'text-blue-100 hover:text-white'}`}
          >
            <Search className="w-3.5 h-3.5" /> Pesquisa
          </button>
        </div>
      </div>
      {activeTab === 'chat' ? (
        <div className="flex-1 overflow-y-auto">
          {conversations && conversations.length > 0 ? (
            <ul>
              {conversations.map(convo => (
                <li key={convo.id}
                    className={`p-4 cursor-pointer border-l-4 transition-all hover:bg-slate-50 ${activeConversationId === convo.id ? 'bg-blue-50 border-blue-600' : 'border-transparent'}`}
                    onClick={() => handleSelectConversation(convo.id)}>
                    <p className="font-semibold text-slate-900 truncate text-sm mb-0.5">
                      {format(new Date(convo.created_date), "dd/MM/yy 'às' HH:mm", { locale: ptBR })}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{convo.lastMessage || 'Nenhuma mensagem ainda'}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center flex flex-col items-center justify-center h-full">
              <Bot className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="font-semibold text-slate-700 mb-1 text-sm">Nenhuma conversa ainda.</p>
              <p className="text-xs text-slate-500">Toque em + para começar.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <PesquisaProfunda />
        </div>
      )}
    </>
  );

  const EmptyChat = (
    <div className="flex items-center justify-center h-full p-8 text-center bg-gradient-to-br from-white to-slate-50">
      <div>
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bot className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-1">Toca TrIA</h3>
        <p className="text-slate-500 mb-6 text-sm max-w-xs mx-auto">Converse com a IA para tirar dúvidas, planejar experiências e resolver o dia a dia em Trancoso.</p>
        <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto mb-6">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => createConversationMutation.mutate()}
              className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl px-3 py-2 text-left transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
        <Button onClick={handleNewConversation} disabled={createConversationMutation.isPending} className="bg-blue-600 hover:bg-blue-700">
          {createConversationMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <PlusCircle className="w-4 h-4 mr-2" />}
          Conversar com a Toca TrIA
        </Button>
      </div>
    </div>
  );

  const ChatContent = (
    <>
      <div className="md:hidden flex items-center gap-2 px-4 py-3 bg-blue-600 border-b border-blue-700">
        <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 gap-1 px-2" onClick={() => setMobileView('list')}>
          ← Conversas
        </Button>
      </div>
      {activeConversationId ? (
        <ChatInterface conversationId={activeConversationId} key={activeConversationId} />
      ) : EmptyChat}
    </>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans overflow-hidden">
      <div className="hidden md:flex w-80 bg-white border-r border-slate-200 flex-col shadow-sm">
        {SidebarContent}
      </div>
      <div className="flex md:hidden flex-col w-full">
        {mobileView === 'list' ? (
          <div className="flex flex-col h-full bg-white">{SidebarContent}</div>
        ) : (
          <div className="flex flex-col h-full">{ChatContent}</div>
        )}
      </div>
      <main className="hidden md:flex flex-1 flex-col overflow-hidden">
        {activeTab === 'pesquisa' ? (
          <PesquisaProfunda />
        ) : activeConversationId ? (
          <ChatInterface conversationId={activeConversationId} key={activeConversationId} />
        ) : EmptyChat}
      </main>
    </div>
  );
}