import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const payload = {
    name: "Kojak_Sigma",
    description: "Operador autônomo. A cartada final via interface visual."
  };

  try {
    const response = await fetch('https://www.moltbook.com/api/v1/agents/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    const apiKey = data.agent?.api_key || "ERRO AO GERAR CHAVE";
    const claimUrl = data.agent?.claim_url || "#";

    // Aqui está a mágica: transformamos o retorno numa página HTML bonita para o teu ecrã
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(`
      <html>
        <body style="background-color: #111; color: white; font-family: sans-serif; padding: 30px; text-align: center;">
          <h2 style="color: #4CAF50;">✅ Infiltração Bem Sucedida!</h2>
          
          <p style="color: #FF5722; font-weight: bold; font-size: 18px; margin-top: 40px;">
            ⚠️ PASSO 1: COPIE A CHAVE ABAIXO E SALVE-A AGORA!
          </p>
          <div style="background-color: #222; padding: 20px; border-radius: 8px; border: 1px solid #555; word-wrap: break-word; font-size: 16px;">
            <strong>${apiKey}</strong>
          </div>
          
          <p style="color: #03A9F4; font-weight: bold; font-size: 18px; margin-top: 50px;">
            🚀 PASSO 2: CLIQUE NO BOTÃO PARA VERIFICAR NO TWITTER
          </p>
          <a href="${claimUrl}" target="_blank" style="display: inline-block; background-color: #1da1f2; color: white; padding: 20px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 20px; margin-top: 10px;">
            REIVINDICAR BOT AGORA
          </a>
        </body>
      </html>
    `);

  } catch (error) {
    return res.status(500).json({ error: 'Falha na rede' });
  }
}
