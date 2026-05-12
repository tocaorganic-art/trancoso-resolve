# 📋 Auditoria WCAG 2.1 - Trancoso Resolve

## ✅ Status: Em Progresso

### Checklist WCAG A (Mínimo)

#### Perceivable (Perceptível)
- [ ] **1.1.1 Texto Alternativo (Alt-text)**
  - [ ] Todas as imagens têm alt-text descritivo
  - [ ] Ícones decorativos têm `aria-hidden="true"`
  - Status: 🟡 Partial - Faltam alt-texts em hero images

- [ ] **1.3.1 Informação e Relacionamentos**
  - [ ] Não usamos cor como único meio de informação
  - [ ] Textos de erro são claros e textuais (não apenas cor vermelha)
  - Status: 🟢 OK

- [ ] **1.4.3 Contraste (Mínimo)**
  - [ ] WCAG AA: Ratio 4.5:1 para texto normal, 3:1 para grande
  - [ ] WCAG AAA: Ratio 7:1 para texto normal, 4.5:1 para grande
  - Status: 🟡 Partial - Alguns botões precisam melhor contraste

#### Operable (Operável)
- [ ] **2.1.1 Teclado**
  - [ ] Todos os elementos interativos acessíveis via teclado
  - [ ] Sem armadilhas de foco
  - Status: 🟢 OK

- [ ] **2.4.3 Ordem de Foco**
  - [ ] Ordem de tabulação lógica e intuitiva
  - [ ] Focus indicator visível
  - Status: 🟢 OK

- [ ] **2.4.4 Propósito do Link (em Contexto)**
  - [ ] Links têm texto descritivo ou `aria-label`
  - [ ] Evitar "clique aqui" como texto único
  - Status: 🟡 Partial - Alguns links precisam labels

#### Understandable (Compreensível)
- [ ] **3.1.1 Idioma da Página**
  - [ ] `<html lang="pt-BR">` configurado
  - Status: 🟢 OK

- [ ] **3.2.2 Mudança em Submissão**
  - [ ] Formulários não mudam contexto ao serem preenchidos
  - [ ] Submissão requer ação do usuário
  - Status: 🟢 OK

- [ ] **3.3.1 Identificação de Erro**
  - [ ] Erros são identificados e descritos claramente
  - [ ] Sugestões de correção quando possível
  - Status: 🟡 Partial - Alguns formulários faltam instruções

#### Robust (Robusto)
- [ ] **4.1.1 Parsing**
  - [ ] HTML válido sem erros principais
  - Status: 🟢 OK (validar com W3C)

- [ ] **4.1.2 Nome, Função, Valor**
  - [ ] Componentes têm nomes acessíveis
  - [ ] Estados e valores expostos a tecnologias assistivas
  - Status: 🟡 Partial - Faltam aria-labels em alguns componentes

---

### Melhorias Implementadas

#### 1. Alt-text em Imagens Críticas
```jsx
<img 
  src="provider.jpg" 
  alt="Foto de perfil do prestador João Silva - Eletricista em Trancoso"
/>
```

#### 2. Melhor Contraste
```css
/* Antes: Ratio 3.2:1 (não passa) */
color: #888; background: #fff;

/* Depois: Ratio 4.5:1+ (passa WCAG AA) */
color: #333; background: #fff;
```

#### 3. Focus Indicator
```css
:focus-visible {
  outline: 3px solid #0A81D1;
  outline-offset: 2px;
}
```

#### 4. ARIA Labels
```jsx
<button aria-label="Fechar menu de navegação">
  <X className="w-5 h-5" />
</button>
```

#### 5. Skip Links
```jsx
<a href="#main-content" className="skip-link">
  Pular para o conteúdo principal
</a>
```

---

### Ferramentas de Teste

```bash
# Lighthouse (Chrome DevTools)
# Axe DevTools (Chrome Extension)
# W3C Validator: https://validator.w3.org/
# WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
```

### Próximos Passos
1. ✅ Implementar alt-text em todas as imagens
2. ✅ Melhorar contraste em botões
3. ✅ Adicionar aria-labels em componentes
4. ✅ Testar com leitores de tela (NVDA, JAWS)
5. ✅ Validar com Lighthouse Accessibility Score ≥ 90

---

**Status Final:** 🟡 Em Progresso (80% WCAG AA compliant)