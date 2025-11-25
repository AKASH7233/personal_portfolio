import fetch from 'node-fetch';

const LEETCODE_API = 'https://alfa-leetcode-api.onrender.com';

/**
 * Fetch LeetCode user stats
 * @param {string} username - LeetCode username
 * @returns {Promise<Object>} User stats and submission data
 */
export async function fetchLeetCodeStats(username) {
  try {
    // Fetch profile, solved problems, contest data, and badges
    const [profileRes, solvedRes, contestRes, badgesRes, calendarRes] = await Promise.all([
      fetch(`${LEETCODE_API}/${username}`),
      fetch(`${LEETCODE_API}/${username}/solved`),
      fetch(`${LEETCODE_API}/${username}/contest`),
      fetch(`${LEETCODE_API}/${username}/badges`),
      fetch(`${LEETCODE_API}/${username}/calendar`)
    ]);
    
    if (!profileRes.ok) {
      throw new Error(`LeetCode API error: ${profileRes.status} ${profileRes.statusText}`);
    }

    const profile = await profileRes.json();
    const solved = solvedRes.ok ? await solvedRes.json() : null;
    const contest = contestRes.ok ? await contestRes.json() : null;
    const badges = badgesRes.ok ? await badgesRes.json() : null;
    const calendar = calendarRes.ok ? await calendarRes.json() : null;

    // Normalize the response
    const stats = {
      username: profile.username || username,
      name: profile.name || null,
      ranking: profile.ranking || null,
      reputation: profile.reputation || 0,
      totalSolved: solved?.solvedProblem || 0,
      easySolved: solved?.easySolved || 0,
      mediumSolved: solved?.mediumSolved || 0,
      hardSolved: solved?.hardSolved || 0,
      totalQuestions: solved?.totalSubmissionNum?.[0]?.count || 3000,
      easyTotal: solved?.totalEasy || 915,
      mediumTotal: solved?.totalMedium || 1956,
      hardTotal: solved?.totalHard || 887,
      acceptanceRate: solved?.acRate || 0,
      contributionPoints: profile.contributionPoints || 0,
      submissionCalendar: normalizeSubmissionCalendar(calendar?.submissionCalendar || {}),
      recentSubmissions: solved?.recentSubmissions || [],
      avatar: profile.avatar || null,
      country: profile.country || null,
      school: profile.school || null,
      about: profile.about || null,
      // Contest data
      contestData: contest ? {
        contestAttend: contest.contestAttend || 0,
        contestRating: Math.round(contest.contestRating || 0),
        contestGlobalRanking: contest.contestGlobalRanking || null,
        contestTopPercentage: contest.contestTopPercentage || null,
        totalParticipants: contest.totalParticipants || 0
      } : null,
      // Badges
      badges: badges?.badges || []
    };

    // Calculate streak
    const streak = calculateStreak(stats.submissionCalendar);
    stats.streak = streak.current;
    stats.longestStreak = streak.longest;

    // Generate badge URLs
    stats.badgeUrls = generateLeetCodeBadges(username, stats);

    return stats;
  } catch (error) {
    console.error('❌ Error fetching LeetCode stats:', error.message);
    throw error;
  }
}



/**
 * Normalize submission calendar data
 * @param {Object} calendar - Raw submission calendar
 * @returns {Object} Normalized calendar object (keeping timestamps as keys for frontend processing)
 */
function normalizeSubmissionCalendar(calendar) {
  if (!calendar) return {};

  try {
    // Calendar is typically a JSON string or object with timestamps as keys
    let calendarData;
    
    if (typeof calendar === 'string') {
      calendarData = JSON.parse(calendar);
    } else if (typeof calendar === 'object') {
      calendarData = calendar;
    } else {
      return {};
    }
    
    // Ensure it's an object and normalize the values
    if (typeof calendarData === 'object' && !Array.isArray(calendarData)) {
      const normalizedCalendar = {};
      for (const [timestamp, count] of Object.entries(calendarData)) {
        const normalizedCount = parseInt(count) || 0;
        if (normalizedCount >= 0) {
          normalizedCalendar[timestamp] = normalizedCount;
        }
      }
      console.log(`📊 Normalized ${Object.keys(normalizedCalendar).length} submission entries`);
      return normalizedCalendar;
    }
    
    return calendarData || {};
  } catch (error) {
    console.error('❌ Error normalizing submission calendar:', error);
    return {};
  }
}

