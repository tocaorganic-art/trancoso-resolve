import React, { useState } from 'react';
import { Menu, X, Send, Zap } from 'lucide-react';
import TrIASidebar from './TrIASidebar.jsx';
import TrIAChatArea from './TrIAChatArea.jsx';

export default function TocaTrIAPremium() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState([
    { id: '1', name: 'Roteiro Trancoso', preview: 'Monte um roteiro de 3 dias...' }
  ]);
  const [activeConversationId, setActiveConversationId] = useState('1');
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: 'Olá! Sou a Toca TrIA, sua assistente de IA. Como posso ajudar você em Trancoso hoje?' }
  ]);

  const handleSendMessage = (content) => {
    const newMessage = { id: Date.now(), role: 'user', content };
    setMessages([...messages, newMessage]);

    // Simular resposta da IA
    setTimeout(() => {
      const response = { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: 'Entendi sua pergunta. Deixe-me pesquisar as melhores opções para você...' 
      };
      setMessages(prev => [...prev, response]);
    }, 500);
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Sidebar */}
      <TrIASidebar 
        isOpen={sidebarOpen} 
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-black via-slate-900 to-slate-800 relative overflow-hidden">
        {/* Header */}
        <div className="h-16 border-b border-slate-800 flex items-center justify-between px-4 bg-black/40 backdrop-blur-md">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors md:hidden"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-semibold text-slate-200">Toca TrIA Online</span>
          </div>
          <div className="text-xs text-slate-500">v1.0 Premium</div>
        </div>

        {/* Chat Content */}
        <TrIAChatArea 
          messages={messages} 
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}