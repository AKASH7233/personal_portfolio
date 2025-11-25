/**
 * Fetch LeetCode Data
 * Retrieves user stats and submission calendar from LeetCode
 */

import dotenv from 'dotenv';
import {
  fetchLeetCodeStats,
  generateLeetCodeBadges,
  calculateStreak
} from './lib/leetcode.js';
import { upsertDocument, closeDB } from './lib/mongodb.js';

dotenv.config();

async function fetchLeetCodeData() {
  const username = process.env.LEETCODE_USERNAME;
  
  if (!username) {
    throw new Error('LEETCODE_USERNAME environment variable is not set');
  }

  console.log('🔄 Fetching LeetCode data...');

  try {
    // Fetch LeetCode stats
    const stats = await fetchLeetCodeStats(username);
    const badges = generateLeetCodeBadges(username, stats);
    const streak = calculateStreak(stats.submissionCalendar);

    console.log(`✅ Total Solved: ${stats.totalSolved}`);
    console.log(`✅ Easy: ${stats.easySolved}/${stats.easyTotal}`);
    console.log(`✅ Medium: ${stats.mediumSolved}/${stats.mediumTotal}`);
    console.log(`✅ Hard: ${stats.hardSolved}/${stats.hardTotal}`);
    console.log(`✅ Current Streak: ${streak.current} days`);
    if (stats.ranking) {
      console.log(`✅ Ranking: ${stats.ranking.toLocaleString()}`);
    }

    // Store in MongoDB
    const result = await upsertDocument(
      'leetcode_stats',
      { username },
      {
        username,
        ...stats,
        badges,
        streak,
        fetchedAt: new Date()
      }
    );

    console.log('✅ Stored LeetCode data in MongoDB');

    return {
      stats,
      badges,
      streak
    };
  } catch (error) {
    console.error('❌ Error fetching LeetCode data:', error.message);
    throw error;
  } finally {
    await closeDB();
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fetchLeetCodeData()
    .then(() => {
      console.log('✅ LeetCode data fetch completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ LeetCode data fetch failed:', error.message);
      process.exit(1);
    });
}

export default fetchLeetCodeData;
