/**
 * Projects Data Generator
 * Auto-fetches and structures project data for SEO
 */

export interface ProjectData {
  id: number;
  name: string;
  description: string;
  htmlUrl: string;
  homepage?: string;
  language: string;
  stars: number;
  forks: number;
  topics: string[];
  updatedAt: string;
  createdAt: string;
  isOriginal: boolean;
}

export async function fetchGitHubProjects(): Promise<ProjectData[]> {
  try {
    const response = await fetch('https://api.github.com/users/AKASH7233/repos?sort=updated&per_page=50');
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const repos = await response.json();
    
    return repos
      .filter((repo: any) => !repo.fork) // Only original repositories
      .map((repo: any) => ({
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
      .sort((a, b) => b.stars - a.stars); // Sort by stars
      
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    return [];
  }
}

export async function fetchPinnedRepos(): Promise<string[]> {
  try {
    // Note: GitHub API doesn't directly provide pinned repos
    // This would typically require GraphQL API or web scraping
    // For now, return manually curated list of important projects
    return [
      'travelGuide_AI',
      'TeamMate', 
      'personal_portfolio',
      'Connectify',
      'Connectnow',
      'Netflix'
    ];
  } catch (error) {
    console.error('Error fetching pinned repos:', error);
    return [];
  }
}

export function generateProjectSlugs(projects: ProjectData[]): string[] {
  return projects.map(project => 
    project.name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  );
}

export async function generateProjectsData(): Promise<{
  projects: ProjectData[];
  pinnedProjects: ProjectData[];
  totalStars: number;
  totalForks: number;
  languages: { [key: string]: number };
}> {
  const projects = await fetchGitHubProjects();
  const pinnedRepoNames = await fetchPinnedRepos();
  
  const pinnedProjects = projects.filter(project =>
    pinnedRepoNames.includes(project.name)
  );
  
  const totalStars = projects.reduce((sum, project) => sum + project.stars, 0);
  const totalForks = projects.reduce((sum, project) => sum + project.forks, 0);
  
  const languages: { [key: string]: number } = {};
  projects.forEach(project => {
    if (project.language) {
      languages[project.language] = (languages[project.language] || 0) + 1;
    }
  });
  
  return {
    projects,
    pinnedProjects,
    totalStars,
    totalForks,
    languages
  };
}