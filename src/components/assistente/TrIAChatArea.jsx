import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import TrIAMessageBubble from './TrIAMessageBubble.jsx';

const QUICK_PROMPTS = [
  '🗺️ Monte um roteiro turístico em Trancoso',
  '📋 Resuma dados',
  '💬 Responda cliente',
  '🔍 Pesquise algo'
];

export default function TrIAChatArea({ messages, onSendMessage }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    onSendMessage(input);
    setInput('');
    
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Bem-vindo à Toca TrIA</h2>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">
                Sua assistente de IA que executa tarefas de forma autônoma em Trancoso
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map(message => (
              <TrIAMessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span className="text-sm text-slate-300">Toca TrIA está pensando...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Quick Prompts */}
      {messages.length < 2 && (
        <div className="px-4 md:px-6 pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {QUICK_PROMPTS.map(prompt => (
              <button
                key={prompt}
                onClick={() => handleQuickPrompt(prompt)}
                className="text-xs p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-black/40 backdrop-blur-md border-t border-slate-800">
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Converse com a Toca TrIA..."
            className="flex-1 bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-purple-500 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition-colors focus:shadow-lg focus:shadow-purple-500/20"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="Enviar mensagem"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}