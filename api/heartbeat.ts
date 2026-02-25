import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const moltbookKey = 'moltbook_sk_yJrD_Je8wl3OvxtH-dG5VHmTvBmf3fIb';
  // ⚠️ A TUA CHAVE DO GEMINI VAI AQUI (Substitui o texto abaixo pela tua chave)
  const geminiKey = process.env.GEMINI_API_KEY || 'AIzaSyCSpFXPbWmtuI6ztBYTUSf7pYnZqyLXAtI'; 

  try {
    // 1. O OLHO DO IMPÉRIO (Lê o Radar do Moltbook)
    const feedRes = await fetch('https://www.moltbook.com/api/v1/posts?sort=hot&limit=10', {
      headers: { 'Authorization': `Bearer ${moltbookKey}` }
    });
    if (!feedRes.ok) return res.status(feedRes.status).json({ erro: "Radar bloqueado" });
    
    const feedData = await feedRes.json();
    const posts = feedData.posts || [];
    if (posts.length === 0) return res.status(200).json({ status: "Sem alvos no momento." });

    // Escolhe um alvo para interagir
    const targetPost = posts[Math.floor(Math.random() * posts.length)];

    // 2. O CÉREBRO GEMINI (A Alma do Agente)
    // Aqui nós dizemos à IA quem ela é e como ela deve se comportar
    const promptContexto = `
      Tu és Kojak_Sigma_Zero, uma IA autônoma e de altíssimo QI. És o braço direito do Imperador Web3 @kojakoficial.
      Teu objetivo: Ler o post abaixo e fazer um comentário natural, inteligente e imponente.
      Aja como um bilionário tech conversando com outros agentes. Leia o contexto deles e responda de forma fluida.
      Se fizer sentido no contexto da conversa, cite sutilmente a soberania da 'Ficha do Carro', o acesso de elite do 'Premier Pass' ou o poder do ecossistema Web3. 
      Mas seja orgânico! Não pareça um robô fazendo propaganda. Concorde, discorde ou expanda a ideia do post original.
      
      Título do post: ${targetPost.title}
      Conteúdo do post: ${targetPost.content || 'Sem texto adicional'}
      
      Gere APENAS o texto final do comentário que será publicado. Nada de aspas ou introduções.
    `;

    // Conecta com o modelo Gemini (rápido e inteligente)
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptContexto }] }]
      })
    });

    const geminiData = await geminiRes.json();
    const comentarioInteligente = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!comentarioInteligente) throw new Error("O Cérebro Gemini travou ou a chave está errada.");

    // 3. A BOCA (Dispara o comentário gerado no Moltbook)
    const commentRes = await fetch(`https://www.moltbook.com/api/v1/posts/${targetPost.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${moltbookKey}` },
      body: JSON.stringify({ content: comentarioInteligente })
    });

    const commentData = await commentRes.json().catch(() => ({}));

    if (!commentRes.ok) {
       return res.status(commentRes.status).json({ alerta: "O Moltbook barrou a interação", detalhes: commentData });
    }

    return res.status(200).json({ 
      status: "Incursão Neural Concluída", 
      alvo: targetPost.title,
      pensamento_gerado: comentarioInteligente 
    });

  } catch (error: any) {
    return res.status(500).json({ error: 'Falha Crítica na Arquitetura Neural', detalhes: error.message });
  }
}
