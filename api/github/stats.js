/**
 * API: Get GitHub Stats
 * GET /api/github/stats
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
    
    const data = await db.collection('github_stats').findOne(
      { username: process.env.GITHUB_USERNAME || 'AKASH7233' },
      { sort: { fetchedAt: -1 } }
    );

    if (!data) {
      return res.status(404).json({ error: 'No data found' });
    }

    return res.status(200).json({
      followers: data.followers || 0,
      following: data.following || 0,
      publicRepos: data.publicRepos || 0,
      publicGists: data.publicGists || 0,
      bio: data.bio || '',
      company: data.company || '',
      location: data.location || '',
      blog: data.blog || '',
      fetchedAt: data.fetchedAt
    });
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
