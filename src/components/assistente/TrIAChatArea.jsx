import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Sparkles, Send, Paperclip, Loader2, Brain, Zap, Globe } from 'lucide-react';
import TrIAMessageBubble from './TrIAMessageBubble';

const QUICK_PROMPTS = [
  { icon: '🌐', text: 'Pesquisa na web', label: 'Buscar informações' },
  { icon: '📋', text: 'Monte um roteiro', label: 'Planejamento' },
  { icon: '💬', text: 'Responda um cliente', label: 'Atendimento' },
  { icon: '📊', text: 'Analise dados', label: 'Análise' },
];

export default function TrIAChatArea({ conversationId }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { data: conversation } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => base44.agents.getConversation(conversationId),
    enabled: !!conversationId,
    onSuccess: (data) => {
      setMessages(data?.messages || []);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (conversationId) {
      // Subscribe to real-time updates
      const unsubscribe = base44.agents.subscribeToConversation(conversationId, (data) => {
        setMessages(data.messages || []);
        setIsThinking(data.messages?.some(m => m.role === 'assistant' && m.status === 'thinking'));
      });
      return () => unsubscribe?.();
    }
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !conversation || isLoading || isThinking) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsThinking(true);

    try {
      await base44.agents.addMessage(conversation, {
        role: 'user',
        content: userMessage,
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setIsThinking(false);
    }
  };

  if (!conversationId) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-black via-slate-900 to-slate-800 p-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-cyan-500/30">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo à Toca TrIA</h2>
          <p className="text-slate-400 mb-6">
            Clique em "Nova conversa" para começar a conversar com seu assistente de IA avançado.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 transition-colors cursor-pointer">
                <p className="text-lg mb-1">{prompt.icon}</p>
                <p className="text-xs font-medium text-white">{prompt.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-black via-slate-900 to-slate-800">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-cyan-500/30">
                <Brain className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Comece uma conversa</h3>
              <p className="text-sm text-slate-400">
                Pergunte à Toca TrIA sobre roteiros, análises, respostas a clientes ou qualquer coisa que precise resolver em Trancoso.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <TrIAMessageBubble key={idx} message={msg} />
            ))}
            {isThinking && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl rounded-tl-none bg-slate-800 border border-slate-700">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-xs text-slate-400">IA pensando...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 border-t border-slate-800 bg-gradient-to-t from-black via-slate-900 to-transparent flex-shrink-0">
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          {/* Message Input */}
          <div className="flex gap-3">
            <button
              className="p-2.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors"
              title="Anexar arquivo"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder="Escreva sua pergunta ou comando..."
                className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-cyan-500 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition-colors focus:shadow-lg focus:shadow-cyan-500/20"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || isThinking}
              className="p-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              title="Enviar mensagem"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Quick Actions */}
          {messages.length === 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputValue(prompt.text);
                    inputRef.current?.focus();
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-all text-sm font-medium"
                >
                  <span>{prompt.icon}</span>
                  <span className="hidden sm:inline text-xs">{prompt.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}