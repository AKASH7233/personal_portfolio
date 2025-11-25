/**
 * Generate AI Achievements
 * Uses Google Gemini to generate achievement summaries from GitHub and LeetCode data
 */

import dotenv from 'dotenv';
import crypto from 'crypto';
import { findDocument, upsertDocument, closeDB } from './lib/mongodb.js';
import { generateAchievements, generateBio } from './lib/gemini.js';

dotenv.config();

/**
 * Create hash of data to detect changes
 * @param {Object} data - Data to hash
 * @returns {string} Hash
 */
function createHash(data) {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(data))
    .digest('hex');
}

async function generateAchievementsData() {
  const githubUsername = process.env.GITHUB_USERNAME;
  const leetcodeUsername = process.env.LEETCODE_USERNAME;

  if (!githubUsername || !leetcodeUsername) {
    throw new Error('GITHUB_USERNAME and LEETCODE_USERNAME must be set');
  }

  console.log('🔄 Generating AI achievements...');

  try {
    // Fetch data from MongoDB
    const [githubRepos, githubContribs, githubStats, leetcodeStats] = await Promise.all([
      findDocument('github_repositories', { username: githubUsername }),
      findDocument('github_contributions', { username: githubUsername }),
      findDocument('github_stats', { username: githubUsername }),
      findDocument('leetcode_stats', { username: leetcodeUsername })
    ]);

    if (!githubRepos || !githubContribs || !githubStats || !leetcodeStats) {
      throw new Error('Required data not found in MongoDB. Run fetch-github and fetch-leetcode first.');
    }

    // Create hash of source data
    const sourceData = {
      repoCount: githubRepos.repositories.length,
      totalContributions: githubContribs.totalContributions,
      leetcodeSolved: leetcodeStats.totalSolved,
      topLanguages: githubRepos.topLanguages
    };
    const dataHash = createHash(sourceData);

    // Check if achievements already exist with same hash
    const existingAchievements = await findDocument('achievements', {
      username: githubUsername
    });

    if (existingAchievements && existingAchievements.sourceHash === dataHash) {
      console.log('ℹ️  No changes detected in source data, skipping generation');
      return existingAchievements;
    }

    console.log('🤖 Calling Gemini AI to generate achievements...');

    // Prepare data for Gemini
    const githubData = {
      repos: githubRepos.repositories,
      contributions: githubContribs,
      stats: githubStats,
      topLanguages: githubRepos.topLanguages
    };

    const leetcodeData = {
      totalSolved: leetcodeStats.totalSolved,
      easySolved: leetcodeStats.easySolved,
      easyTotal: leetcodeStats.easyTotal,
      mediumSolved: leetcodeStats.mediumSolved,
      mediumTotal: leetcodeStats.mediumTotal,
      hardSolved: leetcodeStats.hardSolved,
      hardTotal: leetcodeStats.hardTotal,
      ranking: leetcodeStats.ranking
    };

    // Generate achievements and bio
    const [achievements, bio] = await Promise.all([
      generateAchievements(githubData, leetcodeData),
      generateBio(githubData, leetcodeData)
    ]);

    console.log('✅ Generated achievements successfully');
    console.log('✅ Generated bio successfully');

    // Store in MongoDB
    const result = await upsertDocument(
      'achievements',
      { username: githubUsername },
      {
        username: githubUsername,
        summary: achievements.summary,
        bulletPoints: achievements.bulletPoints,
        bio,
        sourceHash: dataHash,
        generatedAt: new Date()
      }
    );

    console.log('✅ Stored achievements in MongoDB');

    const storedData = result.generatedAt || new Date();
    
    return {
      summary: achievements.summary,
      bulletPoints: achievements.bulletPoints,
      bio,
      sourceHash: dataHash,
      generatedAt: storedData
    };
  } catch (error) {
    console.error('❌ Error generating achievements:', error.message);
    throw error;
  } finally {
    await closeDB();
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAchievementsData()
    .then(() => {
      console.log('✅ Achievement generation completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Achievement generation failed:', error.message);
      process.exit(1);
    });
}

export default generateAchievementsData;
