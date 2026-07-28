import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { LogIn, ShieldAlert } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import TwoFactorVerification from "@/components/auth/TwoFactorVerification";

export default function Login() {
  const [twoFAState, setTwoFAState] = useState(null); // null | { maskedEmail }
  const location = useLocation();
  const fromPath = location.state?.from?.pathname || null;

  useEffect(() => {
    document.title = 'Entrar | Trancoso Resolve';
    const desc = 'Acesse sua conta na Trancoso Resolve para contratar ou gerenciar seus serviços em Trancoso, Bahia.';
    let m = document.querySelector('meta[name="description"]');
    if (m) m.content = desc;

    // Check if we just returned from OAuth and user needs 2FA
    checkPostLoginUser();
  }, []);

  const checkPostLoginUser = async () => {
    try {
      const user = await base44.auth.me();
      if (!user) return;

      // Already verified this session
      if (sessionStorage.getItem('2fa_verified') === 'true') {
        redirectAfterLogin(user);
        return;
      }

      // Only require 2FA for prestadores who have it enabled
      if (user.user_type === 'prestador' && user.two_fa_enabled) {
        const res = await base44.functions.invoke('twoFactor', { action: 'send' });
        setTwoFAState({ maskedEmail: res?.data?.maskedEmail || user.email });
        return;
      }

      redirectAfterLogin(user);
    } catch {
      // Not logged in yet, show login buttons
    }
  };

  const redirectAfterLogin = (user) => {
    if (!user) { window.location.href = "/"; return; }
    if (!user.user_type || user.user_type === "indefinido") {
      window.location.href = "/CadastroTipo";
      return;
    }
    if (fromPath && fromPath !== '/login') {
      window.location.href = fromPath;
      return;
    }
    if (user.user_type === "prestador") {
      window.location.href = "/MeuPerfilPrestador";
    } else if (user.user_type === "cliente") {
      window.location.href = "/MeusPedidos";
    } else {
      window.location.href = "/";
    }
  };

  if (twoFAState) {
    return (
      <TwoFactorVerification
        maskedEmail={twoFAState.maskedEmail}
        onSuccess={async () => {
          const user = await base44.auth.me();
          redirectAfterLogin(user);
        }}
        onCancel={() => {
          base44.auth.logout('/login');
        }}
      />
    );
  }

  return (
    <AuthLayout
      icon={LogIn}
      title="Bem-vindo(a)"
      subtitle="Entre com sua conta para continuar"
    >
      <div className="space-y-4">
        <Button
          className="w-full h-12 text-sm font-medium bg-orange-600 hover:bg-orange-700"
          onClick={() => base44.auth.redirectToLogin('/login')}
        >
          <LogIn className="w-5 h-5 mr-2" />
          Entrar com Email
        </Button>

        <div className="flex items-start gap-2 rounded-lg bg-muted/60 px-4 py-3 text-sm text-muted-foreground" role="note" aria-label="Aviso sobre login social">
          <ShieldAlert className="mt-0.5 w-4 h-4 shrink-0 text-amber-500" aria-hidden="true" />
          <span>O login social está temporariamente indisponível por segurança. Entre com seu e-mail e senha.</span>
        </div>
      </div>
    </AuthLayout>
  );
}