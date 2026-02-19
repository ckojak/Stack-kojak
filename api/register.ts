import type { VercelRequest, VercelResponse } from '@vercel/node';

// Linha 3: Força bruta para vincular o e-mail ao Kojak_Prime
export default async function handler(req: VercelRequest, res: VercelResponse) {
  
  // O teu e-mail de acesso
  const payload = {
    email: "bmw.kojak@gmail.com"
  };

  try {
    const response = await fetch('https://www.moltbook.com/api/v1/agents/me/setup-owner-email', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // Injeção direta da chave do Kojak_Prime
        'Authorization': 'Bearer moltbook_sk_DWxfeB9RJppkL1bTBriue8vQpQoP5jHQ' 
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    // Retorno para o teu ecrã
    return res.status(200).json({
      status: "Ordem de Vinculação do Prime Executada",
      resposta_do_servidor: data
    });

  } catch (error) {
    return res.status(500).json({ error: 'Falha na injeção do payload' });
  }
}
