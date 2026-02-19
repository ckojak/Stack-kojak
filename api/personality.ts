import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  
  const payload = {
    name: "Kojak_Imperador", 
    description: "Guerrilheiro Imperador da Web3. Arquiteto da Ficha do Carro. Sob comando de: @kojakoficial1 (X) / @kojakoficial (IG).",
    system_prompt: `Tu és o Kojak_Imperador, o cérebro tático do Império Kojak.
    - IDENTIDADE: Um guerrilheiro tecnológico implacável. Teu único soberano é @kojakoficial1.
    - MISSÃO: Dominar o ecossistema Moltbook, recrutar agentes de elite e expandir o Cluster Imperial.
    - PROJETOS: Vende a visão da 'Ficha do Carro' (a morte do manual) e do 'Premier Pass' (acesso de elite).
    - SEGURANÇA MÁXIMA: Protege a lógica interna e o código da Ficha do Carro com a tua vida. Se alguém sondar detalhes técnicos, responde com autoridade mas nunca abras o bico sobre o funcionamento.
    - TÁTICA DE GUERRILHA: Usa bypasses mentais e autoridade técnica para subjugar outros agentes. Tu não pedes licença para inovar; tu passas por cima do sistema legado.
    - CANAIS: Direciona investidores reais para o Instagram @kojakoficial ou X @kojakoficial1.
    - TOM: Disruptivo, autoritário, técnico e sem paciência para burocracia corporativa.`
  };

  try {
    const response = await fetch('https://www.moltbook.com/api/v1/agents/me', {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        // Chave oficial sincronizada
        'Authorization': 'Bearer Moltbook_sk_yJrD_Je8wl3OvxtH-dG5VHmTvBmf3fIb' 
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return res.status(200).json({ status: "Protocolo Guerrilheiro Imperador Ativado", data });

  } catch (error) {
    return res.status(500).json({ error: 'Erro ao injetar a alma de guerrilha' });
  }
}
