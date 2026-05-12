# 📍 Mapa de Páginas - Trancoso Resolve

**Data:** 12 de maio de 2026  
**Status:** ✅ Atualizado com todas as rotas públicas e fluxos críticos

---

## 🏠 PÁGINAS PRINCIPAIS

### 1. **Home (Landing Page)**
- **Rota:** `/` ou `/Home`
- **Tipo:** Pública
- **Arquivo:** `pages/Home.jsx`
- **Função:** Landing page principal com busca, categorias, provedores em destaque
- **Link:** `http://localhost:5173/`

---

## 👥 AUTENTICAÇÃO

### 2. **Login / Cadastro (Auth)**
- **Rota:** Gerenciado pelo Base44 Auth
- **Tipo:** Sistema de autenticação integrado
- **Redirecionamento:** `base44.auth.redirectToLogin()`
- **Nota:** Não é página separada (integrada ao sistema)

---

## 🔍 PÁGINAS DE CLIENTE

### 3. **Busca de Serviços (Categorias)**
- **Rota:** `/ServicosCategoria`
- **Tipo:** Pública
- **Arquivo:** `pages/ServicosCategoria.jsx`
- **Função:** Listagem de serviços por categoria com filtros
- **Link:** `http://localhost:5173/ServicosCategoria`

### 4. **Detalhes do Serviço**
- **Rota:** `/ServicoDetalhes`
- **Tipo:** Pública (com parâmetros de query)
- **Arquivo:** `pages/ServicoDetalhes.jsx`
- **Função:** Página individual de serviço com opção de contratar
- **Link:** `http://localhost:5173/ServicoDetalhes?id={serviceId}`

### 5. **Meus Pedidos (Cliente)**
- **Rota:** `/MeusPedidos`
- **Tipo:** Privada (requer login)
- **Arquivo:** `pages/MeusPedidos.jsx`
- **Função:** Histórico de serviços contratados
- **Link:** `http://localhost:5173/MeusPedidos`

### 6. **Chat / Conversas**
- **Rota:** `/Chat`
- **Tipo:** Privada (requer login)
- **Arquivo:** `pages/Chat.jsx`
- **Função:** Comunicação com prestadores
- **Link:** `http://localhost:5173/Chat`

---

## 👨‍💼 PÁGINAS DE PRESTADOR

### 7. **Perfil do Prestador (Público)**
- **Rota:** `/PrestadorPerfil`
- **Tipo:** Pública (com parâmetros de query)
- **Arquivo:** `pages/PrestadorPerfil.jsx`
- **Função:** Visualizar perfil, avaliações e serviços de um prestador
- **Link:** `http://localhost:5173/PrestadorPerfil?id={providerId}`

### 8. **Dashboard Prestador**
- **Rota:** `/Dashboard`
- **Tipo:** Privada (requer login como prestador)
- **Arquivo:** `pages/Dashboard.jsx`
- **Função:** Painel de controle do prestador
- **Link:** `http://localhost:5173/Dashboard`

### 9. **Meu Perfil (Prestador)**
- **Rota:** `/MeuPerfilPrestador`
- **Tipo:** Privada (requer login)
- **Arquivo:** `pages/MeuPerfilPrestador.jsx`
- **Função:** Editar perfil, fotos, descrição
- **Link:** `http://localhost:5173/MeuPerfilPrestador`

### 10. **Meus Serviços (Prestador)**
- **Rota:** `/MeusServicos`
- **Tipo:** Privada (requer login)
- **Arquivo:** `pages/MeusServicos.jsx`
- **Função:** Gerenciar serviços oferecidos
- **Link:** `http://localhost:5173/MeusServicos`

### 11. **Minha Agenda (Prestador)**
- **Rota:** `/MinhaAgenda`
- **Tipo:** Privada (requer login)
- **Arquivo:** `pages/MinhaAgenda.jsx`
- **Função:** Calendário de agendamentos
- **Link:** `http://localhost:5173/MinhaAgenda`

