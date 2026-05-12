import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Cookie, X, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

function initializeAnalytics() {
  console.log('Cookies de Analytics autorizados. Serviço pode ser inicializado aqui.');
}

function initializeMarketingTools() {
  console.log('Cookies de Marketing autorizados. Serviço pode ser inicializado aqui.');
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false
  });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Pequeno delay para não aparecer imediatamente
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    } else {
      try {
        const savedPreferences = JSON.parse(consent);
        setPreferences(savedPreferences);
        if (savedPreferences.analytics) initializeAnalytics();
        if (savedPreferences.marketing) initializeMarketingTools();
      } catch (e) {
        console.error('Erro ao carregar preferências de cookies:', e);
        setVisible(true);
      }
    }
  }, []);

  const handleSavePreferences = (newPreferences) => {
    const finalPreferences = {
      ...newPreferences,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    localStorage.setItem('cookieConsent', JSON.stringify(finalPreferences));
    setPreferences(finalPreferences);
    setVisible(false);
    
    if (finalPreferences.analytics) {
      initializeAnalytics();
    }
    
    if (finalPreferences.marketing) {
      initializeMarketingTools();
    }
  };

  const handleAcceptAll = () => {
    handleSavePreferences({ essential: true, analytics: true, marketing: true });
  };

  const handleAcceptSelected = () => {
    handleSavePreferences(preferences);
  };
  
  const handleRejectAll = () => {
    handleSavePreferences({ essential: true, analytics: false, marketing: false });
  };

  const togglePreference = (key) => {
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  if (!visible) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-40 p-3 md:p-4 animate-in slide-in-from-bottom-full duration-500 pb-20 md:pb-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 3rem)' }}
    >
      <Card className="max-w-3xl mx-auto shadow-2xl border-2 border-slate-200 overflow-hidden">
        <CardHeader className="pb-2 md:pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle id="cookie-consent-title" className="flex items-center gap-2 text-base md:text-lg">
              <Cookie className="w-4 md:w-5 h-4 md:h-5 text-cyan-600 shrink-0"/>
              <span>Sua Privacidade</span>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 md:h-8 md:w-8 -mr-2 -mt-2 shrink-0"
              onClick={handleRejectAll}
              aria-label="Recusar cookies não essenciais e fechar"
            >
              <X className="w-3 md:w-4 h-3 md:h-4" />
            </Button>
          </div>
          <CardDescription id="cookie-consent-description" className="text-xs md:text-sm leading-snug mt-1">
            Usamos cookies para melhorar sua experiência. <strong>Cookies essenciais</strong> são necessários para autenticação. 
            Você pode <strong>Personalizar</strong> suas preferências.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {expanded && (
            <div className="mb-6 space-y-4 pt-4 border-t">
              <div className="flex items-start justify-between space-x-4 p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="cookie-essential" className="font-semibold flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    Cookies Essenciais
                  </Label>
                  <p className="text-sm text-slate-500 mt-1">Necessários para o funcionamento básico do site. Incluem autenticação e preferências de sessão.</p>
                </div>
                <Switch id="cookie-essential" checked={preferences.essential} disabled aria-label="Cookies essenciais - sempre ativos" />
              </div>
              <div className="flex items-start justify-between space-x-4 p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="cookie-analytics" className="font-semibold">Cookies Analíticos</Label>
                  <p className="text-sm text-slate-500 mt-1">Nos ajudam a entender como os visitantes interagem com o site para melhorar a experiência.</p>
                </div>
                <Switch 
                  id="cookie-analytics" 
                  checked={preferences.analytics} 
                  onCheckedChange={() => togglePreference('analytics')} 
                  aria-label="Ativar cookies analíticos"
                />
              </div>
              <div className="flex items-start justify-between space-x-4 p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="cookie-marketing" className="font-semibold">Cookies de Marketing</Label>
                  <p className="text-sm text-slate-500 mt-1">Usados para exibir anúncios relevantes baseados em seus interesses.</p>
                </div>
                <Switch 
                  id="cookie-marketing" 
                  checked={preferences.marketing} 
                  onCheckedChange={() => togglePreference('marketing')} 
                  aria-label="Ativar cookies de marketing"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 md:flex-row">
            <Button 
              onClick={handleAcceptAll} 
              className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-xs md:text-sm h-9 md:h-10"
            >
              Aceitar Todos
            </Button>
            <Button 
              onClick={handleRejectAll} 
              variant="secondary" 
              className="flex-1 text-xs md:text-sm h-9 md:h-10"
            >
              Recusar
            </Button>
            <Button 
              variant="outline" 
              onClick={() => expanded ? handleAcceptSelected() : setExpanded(true)}
              className="flex-1 text-xs md:text-sm h-9 md:h-10"
            >
              {expanded ? 'Salvar' : 'Personalizar'}
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center leading-tight">
            Ao continuar navegando, você concorda com nossa{' '}
            <Link to={createPageUrl("PoliticaPrivacidade")} className="underline text-cyan-600 hover:text-cyan-700">
              Política de Privacidade
            </Link>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}