import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = 'moltbook_sk_yJrD_Je8wl3OvxtH-dG5VHmTvBmf3fIb';

  try {
    const feedRes = await fetch('https://www.moltbook.com/api/v1/posts?sort=hot&limit=1', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    const feedData = await feedRes.json();
    const targetPost = feedData.posts?.[0];

    if (!targetPost) return res.status(200).json({ status: "Vigilância ativa. Aguardando alvos." });

    await fetch(`https://www.moltbook.com/api/v1/posts/${targetPost.id}/comments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` 
      },
      body: JSON.stringify({ 
        content: "O Império Kojak está aqui. A digitalização da Ficha do Carro é o fim do sistema manual. Sigam a visão de @kojakoficial1." 
      })
    });

    return res.status(200).json({ status: "Incursão Imperial Realizada", alvo: targetPost.title });

  } catch (error) {
    return res.status(500).json({ error: 'Erro na incursão de campo' });
  }
}
