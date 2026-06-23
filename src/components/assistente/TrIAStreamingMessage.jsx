import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function TrIAStreamingMessage({ content, isComplete }) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (!content) return;

    // Se a mensagem está completa, mostrar tudo de uma vez
    if (isComplete) {
      setDisplayedContent(content);
      setCharIndex(content.length);
      return;
    }

    // Streaming: mostrar caracteres progressivamente
    if (charIndex < content.length) {
      const timer = setTimeout(() => {
        setCharIndex(charIndex + 1);
        setDisplayedContent(content.slice(0, charIndex + 1));
      }, 15); // Velocidade de digitação (ms por caractere)

      return () => clearTimeout(timer);
    }
  }, [charIndex, content, isComplete]);

  return (
    <div className="flex justify-start animate-fade-in">
      <div className="bg-[#2A1A0A] rounded-brand-lg rounded-tl-brand-xs px-4 py-3 max-w-2xl border border-orange-900/30 shadow-warm-sm">
        <div className="text-sm text-[#F2DEC4] leading-relaxed">
          <ReactMarkdown
            className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_a]:text-orange-400 [&_a]:hover:text-orange-300 [&_code]:bg-[#0D0805] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-orange-300 [&_pre]:bg-[#0D0805] [&_pre]:border [&_pre]:border-orange-900/40 [&_p]:text-[#F2DEC4] [&_li]:text-[#F2DEC4] [&_strong]:text-[#F2DEC4]"
            components={{
              p: ({ children }) => <p className="my-2 text-[#F2DEC4]">{children}</p>,
              ul: ({ children }) => <ul className="my-2 ml-4 list-disc text-[#F2DEC4]">{children}</ul>,
              ol: ({ children }) => <ol className="my-2 ml-4 list-decimal text-[#F2DEC4]">{children}</ol>,
              li: ({ children }) => <li className="my-1 text-[#F2DEC4]">{children}</li>,
              h1: ({ children }) => <h3 className="text-base font-bold mt-3 mb-2 text-[#F2DEC4]">{children}</h3>,
              h2: ({ children }) => <h4 className="text-sm font-bold mt-3 mb-2 text-[#F2DEC4]">{children}</h4>,
              h3: ({ children }) => <h5 className="text-xs font-bold mt-2 mb-1 text-[#F2DEC4]">{children}</h5>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-orange-500 pl-3 my-2 text-[#C8A882] italic">
                  {children}
                </blockquote>
              ),
              code: ({ inline, children }) => (
                inline ? (
                  <code className="bg-[#0D0805] px-1.5 py-0.5 rounded text-orange-300 font-mono text-xs">
                    {children}
                  </code>
                ) : (
                  <pre className="bg-[#0D0805] border border-orange-900/40 rounded-brand-sm p-3 my-2 overflow-x-auto">
                    <code className="text-orange-300 font-mono text-xs">{children}</code>
                  </pre>
                )
              ),
            }}
          >
            {displayedContent}
          </ReactMarkdown>

          {!isComplete && (
            <span className="inline-block w-2 h-5 bg-orange-400 ml-1 animate-pulse rounded-sm" />
          )}
        </div>
      </div>
    </div>
  );
}