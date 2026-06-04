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
import Login from '@/pages/Login';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
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
import PoliticaDevolucoesPage from '@/pages/PoliticaDevolucoes';
import TermosDeServicoPage from '@/pages/TermosDeServico';
import AssinaturaConfirmadaPage from '@/pages/AssinaturaConfirmada';
import SeoDashboard from '@/pages/admin/SeoDashboard';
import ConfiguracaoMarketing from '@/pages/admin/ConfiguracaoMarketing';
import DiaristaTrancoso from '@/pages/servicos/DiaristaTrancoso';
import AdminMetricasPage from '@/pages/AdminMetricas';
import EletricistaTrancoso from '@/pages/servicos/EletricistaTrancoso';
import PiscineiroTrancoso from '@/pages/servicos/PiscineiroTrancoso';
import PedreiroTrancoso from '@/pages/servicos/PedreiroTrancoso';
import PintorTrancoso from '@/pages/servicos/PintorTrancoso';
import JardineiroTrancoso from '@/pages/servicos/JardineiroTrancoso';
import EncanadorTrancoso from '@/pages/servicos/EncanadorTrancoso';
import ChefTrancoso from '@/pages/servicos/ChefTrancoso';
import SegurancaTrancoso from '@/pages/servicos/SegurancaTrancoso';
import MotoristaTrancoso from '@/pages/servicos/MotoristaTrancoso';
import QuadradoTrancoso from '@/pages/servicos/QuadradoTrancoso';
import RioVerdeTrancoso from '@/pages/servicos/RioVerdeTrancoso';
import PitingaTrancoso from '@/pages/servicos/PitingaTrancoso';
import DiaristaPortoSeguro from '@/pages/servicos/DiaristaPortoSeguro';
import EletricistaPortoSeguro from '@/pages/servicos/EletricistaPortoSeguro';
import PiscineiroPortoSeguro from '@/pages/servicos/PiscineiroPortoSeguro';
import CozinheiroPortoSeguro from '@/pages/servicos/CozinheiroPortoSeguro';
import JardineiroPortoSeguro from '@/pages/servicos/JardineiroPortoSeguro';
import PedreiroPortoSeguro from '@/pages/servicos/PedreiroPortoSeguro';
import DiaristaCaraiva from '@/pages/servicos/DiaristaCaraiva';
import EletricistaCaraiva from '@/pages/servicos/EletricistaCaraiva';
import PiscineiroCaraiva from '@/pages/servicos/PiscineiroCaraiva';
import CozinheiroCaraiva from '@/pages/servicos/CozinheiroCaraiva';
import JardineiroCaraiva from '@/pages/servicos/JardineiroCaraiva';
import PedreiroCaraiva from '@/pages/servicos/PedreiroCaraiva';
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
      <Route path="/login" element={<Login />} />

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
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
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
        </Route>
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
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
          <Route path="/Assistentevirtual" element={
            <AnimatedPage><AssistenteVirtualPage /></AnimatedPage>
          } />
        </Route>
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
        <Route path="/PoliticaDevolucoes" element={
          <LayoutWrapper currentPageName="PoliticaDevolucoes">
            <AnimatedPage><PoliticaDevolucoesPage /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/TermosDeServico" element={
          <LayoutWrapper currentPageName="TermosDeServico">
            <AnimatedPage><TermosDeServicoPage /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/AssinaturaConfirmada" element={
          <AnimatedPage><AssinaturaConfirmadaPage /></AnimatedPage>
        } />
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
          <Route path="/admin/seo" element={
            <AnimatedPage><SeoDashboard /></AnimatedPage>
          } />
          <Route path="/admin/marketing" element={
            <AnimatedPage><ConfiguracaoMarketing /></AnimatedPage>
          } />
          <Route path="/admin/metricas" element={
            <LayoutWrapper currentPageName="AdminMetricas">
              <AnimatedPage><AdminMetricasPage /></AnimatedPage>
            </LayoutWrapper>
          } />
        </Route>
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
        <Route path="/servicos/pedreiro-trancoso" element={
          <LayoutWrapper currentPageName="PedreiroTrancoso">
            <AnimatedPage><PedreiroTrancoso /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/servicos/pintor-trancoso" element={
          <LayoutWrapper currentPageName="PintorTrancoso">
            <AnimatedPage><PintorTrancoso /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/servicos/jardineiro-trancoso" element={
          <LayoutWrapper currentPageName="JardineiroTrancoso">
            <AnimatedPage><JardineiroTrancoso /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/servicos/encanador-trancoso" element={
          <LayoutWrapper currentPageName="EncanadorTrancoso">
            <AnimatedPage><EncanadorTrancoso /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/servicos/chef-trancoso" element={
          <LayoutWrapper currentPageName="ChefTrancoso">
            <AnimatedPage><ChefTrancoso /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/servicos/seguranca-trancoso" element={
          <LayoutWrapper currentPageName="SegurancaTrancoso">
            <AnimatedPage><SegurancaTrancoso /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/servicos/motorista-trancoso" element={
          <LayoutWrapper currentPageName="MotoristaTrancoso">
            <AnimatedPage><MotoristaTrancoso /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/servicos/quadrado-trancoso" element={
          <LayoutWrapper currentPageName="QuadradoTrancoso">
            <AnimatedPage><QuadradoTrancoso /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/servicos/rio-verde-trancoso" element={
          <LayoutWrapper currentPageName="RioVerdeTrancoso">
            <AnimatedPage><RioVerdeTrancoso /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/servicos/pitinga-trancoso" element={
          <LayoutWrapper currentPageName="PitingaTrancoso">
            <AnimatedPage><PitingaTrancoso /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/servicos/diarista-porto-seguro" element={
          <LayoutWrapper currentPageName="DiaristaPortoSeguro">
            <AnimatedPage><DiaristaPortoSeguro /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/servicos/eletricista-porto-seguro" element={
          <LayoutWrapper currentPageName="EletricistaPortoSeguro">
            <AnimatedPage><EletricistaPortoSeguro /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/servicos/piscineiro-porto-seguro" element={
          <LayoutWrapper currentPageName="PiscineiroPortoSeguro">
            <AnimatedPage><PiscineiroPortoSeguro /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/servicos/cozinheiro-porto-seguro" element={
          <LayoutWrapper currentPageName="CozinheiroPortoSeguro">
            <AnimatedPage><CozinheiroPortoSeguro /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/servicos/jardineiro-porto-seguro" element={
          <LayoutWrapper currentPageName="JardineiroPortoSeguro">
            <AnimatedPage><JardineiroPortoSeguro /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/servicos/pedreiro-porto-seguro" element={
          <LayoutWrapper currentPageName="PedreiroPortoSeguro">
            <AnimatedPage><PedreiroPortoSeguro /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/servicos/diarista-caraiva" element={
          <LayoutWrapper currentPageName="DiaristaCaraiva">
            <AnimatedPage><DiaristaCaraiva /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/servicos/eletricista-caraiva" element={
          <LayoutWrapper currentPageName="EletricistaCaraiva">
            <AnimatedPage><EletricistaCaraiva /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/servicos/piscineiro-caraiva" element={
          <LayoutWrapper currentPageName="PiscineiroCaraiva">
            <AnimatedPage><PiscineiroCaraiva /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/servicos/cozinheiro-caraiva" element={
          <LayoutWrapper currentPageName="CozinheiroCaraiva">
            <AnimatedPage><CozinheiroCaraiva /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/servicos/jardineiro-caraiva" element={
          <LayoutWrapper currentPageName="JardineiroCaraiva">
            <AnimatedPage><JardineiroCaraiva /></AnimatedPage>
          </LayoutWrapper>
        } />
        <Route path="/servicos/pedreiro-caraiva" element={
          <LayoutWrapper currentPageName="PedreiroCaraiva">
            <AnimatedPage><PedreiroCaraiva /></AnimatedPage>
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