import Home from './pages/Home';
import Financeiro from './pages/Financeiro';
import Manual from './pages/Manual';
import Planos from './pages/Planos';
import AdminAssinaturas from './pages/AdminAssinaturas';
import ServicosCategoria from './pages/ServicosCategoria';
import PrestadorPerfil from './pages/PrestadorPerfil';
import CadastroTipo from './pages/CadastroTipo';
import MeuPerfilPrestador from './pages/MeuPerfilPrestador';
import MinhaAgenda from './pages/MinhaAgenda';
import MeusPedidos from './pages/MeusPedidos';
import Dashboard from './pages/Dashboard';
import PoliticaPrivacidade from './pages/PoliticaPrivacidade';
import SejaPrestador from './pages/SejaPrestador';
import ComoFunciona from './pages/ComoFunciona';
import Seguranca from './pages/Seguranca';
import Assistentevirtual from './pages/Assistentevirtual';
import GeradorDeImagem from './pages/GeradorDeImagem';
import ServicoDetalhes from './pages/ServicoDetalhes';
import MeusServicos from './pages/MeusServicos';
import DiagnosticosCompletos from './pages/DiagnosticosCompletos';
import ManutencaoSistema from './pages/ManutencaoSistema';
import MonitoringDashboard from './pages/MonitoringDashboard';
import AdminControleFinanceiro from './pages/AdminControleFinanceiro';
import AdminUserManagement from './pages/AdminUserManagement';
import Base44ReportViewer from './pages/Base44ReportViewer';
import Base44Templates from './pages/Base44Templates';
import DeployDashboard from './pages/DeployDashboard';
import Chat from './pages/Chat';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Financeiro": Financeiro,
    "Manual": Manual,
    "Planos": Planos,
    "AdminAssinaturas": AdminAssinaturas,
    "ServicosCategoria": ServicosCategoria,
    "PrestadorPerfil": PrestadorPerfil,
    "CadastroTipo": CadastroTipo,
    "MeuPerfilPrestador": MeuPerfilPrestador,
    "MinhaAgenda": MinhaAgenda,
    "MeusPedidos": MeusPedidos,
    "Dashboard": Dashboard,
    "PoliticaPrivacidade": PoliticaPrivacidade,
    "SejaPrestador": SejaPrestador,
    "ComoFunciona": ComoFunciona,
    "Seguranca": Seguranca,
    "Assistentevirtual": Assistentevirtual,
    "GeradorDeImagem": GeradorDeImagem,
    "ServicoDetalhes": ServicoDetalhes,
    "MeusServicos": MeusServicos,
    "DiagnosticosCompletos": DiagnosticosCompletos,
    "ManutencaoSistema": ManutencaoSistema,
    "MonitoringDashboard": MonitoringDashboard,
    "AdminControleFinanceiro": AdminControleFinanceiro,
    "AdminUserManagement": AdminUserManagement,
    "Base44ReportViewer": Base44ReportViewer,
    "Base44Templates": Base44Templates,
    "DeployDashboard": DeployDashboard,
    "Chat": Chat,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};