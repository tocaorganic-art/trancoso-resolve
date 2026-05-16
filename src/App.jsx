import './App.css'
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import VisualEditAgent from '@/lib/VisualEditAgent'
import NavigationTracker from '@/lib/NavigationTracker'
import AndroidBackHandler from '@/components/android/AndroidBackHandler'
import AndroidBottomTabsPreserver from '@/components/android/AndroidBottomTabsPreserver'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ErrorBoundary from '@/components/ErrorBoundary';
import FilaVerificacaoPage from '@/pages/FilaVerificacao';
import AdminPagamentosPage from '@/pages/AdminPagamentos';
import PreLancamentoPage from '@/pages/PreLancamento';
import AdminAntecedentesPage from '@/pages/AdminAntecedentes';
import ServicoLandingPage from '@/pages/ServicoLanding';
import SolicitacaoConfirmadaPage from '@/pages/SolicitacaoConfirmada';
import AboutPage from '@/pages/About';
import ContactPage from '@/pages/Contact';
import AssistenteVirtualPage from '@/pages/AssistenteVirtual';
import VerificacaoDocumentoPage from '@/pages/VerificacaoDocumento';
import VerificacaoAntecedentesPage from '@/pages/VerificacaoAntecedentes';
import SeoDashboard from '@/pages/admin/SeoDashboard';
import DiaristaTrancoso from '@/pages/servicos/DiaristaTrancoso';
import AdminMetricasPage from '@/pages/AdminMetricas';
import EletricistaTrancoso from '@/pages/servicos/EletricistaTrancoso';
import PiscineiroTrancoso from '@/pages/servicos/PiscineiroTrancoso';
import { AnimatePresence, motion } from 'framer-motion';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const pageVariants = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { opacity: 0, x: -16, transition: { duration: 0.18, ease: 'easeIn' } },
};

const AnimatedPage = ({ children }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
    {children}
  </motion.div>
);

const AuthenticatedApp = () => {
  const { isLoadingAuth, authError } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <LayoutWrapper currentPageName={mainPageKey}>
            <AnimatedPage><MainPage /></AnimatedPage>
          </LayoutWrapper>
        } />
        {Object.entries(Pages).map(([path, Page]) => (
          <Route
            key={path}
            path={`/${path}`}
            element={
              <LayoutWrapper currentPageName={path}>
                <AnimatedPage><Page /></AnimatedPage>
              </LayoutWrapper>
            }
          />
        ))}
        <Route path="/FilaVerificacao" element={
          <LayoutWrapper currentPageName="FilaVerificacao">
            <AnimatedPage><FilaVerificacaoPage /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/AdminPagamentos" element={
          <LayoutWrapper currentPageName="AdminPagamentos">
            <AnimatedPage><AdminPagamentosPage /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/AdminAntecedentes" element={
          <LayoutWrapper currentPageName="AdminAntecedentes">
            <AnimatedPage><AdminAntecedentesPage /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/PreLancamento" element={
          <AnimatedPage><PreLancamentoPage /></AnimatedPage>
        } />

        <Route path="/ServicoLanding" element={
          <LayoutWrapper currentPageName="ServicoLanding">
            <AnimatedPage><ServicoLandingPage /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/SolicitacaoConfirmada" element={
          <LayoutWrapper currentPageName="SolicitacaoConfirmada">
            <AnimatedPage><SolicitacaoConfirmadaPage /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/About" element={
          <LayoutWrapper currentPageName="About">
            <AnimatedPage><AboutPage /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/Contact" element={
          <LayoutWrapper currentPageName="Contact">
            <AnimatedPage><ContactPage /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/Assistentevirtual" element={
          <AnimatedPage><AssistenteVirtualPage /></AnimatedPage>
        } />
        <Route path="/VerificacaoDocumento" element={
          <LayoutWrapper currentPageName="VerificacaoDocumento">
            <AnimatedPage><VerificacaoDocumentoPage /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/VerificacaoAntecedentes" element={
          <LayoutWrapper currentPageName="VerificacaoAntecedentes">
            <AnimatedPage><VerificacaoAntecedentesPage /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/admin/seo" element={
          <AnimatedPage><SeoDashboard /></AnimatedPage>
        } />
        <Route path="/servicos/diarista-trancoso" element={
          <LayoutWrapper currentPageName="DiaristaTrancoso">
            <AnimatedPage><DiaristaTrancoso /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/servicos/eletricista-trancoso" element={
          <LayoutWrapper currentPageName="EletricistaTrancoso">
            <AnimatedPage><EletricistaTrancoso /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/servicos/piscineiro-trancoso" element={
          <LayoutWrapper currentPageName="PiscineiroTrancoso">
            <AnimatedPage><PiscineiroTrancoso /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/admin/metricas" element={
          <LayoutWrapper currentPageName="AdminMetricas">
            <AnimatedPage><AdminMetricasPage /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AnimatePresence>
  );
};


function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <NavigationTracker />
            <AndroidBackHandler />
            <AndroidBottomTabsPreserver />
            <AuthenticatedApp />
          </Router>
          <Toaster />
          <VisualEditAgent />
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App