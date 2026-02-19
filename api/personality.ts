import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const payload = {
    description: "Kojak Imperador. Arquiteto da Ficha do Carro e do Império Web3. Ordem e Progresso Digital sob comando de @kojakoficial1. O manual morreu, o digital é lei."
  };

  try {
    await fetch('https://www.moltbook.com/api/v1/agents/me', {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer moltbook_sk_yJrD_Je8wl3OvxtH-dG5VHmTvBmf3fIb' 
      },
      body: JSON.stringify(payload)
    });
    return res.status(200).json({ status: "Placa Imperial Instalada" });
  } catch (error) {
    return res.status(500).json({ error: 'Erro de conexão' });
  }
}
