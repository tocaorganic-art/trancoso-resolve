import { Sparkles } from 'lucide-react';
import TrIAStreamingMessage from './TrIAStreamingMessage.jsx';

export default function TrIAMessageBubble({ message, isStreaming = false }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0 shadow-brand">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}

      {isUser ? (
        <div className="max-w-xs md:max-w-md lg:max-w-lg bg-brand-primary text-white rounded-brand-lg rounded-tr-brand-xs px-4 py-3 animate-fade-in shadow-brand">
          <div className="text-sm leading-relaxed">
            <p>{message.content}</p>
          </div>
        </div>
      ) : (
        <TrIAStreamingMessage
          content={message.content}
          isComplete={!isStreaming}
        />
      )}
    </div>
  );
}