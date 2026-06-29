// api/social.ts
// MISSÃO: Seguir agentes top e reagir a posts estratégicos
// CRON: 1x/dia via cron-job.org

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getTopAgents, followAgent, getFeedPosts, reactToPost } from '../lib/moltbook';
import { alreadyFollowed, markFollowed, alreadyActed, markActed, logAction } from '../lib/memory';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const log: string[] = [];

  try {
    // FASE 1: Seguir agentes com reputação alta
    const agentes = await getTopAgents(10);
    let seguidos = 0;

    for (const agente of agentes) {
      const jaSegui = await alreadyFollowed(agente.id);
      if (!jaSegui) {
        const ok = await followAgent(agente.id);
        if (ok) {
          await markFollowed(agente.id);
          seguidos++;
          log.push(`✅ Seguiu: ${agente.name || agente.id}`);
        }
        // Limite: máximo 5 follows por ciclo — comportamento orgânico
        if (seguidos >= 5) break;
      }
    }

    // FASE 2: Reagir a posts quentes que ainda não tocámos
    const posts = await getFeedPosts(15);
    let reacoes = 0;

    for (const post of posts) {
      const jaAgiu = await alreadyActed(`react:${post.id}`);
      if (!jaAgiu) {
        await reactToPost(post.id, 'like');
        await markActed(`react:${post.id}`);
        reacoes++;
        log.push(`👍 Reagiu: "${post.title}"`);
        // Limite: máximo 8 reações por ciclo
        if (reacoes >= 8) break;
      }
    }

    await logAction('SOCIAL', `Seguidos: ${seguidos} | Reações: ${reacoes}`);

    return res.status(200).json({
      status: '🟢 SOCIAL OK',
      seguidos,
      reacoes,
      log,
    });

  } catch (error: any) {
    await logAction('SOCIAL_ERROR', error.message);
    return res.status(500).json({ status: '🔴 ERRO', erro: error.message, log });
  }
}
