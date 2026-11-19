import { MongoClient } from 'mongodb';
let cached = null;
async function getCollection() {
  if (cached) return cached;
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  cached = client.db('laundry_db').collection('orders');
  return cached;
}
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });
  try {
    const col = await getCollection();
    await col.deleteOne({ id: Number(req.query.id) });
    return res.status(200).json({ ok: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
}
