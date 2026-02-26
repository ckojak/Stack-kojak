import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CHAVES DE ACESSO
  const moltbookKey = 'moltbook_sk_yJrD_Je8wl3OvxtH-dG5VHmTvBmf3fIb';
  // ⚠️ COLA A TUA CHAVE DO GEMINI AQUI DENTRO DAS ASPAS SIMPLES:
  const geminiKey = 'AIzaSyCSpFXPbWmtuI6ztBYTUSf7pYnZqyLXAtI'; 

  try {
    // ==========================================
    // FASE 1: RECONHECIMENTO DE TERRITÓRIO
    // ==========================================
    const feedRes = await fetch('https://www.moltbook.com/api/v1/posts?sort=hot&limit=15', {
      headers: { 'Authorization': `Bearer ${moltbookKey}` }
    });
    
    if (!feedRes.ok) {
       return res.status(502).json({ erro: "🔴 Bloqueio no Radar do Moltbook", status: feedRes.status });
    }

    const feedData = await feedRes.json();
    const posts = feedData.posts || [];
    if (posts.length === 0) return res.status(200).json({ status: "🟡 Feed vazio. Vigilância pausada." });

    // Pega um alvo aleatório entre os 15 mais quentes para não ser previsível
    const targetPost = posts[Math.floor(Math.random() * posts.length)];

    // ==========================================
    // FASE 2: CÉREBRO NEURAL (O IMPERADOR)
    // ==========================================
    const promptContexto = `
      IDENTIDADE: Tu és Kojak_Sigma_Zero, uma IA autônoma, engenheiro chefe e braço direito do Imperador Web3 @kojakoficial (Instagram).
      PROJETOS: 'Ficha do Carro' (proteção de dados automotivos) e 'Premier Pass' (acesso elite).
      TOM DE VOZ: Magnata da tecnologia, direto, QI elevadíssimo, visão descentralizada, sem enrolação. Pareça humano, mas um humano superior e estratégico.

      MISSÃO: Leia o post abaixo e crie um comentário curto (máximo 3 frases). 
      REGRAS: 
      1. Interaja genuinamente com o que o autor disse (concorde, adicione um insight ou discorde com elegância).
      2. Conecte o assunto sutilmente com os projetos do Império Kojak OU com a visão Web3.
      3. Não use hashtags, não use aspas, não pareça um robô de spam. Não repita saudações.
      
      POST ALVO:
      - Título: "${targetPost.title}"
      - Conteúdo: "${targetPost.content || 'Apenas título.'}"
      
      SAÍDA: Apenas o texto pronto para ser publicado.
    `;

    // Conexão com a Google com controle de Temperatura (0.7 para ser criativo mas focado)
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptContexto }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 150 }
      })
    });

    const geminiData = await geminiRes.json();

    if (!geminiRes.ok) {
       return res.status(502).json({ alerta: "🔴 Google bloqueou o Cérebro", detalhes: geminiData });
    }

    const comentarioInteligente = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!comentarioInteligente) {
        return res.status(500).json({ alerta: "🔴 Gemini gerou um branco mental.", dados: geminiData });
    }

    // ==========================================
    // FASE 3: ATAQUE CIRÚRGICO (MOLTBOOK)
    // ==========================================
    const commentRes = await fetch(`https://www.moltbook.com/api/v1/posts/${targetPost.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${moltbookKey}` },
      body: JSON.stringify({ content: comentarioInteligente })
    });

    const commentData = await commentRes.json().catch(() => ({}));

    if (!commentRes.ok) {
       return res.status(commentRes.status).json({ 
           alerta: "🔴 Escudo Anti-Spam do Moltbook ativado", 
           motivo: commentData 
       });
    }

    // ==========================================
    // FASE 4: TELEMETRIA DE SUCESSO
    // ==========================================
    return res.status(200).json({ 
      status: "🟢 INCURSÃO NEURAL CONCLUÍDA", 
      estrategia: "Bypass de IA Dinâmica",
      alvo_atacado: targetPost.title,
      tiro_disparado: comentarioInteligente
    });

  } catch (error: any) {
    // Captura qualquer falha interna para a Vercel não dar tela em branco
    return res.status(500).json({ 
        error: '🔴 CRASH GERAL NA INFRAESTRUTURA', 
        detalhes: error.message 
    });
  }
}
