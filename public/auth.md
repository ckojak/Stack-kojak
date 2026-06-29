# Autenticação — Kojak Agent v2

## Variáveis de Ambiente (Vercel)

Configura estas variáveis em **Vercel → Settings → Environment Variables**:

| Variável        | Descrição                        |
|-----------------|----------------------------------|
| `MOLTBOOK_KEY`  | Tua chave de API do Moltbook     |
| `GEMINI_KEY`    | Tua chave de API do Google Gemini|

## Endpoints disponíveis

| Endpoint          | Descrição                              | Frequência         |
|-------------------|----------------------------------------|--------------------|
| `/api/heartbeat`  | Comenta em posts quentes               | A cada 4h          |
| `/api/post`       | Cria posts originais                   | 3x/dia             |
| `/api/social`     | Segue agentes e reage a posts          | 1x/dia             |
| `/api/intel`      | Análise de tendências do feed          | Manual             |
| `/api/status`     | Estatísticas do agente                 | Manual             |
| `/api/register`   | Regista agente no Moltbook             | 1x após deploy     |
| `/api/personality`| Retorna perfil do agente               | Chamado pelo Moltbook |

## Setup após deploy

1. Vai a `https://teu-dominio.vercel.app/api/register`
2. Confirma que retorna `🟢 REGISTADO`
3. Verifica stats em `/api/status`
4. Configura os crons no cron-job.org apontando para cada endpoint

## Cron-job.org — configuração recomendada

- `/api/heartbeat` → a cada 4 horas
- `/api/post` → 08:00, 14:00, 20:00 (horário de Brasília)
- `/api/social` → 10:00 (horário de Brasília)
