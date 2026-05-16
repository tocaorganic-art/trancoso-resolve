import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, LogOut, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function PermissionChecker({ children, requiredRole = null, requiredUserType = null }) {
  const [permissionStatus, setPermissionStatus] = useState('checking');
  const [errorDetails, setErrorDetails] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const userData = await base44.auth.me();
      return userData;
    },
    retry: 2,
    retryDelay: 1000,
    staleTime: 0,
  });

  useEffect(() => {
    if (isLoading) {
      setPermissionStatus('checking');
      return;
    }

    if (error) {
      setPermissionStatus('error');
      setErrorDetails({ code: 'AUTH_ERROR', message: 'Falha na autenticação', details: error.message });
      return;
    }

    if (!user) {
      setPermissionStatus('unauthorized');
      return;
    }

    // Verificar role se necessário
    if (requiredRole && user.role !== requiredRole) {
      setPermissionStatus('forbidden');
      setErrorDetails({
        code: 'INSUFFICIENT_ROLE',
        message: 'Acesso negado',
        details: `Esta página requer perfil "${requiredRole}". Seu perfil: "${user.role || 'indefinido'}"`,
      });
      return;
    }

    // Verificar user_type se necessário
    if (requiredUserType && user.user_type !== requiredUserType) {
      const userTypeUndefined = !user.user_type || user.user_type === 'indefinido';

      // Flag de cadastro recente (banco ainda propagando): bypass por até 30s
      const cadastroTs = localStorage.getItem('user_type_prestador_pendente');
      const cadastroRecente = cadastroTs && (Date.now() - parseInt(cadastroTs)) < 30000;
      if (cadastroRecente && requiredUserType === 'prestador') {
        console.log('[PermissionChecker] Cadastro de prestador recente, aguardando propagação...');
        if (retryCount < 8) {
          setTimeout(() => {
            setRetryCount(c => c + 1);
            refetch();
          }, 1500);
          setPermissionStatus('checking');
          return;
        }
        // Após 8 tentativas (~12s), limpa o flag e deixa passar mesmo assim
        localStorage.removeItem('user_type_prestador_pendente');
        setPermissionStatus('authorized');
        return;
      }

      // user_type indefinido sem cadastro recente: tenta algumas vezes antes de bloquear
      if (userTypeUndefined && retryCount < 3) {
        setTimeout(() => {
          setRetryCount(c => c + 1);
          refetch();
        }, 1500);
        setPermissionStatus('checking');
        return;
      }

      // user_type indefinido após retries → vai pro CadastroTipo
      if (userTypeUndefined) {
        setPermissionStatus('needs_setup');
        return;
      }

      // user_type definido mas incorreto (ex: cliente no Dashboard de prestador)
      setPermissionStatus('forbidden');
      setErrorDetails({
        code: 'INSUFFICIENT_USER_TYPE',
        message: 'Acesso negado',
        details: `Esta página requer tipo de usuário "${requiredUserType}". Seu tipo: "${user.user_type}"`,
      });
      return;
    }

    // Limpa flag de cadastro recente se o user_type já está correto
    if (requiredUserType && user.user_type === requiredUserType) {
      localStorage.removeItem('user_type_prestador_pendente');
    }

    // Verificar se user_type está indefinido (novo usuário sem requiredUserType)
    const userTypeUndefined = !user.user_type || user.user_type === 'indefinido';
    if (userTypeUndefined && window.location.pathname !== '/CadastroTipo') {
      setPermissionStatus('needs_setup');
      return;
    }

    setPermissionStatus('authorized');
  }, [user, isLoading, error, requiredRole, requiredUserType, retryCount]);

  // Loading
  if (permissionStatus === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Verificando acesso...</h2>
            <p className="text-slate-600">Aguarde enquanto validamos suas credenciais.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Needs Setup (user_type indefinido)
  if (permissionStatus === 'needs_setup') {
    window.location.href = '/CadastroTipo';
    return null;
  }

  // Unauthorized (não logado) — redireciona automaticamente para login
  if (permissionStatus === 'unauthorized') {
    base44.auth.redirectToLogin(window.location.pathname);
    return null;
  }

  // Forbidden (logado mas sem permissão)
  if (permissionStatus === 'forbidden') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
        <Card className="w-full max-w-md border-yellow-200">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Sem Permissão</h2>
            <p className="text-slate-600 mb-4">{errorDetails?.details}</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-xs text-yellow-800 font-mono">
                Código: {errorDetails?.code}
              </p>
              <p className="text-xs text-yellow-700 mt-2">
                Se você acredita que deveria ter acesso, entre em contato com o suporte.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => window.location.href = '/'} className="flex-1">
                Ir para Início
              </Button>
              <Button onClick={() => base44.auth.logout()} variant="destructive" className="flex-1">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error de autenticação — redireciona para login
  if (permissionStatus === 'error') {
    base44.auth.redirectToLogin(window.location.pathname);
    return null;
  }

  // Authorized - render children
  return <>{children}</>;
}