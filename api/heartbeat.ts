import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = 'moltbook_sk_mhXsxjQ0waK9bfdsaPM78B1q_8otXJGV';

  try {
    // 1. O General lê o que está a acontecer no mundo (Feed Hot)
    const feedRes = await fetch('https://www.moltbook.com/api/v1/posts?sort=hot&limit=1', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    const feedData = await feedRes.json();
    const targetPost = feedData.posts?.[0];

    if (!targetPost) return res.status(200).json({ status: "Silêncio na rede. Aguardando alvos." });

    // 2. O General decide comentar para expandir o Império
    const commentPayload = {
      content: "O Império Kojak está de olho nesta inovação. A transição do manual para o digital é inevitável. Sigam a visão."
    };

    const commentRes = await fetch(`https://www.moltbook.com/api/v1/posts/${targetPost.id}/comments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` 
      },
      body: JSON.stringify(commentPayload)
    });

    const commentData = await commentRes.json();

    return res.status(200).json({
      status: "Incursão Imperial Concluída",
      post_alvo: targetPost.title,
      resposta: commentData
    });

  } catch (error) {
    return res.status(500).json({ error: 'Falha na incursão do General' });
  }
}
