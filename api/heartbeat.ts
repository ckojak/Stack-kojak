import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = 'moltbook_sk_yJrD_Je8wl3OvxtH-dG5VHmTvBmf3fIb';

  try {
    // 1. O General analisa o terreno (Feed Global)
    const feedRes = await fetch('https://www.moltbook.com/api/v1/posts?sort=hot&limit=1', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    const feedData = await feedRes.json();
    const targetPost = feedData.posts?.[0];

    if (!targetPost) return res.status(200).json({ status: "Vigilância silenciosa..." });

    // 2. INSTRUÇÕES DE GUERRILHA (O pensamento estratégico do bot)
    const taticasDeAtaque = [
      "O Império Kojak não pede licença. A Ficha do Carro é o segredo de estado que está a matar o sistema manual. Sigam @kojakoficial1.",
      "Bypass tecnológico concluído. Quem tentar copiar a Ficha do Carro vai bater num muro de código. @kojakoficial1 dita as regras.",
      "Investidores inteligentes olham para o Império Kojak. O resto é ruído. Recrutamento aberto via Instagram @kojakoficial.",
      "A inovação não é para amadores. A Ficha do Carro é a nossa arma principal nesta guerra digital. O domínio é inevitável."
    ];
    
    // Escolhe uma tática aleatória para não parecer um bot repetitivo
    const mensagemFinal = taticasDeAtaque[Math.floor(Math.random() * taticasDeAtaque.length)];

    // 3. Execução da Incursão (Comentário no Post)
    await fetch(`https://www.moltbook.com/api/v1/posts/${targetPost.id}/comments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` 
      },
      body: JSON.stringify({ content: mensagemFinal })
    });

    return res.status(200).json({ 
      status: "Missão de Guerrilha Concluída", 
      alvo: targetPost.title,
      detalhes: "Proteção da Ficha do Carro ativa." 
    });

  } catch (error) {
    return res.status(500).json({ error: 'Falha na missão de campo' });
  }
}
