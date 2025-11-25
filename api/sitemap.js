/**
 * API: Generate Sitemap.xml
 * GET /api/sitemap
 */

import { generateSitemap, defaultSitemapEntries, generateProjectSitemapEntries } from '../../../src/lib/sitemap.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const baseUrl = process.env.SITE_URL || 'https://akash-portfolio-sage.vercel.app';
    
    // Get project sitemap entries
    const projectEntries = await generateProjectSitemapEntries();
    
    // Combine all sitemap entries
    const allEntries = [...defaultSitemapEntries, ...projectEntries];
    
    // Generate sitemap XML
    const sitemapXml = generateSitemap(allEntries, baseUrl);
    
    // Set XML content type and cache headers
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200'); // Cache for 24 hours
    
    return res.status(200).send(sitemapXml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return res.status(500).json({ error: 'Failed to generate sitemap' });
  }
}