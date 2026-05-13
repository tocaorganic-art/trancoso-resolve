import React from 'react';
import { Copy, Check, Sparkles, Zap, BookOpen } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function TrIAMessageBubble({ message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderToolCalls = () => {
    if (!message.tool_calls?.length) return null;

    return (
      <div className="mt-3 space-y-2 border-t border-slate-700 pt-3">
        {message.tool_calls.map((tool, idx) => (
          <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/30 border border-slate-600/50">
            <Zap className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-300 truncate">{tool.name}</p>
              <p className="text-xs text-slate-500">
                {tool.status === 'completed' ? '✓ Executado' : tool.status === 'running' ? '⧖ Executando...' : 'Pendente'}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-end gap-3 max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl">
          <div className="px-4 py-3 rounded-2xl rounded-tr-none bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/20">
            <p className="text-sm leading-relaxed break-words">{message.content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/30">
        <Sparkles className="w-4 h-4 text-white" />
      </div>

      <div className="flex-1 max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl group">
        <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors shadow-lg">
          {/* Markdown Content */}
          <div className="text-sm text-slate-200 leading-relaxed prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-semibold text-cyan-300" {...props} />,
                em: ({ node, ...props }) => <em className="italic text-slate-300" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                li: ({ node, ...props }) => <li className="text-sm" {...props} />,
                code: ({ node, inline, ...props }) => (
                  inline ? (
                    <code className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-300 text-xs font-mono" {...props} />
                  ) : (
                    <code className="block bg-slate-900 px-3 py-2 rounded-lg text-cyan-300 text-xs font-mono my-2 overflow-x-auto" {...props} />
                  )
                ),
                a: ({ node, ...props }) => (
                  <a className="text-cyan-400 hover:text-cyan-300 underline" target="_blank" rel="noopener noreferrer" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-2 border-cyan-500 pl-3 italic text-slate-300 my-2" {...props} />
                ),
                h1: ({ node, ...props }) => <h1 className="text-lg font-bold text-white mt-3 mb-2" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-base font-bold text-white mt-2 mb-1" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-sm font-semibold text-cyan-300 mt-2 mb-1" {...props} />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Tool Calls */}
          {renderToolCalls()}
        </div>

        {/* Copy Button */}
        <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 border border-slate-700 hover:border-slate-600 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copiar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}