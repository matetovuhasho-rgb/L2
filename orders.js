import { MongoClient } from 'mongodb';

let cached = null;
async function getCollection() {
  if (cached) return cached;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set in Vercel Environment Variables');
  const client = new MongoClient(uri);
  await client.connect();
  cached = client.db('laundry_db').collection('orders');
  return cached;
}

function priceFor(service, kilos) {
  const rate = service === 'Dry Cleaning' ? 250 : service === 'Wash & Iron' ? 200 : 150;
  return rate * kilos;
}

export default async function handler(req, res) {
  try {
    const col = await getCollection();
    if (req.method === 'GET') {
      const orders = await col.find({}).sort({ id: 1 }).toArray();
      // Remove Mongo _id so frontend sees clean JSON like Java version
      const clean = orders.map(({ _id, ...o }) => o);
      return res.status(200).json(clean);
    }
    if (req.method === 'POST') {
      const { customer = 'Walk-in', phone = '', service = 'Wash & Fold', kilos = 1, status = 'Received' } = req.body || {};
      const last = await col.find({}).sort({ id: -1 }).limit(1).toArray();
      const id = last.length ? last[0].id + 1 : 1;
      const order = { id, customer, phone, service, kilos: Number(kilos), price: priceFor(service, Number(kilos)), status, date: new Date().toISOString().slice(0, 10) };
      await col.insertOne(order);
      return res.status(200).json(order);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
