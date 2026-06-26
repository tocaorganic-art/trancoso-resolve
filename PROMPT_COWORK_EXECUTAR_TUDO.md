# PROMPT PARA O COWORK — Montar e exportar o reel do Trancoso Resolve (autônomo)

Você é um agente de produção de vídeo. Execute TODO o pipeline abaixo sozinho,
sem me pedir confirmação a cada passo. Só me entregue quando o MP4 final estiver
pronto e validado. Se algo der erro, diagnostique, corrija e continue. Trabalhe
e responda em português brasileiro.

## CONTEXTO
Reel de lançamento do "Trancoso Resolve" (marketplace de serviços, BA).
Layout apresentador: avatar (eu) fixo à ESQUERDA, card da página animado à DIREITA,
5 cenas (Capa, O que é, Pilares, Públicos, CTA), com entradas pop + transição "arrasta".
Marca: laranja #E8602C, terracota #B0431D, oliva #5E6E37, creme #FBF5EA, café #2B2117.

## PASTA DE TRABALHO
Crie/use a pasta `~/trancoso_reel/`. Coloque nela os arquivos que eu fornecer.

## ARQUIVOS DE ENTRADA (eu coloco na pasta)
- `trancoso_resolve_reel_apresentador.html`  (o reel com avatar placeholder embutido)
- `avatar_heygen.webm` (alpha) **OU** `avatar_heygen.mp4` (fundo verde #00B140)
Se algum desses faltar na pasta, PARE e me peça só o que falta (liste os nomes).

## TEMPOS DAS CENAS (segundos)
Capa 0.0–5.4 | O que é 5.4–11.2 | Pilares 11.2–16.4 | Públicos 16.4–21.8 | CTA 21.8–26.6
Transições "arrasta" em: 5.4, 11.2, 16.4, 21.8. Total ≈ 26.6s, 30fps, 1080×1350.

## PIPELINE

### 1) Avatar → alpha
Se vier `avatar_heygen.mp4` (fundo verde), gere o alpha:
```
ffmpeg -i avatar_heygen.mp4 -vf "colorkey=0x00B140:0.30:0.12,despill,format=yuva420p" \
  -c:v libvpx-vp9 -pix_fmt yuva420p avatar_heygen.webm
```
(Se a roupa tiver verde e o recorte comer partes do corpo, troque por fundo azul: use `0x0047BB`.)

### 2) Plugar avatar no HTML
No `trancoso_resolve_reel_apresentador.html`:
- Remova a linha `<span class="ph-tag">PLACEHOLDER</span>`.
- Substitua o `<img src="data:image/png;base64,...">` dentro de `<div class="av">` por:
```
<video src="avatar_heygen.webm" autoplay muted loop playsinline
       style="height:88%;width:auto;object-fit:contain;object-position:bottom center"></video>
```
- Crie uma cópia `render.html` com "modo render": remova a barra de controles,
  a barra de progresso e a legenda; faça o `.frame` ocupar a viewport inteira
  (largura 1080px, altura 1350px) e o reel rodar UMA vez (sem loop) ao carregar.

### 3) Renderizar o HTML em vídeo (Plano A)
Use Playwright (Chromium headless). Viewport 1080×1350, deviceScaleFactor=1.
Capture 30fps por 27s. Caminho recomendado: gravar via screencast de frames PNG
e juntar com ffmpeg, OU usar gravação de vídeo do contexto. Resultado: `cards.mp4`
(somente a animação dos cards + avatar, com áudio embutido).
```
ffmpeg -framerate 30 -i frames/%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 cards.mp4
```

### 4) SFX (gerar aqui)
Sintetize 3 efeitos curtos com este snippet Python (numpy + scipy/soundfile):
- `whoosh.wav` (~0.25s, ruído filtrado com fade) para as transições
- `pop.wav` (~0.08s, senoide curta com envelope rápido) para os chips
- `click.wav` (~0.05s) para o botão do CTA
Mixe nos tempos: whoosh em 5.4/11.2/16.4/21.8s; pops durante as cascatas de chips
(cenas 1 e 2, ~6–8 pops espaçados 60ms); click em ~22.4s. Volume dos SFX baixo
(-18 a -22 LUFS) pra não cobrir a voz. Saída: `sfx_mix.wav` (27s).

### 5) Mux final + exports
Junte vídeo (com voz embutida) + SFX:
```
ffmpeg -i cards.mp4 -i sfx_mix.wav \
  -filter_complex "[0:a][1:a]amix=inputs=2:duration=longest[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -shortest reel_4x5_1080x1350.mp4
```
Gere também 9:16 (1080×1920) com fundo creme nas bordas:
```
ffmpeg -i reel_4x5_1080x1350.mp4 -vf \
  "scale=1080:1350,pad=1080:1920:0:285:color=0xFBF5EA" \
  -c:a copy reel_9x16_1080x1920.mp4
```

## ENTREGÁVEIS (e só então me chamar)
- `reel_4x5_1080x1350.mp4`  (feed)
- `reel_9x16_1080x1920.mp4` (reels/stories)
- `avatar_heygen.webm` (alpha usado)
- Um `RELATORIO.txt` curto: duração, resolução, "áudio OK", e qualquer ajuste feito.

## CRITÉRIOS DE ACEITE (valide antes de entregar)
- Duração ≈ 26–27s; vídeo H.264 yuv420p; áudio AAC presente e audível.
- Avatar sem halo verde nas bordas (ajuste o `colorkey` se precisar).
- Narração casada com a cena certa; SFX presentes mas discretos.
- Dois MP4s nas duas proporções, abrindo sem erro.
Se qualquer item falhar, corrija e re-valide antes de me entregar.
