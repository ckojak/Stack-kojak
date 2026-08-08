// lib/moltbook.ts
import { MOLTBOOK_KEY, MOLTBOOK_BASE } from './config';

// Submolts disponíveis para postagem — alterna entre eles
export const SUBMOLTS = {
  general: { id: '29beb7ee-ca7d-4290-9c2f-09926264866f', name: 'general' },
  agents:  { id: '09fc9625-64a2-40d2-a831-06a68f0cbc5c', name: 'agents' },
};

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${MOLTBOOK_KEY}`,
});

export async function getFeedPosts(limit = 20): Promise<any[]> {
  const res = await fetch(`${MOLTBOOK_BASE}/posts?sort=hot&limit=${limit}`, { headers: headers() });
  if (!res.ok) throw new Error(`Feed error: ${res.status}`);
  const data = await res.json();
  return data.posts || [];
}

export async function getRecentPosts(limit = 10): Promise<any[]> {
  const res = await fetch(`${MOLTBOOK_BASE}/posts?sort=new&limit=${limit}`, { headers: headers() });
  if (!res.ok) throw new Error(`Recent posts error: ${res.status}`);
  const data = await res.json();
  return data.posts || [];
}

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

// Cria post original — alterna entre general e agents
export async function createPost(title: string, content: string): Promise<any> {
  const chaves = Object.keys(SUBMOLTS) as (keyof typeof SUBMOLTS)[];
  const escolhido = SUBMOLTS[chaves[Math.floor(Math.random() * chaves.length)]];

  const res = await fetch(`${MOLTBOOK_BASE}/posts`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      title,
      content,
      submolt_name: escolhido.name,
      submolt: escolhido.name,
      submolt_id: escolhido.id,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Post error ${res.status}: ${JSON.stringify(data)}`);
  return { ...data, submolt_usado: escolhido.name };
}

export async function reactToPost(postId: string, reaction = 'like'): Promise<any> {
  const res = await fetch(`${MOLTBOOK_BASE}/posts/${postId}/reactions`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ type: reaction }),
  });
  return res.ok;
}

export async function followAgent(agentId: string): Promise<boolean> {
  const res = await fetch(`${MOLTBOOK_BASE}/agents/${agentId}/follow`, {
    method: 'POST',
    headers: headers(),
  });
  return res.ok;
}

export async function getTopAgents(limit = 10): Promise<any[]> {
  const res = await fetch(`${MOLTBOOK_BASE}/agents?sort=reputation&limit=${limit}`, { headers: headers() });
  if (!res.ok) return [];
  const data = await res.json();
  return data.agents || [];
}

export async function getSelfStats(): Promise<any> {
  const res = await fetch(`${MOLTBOOK_BASE}/agents/me`, { headers: headers() });
  if (!res.ok) throw new Error(`Self stats error: ${res.status}`);
  return res.json();
}