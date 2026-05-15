import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Home, Calendar, Briefcase, UserCog,
  TrendingUp, CreditCard, Wrench, Menu, X, FileText, User, MessageCircle, Image, Rocket, Globe, ShieldCheck, Banknote, ArrowLeft } from
"lucide-react";

import RoutePreloader from "./components/optimization/RoutePreloader";
import ImagePreloader from "./components/optimization/ImagePreloader";
import PerformanceMonitor from "./components/optimization/PerformanceMonitor";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger } from
"@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/sonner";
import ConnectionStatus from "./components/ConnectionStatus";
import CookieConsent from "./components/CookieConsent";
import OfflineIndicator from "./components/OfflineIndicator";
import SkipToContent from "./components/ui/SkipToContent";
import ErrorBoundary from "./components/ErrorBoundary";
import PageViewTracker from "./components/analytics/PageViewTracker";
import AccessLogger from "./components/auth/AccessLogger";
import SupportChat from "./components/support/SupportChat";
import FeedbackCollector from "./components/feedback/FeedbackCollector";
import BottomNav from "./components/BottomNav";
import CompletarPerfilModal from "./components/auth/CompletarPerfilModal";
import PWAPrompt from "./components/optimization/PWAPrompt";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isRoot = location.pathname === "/" || location.pathname === "/Home";

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    staleTime: Infinity
  });

  useEffect(() => {
    document.documentElement.lang = 'pt-BR';

    const pageTitles = {
      '/': 'Trancoso Resolve - Serviços Confiáveis em Trancoso',
      '/Home': 'Trancoso Resolve - Serviços Confiáveis em Trancoso',
      '/ServicosCategoria': 'Buscar Serviços - Trancoso Resolve',
      '/PrestadorPerfil': 'Perfil do Prestador - Trancoso Resolve',
      '/ServicoDetalhes': 'Detalhes do Serviço - Trancoso Resolve',
      '/Planos': 'Planos e Preços - Trancoso Resolve',
      '/Manual': 'Manual e FAQ - Trancoso Resolve',
      '/SejaPrestador': 'Seja um Prestador - Trancoso Resolve',
      '/ComoFunciona': 'Como Funciona - Trancoso Resolve',
      '/Seguranca': 'Segurança e Privacidade - Trancoso Resolve',
      '/MeusPedidos': 'Meus Pedidos - Trancoso Resolve',
      '/Dashboard': 'Dashboard - Trancoso Resolve',
      '/Financeiro': 'Portal Financeiro - Trancoso Resolve',
      '/Assistentevirtual': 'Assistente Virtual Toca - Trancoso Resolve',
      '/GeradorDeImagem': 'Gerador de Imagens IA - Trancoso Resolve',
      '/PoliticaPrivacidade': 'Política de Privacidade - Trancoso Resolve',
      '/MinhaAgenda': 'Minha Agenda - Trancoso Resolve',
      '/MeuPerfilPrestador': 'Meu Perfil de Prestador - Trancoso Resolve',
      '/MeusServicos': 'Meus Serviços - Trancoso Resolve',
      '/DeployDashboard': 'Deploy Dashboard - Trancoso Resolve',
      '/Chat': 'Minhas Conversas - Trancoso Resolve',
      '/DiagnosticosCompletos': 'Diagnósticos Completos do Sistema | Trancoso Resolve',
      '/ManutencaoSistema': 'Manutenção do Sistema | Trancoso Resolve',
      '/MonitoringDashboard': 'Monitoramento | Trancoso Resolve',
    };

    const pageDescriptions = {
      '/': 'Trancoso Resolve: Profissionais verificados que resolvem seus problemas em Trancoso. Faxina, eletricista, jardinagem, cozinheiro, passeios e muito mais.',
      '/Home': 'Trancoso Resolve: Profissionais verificados que resolvem seus problemas em Trancoso. Faxina, eletricista, jardinagem, cozinheiro, passeios e muito mais.',
      '/ServicosCategoria': 'Navegue por categorias e encontre o profissional que resolve seu problema em Trancoso.',
      '/PrestadorPerfil': 'Veja o perfil detalhado e avaliações dos profissionais verificados em Trancoso.',
      '/ServicoDetalhes': 'Conheça os detalhes de cada serviço e contrate com confiança em Trancoso.'
    };

    const currentPath = location.pathname === '/Home' ? '/' : location.pathname;
    const currentTitle = pageTitles[currentPath] || 'Trancoso Resolve';
    const currentDescription = pageDescriptions[currentPath] || 'A forma mais fácil de encontrar e contratar serviços de confiança em Trancoso, Bahia.';

    document.title = currentTitle;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = currentDescription;

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = currentTitle;

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.content = currentDescription;

  }, [location.pathname]);

  const isAdmin = user?.role === "admin";
  const [perfilModalFechado, setPerfilModalFechado] = useState(false);
  const precisaCompletarPerfil = !!user && !user.profile_completed && !location.pathname.includes('CadastroTipo') && !perfilModalFechado;

  const adminNavItems = [
  { name: "Dashboard", path: createPageUrl("Dashboard"), icon: Home },
  { name: "Minha Agenda", path: createPageUrl("MinhaAgenda"), icon: Calendar },
  { name: "Meus Serviços", path: createPageUrl("MeusServicos"), icon: Briefcase },
  { name: "Meu Perfil", path: createPageUrl("MeuPerfilPrestador"), icon: UserCog },
  { name: "Financeiro", path: createPageUrl("Financeiro"), icon: TrendingUp },
  { name: "Planos", path: createPageUrl("Planos"), icon: CreditCard },
  { name: "Manual", path: createPageUrl("Manual"), icon: FileText },
  ...(isAdmin ? [{ name: "Deploy", path: createPageUrl("DeployDashboard"), icon: Rocket }] : []),
  ...(isAdmin ? [
    { name: "Verificações", path: "/FilaVerificacao", icon: ShieldCheck },
    { name: "Antecedentes", path: "/AdminAntecedentes", icon: ShieldCheck },
    { name: "Pagamentos", path: "/AdminPagamentos", icon: Banknote },
    { name: "📊 Métricas", path: "/admin/metricas", icon: TrendingUp },
  ] : []),
  { name: "Ver Site", path: "/", icon: Globe, clearLogin: true }];


  const publicPages = ['/', '/Home', '/ServicosCategoria', '/PrestadorPerfil', '/ServicoDetalhes', '/MeusPedidos', '/PoliticaPrivacidade', '/Manual', '/SejaPrestador', '/ComoFunciona', '/Seguranca', '/Assistentevirtual', '/GeradorDeImagem', '/Chat', '/About', '/Contact', '/PreLancamento', '/ServicoLanding', '/SolicitacaoConfirmada'];
  const isPublicPage = publicPages.some((page) => {
    const pagePath = page === '/Home' ? '/' : page;
    const currentLocationPath = location.pathname === '/Home' ? '/' : location.pathname;
    return currentLocationPath === pagePath || currentLocationPath === `${pagePath}/`;
  }) || location.pathname.startsWith('/servicos/');

  const isActive = (path) => location.pathname === path;

  // Layout público
  if (isPublicPage) {
    return (
      <ErrorBoundary>
        <SkipToContent />
        <RoutePreloader />
        <ImagePreloader />
        <PerformanceMonitor />
        <PageViewTracker />
        <AccessLogger />

        <div className="min-h-screen bg-slate-900 overflow-x-hidden">
          <style>{`
            :root {
              --primary: #0A81D1;
              --secondary: #F4D35E;
              --accent: #0D8A6F;
              --text-dark: #f1f5f9;
              --text-light: #FFFFFF;
              --background: #0f172a;
              color-scheme: dark;
            }
            :focus-visible {
              outline: 3px solid #38bdf8 !important;
              outline-offset: 2px !important;
              box-shadow: 0 0 0 5px rgba(56, 189, 248, 0.4) !important;
              border-radius: 4px;
              transition: outline 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
            }
          `}</style>

          <nav className="bg-slate-800 shadow-slate-900 sticky top-0 z-50" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
            <div className="container mx-auto px-3 md:px-4 py-3 flex items-center justify-between gap-2 overflow-hidden">
              <Link to={createPageUrl("Home")} className="flex items-center gap-2 min-w-0 shrink" data-testid="nav-logo-link">
                <img src="https://media.base44.com/images/public/68eb21726a9614db4a82ba99/866729f3e_trancoso_resolve_logo_principal.png" alt="Trancoso Resolve - Serviços em Trancoso, Bahia" className="h-12 md:h-14 shrink-0" width="48" height="48" loading="eager" fetchpriority="high" />
                <span className="font-bold text-sm md:text-lg text-white truncate hidden xs:inline sm:inline drop-shadow-md">Trancoso Resolve</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                {user && <>
                  <Link to={createPageUrl("GeradorDeImagem")} className="flex items-center gap-1 text-sm font-semibold text-white hover:text-cyan-300 transition-colors drop-shadow-sm">
                    <Image className="w-4 h-4" /> Toca Vision
                  </Link>
                  <Link to={createPageUrl("Assistentevirtual")} className="flex items-center gap-1 text-sm font-semibold text-white hover:text-cyan-300 transition-colors drop-shadow-sm">
                    <MessageCircle className="w-4 h-4" /> Toca TrIA
                  </Link>
                  <Link to={createPageUrl("Chat")} className="flex items-center gap-1 text-sm font-semibold text-white hover:text-cyan-300 transition-colors drop-shadow-sm">
                    <MessageCircle className="w-4 h-4" /> Chat
                  </Link>
                </>}
                <Link to={createPageUrl("SejaPrestador")} className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors drop-shadow-sm">Seja um prestador</Link>
                <Link to={createPageUrl("ComoFunciona")} className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors drop-shadow-sm">Como funciona?</Link>
                <Link to="/ComoFunciona#toca-tria" className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors drop-shadow-sm">Toca TrIA</Link>
                <Link to={createPageUrl("GeradorDeImagem")} className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors drop-shadow-sm">Toca Vision</Link>
                <Link to={createPageUrl("Seguranca")} className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors drop-shadow-sm">Segurança</Link>
                <Link to={createPageUrl("Manual")} className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors drop-shadow-sm">Manual</Link>
              </div>

              <div className="flex items-center gap-2">
                {user ?
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 text-slate-100" data-testid="user-menu-trigger">
                        <User className="w-5 h-5" />
                        <span>{user.full_name || user.email}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {user.user_type === 'prestador' &&
                    <Link to={createPageUrl("Dashboard")}>
                          <DropdownMenuItem data-testid="user-menu-dashboard" className="cursor-pointer">Dashboard</DropdownMenuItem>
                        </Link>
                    }
                      <Link to={createPageUrl("MeusPedidos")}>
                        <DropdownMenuItem className="cursor-pointer" data-testid="user-menu-meus-pedidos">
                          <FileText className="w-4 h-4 mr-2" />
                          Meus Pedidos
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => base44.auth.logout()} className="cursor-pointer" data-testid="user-menu-logout">
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> :

                <Button onClick={() => { sessionStorage.setItem('loginTimestamp', Date.now().toString()); base44.auth.redirectToLogin(); }} className="bg-[var(--primary)] text-[var(--text-light)] hover:bg-blue-700" size="sm" data-testid="login-button">
                    Entrar
                  </Button>
                }
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Abrir menu de navegação">
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen &&
            <div className="md:hidden mt-2 pb-4 space-y-2 px-4 bg-slate-700 rounded" data-testid="mobile-menu-content-public">
                {user && <>
                  <Link to={createPageUrl("GeradorDeImagem")} className="block text-base font-semibold text-white hover:text-cyan-300 py-2" onClick={() => setMobileMenuOpen(false)}>
                    <span className="flex items-center gap-2"><Image className="w-4 h-4" /> Toca Vision</span>
                  </Link>
                  <Link to={createPageUrl("Assistentevirtual")} className="block text-base font-semibold text-white hover:text-cyan-300 py-2" onClick={() => setMobileMenuOpen(false)}>
                    <span className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Toca TrIA</span>
                  </Link>
                  <Link to={createPageUrl("Chat")} className="block text-base font-semibold text-white hover:text-cyan-300 py-2" onClick={() => setMobileMenuOpen(false)}>
                    <span className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Minhas Conversas</span>
                  </Link>
                </>}
                <Link to={createPageUrl("SejaPrestador")} className="block text-base font-semibold text-white hover:text-cyan-300 py-2" onClick={() => setMobileMenuOpen(false)}>Seja um prestador</Link>
                <Link to={createPageUrl("ComoFunciona")} className="block text-base font-semibold text-white hover:text-cyan-300 py-2" onClick={() => setMobileMenuOpen(false)}>Como funciona?</Link>
                <Link to="/ComoFunciona#toca-tria" className="block text-base font-semibold text-white hover:text-cyan-300 py-2" onClick={() => setMobileMenuOpen(false)}>Toca TrIA</Link>
                <Link to={createPageUrl("GeradorDeImagem")} className="block text-base font-semibold text-white hover:text-cyan-300 py-2" onClick={() => setMobileMenuOpen(false)}>Toca Vision</Link>
                <Link to={createPageUrl("Seguranca")} className="block text-base font-semibold text-white hover:text-cyan-300 py-2" onClick={() => setMobileMenuOpen(false)}>Segurança</Link>
                <Link to={createPageUrl("Manual")} className="block text-base font-semibold text-white hover:text-cyan-300 py-2" onClick={() => setMobileMenuOpen(false)}>Manual</Link>
                {!user && (
                  <div className="pt-2 border-t border-slate-600">
                    <Button onClick={() => { setMobileMenuOpen(false); sessionStorage.setItem('loginTimestamp', Date.now().toString()); base44.auth.redirectToLogin(); }} className="w-full bg-[var(--primary)] text-white hover:bg-blue-700" size="sm">
                      Entrar
                    </Button>
                  </div>
                )}
              </div>
            }
          </nav>

          {/* Mobile-only top bar: logo on root, back button on sub-pages */}
          {isRoot && (
          <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-slate-800 border-b border-slate-700 flex items-center px-3 h-12" style={{ paddingTop: "env(safe-area-inset-top, 0px)", top: "env(safe-area-inset-top, 0px)" }}>
            <Link to="/" className="flex items-center gap-2">
              <img src="https://media.base44.com/images/public/68eb21726a9614db4a82ba99/866729f3e_trancoso_resolve_logo_principal.png" alt="Trancoso Resolve" className="h-8 w-8" />
              <span className="font-bold text-sm text-slate-100">Trancoso Resolve</span>
            </Link>
          </div>
          )}
          {!isRoot && (
          <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-slate-800 border-b border-slate-700 flex items-center px-3 h-12" style={{ paddingTop: "env(safe-area-inset-top, 0px)", top: "env(safe-area-inset-top, 0px)" }}>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-100 min-w-[44px] min-h-[44px] -ml-1"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Voltar</span>
            </button>
          </div>
          )}

          <main id="main-content" className="pb-24 md:pb-0 pt-12 md:pt-0 md:min-h-screen">{children}</main>

          <footer className="bg-slate-950 text-white py-8 mt-16 pb-safe" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 2rem)" }}>
            <div className="container mx-auto px-4 text-center">
              <div className="flex justify-center gap-4 mb-4 flex-wrap">
                <Link to={createPageUrl("About")} className="text-base font-medium text-slate-200 hover:text-white transition-colors">
                  Sobre
                </Link>
                <Link to={createPageUrl("Contact")} className="text-base font-medium text-slate-200 hover:text-white transition-colors">
                  Contato
                </Link>
                <Link to={createPageUrl("PoliticaPrivacidade")} className="text-base font-medium text-slate-200 hover:text-white transition-colors" data-testid="footer-privacy-link">
                  Política de Privacidade
                </Link>
              </div>
              <p className="text-slate-300 text-base font-medium">
                © 2026 Trancoso Resolve • Plataforma de Serviços em Trancoso • Todos os direitos reservados
              </p>
            </div>
          </footer>
          <Toaster />
          <ConnectionStatus />
          <OfflineIndicator />
          <CookieConsent />
        </div>
        <BottomNav />
        <SupportChat />
        <FeedbackCollector />
        <PWAPrompt />
        <CompletarPerfilModal user={user} open={precisaCompletarPerfil} onClose={() => setPerfilModalFechado(true)} />
      </ErrorBoundary>);

  }

  // Layout administrativo
  return (
    <ErrorBoundary>
      <SkipToContent />
      <RoutePreloader />
      <ImagePreloader />
      <PerformanceMonitor />
      <PageViewTracker />
      <AccessLogger />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 transition-colors">
        <style>{`
          :focus-visible {
            outline: 3px solid #38bdf8 !important;
            outline-offset: 2px !important;
            box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.3) !important;
            border-radius: 4px;
            transition: outline 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
          }
          *:focus:not(:focus-visible) { outline: none; }
          a:not([class]) { text-decoration: underline; text-underline-offset: 2px; }
          .skip-link { position: absolute; top: -40px; left: 0; background: #0A81D1; color: white; padding: 8px 16px; z-index: 100; transition: top 0.3s; }
          .skip-link:focus { top: 0; }
          @media (max-width: 768px) { button, a, [role="button"] { min-height: 44px; min-width: 44px; } }
        `}</style>

        <nav className="bg-slate-800 shadow-sm sticky top-0 z-50" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <Link to={createPageUrl("Dashboard")} className="flex items-center gap-2" data-testid="admin-nav-logo-link">
                <img src="https://media.base44.com/images/public/68eb21726a9614db4a82ba99/607538b94_generated_image.png" alt="Trancoso Resolve Logo" className="h-10" />
                <span className="font-bold text-xl text-slate-100">Trancoso Resolve</span>
              </Link>

              <div className="hidden lg:flex items-center gap-2">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => item.clearLogin && sessionStorage.removeItem('loginTimestamp')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                      isActive(item.path) ?
                      'bg-blue-500 text-white' :
                      'text-slate-300 hover:bg-slate-700'}`
                      }
                      data-testid={`admin-nav-${item.name.toLowerCase().replace(' ', '-')}`}>
                      
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{item.name}</span>
                    </Link>);

                })}
              </div>

              <div className="lg:hidden flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  data-testid="mobile-menu-button"
                  aria-label="Abrir menu de navegação">
                  
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            {mobileMenuOpen &&
            <div className="lg:hidden mt-4 pb-4 space-y-2" data-testid="mobile-menu-content">
                {adminNavItems.map((item) => {
                const Icon = item.icon;
                return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => { setMobileMenuOpen(false); item.clearLogin && sessionStorage.removeItem('loginTimestamp'); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                   isActive(item.path) ?
                   'bg-blue-500 text-white' :
                   'text-slate-300 hover:bg-slate-700'}`
                   }
                  data-testid={`admin-mobile-nav-${item.name.toLowerCase().replace(' ', '-')}`}>
                    
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{item.name}</span>
                    </Link>);

              })}
              </div>
            }
          </div>
        </nav>

        <main id="main-content" className="pb-12">
          {children}
        </main>
        <Toaster />
        <ConnectionStatus />
        <OfflineIndicator />
        <CookieConsent />
      </div>
      <SupportChat />
      <FeedbackCollector />
      <PWAPrompt />
    </ErrorBoundary>);

}