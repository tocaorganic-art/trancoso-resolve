import React from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";

function MicrosoftIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" fill="none">
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
      <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}

function FacebookIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.234 2.686.234v2.953h-1.514c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

export default function Login() {
  const handleGoogle = () => base44.auth.loginWithProvider("google", "/");
  const handleMicrosoft = () => base44.auth.loginWithProvider("microsoft", "/");
  const handleFacebook = () => base44.auth.loginWithProvider("facebook", "/");

  return (
    <AuthLayout
      icon={LogIn}
      title="Bem-vindo(a)"
      subtitle="Entre com sua conta para continuar"
    >
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full h-12 text-sm font-medium"
          onClick={handleGoogle}
        >
          <GoogleIcon className="w-5 h-5 mr-2" />
          Continuar com Google
        </Button>

        <Button
          variant="outline"
          className="w-full h-12 text-sm font-medium"
          onClick={handleMicrosoft}
        >
          <MicrosoftIcon className="w-5 h-5 mr-2" />
          Continuar com Microsoft
        </Button>

        <Button
          variant="outline"
          className="w-full h-12 text-sm font-medium"
          onClick={handleFacebook}
        >
          <FacebookIcon className="w-5 h-5 mr-2" />
          Continuar com Facebook
        </Button>
      </div>
    </AuthLayout>
  );
}