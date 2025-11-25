/**
 * Stats Badges Component
 * Displays dynamic GitHub and LeetCode badge images
 */

import { useState, useEffect } from "react";
import { fetchFromAPI, API_ENDPOINTS } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface Badges {
  stars?: string;
  followers?: string;
  repos?: string;
  contributions?: string;
  profileViews?: string;
  solved?: string;
  easy?: string;
  medium?: string;
  hard?: string;
  ranking?: string;
}

export default function StatsBadges() {
  const [githubBadges, setGithubBadges] = useState<Badges>({});
  const [leetcodeBadges, setLeetcodeBadges] = useState<Badges>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBadges() {
      try {
        const [githubData, leetcodeData] = await Promise.all([
          fetchFromAPI(API_ENDPOINTS.GITHUB_REPOS),
          fetchFromAPI(API_ENDPOINTS.LEETCODE_STATS)
        ]);

        setGithubBadges(githubData.badges || {});
        setLeetcodeBadges(leetcodeData.badges || {});
      } catch (err) {
        console.error('Error loading badges:', err);
      } finally {
        setLoading(false);
      }
    }

    loadBadges();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-wrap gap-3 justify-center">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-7 w-32" />
        ))}
      </div>
    );
  }

  const allBadges = [
    githubBadges.stars,
    githubBadges.followers,
    githubBadges.repos,
    githubBadges.profileViews,
    leetcodeBadges.solved,
    leetcodeBadges.easy,
    leetcodeBadges.medium,
    leetcodeBadges.hard,
    leetcodeBadges.ranking
  ].filter(Boolean);

  return (
    <div className="flex flex-wrap gap-3 justify-center items-center">
      {allBadges.map((badge, index) => (
        <img
          key={index}
          src={badge}
          alt="Badge"
          className="h-7 transition-transform hover:scale-105"
          loading="lazy"
        />
      ))}
    </div>
  );
}