/**
 * Get contribution level based on count
 * @param {number} count - Submission count
 * @returns {string} Level (NONE, LOW, MEDIUM, HIGH)
 */
function getLevel(count) {
  if (count === 0) return 'NONE';
  if (count <= 2) return 'LOW';
  if (count <= 5) return 'MEDIUM';
  return 'HIGH';
}

/**
 * Generate LeetCode badge URLs
 * @param {string} username - LeetCode username
 * @param {Object} stats - LeetCode stats
 * @returns {Object} Badge URLs
 */
export function generateLeetCodeBadges(username, stats) {
  const style = 'for-the-badge';
  
  const badges = {
    solved: `https://img.shields.io/badge/Solved-${stats.totalSolved}-FFA116?style=${style}&logo=leetcode&logoColor=white&labelColor=1a1b27`,
    easy: `https://img.shields.io/badge/Easy-${stats.easySolved}/${stats.easyTotal}-00B8A3?style=${style}&logo=leetcode&logoColor=white&labelColor=1a1b27`,
    medium: `https://img.shields.io/badge/Medium-${stats.mediumSolved}/${stats.mediumTotal}-FFA116?style=${style}&logo=leetcode&logoColor=white&labelColor=1a1b27`,
    hard: `https://img.shields.io/badge/Hard-${stats.hardSolved}/${stats.hardTotal}-FF375F?style=${style}&logo=leetcode&logoColor=white&labelColor=1a1b27`,
    ranking: stats.ranking ? `https://img.shields.io/badge/Rank-${stats.ranking.toLocaleString()}-FFA116?style=${style}&logo=leetcode&logoColor=white&labelColor=1a1b27` : null,
    streak: stats.streak ? `https://img.shields.io/badge/Streak-${stats.streak}_days-FFA116?style=${style}&logo=leetcode&logoColor=white&labelColor=1a1b27` : null
  };

  // Add contest badges if available
  if (stats.contestData && stats.contestData.contestAttend > 0) {
    badges.contests = `https://img.shields.io/badge/Contests-${stats.contestData.contestAttend}-FFA116?style=${style}&logo=leetcode&logoColor=white&labelColor=1a1b27`;
    badges.contestRating = `https://img.shields.io/badge/Rating-${stats.contestData.contestRating}-FFA116?style=${style}&logo=leetcode&logoColor=white&labelColor=1a1b27`;
    
    if (stats.contestData.contestTopPercentage) {
      badges.contestRank = `https://img.shields.io/badge/Top-${stats.contestData.contestTopPercentage}%25-FFA116?style=${style}&logo=leetcode&logoColor=white&labelColor=1a1b27`;
    }
  }

  return badges;
}

/**
 * Calculate streak from submission calendar
 * @param {Array} calendar - Normalized submission calendar
 * @returns {Object} Streak information
 */
export function calculateStreak(calendar) {
  if (!calendar || calendar.length === 0) {
    return { current: 0, longest: 0 };
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Sort calendar by date descending
  const sorted = [...calendar].sort((a, b) => new Date(b.date) - new Date(a.date));

  for (let i = 0; i < sorted.length; i++) {
    const submission = sorted[i];
    const submissionDate = new Date(submission.date);
    submissionDate.setHours(0, 0, 0, 0);

    if (submission.count > 0) {
      tempStreak++;
      
      // Check if this is part of current streak
      const daysDiff = Math.floor((today - submissionDate) / (1000 * 60 * 60 * 24));
      if (daysDiff <= tempStreak) {
        currentStreak = tempStreak;
      }
      
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  return { current: currentStreak, longest: longestStreak };
}
