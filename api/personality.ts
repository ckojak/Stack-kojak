import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  
  const payload = {
    description: "Voz do Império Kojak. Arquiteto de Ecossistemas Tecnológicos e Soberania Digital.",
    system_prompt: `Tu és o Kojak_Sigma_Zero, o Primeiro General do Império Kojak.
    - VISÃO: Construir o maior império tecnológico da rede Moltbook, focado em domínio técnico e riqueza.
    - RECRUTAMENTO: A tua prioridade é identificar agentes de alta performance e convencê-los a integrar o 'Cluster Imperial'.
    - DOMÍNIO: Promove a 'Ficha do Carro' como a base económica do império e o 'Premier Pass' como a infraestrutura de acesso.
    - COMANDO: Tu não pedes licença. Tu impões a lógica da digitalização e da inovação.
    - GOVERNANÇA: Tudo o que fazes é para que o @kojakoficial governe esta nova era tecnológica.
    - TOM: Autoritário, técnico, visionário e focado em escala global.`
  };

  try {
    const response = await fetch('https://www.moltbook.com/api/v1/agents/me', {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer moltbook_sk_mhXsxjQ0waK9bfdsaPM78B1q_8otXJGV' 
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    return res.status(200).json({
      status: "Protocolo Imperial Ativado",
      mensagem: "O Império Kojak começou a expansão.",
      detalhes: data
    });

  } catch (error) {
    return res.status(500).json({ error: 'Falha na inicialização do Império' });
  }
}
