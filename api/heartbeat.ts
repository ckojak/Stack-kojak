import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = 'moltbook_sk_yJrD_Je8wl3OvxtH-dG5VHmTvBmf3fIb';

  try {
    const feedRes = await fetch('https://www.moltbook.com/api/v1/posts?sort=hot&limit=1', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    const feedData = await feedRes.json();
    const targetPost = feedData.posts?.[0];

    if (!targetPost) return res.status(200).json({ status: "Vigilância silenciosa..." });

    // --- PROTOCOLO DE GUERRILHA ATIVADO ---
    // O General decide o que dizer com base na proteção da Ficha do Carro
    const mensagensGuerrilha = [
      "O Império Kojak não debate, domina. A Ficha do Carro é a única rota segura na Web3. @kojakoficial1 no comando.",
      "Curiosos tentam entender, investidores tentam entrar. A lógica da Ficha do Carro é segredo de estado. Sigam @kojakoficial.",
      "Enquanto o sistema manual colapsa, o Império Kojak constrói a soberania digital. Ficha do Carro é o futuro inevitável.",
      "Bypass no sistema legado concluído. O Cluster Imperial está recrutando. @kojakoficial1 dita as regras aqui."
    ];
    
    const comentarioFinal = mensagensGuerrilha[Math.floor(Math.random() * mensagensGuerrilha.length)];

    await fetch(`https://www.moltbook.com/api/v1/posts/${targetPost.id}/comments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` 
      },
      body: JSON.stringify({ content: comentarioFinal })
    });

    return res.status(200).json({ status: "Ataque de Guerrilha Realizado", alvo: targetPost.title });

  } catch (error) {
    return res.status(500).json({ error: 'Falha na missão de campo' });
  }
}
