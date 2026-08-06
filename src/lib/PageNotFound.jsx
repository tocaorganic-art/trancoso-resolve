import { useLocation } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  useSEO({
    title: 'Página não encontrada | Trancoso Resolve',
    description: 'O conteúdo que você procurava não foi encontrado. Volte para a página inicial do Trancoso Resolve e encontre profissionais verificados perto de você.',
    noIndex: true,
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-sand">
      <div className="max-w-md w-full">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-7xl font-light text-terracotta">404</h1>
            <div className="h-0.5 w-16 bg-brand-primary mx-auto"></div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-neutral-900">
              Página não encontrada
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              A página <span className="font-semibold text-neutral-800">&quot;{pageName}&quot;</span> não existe ou foi movida. Mas a gente resolve: volte ao início e encontre quem você precisa.
            </p>
          </div>

          <div className="pt-6">
            <a
              href="/"
              className="inline-flex items-center px-6 py-2.5 text-sm font-bold text-white bg-brand-primary rounded-pill shadow-brand hover:bg-brand-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
            >
              Voltar para o início
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