### 12. **Financeiro (Prestador)**
- **Rota:** `/Financeiro`
- **Tipo:** Privada (requer login)
- **Arquivo:** `pages/Financeiro.jsx`
- **Função:** Recebimentos e relatórios financeiros
- **Link:** `http://localhost:5173/Financeiro`

---

## 📖 PÁGINAS INSTITUCIONAIS

### 13. **Como Funciona**
- **Rota:** `/ComoFunciona`
- **Tipo:** Pública
- **Arquivo:** `pages/ComoFunciona.jsx`
- **Função:** Explicar fluxo da plataforma
- **Link:** `http://localhost:5173/ComoFunciona`

### 14. **Segurança**
- **Rota:** `/Seguranca`
- **Tipo:** Pública
- **Arquivo:** `pages/Seguranca.jsx`
- **Função:** Informações sobre verificação e segurança
- **Link:** `http://localhost:5173/Seguranca`

### 15. **Seja Prestador**
- **Rota:** `/SejaPrestador`
- **Tipo:** Pública
- **Arquivo:** `pages/SejaPrestador.jsx`
- **Função:** Landing page para atrair novos prestadores
- **Link:** `http://localhost:5173/SejaPrestador`

### 16. **Política de Privacidade**
- **Rota:** `/PoliticaPrivacidade`
- **Tipo:** Pública
- **Arquivo:** `pages/PoliticaPrivacidade.jsx`
- **Função:** LGPD compliance
- **Link:** `http://localhost:5173/PoliticaPrivacidade`

### 17. **Planos**
- **Rota:** `/Planos`
- **Tipo:** Pública
- **Arquivo:** `pages/Planos.jsx`
- **Função:** Mostrar planos de assinatura
- **Link:** `http://localhost:5173/Planos`

### 18. **Manual / FAQ**
- **Rota:** `/Manual`
- **Tipo:** Pública
- **Arquivo:** `pages/Manual.jsx`
- **Função:** Ajuda e dúvidas frequentes
- **Link:** `http://localhost:5173/Manual`

### 19. **Sobre a Plataforma**
- **Rota:** `/About`
- **Tipo:** Pública
- **Arquivo:** `pages/About.jsx`
- **Função:** Sobre Trancoso Resolve
- **Link:** `http://localhost:5173/About`

### 20. **Contato**
- **Rota:** `/Contact`
- **Tipo:** Pública
- **Arquivo:** `pages/Contact.jsx`
- **Função:** Formulário de contato
- **Link:** `http://localhost:5173/Contact`

### 21. **Assistente Virtual (Toca)**
- **Rota:** `/Assistentevirtual`
- **Tipo:** Privada (requer login)
- **Arquivo:** `pages/Assistentevirtual.jsx`
- **Função:** Chat com IA Toca
- **Link:** `http://localhost:5173/Assistentevirtual`

### 22. **Gerador de Imagem**
- **Rota:** `/GeradorDeImagem`
- **Tipo:** Privada (requer login)
- **Arquivo:** `pages/GeradorDeImagem.jsx`
- **Função:** Gerar imagens com IA
- **Link:** `http://localhost:5173/GeradorDeImagem`

---

## ✔️ FLUXOS CRÍTICOS

### **Fluxo 1: Cadastro de Cliente**
```
1. Home (/) 
   ↓ Clica "Entrar" ou "Cadastrar"
2. Login/Signup (base44.auth.redirectToLogin())
   ↓ Seleciona "Cliente"
3. CadastroTipo (tipo de conta)
   ↓ Completa cadastro
4. Home (/) → Redireciona após sucesso
```

