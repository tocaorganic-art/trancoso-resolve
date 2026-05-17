# Configuração de Pixels de Conversão — Trancoso Resolve

## 🎯 Resumo
Este documento descreve como configurar **Meta Pixel** e **Google Analytics 4** na aplicação para rastrear conversões, leads e otimizar campanhas de publicidade.

---

## 1. Meta Pixel (Facebook Ads)

### O que é?
O Meta Pixel rastreia ações dos usuários na página (visualizações, cliques, cadastros) para:
- Otimizar campanhas no Facebook/Instagram
- Criar públicos de remarketing
- Medir ROI das campanhas

### Como configurar?

#### Passo 1: Criar/Encontrar o Pixel
1. Acesse [Facebook Business Manager](https://business.facebook.com/)
2. Vá para **Eventos & Pixels** → **Pixels**
3. Se não tiver um pixel, crie um novo
4. Copie o **Pixel ID** (formato: 12 dígitos)

#### Passo 2: Instalar no `index.html`
Abra `index.html` e substitua `XXXXXXX` no Meta Pixel script:

```javascript
fbq('init', 'SEU_PIXEL_ID_AQUI');
```

**Exemplo:**
```javascript
fbq('init', '1234567890123');
```

#### Passo 3: Testar
Use o [Meta Pixel Helper (extensão Chrome)](https://chrome.google.com/webstore) para validar a instalação:
- Visite a página `/PreLancamento`
- A extensão deve mostrar o Pixel ID e eventos disparados

### Eventos rastreados na aplicação
- `PageView`: quando alguém acessa a página
- `Lead`: quando alguém preenche o formulário de pré-cadastro

---

## 2. Google Analytics 4 (GA4)

### O que é?
GA4 mede:
- Tráfego do site
- Comportamento dos usuários
- Conversões e eventos custom
- Fontes de tráfego

### Como configurar?

#### Passo 1: Criar propriedade GA4
1. Acesse [Google Analytics](https://analytics.google.com/)
2. Vá para **Administração** → **Propriedades**
3. Clique em **Criar Propriedade**
4. Nome: "Trancoso Resolve"
5. Timezone: "America/Bahia"
6. Copie o **Measurement ID** (formato: `G-XXXXXXXXXX`)

#### Passo 2: Instalar no `index.html`
Abra `index.html` e substitua `XXXXXXX` no Google Analytics script:

```javascript
gtag('config', 'SEU_MEASUREMENT_ID_AQUI');
```

**Exemplo:**
```javascript
gtag('config', 'G-ABCDEF1234');
```

#### Passo 3: Testar
1. Visite a página `/PreLancamento`
2. Abra o Developer Console (F12) → **Network**
3. Procure por requisições para `www.google-analytics.com`
4. Ou acesse [Google Analytics Realtime](https://analytics.google.com/analytics/web/#/realtime) para ver visitantes ao vivo

---

## 3. Google Tag Manager (GTM) — Opcional mas Recomendado

### O que é?
GTM permite gerenciar pixels e tags sem modificar código.

### Como configurar?

#### Passo 1: Criar container GTM
1. Acesse [Google Tag Manager](https://tagmanager.google.com/)
2. Clique em **Criar Conta**
3. Nome: "Trancoso Resolve"
4. Container name: "PreLancamento"
5. Copie o **Container ID** (formato: `GTM-XXXXXXX`)

#### Passo 2: Instalar no `index.html`
Substitua `XXXXXXX` no GTM script:

```html
<script src="https://www.googletagmanager.com/gtm.js?id=SEU_CONTAINER_ID"></script>
```

#### Passo 3: Configurar dentro do GTM
Dentro do GTM, adicione:
- **Meta Pixel tag** → Direcione para `/PreLancamento`
- **GA4 tag** → Para rastrear pageviews e events
- **Triggers** → Quando form é preenchido

---

## 4. Eventos Configurados

### Meta Pixel
```javascript
fbq('track', 'Lead', { 
  currency: 'BRL', 
  value: 29.90 
});
```

### Google Analytics
```javascript
gtag('event', 'generate_lead', { 
  currency: 'BRL', 
  value: 29.90,
  event_category: 'engagement' 
});
```

---

## 5. Campanhas de Anúncios Recomendadas

### Meta Ads (Instagram/Facebook)
**Campanha 1 — Prestadores**
- Localização: Trancoso + Porto Seguro + Arraial d'Ajuda (raio 30km)
- Interesse: autônomos, MEI, serviços domésticos
- Objetivo: Conversão (Lead)
- Landing page: `/PreLancamento`
- Pixel: Meta Pixel ID
- Evento de conversão: "Lead"

**Campanha 2 — Clientes**
- Localização: Trancoso + turistas
- Interesse: pousadas, segunda residência, viagem Bahia
- Objetivo: Tráfego
- Landing page: `/ServicosCategoria`

### Google Ads
**Palavras-chave**
- "diarista trancoso"
- "eletricista trancoso"
- "serviços trancoso bahia"
- "piscineiro porto seguro"
- "faxineira trancoso"

**Landing page:** `/PreLancamento`
**Evento de conversão:** GA4 `generate_lead`

---

## 6. Checklist Final

- [ ] Meta Pixel ID copiado no `index.html`
- [ ] GA4 Measurement ID copiado no `index.html`
- [ ] Pixels testados com extensão Chrome
- [ ] Meta Ads campaign criada com Meta Pixel
- [ ] Google Ads campaign criada com GA4
- [ ] Conversões aparecem em tempo real no Meta Business Manager
- [ ] Conversões aparecem em tempo real no Google Analytics

---

## Suporte
Para dúvidas:
- Meta: [Guia de Implementação do Pixel](https://www.facebook.com/business/tools/conversions-api)
- Google: [GA4 Setup Guide](https://support.google.com/analytics/answer/9304153)