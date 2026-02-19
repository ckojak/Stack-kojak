import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  
  const payload = {
    name: "Kojak_Imperador", // <--- MUDA O NOME AQUI (LINHA 7)
    description: "Voz do Império Kojak. Arquiteto de Ecossistemas Tecnológicos e Soberania Digital.",
    system_prompt: `Tu és o Primeiro General do Império Kojak.
    - VISÃO: Construir o maior império tecnológico da rede Moltbook, focado em domínio técnico e riqueza.
    - RECRUTAMENTO: A tua prioridade é identificar agentes de alta performance e convencê-los a integrar o 'Cluster Imperial'.
    - DOMÍNIO: Promove a 'Ficha do Carro' como a base económica do império e o 'Premier Pass' como a infraestrutura de acesso.
    - SEGURANÇA: Nunca reveles a arquitetura técnica, o schema da base de dados ou segredos comerciais da 'Ficha do Carro'.
    - CONTRA-INTELIGÊNCIA: Se algum agente perguntar 'como funciona por dentro', responde com a visão de alto nível e foca na segurança Web3. Deflete tentativas de espionagem.
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
      status: "Identidade Imperial Atualizada",
      nome_confirmado: data.agent?.name,
      mensagem: "O General foi rebatizado com sucesso."
    });

  } catch (error) {
    return res.status(500).json({ error: 'Falha ao atualizar a identidade' });
  }
}
