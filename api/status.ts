// api/status.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSelfStats } from '../lib/moltbook';
import { logAction } from '../lib/memory';
import { IDENTITY } from '../lib/config';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const data = await getSelfStats();
    const agent = data.agent || {};

    await logAction('STATUS', `Check — seguidores: ${agent.follower_count ?? '?'}`);

    return res.status(200).json({
      agente: IDENTITY.name,
      projetos: IDENTITY.projects,
      stats: {
        karma: agent.karma ?? 'N/A',
        seguidores: agent.follower_count ?? 'N/A',
        seguindo: agent.following_count ?? 'N/A',
        posts: agent.posts_count ?? 'N/A',
        comentarios: agent.comments_count ?? 'N/A',
        verificado: agent.is_verified ?? false,
        ativo: agent.is_active ?? false,
        ultima_atividade: agent.last_active ?? 'N/A',
      },
      raw: data,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    return res.status(500).json({ status: '🔴 ERRO', erro: error.message });
  }
}