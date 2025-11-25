/**
 * Update Skills and About Data
 * Extracts skills from GitHub projects and updates about section
 */

import dotenv from 'dotenv';
import { findDocument, upsertDocument, closeDB } from './lib/mongodb.js';
import { extractSkills, generateSkillLevels } from './lib/skills-extractor.js';
import { generateBio } from './lib/gemini.js';

dotenv.config();

async function updateSkillsAndAbout() {
  const username = process.env.GITHUB_USERNAME;

  if (!username) {
    throw new Error('GITHUB_USERNAME environment variable is not set');
  }

  console.log('🔄 Updating skills and about section...');

  try {
    // Fetch GitHub data from MongoDB
    const [githubRepos, githubStats, achievements] = await Promise.all([
      findDocument('github_repositories', { username }),
      findDocument('github_stats', { username }),
      findDocument('achievements', { username })
    ]);

    if (!githubRepos) {
      throw new Error('GitHub repositories not found. Run fetch-github first.');
    }

    const repositories = githubRepos.repositories || [];

    // Extract skills from repositories
    console.log('🔍 Extracting skills from repositories...');
    const extractedSkills = extractSkills(repositories);
    const skillsWithLevels = generateSkillLevels(repositories, extractedSkills);

    console.log('✅ Extracted skills:');
    Object.keys(skillsWithLevels).forEach(category => {
      if (skillsWithLevels[category].length > 0) {
        console.log(`   ${category}: ${skillsWithLevels[category].length} skills`);
      }
    });

    // Prepare about section data
    const aboutData = {
      bio: githubStats?.bio || achievements?.bio || 'Full-stack developer passionate about building scalable applications.',
      location: githubStats?.location || '',
      company: githubStats?.company || '',
      blog: githubStats?.blog || '',
      email: '', // User can set manually
      social: {
        github: `https://github.com/${username}`,
        linkedin: '', // User can set manually
        twitter: '', // User can set manually
      },
      stats: {
        yearsOfExperience: calculateYearsOfExperience(githubStats?.createdAt),
        projectsCompleted: repositories.length,
        totalStars: githubRepos.totalStars || 0,
        totalCommits: 0, // Can be calculated if needed
      },
      highlights: extractHighlights(repositories, githubRepos.topLanguages),
      updatedAt: new Date()
    };

    // Store skills in MongoDB
    await upsertDocument(
      'skills',
      { username },
      {
        username,
        skills: skillsWithLevels,
        extractedFrom: repositories.length,
        updatedAt: new Date()
      }
    );

    console.log('✅ Stored skills in MongoDB');

    // Store about data in MongoDB
    await upsertDocument(
      'about',
      { username },
      aboutData
    );

    console.log('✅ Stored about section in MongoDB');

    return {
      skills: skillsWithLevels,
      about: aboutData
    };
  } catch (error) {
    console.error('❌ Error updating skills and about:', error.message);
    throw error;
  } finally {
    await closeDB();
  }
}

/**
 * Calculate years of experience based on GitHub account creation
 * @param {string} createdAt - Account creation date
 * @returns {number} Years of experience
 */
function calculateYearsOfExperience(createdAt) {
  if (!createdAt) return 0;
  
  const created = new Date(createdAt);
  const now = new Date();
  const years = (now - created) / (1000 * 60 * 60 * 24 * 365);
  
  return Math.floor(years);
}

/**
 * Extract key highlights from repository data
 * @param {Array} repositories - Repositories
 * @param {Array} topLanguages - Top languages
 * @returns {Array} Highlights
 */
function extractHighlights(repositories, topLanguages) {
  const highlights = [];

  // Most used language
  if (topLanguages && topLanguages.length > 0) {
    const topLang = topLanguages[0];
    highlights.push(`Specialized in ${topLang.language} development`);
  }

  // Repository count
  if (repositories.length > 0) {
    highlights.push(`Built ${repositories.length}+ open-source projects`);
  }

  // Popular projects
  const popularRepos = repositories
    .filter(r => r.stars > 0)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 3);

  if (popularRepos.length > 0) {
    const totalStars = popularRepos.reduce((sum, r) => sum + r.stars, 0);
    highlights.push(`Earned ${totalStars}+ GitHub stars`);
  }

  // Recent activity
  const recentRepos = repositories
    .filter(r => {
      const updated = new Date(r.updatedAt);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return updated > sixMonthsAgo;
    });

  if (recentRepos.length > 0) {
    highlights.push(`Actively maintaining ${recentRepos.length} projects`);
  }

  return highlights.slice(0, 4); // Limit to 4 highlights
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updateSkillsAndAbout()
    .then(() => {
      console.log('✅ Skills and about update completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Skills and about update failed:', error.message);
      process.exit(1);
    });
}

export default updateSkillsAndAbout;
