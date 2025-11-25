/**
 * API: Projects Data
 * GET /api/projects/data
 * Returns structured project data for SEO and components
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

async function fetchGitHubProjects() {
  try {
    const response = await fetch('https://api.github.com/users/AKASH7233/repos?sort=updated&per_page=50', {
      headers: {
        'User-Agent': 'Portfolio-App'
      }
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const repos = await response.json();
    
    return repos
      .filter(repo => !repo.fork) // Only original repositories
      .map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description || '',
        htmlUrl: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        topics: repo.topics || [],
        updatedAt: repo.updated_at,
        createdAt: repo.created_at,
        isOriginal: !repo.fork
      }))
      .sort((a, b) => b.stars - a.stars);
      
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    return [];
  }
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
    // Fetch fresh GitHub data
    const projects = await fetchGitHubProjects();
    
    // Define pinned projects
    const pinnedRepoNames = [
      'travelGuide_AI',
      'TeamMate', 
      'personal_portfolio',
      'Connectify',
      'Connectnow',
      'Netflix'
    ];
    
    const pinnedProjects = projects.filter(project =>
      pinnedRepoNames.includes(project.name)
    );
    
    // Calculate stats
    const totalStars = projects.reduce((sum, project) => sum + project.stars, 0);
    const totalForks = projects.reduce((sum, project) => sum + project.forks, 0);
    
    const languages = {};
    projects.forEach(project => {
      if (project.language) {
        languages[project.language] = (languages[project.language] || 0) + 1;
      }
    });
    
    const projectData = {
      projects,
      pinnedProjects,
      totalStars,
      totalForks,
      languages,
      totalRepos: projects.length,
      lastUpdated: new Date().toISOString()
    };

    // Cache in MongoDB if available
    if (process.env.MONGODB_URI) {
      try {
        const client = await connectToDatabase();
        const db = client.db();
        
        await db.collection('projects_cache').replaceOne(
          { type: 'projects_data' },
          { 
            type: 'projects_data',
            data: projectData,
            updatedAt: new Date()
          },
          { upsert: true }
        );
      } catch (dbError) {
        console.error('Error caching projects data:', dbError);
      }
    }
    
    // Set cache headers
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=1800'); // Cache for 1 hour
    
    return res.status(200).json(projectData);
    
  } catch (error) {
    console.error('Error generating projects data:', error);
    
    // Try to return cached data from MongoDB
    if (process.env.MONGODB_URI) {
      try {
        const client = await connectToDatabase();
        const db = client.db();
        
        const cached = await db.collection('projects_cache').findOne({ type: 'projects_data' });
        if (cached) {
          return res.status(200).json(cached.data);
        }
      } catch (dbError) {
        console.error('Error fetching cached projects data:', dbError);
      }
    }
    
    // Fallback to basic structure
    return res.status(200).json({
      projects: [],
      pinnedProjects: [],
      totalStars: 0,
      totalForks: 0,
      languages: {},
      totalRepos: 0,
      lastUpdated: new Date().toISOString(),
      error: 'Failed to fetch projects data'
    });
  }
}