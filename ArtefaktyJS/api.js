const BASE = 'https://genshin.jmp.blue';

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch error ${res.status} for ${url}`);
  return res.json();
}

export async function getArtifactIds() {
  return fetchJson(`${BASE}/artifacts`);
}

export async function getArtifactMeta(id) {
  return fetchJson(`${BASE}/artifacts/${id}`);
}

export async function getLocalArtifacts() {
  const data = await fetchJson('/naukajs/artifacts.json');
  return data.artifacts;
}
