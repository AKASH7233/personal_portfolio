/**
 * LeetCode Stats Component
 * Displays LeetCode problem-solving statistics with badges
 */

import { useState, useEffect } from "react";
import { fetchFromAPI, API_ENDPOINTS } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, TrendingUp, Award } from "lucide-react";

interface ContestData {
  contestAttend: number;
  contestRating: number;
  contestGlobalRanking: number | null;
  contestTopPercentage: number | null;
  totalParticipants: number;
}

interface Badge {
  id: string;
  name: string;
  icon?: string;
  displayName?: string;
}

interface LeetCodeData {
  totalSolved: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
  ranking?: number;
  streak: number;
  longestStreak: number;
  contestData?: ContestData | null;
  badges: Badge[];
  badgeUrls: {
    solved?: string;
    easy?: string;
    medium?: string;
    hard?: string;
    ranking?: string;
    streak?: string;
    contests?: string;
    contestRating?: string;
    contestRank?: string;
  };
}

export default function LeetCodeStats() {
  const [data, setData] = useState<LeetCodeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const leetcodeData = await fetchFromAPI(API_ENDPOINTS.LEETCODE_STATS);
        setData(leetcodeData);
      } catch (err) {
        console.error('Error loading LeetCode stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!data) {
    return null;
  }

  const easyPercent = (data.easySolved / data.easyTotal) * 100;
  const mediumPercent = (data.mediumSolved / data.mediumTotal) * 100;
  const hardPercent = (data.hardSolved / data.hardTotal) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          LeetCode Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Solved */}
        <div className="text-center space-y-2">
          <div className="text-5xl font-bold text-primary">{data.totalSolved}</div>
          <div className="text-muted-foreground">Problems Solved</div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="space-y-4">
          {/* Easy */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-green-600 dark:text-green-400">Easy</span>
              <span className="text-muted-foreground">
                {data.easySolved} / {data.easyTotal}
              </span>
            </div>
            <Progress value={easyPercent} className="h-2 bg-green-100 dark:bg-green-950">
              <div className="h-full bg-green-600 dark:bg-green-400 rounded-full" style={{ width: `${easyPercent}%` }} />
            </Progress>
          </div>

          {/* Medium */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-yellow-600 dark:text-yellow-400">Medium</span>
              <span className="text-muted-foreground">
                {data.mediumSolved} / {data.mediumTotal}
              </span>
            </div>
            <Progress value={mediumPercent} className="h-2 bg-yellow-100 dark:bg-yellow-950">
              <div className="h-full bg-yellow-600 dark:bg-yellow-400 rounded-full" style={{ width: `${mediumPercent}%` }} />
            </Progress>
          </div>

          {/* Hard */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-red-600 dark:text-red-400">Hard</span>
              <span className="text-muted-foreground">
                {data.hardSolved} / {data.hardTotal}
              </span>
            </div>
            <Progress value={hardPercent} className="h-2 bg-red-100 dark:bg-red-950">
              <div className="h-full bg-red-600 dark:bg-red-400 rounded-full" style={{ width: `${hardPercent}%` }} />
            </Progress>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          {data.ranking && (
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-sm text-muted-foreground">Ranking</div>
                <div className="font-semibold">{data.ranking.toLocaleString()}</div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
              <div className="font-semibold">{data.streak} days</div>
            </div>
          </div>
        </div>

        {/* Contest Stats */}
        {data.contestData && data.contestData.contestAttend > 0 && (
          <div className="pt-4 border-t space-y-3">
            <div className="text-sm font-semibold text-aqua flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Contest Performance
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Contests</div>
                <div className="font-semibold">{data.contestData.contestAttend}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Rating</div>
                <div className="font-semibold">{data.contestData.contestRating}</div>
              </div>
              {data.contestData.contestTopPercentage !== null && (
                <div>
                  <div className="text-sm text-muted-foreground">Percentile</div>
                  <div className="font-semibold">Top {data.contestData.contestTopPercentage}%</div>
                </div>
              )}
              {data.contestData.contestGlobalRanking !== null && (
                <div>
                  <div className="text-sm text-muted-foreground">Global Rank</div>
                  <div className="font-semibold">{data.contestData.contestGlobalRanking.toLocaleString()}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LeetCode Badges */}
        {data.badges && data.badges.length > 0 && (
          <div className="pt-4 border-t space-y-3">
            <div className="text-sm font-semibold text-aqua flex items-center gap-2">
              <Award className="h-4 w-4" />
              Earned Badges
            </div>
            <div className="flex flex-wrap gap-2">
              {data.badges.slice(0, 6).map((badge, index) => (
                <div
                  key={badge.id || index}
                  className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-xs"
                  title={badge.displayName || badge.name}
                >
                  {badge.icon && <img src={badge.icon} alt="" className="h-4 w-4" />}
                  <span className="truncate max-w-[100px]">{badge.displayName || badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Badge URLs */}
        <div className="flex flex-wrap gap-2 justify-center pt-4 border-t">
          {Object.values(data.badgeUrls).filter(Boolean).map((badgeUrl, index) => (
            <img
              key={index}
              src={badgeUrl as string}
              alt="LeetCode Badge"
              className="h-7 transition-transform hover:scale-105"
              loading="lazy"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
