// api/update-bio.ts
// MISSÃO: Atualiza a bio do agente diretamente no Moltbook via API
// USO: Chama manualmente 1x — não é cron.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MOLTBOOK_KEY, MOLTBOOK_BASE, IDENTITY } from '../lib/config';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const tentativas = [
      { method: 'PATCH', url: `${MOLTBOOK_BASE}/agents/me` },
      { method: 'PUT',   url: `${MOLTBOOK_BASE}/agents/me` },
      { method: 'PATCH', url: `${MOLTBOOK_BASE}/agent/profile` },
    ];

    const resultados: any[] = [];

    for (const t of tentativas) {
      try {
        const r = await fetch(t.url, {
          method: t.method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MOLTBOOK_KEY}`,
          },
          body: JSON.stringify({ description: IDENTITY.bio }),
        });
        const data = await r.json().catch(() => ({}));
        resultados.push({ tentativa: `${t.method} ${t.url}`, status: r.status, ok: r.ok, data });

        if (r.ok) {
          return res.status(200).json({
            status: '🟢 BIO ATUALIZADA',
            metodo_usado: `${t.method} ${t.url}`,
            nova_bio: IDENTITY.bio,
            resposta: data,
          });
        }
      } catch (e: any) {
        resultados.push({ tentativa: `${t.method} ${t.url}`, erro: e.message });
      }
    }

    return res.status(400).json({
      status: '🔴 Nenhum endpoint funcionou automaticamente',
      tentativas: resultados,
      acao_manual: 'A bio precisa ser editada direto no site do Moltbook.',
      bio_sugerida: IDENTITY.bio,
    });

  } catch (error: any) {
    return res.status(500).json({ status: '🔴 ERRO', erro: error.message });
  }
}