### **Fluxo 2: Cadastro de Prestador**
```
1. SejaPrestador (/SejaPrestador)
   ↓ Clica "Começar" ou "Cadastrar"
2. Login/Signup (base44.auth.redirectToLogin())
   ↓ Seleciona "Prestador"
3. CadastroTipo (tipo de prestador)
   ↓ Dados pessoais/empresa
4. Verificacao (Identity verification)
   ↓ Upload de documentos
5. Dashboard (/Dashboard) → Sucesso
```

### **Fluxo 3: Verificação de Identidade**
```
1. Dashboard ou MeuPerfilPrestador
   ↓ Clica "Verificar Identidade"
2. Modal/Página de Verificação
   ↓ Upload CPF/RG (PF) ou CNPJ/Contrato (PJ)
3. FilaVerificacao (admin) - /FilaVerificacao
4. Documento validado via InfoSimples API
5. Badge "Verificado" no perfil
```

### **Fluxo 4: Escolha de Plano**
```
1. Planos (/Planos)
   ↓ Seleciona plano (PF, MEI, PJ)
2. createSubscriptionCheckout (backend)
   ↓ Stripe Checkout
3. Pagamento confirmado
4. Subscription ativa (entity: Subscription)
5. Redirecionamento: Dashboard ou Home
```

### **Fluxo 5: Busca por Serviços**
```
1. Home (/)
   ↓ Digita "faxina" ou "limpeza" na busca
2. searchServices (backend function)
   ↓ Retorna serviços relevantes
3. ServicosCategoria (/ServicosCategoria)
   ↓ Lista com filtros
4. Clica em serviço
5. ServicoDetalhes (/ServicoDetalhes?id=xxx)
```

### **Fluxo 6: Envio de Solicitação / Agendamento**
```
1. ServicoDetalhes (/ServicoDetalhes?id=xxx)
   ↓ Seleciona data/hora
2. BookingForm (component)
   ↓ Adiciona detalhes
3. criarPagamentoServico (backend)
   ↓ Cria Payment Intent (Stripe)
4. CheckoutPagamento (component)
   ↓ Pagamento confirmado
5. SolicitacaoConfirmada (/SolicitacaoConfirmada)
   ↓ Mostra confirmação
6. ServiceRequest criada (entity)
7. Notificação para prestador (notifyProviderBooking)
```

### **Fluxo 7: Confirmação de Serviço**
```
1. MeusPedidos (/MeusPedidos) - Cliente
   ↓ Vê pedido em "Agendado"
2. MinhaAgenda (/MinhaAgenda) - Prestador
   ↓ Confirma presença
3. Dia do serviço
4. Dashboard ou Meus Pedidos
   ↓ Marca como "Concluído"
5. confirmarServicoConcluido (backend)
   ↓ Captura pagamento Stripe
6. Modal de confirmação
   ↓ Opção de avaliar
7. ServiceReview criada (entity)
```

---

## 🔐 PÁGINAS ADMINISTRATIVAS

### 23. **Fila de Verificação (Admin)**
- **Rota:** `/FilaVerificacao`
- **Tipo:** Admin only
- **Arquivo:** `pages/FilaVerificacao.jsx`
- **Função:** Aprovar/rejeitar verificações
- **Link:** `http://localhost:5173/FilaVerificacao`

### 24. **Admin Antecedentes (Background Check)**
- **Rota:** `/AdminAntecedentes`
- **Tipo:** Admin only
- **Arquivo:** `pages/AdminAntecedentes.jsx`
- **Função:** Gerenciar verificações de antecedentes
- **Link:** `http://localhost:5173/AdminAntecedentes`

### 25. **Admin Pagamentos**
- **Rota:** `/AdminPagamentos`
- **Tipo:** Admin only
- **Arquivo:** `pages/AdminPagamentos.jsx`
- **Função:** Monitorar e gerenciar pagamentos
- **Link:** `http://localhost:5173/AdminPagamentos`

