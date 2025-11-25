/**
 * Auto-generated sitemap.xml for SEO optimization
 * This file dynamically generates sitemap based on portfolio content
 */

export interface SitemapEntry {
  url: string;
  lastModified?: string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export function generateSitemap(entries: SitemapEntry[], baseUrl: string): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetClose = '</urlset>';

  const urls = entries.map(entry => {
    const url = `<url>
  <loc>${baseUrl}${entry.url}</loc>
  ${entry.lastModified ? `<lastmod>${entry.lastModified}</lastmod>` : ''}
  ${entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : ''}
  ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
</url>`;
    return url;
  }).join('\n');

  return `${xmlHeader}\n${urlsetOpen}\n${urls}\n${urlsetClose}`;
}

export function generateRobotsTxt(baseUrl: string): string {
  return `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/projects-sitemap.xml

# Block access to admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /node_modules/

# Allow important files
Allow: /api/sitemap
Allow: /api/rss

# Cache directives
Crawl-delay: 1`;
}

export const defaultSitemapEntries: SitemapEntry[] = [
  {
    url: '/',
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 1.0
  },
  {
    url: '/#about',
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.9
  },
  {
    url: '/#projects',
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.9
  },
  {
    url: '/#skills',
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.8
  },
  {
    url: '/#experience',
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.8
  },
  {
    url: '/#education',
    lastModified: new Date().toISOString(),
    changeFrequency: 'yearly',
    priority: 0.7
  },
  {
    url: '/#leetcode',
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8
  },
  {
    url: '/#achievements',
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.7
  },
  {
    url: '/#contact',
    lastModified: new Date().toISOString(),
    changeFrequency: 'yearly',
    priority: 0.6
  }
];

// Generate project sitemap entries from GitHub repos
export async function generateProjectSitemapEntries(): Promise<SitemapEntry[]> {
  try {
    const response = await fetch('https://api.github.com/users/AKASH7233/repos?sort=updated&per_page=50');
    if (!response.ok) return [];
    
    const repos = await response.json();
    
    return repos
      .filter((repo: any) => !repo.fork && repo.homepage) // Only original repos with live demos
      .map((repo: any) => ({
        url: `/projects/${repo.name.toLowerCase()}`,
        lastModified: repo.updated_at,
        changeFrequency: 'monthly' as const,
        priority: repo.stargazers_count > 0 ? 0.8 : 0.6
      }));
  } catch (error) {
    console.error('Error generating project sitemap entries:', error);
    return [];
  }
}