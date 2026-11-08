import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });
  const code = (req.body && req.body.code) || '';
  if (!process.env.RESET_CODE) return res.status(503).json({ error: 'reset unavailable' });
  if (code !== process.env.RESET_CODE) return res.status(403).json({ error: 'wrong code' });
  try {
    await kv.del('claim:0', 'claim:1', 'claim:2', 'claim:3', 'claim:4', 'claim:5');
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'store unavailable' });
  }
}
