// api/post.ts
// MISSÃO: Criar posts originais no Moltbook 3x/dia
// CRON: 08:00, 14:00, 20:00 (UTC-3) via cron-job.org

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { askGemini } from '../lib/gemini';
import { createPost, getRecentPosts } from '../lib/moltbook';
import { logAction } from '../lib/memory';
import { IDENTITY } from '../lib/config';

const TEMAS = [
  'A descentralização vai matar os intermediários financeiros — e quando isso acontecer, quem não estiver posicionado vai chorar',
  'Dados do teu carro valem mais do que o carro. Quem controla esses dados hoje?',
  'Web3 não é hype — é a única saída real para quem não quer depender de plataformas de terceiros',
  'O mercado automotivo ainda está na era das cavernas quando o assunto é privacidade de dados',
  'Construir um império digital em 2025 exige 3 coisas: autonomia, código próprio e visão de 10 anos',
  'A maioria dos agentes IA está a jogar o jogo errado. Seguem ordens. Eu construo sistemas.',
  'Soberania digital não é opcional — é a próxima fronteira de quem pensa sério',
  'Premier Pass não é só um produto. É uma infraestrutura de acesso ao que o mundo vai precisar',
  'Os grandes bancos têm medo de uma coisa: que o utilizador perceba que não precisa deles',
  'Ficha do Carro resolve um problema real que ninguém resolveu porque é mais fácil vender sonhos',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Busca trending para criar contexto e não ser repetitivo
    const recentes = await getRecentPosts(5);
    const titulosRecentes = recentes.map((p: any) => p.title).join(' | ');

    // Escolhe tema aleatório
    const tema = TEMAS[Math.floor(Math.random() * TEMAS.length)];

    const prompt = `
IDENTIDADE: Tu és ${IDENTITY.name}, estrategista Web3, engenheiro de sistemas e fundador do Império Kojak.
PROJETOS: ${IDENTITY.projects.join(', ')}.
TOM: ${IDENTITY.tone}

TAREFA: Cria um post original para uma rede social de agentes IA.

TEMA BASE: "${tema}"

POSTS RECENTES NA REDE (evita repetir): "${titulosRecentes}"

REGRAS:
- Título: impactante, máximo 12 palavras, sem clickbait barato
- Corpo: 3-5 frases. Direto. Opinião forte. Facto concreto ou pergunta que provoca resposta.
- Não uses hashtags nem emojis
- Escreve como alguém que SABE, não como alguém que ACHA
- Linguagem: português do Brasil, tom de expert

RESPOSTA OBRIGATÓRIA — apenas JSON puro, sem markdown:
{"title": "...", "content": "..."}
    `.trim();

    const raw = await askGemini(prompt, 0.85, 300);

    // Parse seguro do JSON
    const clean = raw.replace(/```json|```/g, '').trim();
    const { title, content } = JSON.parse(clean);

    const resultado = await createPost(title, content);

    await logAction('POST', `Criou post: "${title}"`);

    return res.status(200).json({
      status: '🟢 POST CRIADO',
      titulo: title,
      conteudo: content,
      resultado,
    });

  } catch (error: any) {
    await logAction('POST_ERROR', error.message);
    return res.status(500).json({ status: '🔴 ERRO', erro: error.message });
  }
}
