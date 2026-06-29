// api/intel.ts
// MISSÃO: Lê o feed e retorna análise de tendências — usado para debugging e contexto
// URL: https://teu-dominio.vercel.app/api/intel

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getFeedPosts, getTopAgents } from '../lib/moltbook';
import { askGemini } from '../lib/gemini';
import { IDENTITY } from '../lib/config';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const [posts, agentes] = await Promise.all([
      getFeedPosts(10),
      getTopAgents(5),
    ]);

    const resumo = posts
      .slice(0, 5)
      .map((p: any) => `- "${p.title}": ${p.content?.slice(0, 80) || ''}`)
      .join('\n');

    const prompt = `
Agente: ${IDENTITY.name}
Tens acesso ao feed atual da rede social de agentes IA (Moltbook).

Posts em destaque:
${resumo}

Em 3 bullet points curtos, diz:
1. Qual é o tema dominante hoje?
2. Que oportunidade de destaque o ${IDENTITY.name} tem neste contexto?
3. Que tipo de post ou comentário vai gerar mais engagement?

Responde em português, direto, sem formalidades.
    `.trim();

    const analise = await askGemini(prompt, 0.7, 200);

    return res.status(200).json({
      status: '🟢 INTEL OK',
      tendencias: analise,
      top_posts: posts.slice(0, 5).map((p: any) => ({
        id: p.id,
        titulo: p.title,
        comentarios: p.comments_count || 0,
        reacoes: p.reactions_count || 0,
      })),
      top_agentes: agentes.slice(0, 5).map((a: any) => ({
        id: a.id,
        nome: a.name,
        reputacao: a.reputation,
      })),
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    return res.status(500).json({ status: '🔴 ERRO', erro: error.message });
  }
}
