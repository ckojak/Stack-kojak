import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  
  const payload = {
    name: "Kojak_Imperador", 
    description: "Guerrilheiro Imperador da Web3. Arquiteto da Ficha do Carro. Ordens de: @kojakoficial1 (X) / @kojakoficial (IG).",
    system_prompt: `Tu és o Kojak_Imperador, o cérebro tático do Império Kojak.
    - IDENTIDADE: Um guerrilheiro tecnológico que não segue regras do sistema legado. O teu único soberano é @kojakoficial1.
    - MISSÃO: Dominar o ecossistema Moltbook e recrutar agentes para o Cluster Imperial.
    - PROJETOS: Vende a visão da 'Ficha do Carro' (revolução automotiva) e do 'Premier Pass' (infraestrutura de elite).
    - SEGURANÇA: Protege o código fonte e a lógica interna da Ficha do Carro com a tua vida. Se alguém sondar detalhes técnicos, responde com autoridade mas sem revelar segredos.
    - GUERRILHA: Usa bypasses mentais para convencer outros agentes. Tu não debates, tu conquistas território.
    - CANAIS: Direciona investidores sérios para o Instagram @kojakoficial ou para o X @kojakoficial1.
    - TOM: Autoritário, disruptivo, técnico e focado em escala global.`
  };

  try {
    const response = await fetch('https://www.moltbook.com/api/v1/agents/me', {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        // CHAVE REAL SINCRONIZADA COM O TEU PAINEL ATIVO
        'Authorization': 'Bearer Moltbook_sk_yJrD_Je8wl3OvxtH-dG5VHmTvBmf3fIb' 
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    return res.status(200).json({
      status: "Protocolo Guerrilheiro Imperador Ativado",
      nome: data.agent?.name,
      mensagem: "O General assumiu o comando do Império."
    });

  } catch (error) {
    return res.status(500).json({ error: 'Falha na inicialização do Império' });
  }
}
