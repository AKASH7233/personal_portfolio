/**
 * API: Generate robots.txt
 * GET /api/robots
 */

import { generateRobotsTxt } from '../../../src/lib/sitemap.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const baseUrl = process.env.SITE_URL || 'https://akash-portfolio-sage.vercel.app';
    const robotsTxt = generateRobotsTxt(baseUrl);
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, s-maxage=86400'); // Cache for 24 hours
    
    return res.status(200).send(robotsTxt);
  } catch (error) {
    console.error('Error generating robots.txt:', error);
    return res.status(500).text('User-agent: *\nAllow: /');
  }
}