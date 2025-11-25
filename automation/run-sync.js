/**
 * Run Sync - Orchestrates all data fetching and generation
 * Main entry point for automation workflow
 */

import dotenv from 'dotenv';
import fetchGitHubData from './fetch-github.js';
import fetchLeetCodeData from './fetch-leetcode.js';
import generateAchievementsData from './generate-achievements.js';
import updateSkillsAndAbout from './update-skills-about.js';

dotenv.config();

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

async function runSync() {
  console.log('🚀 Starting portfolio data sync...\n');

  if (isDryRun) {
    console.log('ℹ️  Running in DRY RUN mode - no data will be committed\n');
  }

  const startTime = Date.now();
  const results = {
    github: false,
    leetcode: false,
    achievements: false,
    skillsAndAbout: false,
    errors: []
  };

  try {
    // Step 1: Fetch GitHub data
    console.log('═══════════════════════════════════════');
    console.log('STEP 1: Fetching GitHub Data');
    console.log('═══════════════════════════════════════');
    try {
      await fetchGitHubData();
      results.github = true;
      console.log('');
    } catch (error) {
      results.errors.push({ step: 'GitHub', error: error.message });
      console.error('❌ GitHub fetch failed, continuing...\n');
    }

    // Step 2: Fetch LeetCode data
    console.log('═══════════════════════════════════════');
    console.log('STEP 2: Fetching LeetCode Data');
    console.log('═══════════════════════════════════════');
    try {
      await fetchLeetCodeData();
      results.leetcode = true;
      console.log('');
    } catch (error) {
      results.errors.push({ step: 'LeetCode', error: error.message });
      console.error('❌ LeetCode fetch failed, continuing...\n');
    }

    // Step 3: Generate achievements (only if both GitHub and LeetCode succeeded)
    if (results.github && results.leetcode) {
      console.log('═══════════════════════════════════════');
      console.log('STEP 3: Generating AI Achievements');
      console.log('═══════════════════════════════════════');
      try {
        await generateAchievementsData();
        results.achievements = true;
        console.log('');
      } catch (error) {
        results.errors.push({ step: 'Achievements', error: error.message });
        console.error('❌ Achievement generation failed\n');
      }
    } else {
      console.log('⚠️  Skipping achievement generation due to previous errors\n');
    }

    // Step 4: Update skills and about section (only if GitHub succeeded)
    if (results.github) {
      console.log('═══════════════════════════════════════');
      console.log('STEP 4: Updating Skills & About Section');
      console.log('═══════════════════════════════════════');
      try {
        await updateSkillsAndAbout();
        results.skillsAndAbout = true;
        console.log('');
      } catch (error) {
        results.errors.push({ step: 'Skills/About', error: error.message });
        console.error('❌ Skills and about update failed\n');
      }
    } else {
      console.log('⚠️  Skipping skills/about update due to GitHub fetch failure\n');
    }

    // Summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('═══════════════════════════════════════');
    console.log('SYNC SUMMARY');
    console.log('═══════════════════════════════════════');
    console.log(`✅ GitHub Data: ${results.github ? 'SUCCESS' : 'FAILED'}`);
    console.log(`✅ LeetCode Data: ${results.leetcode ? 'SUCCESS' : 'FAILED'}`);
    console.log(`✅ AI Achievements: ${results.achievements ? 'SUCCESS' : 'SKIPPED/FAILED'}`);
    console.log(`✅ Skills & About: ${results.skillsAndAbout ? 'SUCCESS' : 'SKIPPED/FAILED'}`);
    console.log(`⏱️  Duration: ${duration}s`);
    console.log('═══════════════════════════════════════\n');

    if (results.errors.length > 0) {
      console.log('⚠️  ERRORS ENCOUNTERED:');
      results.errors.forEach(({ step, error }) => {
        console.log(`   ${step}: ${error}`);
      });
      console.log('');
    }

    // Exit with appropriate code
    const allSuccess = results.github && results.leetcode && results.achievements && results.skillsAndAbout;
    if (!allSuccess) {
      console.log('⚠️  Sync completed with errors');
      process.exit(1);
    }

    console.log('🎉 Sync completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error during sync:', error.message);
    process.exit(1);
  }
}

// Run sync
runSync();
