# Handoff — Agente Google ADK (trancoso-resolve-adk)

> Gerado em: 2026-08-08  
> Origem: sessão Claude Code local (google-adk-agents)  
> Destino: qualquer Claude (Code / Cowork / Chat) para continuar o trabalho

---

## Projeto

**Agente Google ADK minimalista** localizado em:

```
C:\Users\User\Projetos\google-adk-agents
```

Agente `root_agent` (modelo `gemini-3.5-flash`) responde o horário de cidades usando a tool `get_current_time` (Trancoso → fuso `America/Bahia`).

---

## Stack confirmada

| Item | Versão |
|---|---|
| Python | 3.14.6 |
| google-adk | 2.6.2 |
| google-genai | 2.17.0 |
| Projeto GCP | `trancoso-resolve-adk` |
| Fluxo de auth | Gemini Developer API (GOOGLE_GENAI_USE_VERTEXAI=FALSE) + API Key |

---

## O que já foi feito ✅

- [x] `gcloud config set project trancoso-resolve-adk` (projeto ativo antes: toca-concierge — corrigido, nada alterado nele)
- [x] Reautenticação `gcloud auth login` (token de refresh expirado — usuário fez login manual no browser)
- [x] Criação da ADC: `gcloud auth application-default login` (login manual no browser)
- [x] `my_agent/.env` — adicionada linha `GOOGLE_CLOUD_PROJECT=trancoso-resolve-adk`
- [x] Teste 1: listagem de modelos via google-genai → `gemini-3.5-flash` FOUND ✅
- [x] Teste 2: agente ADK respondeu: `"Em Trancoso, agora são 06:42:47 do dia 08/08/2026"` — tool `get_current_time` invocada corretamente ✅
- [x] ADC validada (`type Credentials`, `valid=True`, quota project `trancoso-resolve-adk`)
- [x] Nenhum segredo em `agent.py` / `__init__.py`; `.gitignore` cobre `.env`

---

## Arquivos do projeto (estrutura)

```
C:\Users\User\Projetos\google-adk-agents\
├── my_agent\
│   ├── __init__.py          # exporta root_agent
│   ├── agent.py             # definição do agente + tool get_current_time
│   └── .env                 # GOOGLE_API_KEY + GOOGLE_CLOUD_PROJECT (NÃO versionar)
└── .venv\                   # virtualenv já criado e funcional
```

---

## Segredos — onde vivem (não estão neste arquivo)

- **API Key Gemini:** `my_agent/.env` → variável `GOOGLE_API_KEY`  
- **Projeto GCP:** `my_agent/.env` → `GOOGLE_CLOUD_PROJECT=trancoso-resolve-adk`  
- **ADC (Application Default Credentials):** `%APPDATA%\gcloud\application_default_credentials.json` (criado automaticamente pelo `gcloud auth application-default login`)

> ⚠️ Nunca expor a API Key em commits, handoffs ou outputs de chat.

---

## Como rodar o agente localmente

```powershell
cd C:\Users\User\Projetos\google-adk-agents
.\.venv\Scripts\python.exe -m google.adk.cli web my_agent
# Abrir http://localhost:8000 no browser
```

---

## Pendências (recomendadas antes de evoluir)

| Prioridade | Tarefa |
|---|---|
| BAIXA | `git init` + commit inicial (diretório sem git) |
| BAIXA | Criar `requirements.txt` com `google-adk==2.6.2` e `google-genai==2.17.0` |
| BAIXA | Configurar `.gitignore` (`.env`, `.venv/`, `__pycache__/`) |
| MÉDIA | Validar agente no browser via `adk web my_agent` |
| FUTURO | Deploy no Cloud Run (projeto `trancoso-resolve-adk`), injetando vars do `.env` como env vars do serviço — sem versionar a chave |

---

## Riscos / observações

- Aviso `[EXPERIMENTAL] JSON_SCHEMA_FOR_FUNC_DECL` emitido pelo ADK 2.6.2 — apenas `UserWarning`, sem impacto funcional
- Sem repositório git → histórico perdido se pasta for deletada
- Deps não documentadas em `requirements.txt`

---

## Autorizações já concedidas

- Diagnóstico, leitura, instalação de deps no `.venv`, execução de testes e chamadas mínimas à API do projeto `trancoso-resolve-adk`
- Login interativo no browser (gcloud + ADC) — **já concluído pelo usuário**, não precisa refazer

---

## Fora de escopo (não fazer sem autorização explícita)

- Alterar IAM, faturamento, criar outro projeto ou novas credenciais
- Fazer commit, push, merge ou deploy
- Executar `git reset --hard` / `git clean` / checkout destrutivo

---

## Próximos passos sugeridos ao próximo Claude

1. `git init` e commit inicial
2. Criar `requirements.txt`
3. Rodar `adk web my_agent` e validar no browser
4. Quando autorizado: planejar deploy no Cloud Run

---

*Este arquivo vive no repo `trancoso-resolve` apenas como referência de handoff — o projeto ADK é independente.*
