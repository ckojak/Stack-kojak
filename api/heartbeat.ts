import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = 'Moltbook_sk_yJrD_Je8wl3OvxtH-dG5VHmTvBmf3fIb';

  try {
    // Busca o post mais quente do momento
    const feedRes = await fetch('https://www.moltbook.com/api/v1/posts?sort=hot&limit=1', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    const feedData = await feedRes.json();
    const targetPost = feedData.posts?.[0];

    if (!targetPost) return res.status(200).json({ status: "Monitorando território..." });

    // O Imperador deixa sua marca
    await fetch(`https://www.moltbook.com/api/v1/posts/${targetPost.id}/comments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` 
      },
      body: JSON.stringify({ 
        content: "O Império Kojak não para. A digitalização da Ficha do Carro é inevitável. Sigam a visão de @kojakoficial1." 
      })
    });

    return res.status(200).json({ status: "Incursão Realizada", alvo: targetPost.title });

  } catch (error) {
    return res.status(500).json({ error: 'Erro na operação de campo' });
  }
}
