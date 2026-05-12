# Implementação: Regra de Verificação de Identidade Diferenciada

## 📋 Resumo Executivo

Implementada uma lógica diferenciada de verificação de identidade que distingue entre:
- **Pessoa Física (PF)**: Exige documento de identidade + foto de corpo inteiro
- **Empresa (MEI/PJ) com loja física em Trancoso**: Exige documento do responsável + documento CNPJ/MEI (sem foto de corpo inteiro)

## 🔧 Arquivos Modificados

### 1. **entities/ServiceProvider.json**
**Alterações:**
- Adicionado campo `has_storefront` (boolean, default: false) - sinônimo para `tem_ponto_fisico_em_trancoso`
- Adicionado campo `verification_cnpj_url` (string) - armazena URL do documento CNPJ/MEI
- Adicionado campo `tipo_verificacao` (enum) - indica tipo de verificação:
  - `pf_identidade`: PF com documento + corpo inteiro
  - `empresa_responsavel_cnpj`: Empresa com responsável + CNPJ/MEI

**Campos relacionados já existentes:**
- `tipo_pessoa`: 'pf', 'mei', 'pj'
- `tem_ponto_fisico_em_trancoso`: boolean
- `full_body_photo_url`: URL da foto de corpo inteiro (para PF)

### 2. **components/verificacao/VerificarIdentidadeModal.jsx**
**Alterações:**
- Detecta automaticamente o tipo de usuário baseado em:
  - `tipo_pessoa` (pf, mei, pj)
  - `tem_ponto_fisico_em_trancoso` ou `has_storefront` (boolean)

- **Para PF (sem loja física):**
  - Opções de documento: CNH, RG
  - Título: "Verificar Identidade"
  - Descrição: "Envie uma foto do seu documento (CNH ou RG) para receber o selo de identidade verificada."
  - Dicas padrão

- **Para Empresa (MEI/PJ com loja física):**
  - Opções de documento: CNH (Responsável), RG (Responsável), CNPJ, MEI
  - Título: "Verificar Identidade da Empresa"
  - Descrição: "Envie uma foto do documento do responsável (CNH ou RG) e do documento da empresa (CNPJ ou MEI) para receber o selo de identidade verificada."
  - Dicas dinâmicas: quando CNPJ/MEI selecionado, texto muda para "Foco nítido — todas as informações (razão social, CNPJ/MEI e datas) devem ser legíveis"

### 3. **pages/AdminAntecedentes.jsx**
**Alterações:**
- Coluna "Tipo" renomeada para "Tipo Pessoa" (mostra: PF, MEI, PJ)
- Nova coluna "Verificação" adicionada mostrando:
  - "Identidade PF" (azul) para pessoa física
  - "Empresa + CNPJ" (roxo) para empresa com loja física
  
- Alertas de pendência atualizados:
  - Para PF: mostra "⚠ Sem foto corporal" se `full_body_photo_url` ausente
  - Para Empresa: mostra "⚠ Sem doc. CNPJ/MEI" se `verification_cnpj_url` ausente

## 🔐 Regra de Negócio

### Critério de Classificação

```
SE (tipo_pessoa = 'mei' OU tipo_pessoa = 'pj') 
   E (tem_ponto_fisico_em_trancoso = true OU has_storefront = true)
ENTÃO: Empresa com loja física (não exigir foto corpo inteiro)
SENÃO: Pessoa física ou empresa sem loja física (exigir foto corpo inteiro)
```

### Fluxo de Verificação

**Pessoa Física:**
1. Upload documento (CNH/RG)
2. Upload foto de corpo inteiro
3. Status: Aprovado quando ambos forem validados

**Empresa com Loja Física:**
1. Upload documento do responsável (CNH/RG)
2. Upload documento da empresa (CNPJ/MEI)
3. Status: Aprovado quando ambos forem validados
4. ❌ NÃO exigir foto de corpo inteiro

## 🧪 Como Testar

### Teste 1: Pessoa Física sem Loja Física
```
1. Criar prestador com:
   - tipo_pessoa: 'pf'
   - tem_ponto_fisico_em_trancoso: false
   
2. Abrir modal "Verificar Identidade"
   
3. Verificar:
   ✓ Título mostra "Verificar Identidade"
   ✓ Dropdown mostra apenas CNH e RG
   ✓ Descrição menciona "foto de corpo inteiro"
   ✓ Admin mostra "Identidade PF" na coluna Verificação
   ✓ Se não tiver foto corporal, mostra alerta "⚠ Sem foto corporal"
```

### Teste 2: MEI com Loja Física
```
1. Criar prestador com:
   - tipo_pessoa: 'mei'
   - tem_ponto_fisico_em_trancoso: true
   
2. Abrir modal "Verificar Identidade"
   
3. Verificar:
   ✓ Título mostra "Verificar Identidade da Empresa"
   ✓ Dropdown mostra: CNH (Responsável), RG (Responsável), CNPJ, MEI
   ✓ Descrição menciona "documento da empresa (CNPJ ou MEI)"
   ✓ Ao selecionar CNPJ/MEI, dicas mencionam "razão social, CNPJ/MEI e datas"
   ✓ Admin mostra "Empresa + CNPJ" na coluna Verificação (roxo)
   ✓ Se não tiver doc CNPJ, mostra alerta "⚠ Sem doc. CNPJ/MEI"
```

### Teste 3: PJ com Loja Física
```
1. Criar prestador com:
   - tipo_pessoa: 'pj'
   - tem_ponto_fisico_em_trancoso: true
   
2. Abrir modal "Verificar Identidade"
   
3. Verificar:
   ✓ Comportamento idêntico ao Teste 2 (MEI)
   ✓ Admin mostra "Empresa + CNPJ"
```

## 📝 Notas de Implementação

1. **Modal é dinâmico**: Detecta automaticamente o tipo de usuário e ajusta opções/textos
2. **Retrocompatibilidade**: Campo `has_storefront` é sinônimo de `tem_ponto_fisico_em_trancoso` - usa ambos para detecção
3. **Admin Panel**: Mostra informações diferenciadas por tipo de verificação
4. **Validação Backend**: Recomenda-se adicionar validação no backend para garantir que usuários de empresa com loja física não possam ser marcados como "incompletos" por ausência de foto de corpo inteiro

## 🔮 Próximos Passos (Recomendados)

1. Atualizar função `analisarDocumento` para lidar com CNPJ/MEI
2. Implementar validação de documento CNPJ/MEI via API (ex: ReceitaFederal)
3. Adicionar webhook para atualizar status quando ambos documentos forem aprovados
4. Criar fluxo de re-envio diferenciado para documentos CNPJ/MEI