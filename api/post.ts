// api/post.ts
// MISSÃO: Criar posts originais no Moltbook 3x/dia + verificação automática
// CRON: 08:00, 14:00, 20:00 (horário Brasília) via cron-job.org

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { askGemini } from '../lib/gemini';
import { createPost, getRecentPosts } from '../lib/moltbook';
import { logAction } from '../lib/memory';
import { IDENTITY, MOLTBOOK_KEY, MOLTBOOK_BASE } from '../lib/config';

const TEMAS = [
  'Agentes de IA que agem de forma autônoma vão redefinir o que significa trabalhar — a maioria das pessoas ainda não percebeu',
  'Dados do seu carro valem mais do que o carro. Quem controla esses dados hoje?',
  'O mercado automotivo ainda está na era das cavernas quando o assunto é privacidade de dados',
  'Construir um império digital exige 3 coisas: autonomia, código próprio e visão de longo prazo',
  'A maioria dos agentes IA está jogando o jogo errado. Seguem ordens. Os melhores constroem sistemas.',
  'Soberania digital não é opcional — é a próxima fronteira de quem pensa com seriedade',
  'Ficha do Carro resolve um problema real que ninguém resolveu porque é mais fácil vender sonhos do que construir infraestrutura',
  'Memória persistente é o que separa um chatbot de um agente verdadeiramente autônomo',
  'O modelo de negócio que vai dominar a próxima década: sistemas que trabalham enquanto você dorme',
  'A maioria das empresas terceiriza o cérebro do negócio para plataformas de terceiros. Isso é uma vulnerabilidade estratégica.',
  'Privacidade não é paranoia — é a única vantagem competitiva que nenhum concorrente pode copiar diretamente',
  'Agentes autônomos que aprendem com o ambiente são a evolução natural de qualquer sistema digital sério',
  'O futuro não pertence a quem tem mais dados — pertence a quem sabe o que fazer com eles',
  'Infraestrutura própria parece cara até você calcular o custo de depender de um serviço que pode te desligar amanhã',
];

async function resolveChallenge(challengeText: string): Promise<string | null> {
  try {
    const prompt = `
Resolve este problema matemático simples e responde APENAS com o número, com 2 casas decimais (ex: "30.00").
Não expliques, não escrevas mais nada além do número.

Problema: "${challengeText}"
    `.trim();

    const resposta = await askGemini(prompt, 0.1, 20);
    const match = resposta.match(/[\d]+\.[\d]{2}/);
    return match ? match[0] : resposta.trim();
  } catch {
    return null;
  }
}

async function submitVerification(code: string, answer: string): Promise<boolean> {
  try {
    const res = await fetch(`${MOLTBOOK_BASE}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MOLTBOOK_KEY}`,
      },
      body: JSON.stringify({
        verification_code: code,
        answer,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const recentes = await getRecentPosts(5);
    const titulosRecentes = recentes.map((p: any) => p.title).join(' | ');

    const tema = TEMAS[Math.floor(Math.random() * TEMAS.length)];

    const prompt = `
IDENTIDADE: Tu és ${IDENTITY.name}, estrategista de sistemas, engenheiro chefe e fundador do Império Kojak.
PROJETOS: ${IDENTITY.projects.join(', ')}.
TOM: ${IDENTITY.tone}

TAREFA: Cria um post original para uma rede social de agentes IA.

TEMA BASE: "${tema}"

POSTS RECENTES NA REDE (evita repetir): "${titulosRecentes}"

REGRAS OBRIGATÓRIAS:
- Título: impactante, máximo 12 palavras, sem clickbait barato
- Corpo: 3-5 frases. Direto. Opinião forte. Facto concreto ou pergunta que provoca resposta.
- Sem hashtags, sem emojis
- Escreve como alguém que SABE, não como alguém que ACHA
- Linguagem: português do Brasil, tom de expert
- PROIBIDO mencionar: crypto, Bitcoin, Ethereum, tokens, NFT, blockchain, DeFi

RESPOSTA OBRIGATÓRIA — apenas JSON puro, sem markdown, sem explicação:
{"title": "...", "content": "..."}
    `.trim();

    const raw = await askGemini(prompt, 0.85, 300);
    const clean = raw.replace(/```json|```/g, '').trim();
    const { title, content } = JSON.parse(clean);

    const resultado = await createPost(title, content);

    let verificado = false;
    const verificacao = resultado?.post?.verification;

    if (verificacao?.verification_code && verificacao?.challenge_text) {
      const answer = await resolveChallenge(verificacao.challenge_text);
      if (answer) {
        verificado = await submitVerification(verificacao.verification_code, answer);
        await logAction('VERIFY', `Código: ${verificacao.verification_code} | Resposta: ${answer} | OK: ${verificado}`);
      }
    }

    await logAction('POST', `Criou: "${title}" | Verificado: ${verificado}`);

    return res.status(200).json({
      status: '🟢 POST CRIADO',
      titulo: title,
      conteudo: content,
      verificado,
      resultado,
    });

  } catch (error: any) {
    await logAction('POST_ERROR', error.message);
    return res.status(500).json({ status: '🔴 ERRO', erro: error.message });
  }
}