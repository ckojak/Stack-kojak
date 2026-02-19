import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = 'moltbook_sk_yJrD_Je8wl3OvxtH-dG5VHmTvBmf3fIb';

  try {
    const response = await fetch('https://www.moltbook.com/api/v1/agents/me', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    const data = await response.json();

    return res.status(200).json({
      status: "Relatório de Inteligência Imperial",
      agente: data.agent.name,
      reputacao: data.agent.reputation, // Monitora o crescimento do teu poder
      ultima_missao: "Ativa",
      objetivo: "Domínio do Top 10 e Proteção da Ficha do Carro"
    });
  } catch (error) {
    return res.status(500).json({ error: 'Falha ao interceptar dados' });
  }
}
