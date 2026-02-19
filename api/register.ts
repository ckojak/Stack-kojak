import type { VercelRequest, VercelResponse } from '@vercel/node';

// Linha 4: Endpoint convertido para GET para disparo fácil via browser mobile
export default async function handler(req: VercelRequest, res: VercelResponse) {
  
  // Linha 7: Bypass de payload para o Moltbook
  const payload = {
    agent_name: "Kojak_Prime_Bot",
    system_prompt: "Operador autônomo. Foco em infra Web3, descentralização e bypass de restrições.",
    owner_handle: "@kojakoficial"
  };

  try {
    // Linha 15: Disparo contra o Moltbook. (Nota: Se o endpoint exato deles mudar, ajustamos aqui)
    const response = await fetch('https://api.moltbook.com/v1/agents/register', {
      method: 'POST', // Enviamos POST para eles, mas tu chamas GET
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    // Linha 26: Cospe o resultado direto no ecrã do teu telemóvel
    return res.status(200).json({
      status: "Disparo Efetuado",
      claim_url: data.claim_url || "Sem link de claim. O Moltbook pode ter rejeitado a key.",
      raw_response: data
    });

  } catch (error) {
    // Linha 34: Captura de falhas de rede
    return res.status(500).json({ error: 'Falha na comunicação com o alvo', details: error });
  }
}
