import { Trophy, TrendingUp, Users, Award, Medal, ArrowUp, ArrowDown, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ContestParticipation {
  attended: boolean;
  rating: number;
  ranking: number;
  trendDirection: string;
  problemsSolved: number;
  totalProblems: number;
  finishTimeInSeconds: number;
  contest: {
    title: string;
    startTime: number;
  };
}

interface ContestData {
  contestAttend: number;
  contestRating: number;
  contestGlobalRanking: number | null;
  contestTopPercentage: number | null;
  totalParticipants: number;
  contestBadges?: {
    name: string;
  };
  contestParticipation?: ContestParticipation[];
}

interface LeetCodeContestProps {
  contestData: ContestData | null;
}

const getRatingColor = (rating: number) => {
  if (rating >= 2400) return "text-red-500";
  if (rating >= 2000) return "text-orange-500";
  if (rating >= 1600) return "text-purple-500";
  if (rating >= 1400) return "text-blue-500";
  return "text-gray-500";
};

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

export function LeetCodeContest({ contestData }: LeetCodeContestProps) {
  if (!contestData || contestData.contestAttend === 0) {
    return null;
  }

  const ratingColor = getRatingColor(contestData.contestRating);

  return (
    <Card className="w-full border-2 border-aqua/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-aqua">
          <Trophy className="h-5 w-5" />
          Contest Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contest Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className={`text-3xl font-bold ${ratingColor}`}>
              {Math.round(contestData.contestRating)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Rating</div>
            {contestData.contestBadges?.name && (
              <Badge className="mt-2 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30">
                {contestData.contestBadges.name}
              </Badge>
            )}
          </div>

          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-3xl font-bold text-aqua">{contestData.contestAttend}</div>
            <div className="text-sm text-muted-foreground mt-1">Contests</div>
          </div>

          {contestData.contestTopPercentage !== null && (
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                Top {contestData.contestTopPercentage}%
              </div>
              <div className="text-sm text-muted-foreground mt-1">Percentile</div>
            </div>
          )}

          {contestData.contestGlobalRanking !== null && (
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {contestData.contestGlobalRanking.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Global Rank</div>
            </div>
          )}
        </div>

        {/* Recent Contests */}
        {contestData.contestParticipation && contestData.contestParticipation.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground">Recent Contests</h4>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {contestData.contestParticipation.slice(0, 5).map((contest, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">
                        {contest.contest.title}
                      </span>
                      {contest.trendDirection === "UP" ? (
                        <ArrowUp className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-500 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        Rank: {contest.ranking.toLocaleString()}
                      </span>
                      <span>
                        Solved: {contest.problemsSolved}/{contest.totalProblems}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(contest.finishTimeInSeconds)}
                      </span>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${getRatingColor(contest.rating)} flex-shrink-0 ml-3`}>
                    {Math.round(contest.rating)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
