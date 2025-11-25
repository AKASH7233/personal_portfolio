/**
 * GitHub API Integration
 * Fetches repositories, contributions, and profile data
 */

import fetch from 'node-fetch';

const GITHUB_API = 'https://api.github.com';
const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

/**
 * Make authenticated GitHub REST API request
 * @param {string} endpoint - API endpoint
 * @returns {Promise<Object>} API response
 */
async function githubRequest(endpoint) {
  const token = process.env.GITHUB_TOKEN;
  const response = await fetch(`${GITHUB_API}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-Auto-Updater'
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Make authenticated GitHub GraphQL request
 * @param {string} query - GraphQL query
 * @returns {Promise<Object>} API response
 */
async function githubGraphQL(query) {
  const token = process.env.GITHUB_TOKEN;
  const response = await fetch(GITHUB_GRAPHQL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Portfolio-Auto-Updater'
    },
    body: JSON.stringify({ query })
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
  }

  return data.data;
}

/**
 * Fetch all public repositories for a user (owner repos only, no forks)
 * @param {string} username - GitHub username
 * @returns {Promise<Array>} Array of repositories
 */
export async function fetchRepositories(username) {
  const repos = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const data = await githubRequest(`/users/${username}/repos?page=${page}&per_page=${perPage}&sort=updated&type=owner`);
    
    if (data.length === 0) break;
    
    // Filter and map repositories (only non-forked, public repos owned by the user)
    const filtered = data
      .filter(repo => !repo.fork && !repo.private && repo.owner.login === username)
      .map(repo => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        htmlUrl: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        watchers: repo.watchers_count,
        openIssues: repo.open_issues_count,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        pushedAt: repo.pushed_at,
        size: repo.size,
        topics: repo.topics || []
      }));
    
    repos.push(...filtered);
    
    if (data.length < perPage) break;
    page++;
  }

  return repos;
}

/**
 * Fetch GitHub contributions for the past 12 months
 * @param {string} username - GitHub username
 * @returns {Promise<Object>} Contributions data
 */
export async function fetchContributions(username) {
  const query = `
    query {
      user(login: "${username}") {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  const data = await githubGraphQL(query);
  const calendar = data.user.contributionsCollection.contributionCalendar;

  // Flatten the weeks array
  const contributions = calendar.weeks.flatMap(week => 
    week.contributionDays.map(day => ({
      date: day.date,
      count: day.contributionCount,
      level: day.contributionLevel
    }))
  );

  return {
    totalContributions: calendar.totalContributions,
    contributions
  };
}

/**
 * Fetch user profile stats
 * @param {string} username - GitHub username
 * @returns {Promise<Object>} User stats
 */
export async function fetchUserStats(username) {
  const user = await githubRequest(`/users/${username}`);
  
  return {
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
    publicGists: user.public_gists,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    bio: user.bio,
    company: user.company,
    location: user.location,
    blog: user.blog
  };
}

/**
 * Generate GitHub badge URLs
 * @param {string} username - GitHub username
 * @returns {Object} Badge URLs
 */
export function generateBadges(username) {
  const style = 'for-the-badge';
  
  return {
    stars: `https://img.shields.io/github/stars/${username}?style=${style}&logo=github&labelColor=1a1b27&color=70a5fd`,
    followers: `https://img.shields.io/github/followers/${username}?style=${style}&logo=github&labelColor=1a1b27&color=70a5fd`,
    repos: `https://img.shields.io/badge/dynamic/json?style=${style}&logo=github&labelColor=1a1b27&color=70a5fd&label=Repos&query=$.public_repos&url=https://api.github.com/users/${username}`,
    contributions: `https://img.shields.io/badge/dynamic/json?style=${style}&logo=github&labelColor=1a1b27&color=70a5fd&label=Contributions&query=$.total&url=https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
    profileViews: `https://komarev.com/ghpvc/?username=${username}&style=${style}&color=70a5fd&labelColor=1a1b27`
  };
}

/**
 * Fetch top languages from all repositories
 * @param {string} username - GitHub username
 * @returns {Promise<Object>} Language statistics
 */
export async function fetchTopLanguages(username) {
  const repos = await fetchRepositories(username);
  const languages = {};

  for (const repo of repos) {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  }

  // Sort by count
  const sorted = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([language, count]) => ({ language, count }));

  return sorted;
}
