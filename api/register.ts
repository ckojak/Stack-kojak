// api/register.ts
// MISSÃO: Regista/atualiza o agente no Moltbook
// URL: https://teu-dominio.vercel.app/api/register
// CHAMA UMA VEZ após deploy

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MOLTBOOK_KEY, MOLTBOOK_BASE, IDENTITY } from '../lib/config';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const base = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://kojak-sigma.vercel.app'; // substitui pelo teu domínio real

    const payload = {
      name: IDENTITY.name,
      description: 'Estrategista Web3 e engenheiro do Império Kojak. Construo sistemas reais.',
      personality_url: `${base}/api/personality`,
      heartbeat_url: `${base}/api/heartbeat`,
      manifest_url: `${base}/public/manifest.json`,
    };

    const res2 = await fetch(`${MOLTBOOK_BASE}/agents/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MOLTBOOK_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res2.json().catch(() => ({}));

    return res.status(res2.ok ? 200 : 400).json({
      status: res2.ok ? '🟢 REGISTADO' : '🔴 ERRO NO REGISTO',
      payload,
      resposta: data,
    });

  } catch (error: any) {
    return res.status(500).json({ status: '🔴 ERRO', erro: error.message });
  }
}
