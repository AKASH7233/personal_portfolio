/**
 * API Configuration
 * Base configuration for API calls
 */

import {
  mockGitHubRepos,
  mockGitHubContributions,
  mockGitHubStats,
  mockLeetCodeStats,
  mockAchievements,
  mockSkills,
  mockAbout
} from './mockApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const IS_DEVELOPMENT = import.meta.env.DEV;

export const API_ENDPOINTS = {
  GITHUB_REPOS: `${API_BASE_URL}/github/repos`,
  GITHUB_CONTRIBUTIONS: `${API_BASE_URL}/github/contributions`,
  GITHUB_STATS: `${API_BASE_URL}/github/stats`,
  LEETCODE_STATS: `${API_BASE_URL}/leetcode/stats`,
  ACHIEVEMENTS: `${API_BASE_URL}/achievements`,
  SKILLS: `${API_BASE_URL}/skills`,
  ABOUT: `${API_BASE_URL}/about`,
};

// Mock data mapping for development
const MOCK_DATA: Record<string, any> = {
  [API_ENDPOINTS.GITHUB_REPOS]: mockGitHubRepos,
  [API_ENDPOINTS.GITHUB_CONTRIBUTIONS]: mockGitHubContributions,
  [API_ENDPOINTS.GITHUB_STATS]: mockGitHubStats,
  [API_ENDPOINTS.LEETCODE_STATS]: mockLeetCodeStats,
  [API_ENDPOINTS.ACHIEVEMENTS]: mockAchievements,
  [API_ENDPOINTS.SKILLS]: mockSkills,
  [API_ENDPOINTS.ABOUT]: mockAbout,
};

export async function fetchFromAPI(endpoint: string, forceRealData = false) {
  // Force real API calls for GitHub contributions and LeetCode stats (heatmaps)
  const useRealAPI = forceRealData || 
    endpoint.includes('/github/contributions') || 
    endpoint.includes('/leetcode/stats');

  // In development, use mock data (except for forced real data endpoints)
  if (IS_DEVELOPMENT && !useRealAPI) {
    console.log(`🔧 DEV MODE: Using mock data for ${endpoint}`);
    return Promise.resolve(MOCK_DATA[endpoint] || {});
  }

  // Fetch from real API (production or forced endpoints)
  console.log(`🌐 Fetching real data from ${endpoint}`);
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    
    // Log data for debugging LeetCode endpoints
    if (endpoint.includes('/leetcode/stats')) {
      console.log('📊 LeetCode API Response:', {
        username: data.username,
        hasSubmissionCalendar: !!data.submissionCalendar,
        calendarType: typeof data.submissionCalendar,
        calendarEntries: data.submissionCalendar ? Object.keys(data.submissionCalendar).length : 0
      });
    }
    
    return data;
  } catch (error) {
    console.error(`Failed to fetch from ${endpoint}:`, error);
    // Fallback to mock data on error
    console.log(`⚠️ Falling back to mock data for ${endpoint}`);
    return MOCK_DATA[endpoint] || {};
  }
}
