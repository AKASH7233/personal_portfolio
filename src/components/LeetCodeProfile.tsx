import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeetCodeProfileProps {
  data: {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    easyTotal: number;
    mediumTotal: number;
    hardTotal: number;
    ranking?: number;
    streak: number;
    longestStreak?: number;
    contestData?: {
      contestAttend: number;
      contestRating: number;
      contestGlobalRanking: number;
      contestTopPercentage: number;
      totalParticipants: number;
      contestBadges?: {
        name: string;
      };
      contestParticipation?: Array<{
        attended: boolean;
        rating: number;
        ranking: number;
        contest: {
          title: string;
          startTime: number;
        };
      }>;
    };
    badges?: Array<{
      id: string;
      name: string;
      displayName?: string;
      icon?: string;
    }>;
  };
}

export function LeetCodeProfile({ data }: LeetCodeProfileProps) {
  const totalQuestions = data.easyTotal + data.mediumTotal + data.hardTotal;
  const solvedPercentage = ((data.totalSolved / totalQuestions) * 100).toFixed(1);
  
  // Calculate circle progress percentages
  const easyDegrees = (data.easySolved / data.easyTotal) * 360;
  const mediumDegrees = (data.mediumSolved / data.mediumTotal) * 360;
  const hardDegrees = (data.hardSolved / data.hardTotal) * 360;

  // Generate rating chart data points (simplified)
  const ratingHistory = data.contestData?.contestParticipation || [];
  const ratings = ratingHistory.length > 0 
    ? ratingHistory.slice(0, 10).reverse().map(p => p.rating)
    : [1500, 1600, 1700, 1750, 1800, 1850, 1869]; // Fallback ratings
  const minRating = ratings.length > 0 ? Math.min(...ratings) : 1500;
  const maxRating = ratings.length > 0 ? Math.max(...ratings) : 2000;
  const ratingRange = maxRating - minRating || 100;

  return (
    <div className="space-y-6">
      {/* Top Section - Contest Rating & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contest Rating Card */}
        {data.contestData && (
          <Card className="bg-[#282828] border-[#3a3a3a] text-white">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Left side - Rating info */}
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Contest Rating</div>
                    <div className="text-4xl font-bold">{Math.round(data.contestData.contestRating)}</div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-[#282828] rounded transform rotate-45"></div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Level</div>
                      <div className="text-teal-400 font-semibold">
                        {data.contestData.contestBadges?.name || "Knight"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-1">Global Ranking</div>
                    <div className="text-lg font-semibold">
                      {data.contestData.contestGlobalRanking?.toLocaleString()}
                      <span className="text-gray-500 text-sm">/{data.contestData.totalParticipants?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-1">Attended</div>
                    <div className="text-lg font-semibold">{data.contestData.contestAttend}</div>
                  </div>
                </div>

                {/* Right side - Rating chart */}
                <div>
                  <div className="text-sm text-gray-400 mb-1">Top</div>
                  <div className="text-4xl font-bold mb-4">{data.contestData.contestTopPercentage}%</div>
                  
                  {/* Simple rating graph */}
                  <div className="relative h-24">
                    {ratings.length > 1 ? (
                      <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                        <polyline
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="2"
                          points={ratings.map((rating, i) => {
                            const x = (i / Math.max(ratings.length - 1, 1)) * 400;
                            const y = 100 - ((rating - minRating) / ratingRange) * 90;
                            return `${x},${y}`;
                          }).join(' ')}
                        />
                        {ratings.map((rating, i) => {
                          const x = (i / Math.max(ratings.length - 1, 1)) * 400;
                          const y = 100 - ((rating - minRating) / ratingRange) * 90;
                          return (
                            <circle
                              key={i}
                              cx={x}
                              cy={y}
                              r="3"
                              fill={i === ratings.length - 1 ? "#fff" : "#f59e0b"}
                            />
                          );
                        })}
                      </svg>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                        No contest history
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
                      <span>Jun 2025</span>
                      <span>Nov 2025</span>
                    </div>
                  </div>
                  
                  {/* Bar chart for recent contests */}
                  <div className="flex items-end gap-0.5 h-12 mt-2">
                    {Array.from({ length: 30 }).map((_, i) => {
                      const height = i === 20 ? '100%' : Math.random() * 60 + 20 + '%';
                      const color = i === 20 ? '#f59e0b' : '#4a4a4a';
                      return (
                        <div
                          key={i}
                          className="flex-1 rounded-sm"
                          style={{ height, backgroundColor: color }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Problems Solved Card */}
        <Card className="bg-[#282828] border-[#3a3a3a] text-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Left - Circular Progress */}
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  {/* Background circle */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="#3a3a3a"
                      strokeWidth="12"
                    />
                    {/* Easy (green) - starts at top */}
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="#00b8a3"
                      strokeWidth="12"
                      strokeDasharray={`${(data.easySolved / data.easyTotal) * 502.65} 502.65`}
                      strokeLinecap="round"
                    />
                    {/* Medium (yellow) - continues after easy */}
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="#ffc01e"
                      strokeWidth="12"
                      strokeDasharray={`${(data.mediumSolved / data.mediumTotal) * 502.65} 502.65`}
                      strokeDashoffset={`${-(data.easySolved / data.easyTotal) * 502.65}`}
                      strokeLinecap="round"
                    />
                    {/* Hard (red) - continues after medium */}
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="#ef4743"
                      strokeWidth="12"
                      strokeDasharray={`${(data.hardSolved / data.hardTotal) * 502.65} 502.65`}
                      strokeDashoffset={`${-((data.easySolved / data.easyTotal) + (data.mediumSolved / data.mediumTotal)) * 502.65}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Center text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold">{data.totalSolved}</div>
                    <div className="text-sm text-gray-400">/{totalQuestions}</div>
                    <div className="text-sm text-green-400 mt-1">✓ Solved</div>
                  </div>
                </div>
                
                {/* Attempting badge - moved outside circle */}
                <div className="text-center mt-2 text-sm text-gray-400">
                  17 Attempting
                </div>
              </div>

              {/* Right - Category breakdown */}
              <div className="flex flex-col justify-center space-y-4">
                <div className="bg-[#00b8a3]/10 border border-[#00b8a3]/30 rounded-lg p-3">
                  <div className="text-[#00b8a3] text-sm font-medium mb-1">Easy</div>
                  <div className="text-2xl font-bold">
                    {data.easySolved}<span className="text-gray-500 text-lg">/{data.easyTotal}</span>
                  </div>
                </div>

                <div className="bg-[#ffc01e]/10 border border-[#ffc01e]/30 rounded-lg p-3">
                  <div className="text-[#ffc01e] text-sm font-medium mb-1">Med.</div>
                  <div className="text-2xl font-bold">
                    {data.mediumSolved}<span className="text-gray-500 text-lg">/{data.mediumTotal}</span>
                  </div>
                </div>

                <div className="bg-[#ef4743]/10 border border-[#ef4743]/30 rounded-lg p-3">
                  <div className="text-[#ef4743] text-sm font-medium mb-1">Hard</div>
                  <div className="text-2xl font-bold">
                    {data.hardSolved}<span className="text-gray-500 text-lg">/{data.hardTotal}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Full Profile Button */}
      <div className="flex justify-center mt-6">
        <Button
          asChild
          className="bg-gradient-to-r from-[#ffa116] to-[#ff8c00] hover:from-[#ff8c00] hover:to-[#ffa116] text-white border-0"
        >
          <a 
            href="https://leetcode.com/u/akashyadv7233" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            View Full Profile on LeetCode
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
