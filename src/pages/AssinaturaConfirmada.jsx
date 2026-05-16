import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AssinaturaConfirmada() {
  useEffect(() => {
    document.title = 'Assinatura Confirmada - Trancoso Resolve';
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-slate-800 rounded-2xl p-10 shadow-2xl border border-slate-700">
          <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-3">Assinatura Confirmada!</h1>
          <p className="text-slate-300 mb-2 text-lg">
            Bem-vindo à Trancoso Resolve! 🎉
          </p>
          <p className="text-slate-400 text-sm mb-8">
            Seu pagamento foi processado com sucesso. Acesse o Dashboard para configurar seu perfil e começar a receber clientes.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/Dashboard">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base">
                Ir para o Dashboard
              </Button>
            </Link>
            <Link to="/Planos">
              <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                Ver minha assinatura
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}