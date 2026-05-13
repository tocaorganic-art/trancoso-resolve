import React from 'react';
import { Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function TrIAMessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 ${
        isUser
          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
          : 'bg-slate-800 text-slate-100 border border-slate-700'
      }`}>
        <div className="text-sm leading-relaxed">
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-bold text-cyan-300" {...props} />,
                em: ({ node, ...props }) => <em className="italic text-slate-300" {...props} />,
                code: ({ node, inline, ...props }) => 
                  inline ? (
                    <code className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-300 text-xs" {...props} />
                  ) : (
                    <code className="block bg-slate-900 p-2 rounded my-2 text-cyan-300 text-xs overflow-x-auto" {...props} />
                  ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}