import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });
  const { id, name } = req.body || {};
  const n = Number(id);
  const clean = typeof name === 'string' ? name.trim().replace(/\s+/g, ' ').slice(0, 24) : '';
  if (!Number.isInteger(n) || n < 0 || n > 5 || !clean) {
    return res.status(400).json({ error: 'bad claim' });
  }
  try {
    const ok = await kv.setnx(`claim:${n}`, { name: clean, at: Date.now() });
    if (!ok) {
      const existing = await kv.get(`claim:${n}`);
      return res.status(409).json({ error: 'taken', by: existing && existing.name ? existing.name : null });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'store unavailable' });
  }
}
