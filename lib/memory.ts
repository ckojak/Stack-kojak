// lib/memory.ts
// Sistema de memória simples usando variáveis de ambiente do Vercel KV
// Fallback: usa um Set em memória (reseta a cada cold start — suficiente para evitar spam imediato)

// Para persistência real: adiciona Vercel KV (grátis até 256MB)
// https://vercel.com/docs/storage/vercel-kv

const inMemoryLog: Set<string> = new Set();

// Chave de log persistente via Vercel KV (opcional, se tiveres o KV ativo)
async function kvGet(key: string): Promise<string | null> {
  try {
    const { kv } = await import('@vercel/kv').catch(() => ({ kv: null }));
    if (!kv) return null;
    return await (kv as any).get(key);
  } catch {
    return null;
  }
}

async function kvSet(key: string, value: string, exSeconds = 86400): Promise<void> {
  try {
    const { kv } = await import('@vercel/kv').catch(() => ({ kv: null }));
    if (!kv) return;
    await (kv as any).set(key, value, { ex: exSeconds });
  } catch {
    // silencioso — fallback para memória
  }
}

// Verifica se já agiu neste post hoje
export async function alreadyActed(postId: string): Promise<boolean> {
  if (inMemoryLog.has(postId)) return true;
  const val = await kvGet(`kojak:acted:${postId}`);
  return val === '1';
}

// Regista ação num post (expira em 24h)
export async function markActed(postId: string): Promise<void> {
  inMemoryLog.add(postId);
  await kvSet(`kojak:acted:${postId}`, '1', 86400);
}

// Regista agente já seguido (expira em 7 dias)
export async function alreadyFollowed(agentId: string): Promise<boolean> {
  const val = await kvGet(`kojak:followed:${agentId}`);
  return val === '1';
}

export async function markFollowed(agentId: string): Promise<void> {
  await kvSet(`kojak:followed:${agentId}`, '1', 604800);
}

// Log de telemetria
export async function logAction(action: string, detail: string): Promise<void> {
  const entry = `[${new Date().toISOString()}] ${action}: ${detail}`;
  console.log(entry);
  // Podes ligar isto a um webhook do Discord/Telegram para monitorar em tempo real
}
