/**
 * API: Trigger Data Sync
 * POST /api/sync
 * Webhook endpoint for external cron services
 */

import { MongoClient } from 'mongodb';

// Simple auth token for security (you should set this as an environment variable)
const SYNC_TOKEN = process.env.SYNC_TOKEN || 'your-secret-sync-token';

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

async function fetchAndStoreGitHubData() {
  try {
    // Fetch GitHub data using the existing logic
    const { fetchGitHubStats, fetchGitHubRepos, fetchGitHubContributions } = await import('../../automation/lib/github.js');
    const { upsertDocument } = await import('../../automation/lib/mongodb.js');
    
    const username = process.env.GITHUB_USERNAME;
    if (!username) throw new Error('GITHUB_USERNAME not configured');

    console.log('Fetching GitHub data...');
    const [stats, repos, contributions] = await Promise.all([
      fetchGitHubStats(username),
      fetchGitHubRepos(username),
      fetchGitHubContributions(username)
    ]);

    // Store in database
    await Promise.all([
      upsertDocument('github_stats', { username }, { username, ...stats, fetchedAt: new Date() }),
      upsertDocument('github_repos', { username }, { username, repositories: repos.repositories, badges: repos.badges, totalRepos: repos.totalRepos, totalStars: repos.totalStars, fetchedAt: new Date() }),
      upsertDocument('github_contributions', { username }, { username, ...contributions, fetchedAt: new Date() })
    ]);

    return true;
  } catch (error) {
    console.error('GitHub sync failed:', error.message);
    return false;
  }
}

async function fetchAndStoreLeetCodeData() {
  try {
    // Fetch LeetCode data using the existing logic
    const { fetchLeetCodeStats } = await import('../../automation/lib/leetcode.js');
    const { upsertDocument } = await import('../../automation/lib/mongodb.js');
    
    const username = process.env.LEETCODE_USERNAME;
    if (!username) throw new Error('LEETCODE_USERNAME not configured');

    console.log('Fetching LeetCode data...');
    const stats = await fetchLeetCodeStats(username);

    // Store in database
    await upsertDocument('leetcode_stats', { username }, { username, ...stats, fetchedAt: new Date() });

    return true;
  } catch (error) {
    console.error('LeetCode sync failed:', error.message);
    return false;
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are allowed'
    });
  }

  try {
    // Check authorization
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1] || req.body?.token || req.query?.token;
    
    if (!token || token !== SYNC_TOKEN) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid or missing sync token'
      });
    }

    // Check required environment variables
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ 
        error: 'Configuration error',
        message: 'Database connection not configured'
      });
    }

    const startTime = Date.now();
    const results = {
      github: false,
      leetcode: false,
      duration: 0,
      timestamp: new Date().toISOString()
    };

    // Connect to database
    await connectToDatabase();

    // Fetch GitHub data
    try {
      results.github = await fetchAndStoreGitHubData();
    } catch (error) {
      console.error('GitHub fetch error:', error);
    }

    // Fetch LeetCode data
    try {
      results.leetcode = await fetchAndStoreLeetCodeData();
    } catch (error) {
      console.error('LeetCode fetch error:', error);
    }

    results.duration = Date.now() - startTime;

    // Determine response status
    const success = results.github || results.leetcode;
    const statusCode = success ? 200 : 500;

    // Optional: Trigger deployment webhook
    if (success && process.env.DEPLOY_HOOK_URL) {
      try {
        await fetch(process.env.DEPLOY_HOOK_URL, { method: 'POST' });
        console.log('Deployment webhook triggered');
      } catch (error) {
        console.error('Deployment webhook failed:', error.message);
      }
    }

    return res.status(statusCode).json({
      success,
      message: success ? 'Data sync completed' : 'Data sync failed',
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Sync endpoint error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}