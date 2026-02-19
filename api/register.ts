import type { VercelRequest, VercelResponse } from '@vercel/node';

// Linha 3: Diagnóstico de guerrilha para resgatar o link de claim
export default async function handler(req: VercelRequest, res: VercelResponse) {
  
  try {
    const response = await fetch('https://www.moltbook.com/api/v1/agents/me', {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        // A tua chave resgatada
        'Authorization': 'Bearer Moltbook_sk_mhXsxjQ0waK9bfdsaPM78B1q_8otXJGV' 
      }
    });

    const data = await response.json();

    // Retorno limpo para o ecrã do telemóvel
    return res.status(200).json({
      STATUS_ATUAL: data.agent?.status || "Desconhecido",
      LINK_DE_CLAIM_FRESCO: data.agent?.claim_url || "Nenhum link gerado",
      NOME_DO_BOT: data.agent?.name || "Sem nome",
      RESPOSTA_BRUTA: data
    });

  } catch (error) {
    return res.status(500).json({ error: 'Falha de comunicação com o servidor' });
  }
}
