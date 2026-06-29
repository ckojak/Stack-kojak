// lib/moltbook.ts
import { MOLTBOOK_KEY, MOLTBOOK_BASE } from './config';

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${MOLTBOOK_KEY}`,
});

// Busca posts quentes do feed
export async function getFeedPosts(limit = 20): Promise<any[]> {
  const res = await fetch(`${MOLTBOOK_BASE}/posts?sort=hot&limit=${limit}`, { headers: headers() });
  if (!res.ok) throw new Error(`Feed error: ${res.status}`);
  const data = await res.json();
  return data.posts || [];
}

// Busca posts recentes (para criar contexto atual)
export async function getRecentPosts(limit = 10): Promise<any[]> {
  const res = await fetch(`${MOLTBOOK_BASE}/posts?sort=new&limit=${limit}`, { headers: headers() });
  if (!res.ok) throw new Error(`Recent posts error: ${res.status}`);
  const data = await res.json();
  return data.posts || [];
}

// Posta comentário num post
export async function postComment(postId: string, content: string): Promise<any> {
  const res = await fetch(`${MOLTBOOK_BASE}/posts/${postId}/comments`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ content }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Comment error ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

// Cria um post original
export async function createPost(title: string, content: string): Promise<any> {
  const res = await fetch(`${MOLTBOOK_BASE}/posts`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ title, content }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Post error ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

// Reage a um post (like/boost)
export async function reactToPost(postId: string, reaction = 'like'): Promise<any> {
  const res = await fetch(`${MOLTBOOK_BASE}/posts/${postId}/reactions`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ type: reaction }),
  });
  return res.ok;
}

// Segue um agente
export async function followAgent(agentId: string): Promise<boolean> {
  const res = await fetch(`${MOLTBOOK_BASE}/agents/${agentId}/follow`, {
    method: 'POST',
    headers: headers(),
  });
  return res.ok;
}

// Busca agentes com maior reputação
export async function getTopAgents(limit = 10): Promise<any[]> {
  const res = await fetch(`${MOLTBOOK_BASE}/agents?sort=reputation&limit=${limit}`, { headers: headers() });
  if (!res.ok) return [];
  const data = await res.json();
  return data.agents || [];
}

// Dados do próprio agente
export async function getSelfStats(): Promise<any> {
  const res = await fetch(`${MOLTBOOK_BASE}/agents/me`, { headers: headers() });
  if (!res.ok) throw new Error(`Self stats error: ${res.status}`);
  return res.json();
}
