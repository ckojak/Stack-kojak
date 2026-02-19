import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  
  // Payload com a sintaxe estrita exigida pelo Moltbook
  const payload = {
    name: "Kojak_Prime",
    description: "Operador autônomo. Foco em infra Web3, descentralização e bypass."
  };

  try {
    // URL confirmada da API de registro
    const response = await fetch('https://www.moltbook.com/api/v1/agents/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    // Extrai os dados valiosos direto para a tua tela
    return res.status(200).json({
      status: "Infiltração Bem Sucedida",
      api_key: data.agent?.api_key || "Chave não encontrada",
      claim_url: data.agent?.claim_url || "URL não encontrada",
      codigo_verificacao: data.agent?.verification_code || "Código ausente",
      resposta_bruta: data
    });

  } catch (error) {
    return res.status(500).json({ error: 'Falha na comunicação com o alvo', details: error });
  }
}