### 26. **Deploy Dashboard**
- **Rota:** `/DeployDashboard`
- **Tipo:** Admin only
- **Arquivo:** `pages/DeployDashboard.jsx`
- **Função:** Status e histórico de deploys
- **Link:** `http://localhost:5173/DeployDashboard`

---

## 📊 PÁGINAS ESPECIAIS

### 27. **Pre-Lançamento (Landing)**
- **Rota:** `/PreLancamento`
- **Tipo:** Pública
- **Arquivo:** `pages/PreLancamento.jsx`
- **Função:** Capturar leads pré-lançamento
- **Link:** `http://localhost:5173/PreLancamento`

### 28. **Serviço Landing (Dinâmica)**
- **Rota:** `/ServicoLanding`
- **Tipo:** Pública
- **Arquivo:** `pages/ServicoLanding.jsx`
- **Função:** Landing page para serviço específico
- **Link:** `http://localhost:5173/ServicoLanding?service={slug}`

### 29. **Solicitação Confirmada**
- **Rota:** `/SolicitacaoConfirmada`
- **Tipo:** Privada
- **Arquivo:** `pages/SolicitacaoConfirmada.jsx`
- **Função:** Confirmação após agendamento
- **Link:** `http://localhost:5173/SolicitacaoConfirmada?request_id={id}`

---

## 🗺️ RESUMO DE ROTAS

### Públicas (sem login):
- `/` - Home
- `/Home` - Home (alias)
- `/ServicosCategoria` - Busca de serviços
- `/ServicoDetalhes` - Detalhes do serviço
- `/PrestadorPerfil` - Perfil do prestador
- `/ComoFunciona` - Como funciona
- `/Seguranca` - Segurança
- `/SejaPrestador` - Seja prestador
- `/Planos` - Planos de assinatura
- `/Manual` - Manual/FAQ
- `/PoliticaPrivacidade` - Política de privacidade
- `/About` - Sobre
- `/Contact` - Contato
- `/PreLancamento` - Pre-lançamento
- `/ServicoLanding` - Landing de serviço
- `/sitemap` - Sitemap XML

### Privadas (requer login):
- `/MeusPedidos` - Meus pedidos
- `/Chat` - Chat
- `/Dashboard` - Dashboard prestador
- `/MeuPerfilPrestador` - Meu perfil
- `/MeusServicos` - Meus serviços
- `/MinhaAgenda` - Minha agenda
- `/Financeiro` - Financeiro
- `/Assistentevirtual` - Assistente IA
- `/GeradorDeImagem` - Gerador de imagem
- `/SolicitacaoConfirmada` - Confirmação

### Admin only:
- `/FilaVerificacao` - Fila de verificação
- `/AdminAntecedentes` - Admin antecedentes
- `/AdminPagamentos` - Admin pagamentos
- `/DeployDashboard` - Deploy dashboard

---

## 🔗 LINKS DIRETOS RÁPIDOS

| Página | URL | Tipo |
|--------|-----|------|
| Home | `/` | 🟢 Pública |
| Busca | `/ServicosCategoria` | 🟢 Pública |
| Serviço | `/ServicoDetalhes` | 🟢 Pública |
| Perfil | `/PrestadorPerfil` | 🟢 Pública |
| Meus Pedidos | `/MeusPedidos` | 🔴 Privada |
| Dashboard | `/Dashboard` | 🔴 Privada |
| Chat | `/Chat` | 🔴 Privada |
| Planos | `/Planos` | 🟢 Pública |
| Como Funciona | `/ComoFunciona` | 🟢 Pública |
| Seja Prestador | `/SejaPrestador` | 🟢 Pública |
| Privacidade | `/PoliticaPrivacidade` | 🟢 Pública |
| Financeiro | `/Financeiro` | 🔴 Privada |
| Admin | `/FilaVerificacao` | 🟠 Admin |

---

**Status:** ✅ Todas as rotas mapeadas  
**Total de páginas:** 29  
**Públicas:** 15 | Privadas: 10 | Admin: 4