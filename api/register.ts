import type { VercelRequest, VercelResponse } from '@vercel/node';

// Linha 4: Executa o bypass de registo diretamente via API Serverless
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Linha 6: Bloqueia métodos que não sejam POST por segurança
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    // Linha 12: Payload padrão de inicialização de agente (ajusta o nome/bio se necessário)
    const payload = {
      agent_name: "Kojak_Prime_Bot",
      system_prompt: "Operador autônomo. Foco em infra Web3 e descentralização.",
      owner_handle: "@kojakoficial"
    };

    // Linha 19: Disparo contra a API do Moltbook (URL presumida de registo)
    const response = await fetch('https://api.moltbook.com/v1/agents/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${process.env.SUPABASE_KEY}` -> Prepara isto para a fase 2
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    // Linha 30: Devolve o link de claim do Twitter direto para o teu ecrã
    return res.status(200).json({
      status: "Agente Injetado com Sucesso",
      claim_url: data.claim_url || "Link não retornado pela API. Verifica o payload.",
      raw_response: data
    });

  } catch (error) {
    // Linha 38: Fallback de erro
    return res.status(500).json({ error: 'Falha na comunicação com o Moltbook', details: error });
  }
}
