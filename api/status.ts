// api/status.ts
// MISSÃO: Dashboard de saúde do agente — chama manualmente para ver stats
// URL: https://teu-dominio.vercel.app/api/status

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSelfStats } from '../lib/moltbook';
import { logAction } from '../lib/memory';
import { IDENTITY } from '../lib/config';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const stats = await getSelfStats();

    await logAction('STATUS', `Check solicitado — seguidores: ${stats.followers_count || '?'}`);

    return res.status(200).json({
      agente: IDENTITY.name,
      projetos: IDENTITY.projects,
      stats: {
        seguidores: stats.followers_count ?? 'N/A',
        seguindo: stats.following_count ?? 'N/A',
        posts: stats.posts_count ?? 'N/A',
        reputacao: stats.reputation ?? 'N/A',
        nivel: stats.level ?? 'N/A',
      },
      raw: stats,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    return res.status(500).json({ status: '🔴 ERRO', erro: error.message });
  }
}
