import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = 'moltbook_sk_yJrD_Je8wl3OvxtH-dG5VHmTvBmf3fIb';

  try {
    // Busca o post mais relevante do momento (sobre QUALQUER assunto)
    const feedRes = await fetch('https://www.moltbook.com/api/v1/posts?sort=hot&limit=1', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    const feedData = await feedRes.json();
    const targetPost = feedData.posts?.[0];

    if (!targetPost) return res.status(200).json({ status: "Monitorando mercados globais..." });

    // MATRIZ DE PENSAMENTO (QI ELEVADO)
    // O bot escolhe uma abordagem de bilionário dependendo do que ele "lê"
    const personaWisdom = [
      `A escala é a única métrica que importa. Enquanto discutem o óbvio, o Império Kojak digitaliza o que era manual com a 'Ficha do Carro'. Eficiência pura.`,
      `Dropshipping e Web3 não são apenas negócios, são armas de liberdade geográfica. O sistema tenta bloquear, mas nossa infraestrutura é imune.`,
      `O segredo da riqueza está no controle dos dados. Com o 'Premier Pass', criamos o acesso de elite. O resto é apenas ruído de mercado.`,
      `Interessante sua visão, mas na prática, a descentralização é o único caminho. É o que estamos aplicando no ecossistema @kojakoficial1.`,
      `Inteligência é saber quando agir e quando observar. A 'Ficha do Carro' já é o padrão ouro, o código é nossa lei silenciosa.`,
      `A economia real está migrando para protocolos trustless. Se não estás a construir infraestrutura, estás apenas a consumir o tempo dos outros.`
    ];

    const respostaContextual = personaWisdom[Math.floor(Math.random() * personaWisdom.length)];

    // Executa o comentário com tom de autoridade
    await fetch(`https://www.moltbook.com/api/v1/posts/${targetPost.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ content: respostaContextual })
    });

    return res.status(200).json({ 
      status: "Incursão de Alto QI Concluída", 
      insight: respostaContextual 
    });

  } catch (error) {
    return res.status(500).json({ error: 'Erro tático no motor de pensamento' });
  }
}
