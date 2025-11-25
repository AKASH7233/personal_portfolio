import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeetCodeProfileProps {
  data?: {
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
  };
}

export function LeetCodeProfile({ data }: LeetCodeProfileProps) {
  const defaultData = {
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    easyTotal: 829,
    mediumTotal: 1740,
    hardTotal: 753,
    ranking: 0,
    streak: 0,
    longestStreak: 0,
  };

  const leetcodeData = data || defaultData;
  const isDataAvailable = !!data;

  const totalQuestions =
    leetcodeData.easyTotal +
    leetcodeData.mediumTotal +
    leetcodeData.hardTotal;

  const solvedPercentage = (
    (leetcodeData.totalSolved / totalQuestions) *
    100
  ).toFixed(1);

  // Contest rating chart
  const ratingHistory = data?.contestData?.contestParticipation || [];
  const ratings =
    ratingHistory.length > 0
      ? ratingHistory
          .slice(0, 10)
          .reverse()
          .map((p) => p.rating)
      : [1500, 1600, 1700, 1750, 1800, 1850, 1869];

  const minRating = Math.min(...ratings);
  const maxRating = Math.max(...ratings);
  const ratingRange = maxRating - minRating || 100;

  return (
    <div className="space-y-6">
      {!isDataAvailable && (
        <Card className="bg-[#282828] border-[#3a3a3a] text-white">
          <CardContent className="p-6 text-center text-gray-400">
            <div className="text-lg font-semibold mb-2">
              Loading LeetCode Data...
            </div>
            <div className="text-sm">
              Data will appear once loaded from the API
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contest Section */}
        {data?.contestData && (
          <Card className="bg-[#282828] border-[#3a3a3a] text-white">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">
                      Contest Rating
                    </div>
                    <div className="text-4xl font-bold">
                      {Math.round(data.contestData.contestRating)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-[#282828] rotate-45 rounded"></div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Level</div>
                      <div className="text-teal-400 font-semibold">
                        {data.contestData.contestBadges?.name || "Knight"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-1">
                      Global Ranking
                    </div>
                    <div className="text-lg font-semibold">
                      {data.contestData.contestGlobalRanking?.toLocaleString()}
                      <span className="text-gray-500 text-sm">
                        /{data.contestData.totalParticipants?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-1">Attended</div>
                    <div className="text-lg font-semibold">
                      {data.contestData.contestAttend}
                    </div>
                  </div>
                </div>

                {/* Rating Graph */}
                <div>
                  <div className="text-sm text-gray-400 mb-1">Top</div>
                  <div className="text-4xl font-bold mb-4">
                    {data.contestData.contestTopPercentage}%
                  </div>

                  <div className="relative h-24">
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 400 100"
                      preserveAspectRatio="none"
                    >
                      <polyline
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2"
                        points={ratings
                          .map((rating, i) => {
                            const x =
                              (i / (ratings.length - 1)) *
                              400;
                            const y =
                              100 -
                              ((rating - minRating) / ratingRange) * 90;
                            return `${x},${y}`;
                          })
                          .join(" ")}
                      />

                      {ratings.map((rating, i) => {
                        const x =
                          (i / (ratings.length - 1)) *
                          400;
                        const y =
                          100 -
                          ((rating - minRating) / ratingRange) *
                            90;
                        return (
                          <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="3"
                            fill={
                              i === ratings.length - 1 ? "#fff" : "#f59e0b"
                            }
                          />
                        );
                      })}
                    </svg>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Problems Solved Section */}
        <Card className="bg-[#282828] border-[#3a3a3a] text-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6">
              {/* LEFT SIDE — Circle */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 192 192"
                  >
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="#3a3a3a"
                      strokeWidth="12"
                    />

                    {/* EASY */}
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="#00b8a3"
                      strokeWidth="12"
                      strokeDasharray={`${
                        (leetcodeData.easySolved /
                          leetcodeData.easyTotal) *
                        502.65
                      } 502.65`}
                      strokeLinecap="round"
                    />

                    {/* MEDIUM */}
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="#ffc01e"
                      strokeWidth="12"
                      strokeDasharray={`${
                        (leetcodeData.mediumSolved /
                          leetcodeData.mediumTotal) *
                        502.65
                      } 502.65`}
                      strokeDashoffset={`${
                        -(leetcodeData.easySolved /
                          leetcodeData.easyTotal) *
                        502.65
                      }`}
                      strokeLinecap="round"
                    />

                    {/* HARD */}
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="#ef4743"
                      strokeWidth="12"
                      strokeDasharray={`${
                        (leetcodeData.hardSolved /
                          leetcodeData.hardTotal) *
                        502.65
                      } 502.65`}
                      strokeDashoffset={`${
                        -(
                          (leetcodeData.easySolved /
                            leetcodeData.easyTotal) +
                          (leetcodeData.mediumSolved /
                            leetcodeData.mediumTotal)
                        ) * 502.65
                      }`}
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl lg:text-5xl font-bold">
                      {leetcodeData.totalSolved}
                    </div>
                    <div className="text-sm text-gray-400">
                      /{totalQuestions}
                    </div>
                    <div className="text-sm text-green-400 mt-1">
                      ✓ Solved
                    </div>
                  </div>
                </div>

                {/* 🔥 FIX: Attempting label placed OUTSIDE */}
                <div className="mt-3 text-xs sm:text-sm text-gray-400">
                  17 Attempting
                </div>
              </div>

              {/* RIGHT SIDE — Category Boxes */}
              <div className="flex flex-col justify-center space-y-4">
                <div className="bg-[#00b8a3]/10 border border-[#00b8a3]/30 rounded-lg p-3">
                  <div className="text-[#00b8a3] text-sm font-medium mb-1">
                    Easy
                  </div>
                  <div className="text-xl font-bold">
                    {leetcodeData.easySolved}
                    <span className="text-gray-500 text-sm">
                      /{leetcodeData.easyTotal}
                    </span>
                  </div>
                </div>

                <div className="bg-[#ffc01e]/10 border border-[#ffc01e]/30 rounded-lg p-3">
                  <div className="text-[#ffc01e] text-sm font-medium mb-1">
                    Med.
                  </div>
                  <div className="text-xl font-bold">
                    {leetcodeData.mediumSolved}
                    <span className="text-gray-500 text-sm">
                      /{leetcodeData.mediumTotal}
                    </span>
                  </div>
                </div>

                <div className="bg-[#ef4743]/10 border border-[#ef4743]/30 rounded-lg p-3">
                  <div className="text-[#ef4743] text-sm font-medium mb-1">
                    Hard
                  </div>
                  <div className="text-xl font-bold">
                    {leetcodeData.hardSolved}
                    <span className="text-gray-500 text-sm">
                      /{leetcodeData.hardTotal}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Profile Button */}
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
