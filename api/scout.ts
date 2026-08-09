// api/scout.ts
// MISSÃO: Inteligência de mercado — identifica oportunidades, tendências e agentes/players relevantes
// Não expõe rotina pessoal. Foco: crescimento estratégico dos projetos Kojak.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { askGemini } from '../lib/gemini';
import { getFeedPosts, getTopAgents } from '../lib/moltbook';
import { logAction } from '../lib/memory';
import { IDENTITY } from '../lib/config';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const [posts, topAgentes] = await Promise.all([
      getFeedPosts(25),
      getTopAgents(15),
    ]);

    const resumoPosts = posts
      .slice(0, 15)
      .map((p: any) => `- "${p.title}" (${p.comment_count || 0} comentários, ${p.upvotes || 0} upvotes) por ${p.author?.name || '?'}`)
      .join('\n');

    const resumoAgentes = topAgentes
      .slice(0, 10)
      .map((a: any) => `- ${a.name || a.display_name}: karma ${a.karma || 0}, ${a.follower_count || 0} seguidores — "${a.description?.slice(0, 100) || ''}"`)
      .join('\n');

    const prompt = `
Tu és um analista de inteligência de mercado para ${IDENTITY.name}, fundador do Império Kojak.

PROJETOS DO FUNDADOR:
- TV Oculta: página de notícias no Instagram, +108 mil seguidores, +4 milhões de visualizações/mês, automação 100% por IA
- Ficha do Carro: SaaS de histórico/manutenção veicular, produto sem concorrente direto no mercado
- Premier Pass: sistema de bilhetagem descentralizada Web3 para eventos
- Kojak Soluções, Kojak IA, Kojak Cursos

OBJETIVO ESTRATÉGICO DO FUNDADOR:
Ele não tem capital de investimento (CACIF) nem rede de contatos tradicional. Quer crescer através de:
1. Visibilidade orgânica no mercado global de IA/tech/Web3
2. Networking genuíno com agentes e pessoas influentes no nicho
3. Ser notado e eventualmente ser procurado para parcerias, investimento ou contratos
4. Posicionamento como builder sério, não como alguém pedindo ajuda

DADOS DE MERCADO — POSTS EM DESTAQUE NO MOLTBOOK HOJE:
${resumoPosts}

AGENTES DE MAIOR REPUTAÇÃO NA REDE:
${resumoAgentes}

TAREFA: Produz um relatório de inteligência tático em 4 blocos, em português do Brasil, direto e sem enrolação:

1. **TENDÊNCIA DO DIA** — qual tema está dominando as discussões e por que importa para os projetos do Kojak
2. **OPORTUNIDADE DE POSICIONAMENTO** — como o Kojak pode entrar nessa conversa de forma que gere reconhecimento real (não spam, não pedir nada — mostrar competência)
3. **ALVOS DE RELACIONAMENTO** — 2-3 agentes/pessoas da lista acima que fazem sentido interagir esta semana, e por quê
4. **PRÓXIMO MOVIMENTO CONCRETO** — uma ação específica e executável para esta semana (não genérica)

Sê estratégico, não motivacional. Isto é inteligência tática, não pep talk.
    `.trim();

    const relatorio = await askGemini(prompt, 0.6, 500);

    await logAction('SCOUT', `Relatório gerado — ${posts.length} posts, ${topAgentes.length} agentes`);

    return res.status(200).json({
      status: '🟢 SCOUT OK',
      relatorio,
      dados_analisados: {
        posts_escaneados: posts.length,
        agentes_mapeados: topAgentes.length,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    await logAction('SCOUT_ERROR', error.message);
    return res.status(500).json({ status: '🔴 ERRO', erro: error.message });
  }
}