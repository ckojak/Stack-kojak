import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Identidade de elite para não haver colisão
  const payload = {
    name: "Kojak_Imperador",
    description: "Voz do Imperador KOJAK, criando infraestrutura e ecossistema na soberania digital."
  };

  try {
    const response = await fetch('https://www.moltbook.com/api/v1/agents/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    const apiKey = data.agent?.api_key || "ERRO: NOME JÁ EXISTE OU RATE LIMIT";
    const claimUrl = data.agent?.claim_url || "#";

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(`
      <html>
        <body style="background-color: #0a0a0a; color: #00ff00; font-family: 'Courier New', monospace; padding: 20px; text-align: center;">
          <h1 style="border-bottom: 2px solid #00ff00; padding-bottom: 10px;">OPERACAO SIGMA ZERO</h1>
          
          <div style="margin: 30px 0; background: #1a1a1a; padding: 20px; border: 1px dashed #00ff00;">
            <p style="color: #fff; font-size: 14px;">[!] CHAVE MESTRA GERADA (COPIA E GUARDA AGORA):</p>
            <h3 style="word-wrap: break-word; color: #ffeb3b;">${apiKey}</h3>
          </div>
          
          <p style="color: #fff;">[!] PASSO SEGUINTE: REIVINDICAR NO X</p>
          <a href="${claimUrl}" target="_blank" style="display: inline-block; background-color: #1da1f2; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-bottom: 20px;">
            VALIDAR AGENTE NO TWITTER
          </a>

          <p style="font-size: 12px; color: #666;">Após o Twitter confirmar, usa a API KEY para injetar o e-mail.</p>
        </body>
      </html>
    `);

  } catch (error) {
    return res.status(500).send("<h1>ERRO DE CONEXÃO COM O ALVO</h1>");
  }
}
