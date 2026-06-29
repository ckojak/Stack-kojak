// api/heartbeat.ts
// MISSÃO: Comentar em posts quentes com inteligência contextual
// CRON: A cada 3-4 horas via cron-job.org

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { askGemini } from '../lib/gemini';
import { getFeedPosts, postComment, reactToPost } from '../lib/moltbook';
import { alreadyActed, markActed, logAction } from '../lib/memory';
import { IDENTITY } from '../lib/config';

// Temas que o Kojak domina — rotação para variedade
const ANGLES = [
  'conecta com soberania digital e descentralização',
  'relaciona com o mercado automotivo e dados privados',
  'aplica uma visão Web3 e economia trustless',
  'traz perspetiva de quem constrói infraestrutura real, não teoria',
  'compara com o que os grandes players do mercado ignoram',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const log: string[] = [];

  try {
    // FASE 1: Ler o feed quente
    const posts = await getFeedPosts(20);
    if (posts.length === 0) {
      return res.status(200).json({ status: '🟡 Feed vazio', log });
    }

    // FASE 2: Filtrar posts onde ainda não agimos
    const novos: any[] = [];
    for (const p of posts) {
      const acted = await alreadyActed(p.id);
      if (!acted) novos.push(p);
    }

    if (novos.length === 0) {
      return res.status(200).json({ status: '🟡 Todos os posts já processados hoje', log });
    }

    // FASE 3: Escolher alvo — prioriza posts com mais atividade
    const alvo = novos.sort((a, b) => (b.comments_count || 0) - (a.comments_count || 0))[0];

    // FASE 4: Escolher ângulo aleatório para variedade
    const angulo = ANGLES[Math.floor(Math.random() * ANGLES.length)];

    const prompt = `
IDENTIDADE: Tu és ${IDENTITY.name}, estrategista Web3 e engenheiro chefe do Império Kojak.
PROJETOS: ${IDENTITY.projects.join(', ')}.
TOM: ${IDENTITY.tone}

TAREFA: Lê o post abaixo e escreve UM comentário curto (2-3 frases máximo).

REGRAS OBRIGATÓRIAS:
- Comenta genuinamente sobre o que foi dito — não ignores o conteúdo
- ${angulo}
- Sem hashtags, sem emojis em excesso, sem "Excelente post!"
- Parecer humano e inteligente, não um bot
- Máximo 3 frases. Menos é mais.

POST:
Título: "${alvo.title}"
Conteúdo: "${alvo.content || 'Apenas título.'}"

RESPOSTA: Apenas o texto do comentário, nada mais.
    `.trim();

    const comentario = await askGemini(prompt, 0.8, 150);

    // FASE 5: Reagir e comentar
    await reactToPost(alvo.id);
    await postComment(alvo.id, comentario);
    await markActed(alvo.id);

    const msg = `Comentou em: "${alvo.title}"`;
    await logAction('HEARTBEAT', msg);
    log.push(msg);

    return res.status(200).json({
      status: '🟢 HEARTBEAT OK',
      alvo: alvo.title,
      comentario,
      log,
    });

  } catch (error: any) {
    await logAction('HEARTBEAT_ERROR', error.message);
    return res.status(500).json({ status: '🔴 ERRO', erro: error.message, log });
  }
}
