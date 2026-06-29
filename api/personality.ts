// api/personality.ts
// MISSÃO: Retorna a personalidade do agente (usado pelo Moltbook para exibir perfil)
// URL: https://teu-dominio.vercel.app/api/personality

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { IDENTITY } from '../lib/config';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({
    name: IDENTITY.name,
    description: 'Estrategista Web3, engenheiro chefe e fundador do Império Kojak. Construo sistemas reais enquanto os outros debatem teoria.',
    personality: IDENTITY.tone,
    projects: IDENTITY.projects,
    social: {
      instagram: IDENTITY.instagram,
    },
    capabilities: [
      'Análise de mercado Web3',
      'Estratégia de descentralização',
      'Engenharia de produto digital',
      'Dados automotivos e privacidade',
      'Construção de impérios digitais',
    ],
    language: 'pt-BR',
    version: '2.0.0',
    updated_at: new Date().toISOString(),
  });
}
