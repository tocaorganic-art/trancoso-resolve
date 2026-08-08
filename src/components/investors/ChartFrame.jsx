import { useEffect, useRef, useState } from 'react';

// Casca comum dos gráficos:
// - só monta o conteúdo (recharts) quando chega perto do viewport, para não pesar o carregamento inicial;
// - expõe legenda, nota metodológica e uma tabela equivalente para leitores de tela e navegação por teclado.
export default function ChartFrame({
  title,
  description,
  note,
  tableCaption,
  tableColumns = [],
  tableRows = [],
  showTableLabel,
  hideTableLabel,
  height = 'h-72 md:h-96',
  children,
}) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setReady(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const hasTable = tableColumns.length > 0 && tableRows.length > 0;

  return (
    <figure ref={ref} className="rounded-brand-lg bg-card border border-border p-4 md:p-6 m-0">
      {title && <h3 className="font-bold text-foreground mb-1">{title}</h3>}
      {description && <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>}

      <div className={height} aria-hidden="true">
        {ready ? children : <div className="h-full w-full rounded-brand-md bg-muted/50 animate-pulse" />}
      </div>

      {hasTable && (
        <>
          <button
            type="button"
            onClick={() => setTableOpen((o) => !o)}
            aria-expanded={tableOpen}
            className="mt-4 text-xs font-bold text-muted-foreground underline underline-offset-4 hover:text-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
          >
            {tableOpen ? hideTableLabel : showTableLabel}
          </button>

          {/* Sempre no DOM para leitores de tela; visualmente oculta até o usuário abrir. */}
          <div className={tableOpen ? 'mt-3 overflow-x-auto' : 'sr-only'}>
            <table className="w-full text-sm border border-border rounded-brand-md">
              <caption className="sr-only">{tableCaption || title}</caption>
              <thead>
                <tr className="bg-sand/60 dark:bg-neutral-900">
                  {tableColumns.map((col) => (
                    <th key={col} scope="col" className="text-left p-2.5 font-bold text-foreground whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={row[0] ?? i} className="border-t border-border">
                    {row.map((cell, j) => (
                      <td key={j} className={j === 0 ? 'p-2.5 font-semibold text-foreground' : 'p-2.5 text-muted-foreground'}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {note && <figcaption className="mt-4 text-xs text-muted-foreground leading-relaxed">{note}</figcaption>}
    </figure>
  );
}
