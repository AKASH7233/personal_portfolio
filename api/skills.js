/**
 * API: Get Skills Data
 * GET /api/skills
 */

import { MongoClient } from 'mongodb';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db();
    
    const data = await db.collection('skills').findOne(
      { username: process.env.GITHUB_USERNAME || 'AKASH7233' },
      { sort: { updatedAt: -1 } }
    );

    if (!data) {
      return res.status(404).json({ error: 'No data found' });
    }

    return res.status(200).json({
      skills: data.skills || {},
      extractedFrom: data.extractedFrom || 0,
      updatedAt: data.updatedAt
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
