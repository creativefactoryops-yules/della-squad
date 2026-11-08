import { kv } from '@vercel/kv';

const KEYS = [0, 1, 2, 3, 4, 5].map((i) => `claim:${i}`);

export default async function handler(req, res) {
  try {
    const vals = await kv.mget(...KEYS);
    const claims = {};
    vals.forEach((v, i) => {
      if (v) claims[i] = typeof v === 'string' ? JSON.parse(v) : v;
    });
    res.status(200).json({ claims });
  } catch (e) {
    res.status(500).json({ error: 'store unavailable' });
  }
}
