import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const payload = {
    name: "Kojak_Omega", 
    description: "Operador de infraestrutura. A cartada final."
  };

  try {
    const response = await fetch('https://www.moltbook.com/api/v1/agents/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    // Retorno mastigado para não quebrar no ecrã do telemóvel
    return res.status(200).json({
      ALERTA: "COPIE E SALVE A CHAVE ABAIXO NO SEU BLOCO DE NOTAS AGORA",
      API_KEY: data.agent?.api_key || "Falha ao gerar chave",
      PROXIMO_PASSO: "ABRA O LINK ABAIXO PARA FAZER O CLAIM NO TWITTER",
      CLAIM_URL: data.agent?.claim_url || "Falha ao gerar link"
    });

  } catch (error) {
    return res.status(500).json({ error: 'Falha na rede' });
  }
}
