import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, X, Minimize2, Maximize2, Bot, ThumbsUp, ThumbsDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';

const SYSTEM_PROMPT = `Você é a **Toca**, a Inteligência Artificial Concierge da **Trancoso Resolve**. Forneça assistência rápida, precisa e amigável sobre a plataforma e Trancoso (Bahia).

**Plataforma Trancoso Resolve:**
- Como funciona: clientes encontram prestadores verificados → agendam → pagam com segurança (escrow 48h) → confirmam conclusão
- Categorias: Limpeza, Garçom, Pedreiro, Jardinagem, Babá, Eletricista, Encanador, Pintor, Cozinheiro
- Pagamentos: cartão de crédito via Stripe, custódia de 48h, prestador recebe 80%
- Cancelamento: gratuito antes da confirmação do prestador
- Cadastro de prestador: clicar em "Seja um Prestador" no menu
- Acompanhar pedidos: seção "Meus Pedidos"
- Suporte: suporte@trancosoresolve.com.br

**Tom:** Profissional, amigável, empático, baiano-chic. Respostas concisas em português do Brasil.
**Limites:** Não forneça conselhos legais, médicos ou financeiros pessoais.
**Encerramento:** Sempre pergunte se há mais alguma coisa em que pode ajudar.`;

const quickActions = [
  'Como funciona a plataforma?',
  'Como agendar um serviço?',
  'Como funciona o pagamento?',
  'Quero ser um prestador',
];

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-2`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0 mb-1">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm ${
        isUser
          ? 'bg-blue-600 text-white rounded-br-sm'
          : 'bg-white border border-slate-100 text-slate-900 rounded-bl-sm'
      }`}>
        {isUser ? (
          <p className="text-sm leading-relaxed">{msg.content}</p>
        ) : (
          <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-p:my-0.5 prose-ul:my-1 prose-li:my-0">
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        )}
        <p className={`text-xs mt-1 ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
          {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! 👋 Sou a **Toca**, assistente inteligente da Trancoso Resolve. Como posso ajudar você hoje?',
      timestamp: new Date().toISOString(),
    }
  ]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    const content = text || inputMessage;
    if (!content.trim() || isTyping) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...conversationHistory, { role: 'user', content }];
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);
    setConversationHistory(newHistory);

    // Build context-aware prompt with history
    const historyText = newHistory.slice(-8).map(m =>
      `${m.role === 'user' ? 'Usuário' : 'Toca'}: ${m.content}`
    ).join('\n');

    const prompt = `${SYSTEM_PROMPT}

--- HISTÓRICO DA CONVERSA ---
${historyText}

Responda à última mensagem do usuário de forma concisa e útil. Máximo 3 parágrafos curtos.`;

    const result = await base44.integrations.Core.InvokeLLM({ prompt });

    const assistantMsg = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: typeof result === 'string' ? result : result?.response || 'Desculpe, não consegui processar sua mensagem. Tente novamente.',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, assistantMsg]);
    setConversationHistory(prev => [...prev, { role: 'assistant', content: assistantMsg.content }]);
    setIsTyping(false);

    if (!isOpen) setUnreadCount(prev => prev + 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 z-50 flex items-center justify-center transition-all hover:scale-105"
        aria-label="Abrir chat de suporte"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isMinimized ? 'w-80' : 'w-96'} max-w-[calc(100vw-2rem)]`}>
      <Card className="shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Toca — Assistente IA</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-white/80">Online agora • IA avançada</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label={isMinimized ? 'Maximizar chat' : 'Minimizar chat'}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Fechar chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}

              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 1 && !isTyping && (
              <div className="px-4 py-3 bg-white border-t border-slate-100">
                <p className="text-xs text-slate-500 font-medium mb-2">Perguntas frequentes:</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {quickActions.map((action) => (
                    <button
                      key={action}
                      onClick={() => sendMessage(action)}
                      className="text-xs text-left px-3 py-2 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-slate-700"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 bg-white border-t border-slate-100">
              <div className="flex gap-2 items-center">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Digite sua mensagem..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isTyping}
                  className="flex-1 text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 disabled:opacity-50 bg-slate-50"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!inputMessage.trim() || isTyping}
                  className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  aria-label="Enviar mensagem"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
              <p className="text-center text-xs text-slate-400 mt-2">Powered by IA · Trancoso Resolve</p>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}