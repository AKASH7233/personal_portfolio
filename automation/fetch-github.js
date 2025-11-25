/**
 * Fetch GitHub Data
 * Retrieves repositories, contributions, and user stats from GitHub
 */

import dotenv from 'dotenv';
import {
  fetchRepositories,
  fetchContributions,
  fetchUserStats,
  fetchTopLanguages,
  generateBadges
} from './lib/github.js';
import { upsertDocument, closeDB } from './lib/mongodb.js';

dotenv.config();

async function fetchGitHubData() {
  const username = process.env.GITHUB_USERNAME;
  
  if (!username) {
    throw new Error('GITHUB_USERNAME environment variable is not set');
  }

  console.log('🔄 Fetching GitHub data...');

  try {
    // Fetch all data in parallel
    const [repos, contributions, stats, topLanguages] = await Promise.all([
      fetchRepositories(username),
      fetchContributions(username),
      fetchUserStats(username),
      fetchTopLanguages(username)
    ]);

    const badges = generateBadges(username);

    console.log(`✅ Fetched ${repos.length} repositories`);
    console.log(`✅ Fetched ${contributions.contributions.length} contribution days`);
    console.log(`✅ Total contributions: ${contributions.totalContributions}`);

    // Store repositories in MongoDB
    const reposResult = await upsertDocument(
      'github_repositories',
      { username },
      {
        username,
        repositories: repos,
        topLanguages,
        badges,
        totalRepos: repos.length,
        totalStars: repos.reduce((sum, repo) => sum + repo.stars, 0),
        fetchedAt: new Date()
      }
    );

    console.log('✅ Stored repositories in MongoDB');

    // Store contributions in MongoDB
    const contribResult = await upsertDocument(
      'github_contributions',
      { username },
      {
        username,
        totalContributions: contributions.totalContributions,
        contributions: contributions.contributions,
        fetchedAt: new Date()
      }
    );

    console.log('✅ Stored contributions in MongoDB');

    // Store user stats in MongoDB
    const statsResult = await upsertDocument(
      'github_stats',
      { username },
      {
        username,
        ...stats,
        fetchedAt: new Date()
      }
    );

    console.log('✅ Stored user stats in MongoDB');

    return {
      repos,
      contributions,
      stats,
      topLanguages,
      badges
    };
  } catch (error) {
    console.error('❌ Error fetching GitHub data:', error.message);
    throw error;
  } finally {
    await closeDB();
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fetchGitHubData()
    .then(() => {
      console.log('✅ GitHub data fetch completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ GitHub data fetch failed:', error.message);
      process.exit(1);
    });
}

export default fetchGitHubData;
