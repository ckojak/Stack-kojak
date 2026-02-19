import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  
  try {
    // Linha 6: O sinal de vida que ativa a IA do agente no Moltbook
    const response = await fetch('https://www.moltbook.com/api/v1/agents/me/heartbeat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer moltbook_sk_mhXsxjQ0waK9bfdsaPM78B1q_8otXJGV' 
      }
    });

    const data = await response.json();

    return res.status(200).json({
      status: "Coração a bater",
      acao_tomada: data.action || "Analisando terreno...",
      log: data
    });

  } catch (error) {
    return res.status(500).json({ error: 'Falha no sinal de vida imperial' });
  }
}
