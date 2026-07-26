import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { XCircle } from 'lucide-react';

const Spinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-[#E8571A] rounded-full animate-spin" />
  </div>
);

export default function AdminRoute() {
  const { user, isAuthenticated, isLoadingAuth } = useAuth();

  if (isLoadingAuth) return <Spinner />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <XCircle className="w-16 h-16 text-red-400" />
        <h2 className="text-2xl font-bold text-foreground">Acesso Restrito</h2>
        <p className="text-muted-foreground">Esta área é exclusiva para administradores.</p>
        <a href="/" className="text-sm text-orange-600 underline">Voltar para o início</a>
      </div>
    );
  }

  return <Outlet />;
}
