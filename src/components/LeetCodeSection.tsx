import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Flame, Trophy, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";
import { fetchFromAPI, API_ENDPOINTS } from "@/lib/api";

/* ── types ─────────────────────────────────────────────────────── */
interface ContestEntry {
  attended: boolean;
  rating: number;
  ranking: number;
  trendDirection?: string;
  problemsSolved: number;
  totalProblems: number;
  contest: { title: string; startTime: number };
}

interface LeetCodeData {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalQuestions: number;
  easyTotal: number;
  mediumTotal: number;
  hardTotal: number;
  ranking: number;
  streak: number;
  longestStreak?: number;
  submissionCalendar?: Record<string, number>;
  contestData?: {
    contestAttend: number;
    contestRating: number;
    contestGlobalRanking: number;
    contestTopPercentage: number;
    totalParticipants: number;
    contestBadges?: { name: string };
    contestParticipation?: ContestEntry[];
  };
  badges?: Array<{ id: string; name: string; displayName: string; icon: string }>;
}

/* ── colours ───────────────────────────────────────────────────── */
const EASY = "#00b8a3";
const MEDIUM = "#ffa116";
const HARD = "#ff375f";

/* ── SolvedDonut ───────────────────────────────────────────────── */
function SolvedDonut({ easy, medium, hard, total }: { easy: number; medium: number; hard: number; total: number }) {
  const r = 70, stroke = 10, circ = 2 * Math.PI * r;
  const all = easy + medium + hard;
  const eLen = (easy / (all || 1)) * circ;
  const mLen = (medium / (all || 1)) * circ;
  const hLen = (hard / (all || 1)) * circ;

  return (
    <div className="relative w-44 h-44 mx-auto" role="img" aria-label={`${all} of ${total} problems solved`}>
      <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
        <circle cx={80} cy={80} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-muted/30" />
        <circle cx={80} cy={80} r={r} fill="none" stroke={EASY} strokeWidth={stroke}
          strokeDasharray={`${eLen} ${circ - eLen}`} strokeDashoffset={0} strokeLinecap="round" />
        <circle cx={80} cy={80} r={r} fill="none" stroke={MEDIUM} strokeWidth={stroke}
          strokeDasharray={`${mLen} ${circ - mLen}`} strokeDashoffset={-eLen} strokeLinecap="round" />
        <circle cx={80} cy={80} r={r} fill="none" stroke={HARD} strokeWidth={stroke}
          strokeDasharray={`${hLen} ${circ - hLen}`} strokeDashoffset={-(eLen + mLen)} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{all}</span>
        <span className="text-xs text-muted-foreground">Solved</span>
      </div>
    </div>
  );
}

/* ── SubmissionHeatmap ─────────────────────────────────────────── */
function SubmissionHeatmap({ calendar }: { calendar: Record<string, number> }) {
  const { weeks, months, totalSubmissions } = useMemo(() => {
    const today = new Date();
    const entries: { date: string; count: number }[] = [];

    for (let i = 370; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const ds = d.toISOString().split("T")[0];
      // calendar keys are unix‑timestamp strings
      const ts = Math.floor(new Date(ds).getTime() / 1000);
      entries.push({ date: ds, count: calendar[ts] || calendar[ts.toString()] || 0 });
    }

    const recent = entries.slice(-371);
    const firstDay = new Date(recent[0].date).getDay();
    const padded = [
      ...Array.from({ length: firstDay }, () => ({ date: "", count: 0 })),
      ...recent,
    ];

    const ws: typeof padded extends (infer T)[] ? T[][] : never = [];
    for (let i = 0; i < padded.length; i += 7) ws.push(padded.slice(i, i + 7));

    const ms: { label: string; col: number }[] = [];
    let last = "";
    ws.forEach((w, ci) => {
      const f = w.find((d) => d.date);
      if (!f) return;
      const m = new Date(f.date).toLocaleString("default", { month: "short" });
      if (m !== last) { ms.push({ label: m, col: ci }); last = m; }
    });

    const tot = recent.reduce((s, e) => s + e.count, 0);
    return { weeks: ws, months: ms, totalSubmissions: tot };
  }, [calendar]);

  const colour = (c: number) =>
    c === 0 ? "bg-[#161b22]" :
    c <= 2 ? "bg-orange-900/60" :
    c <= 5 ? "bg-orange-700/70" :
    c <= 10 ? "bg-orange-500" : "bg-orange-400";

  return (
    <div className="overflow-x-auto" role="img" aria-label={`${totalSubmissions} LeetCode submissions in the last year`}>
      <div className="flex text-[10px] text-muted-foreground mb-1 ml-7" aria-hidden>
        {months.map((m, i) => (
          <span key={i} style={{ position: "relative", left: `${m.col * 14}px` }} className="absolute">
            {m.label}
          </span>
        ))}
      </div>
      <div className="flex gap-[3px] mt-5">
        <div className="flex flex-col gap-[3px] text-[10px] text-muted-foreground pr-1" aria-hidden>
          {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
            <span key={i} className="h-[11px] leading-[11px]">{d}</span>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day, di) => (
              <div
                key={di}
                className={cn("w-[11px] h-[11px] rounded-sm", colour(day.count))}
                title={day.date ? `${day.count} submissions on ${day.date}` : ""}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground justify-end" aria-hidden>
        Less
        {[0, 1, 3, 6, 11].map((c) => (
          <div key={c} className={cn("w-[11px] h-[11px] rounded-sm", colour(c))} />
        ))}
        More
      </div>
    </div>
  );
}

/* ── RatingChart ───────────────────────────────────────────────── */
function RatingChart({ contests }: { contests: ContestEntry[] }) {
  const data = [...contests].reverse().slice(-15);
  if (data.length < 2) return null;

  const ratings = data.map((c) => c.rating);
  const minR = Math.min(...ratings) - 50;
  const maxR = Math.max(...ratings) + 50;
  const range = maxR - minR || 100;
  const W = 400, H = 120;

  const pts = data.map((c, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((c.rating - minR) / range) * (H - 10),
  }));

  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `0,${H} ${line} ${W},${H}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-28" preserveAspectRatio="none" role="img" aria-label="Contest rating trend">
      <defs>
        <linearGradient id="ratingFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#ratingFill)" />
      <polyline points={line} fill="none" stroke="#f59e0b" strokeWidth="2" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={i === pts.length - 1 ? "#fff" : "#f59e0b"} />
      ))}
    </svg>
  );
}

/* ── main export ───────────────────────────────────────────────── */
export default function LeetCodeSection() {
  const { elementRef, isIntersecting } = useIntersectionObserver({ threshold: 0.05, rootMargin: "-80px" });
  const [data, setData] = useState<LeetCodeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const d = await fetchFromAPI(API_ENDPOINTS.LEETCODE_STATS);
        setData(d);
      } catch (e) {
        console.error("Error loading LeetCode data:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <section id="leetcode" className="py-16 md:py-24 bg-muted/50" aria-label="LeetCode profile">
        <div className="container mx-auto px-4 md:px-6 space-y-6">
          <Skeleton className="h-8 w-60" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-52" />)}
          </div>
        </div>
      </section>
    );
  }

  const d = data ?? {
    username: "akashyadv7233", totalSolved: 0, easySolved: 0, mediumSolved: 0,
    hardSolved: 0, totalQuestions: 3322, easyTotal: 829, mediumTotal: 1740, hardTotal: 753,
    ranking: 0, streak: 0,
  };

  const totalQ = d.easyTotal + d.mediumTotal + d.hardTotal;
  const cd = d.contestData;

  return (
    <section
      id="leetcode"
      ref={elementRef as React.RefObject<HTMLElement>}
      className={cn(
        "py-16 md:py-24 bg-muted/50 transition-all duration-700",
        isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      aria-label="LeetCode profile and statistics"
    >
      <div className="container mx-auto px-4 md:px-6 space-y-8">
        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="section-title">LeetCode</h2>
          <a
            href={`https://leetcode.com/u/${d.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-aqua hover:underline flex items-center gap-1"
          >
            @{d.username} <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 3-col cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Solved card */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <SolvedDonut easy={d.easySolved} medium={d.mediumSolved} hard={d.hardSolved} total={totalQ} />
              <div className="mt-4 space-y-2">
                {[
                  { label: "Easy", solved: d.easySolved, total: d.easyTotal, color: EASY },
                  { label: "Medium", solved: d.mediumSolved, total: d.mediumTotal, color: MEDIUM },
                  { label: "Hard", solved: d.hardSolved, total: d.hardTotal, color: HARD },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-sm">
                    <span style={{ color: row.color }} className="font-medium">{row.label}</span>
                    <span className="text-muted-foreground">{row.solved} / {row.total}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contest card */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              {cd ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <span className="text-sm text-muted-foreground">Contest Rating</span>
                  </div>
                  <div className="text-4xl font-bold mb-1">{Math.round(cd.contestRating)}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    {cd.contestBadges?.name && (
                      <span className="text-teal-400 font-medium">{cd.contestBadges.name}</span>
                    )}
                    <span>Top {cd.contestTopPercentage}%</span>
                  </div>

                  <RatingChart contests={cd.contestParticipation || []} />

                  <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                    <div>
                      <div className="text-muted-foreground text-xs">Global Rank</div>
                      <div className="font-semibold">
                        {cd.contestGlobalRanking?.toLocaleString()}
                        <span className="text-muted-foreground text-xs"> / {cd.totalParticipants?.toLocaleString()}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Attended</div>
                      <div className="font-semibold">{cd.contestAttend}</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  No contest data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats & Streak card */}
          <Card className="bg-card border-border">
            <CardContent className="p-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="text-sm text-muted-foreground">Current Streak</span>
                </div>
                <div className="text-4xl font-bold">{d.streak}<span className="text-lg text-muted-foreground"> days</span></div>
                {d.longestStreak != null && (
                  <div className="text-xs text-muted-foreground mt-1">Longest: {d.longestStreak} days</div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-aqua" />
                  <span className="text-sm text-muted-foreground">Ranking</span>
                </div>
                <div className="text-2xl font-bold">{d.ranking?.toLocaleString() || "—"}</div>
              </div>
              {d.badges && d.badges.length > 0 && (
                <div>
                  <div className="text-xs text-muted-foreground mb-2">Badges</div>
                  <div className="flex flex-wrap gap-2">
                    {d.badges.map((b) => (
                      <span key={b.id} className="text-xs bg-muted px-2 py-1 rounded">{b.displayName || b.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* submission heatmap */}
        {d.submissionCalendar && Object.keys(d.submissionCalendar).length > 0 && (
          <Card className="bg-card border-border">
            <CardContent className="p-4 md:p-6">
              <p className="text-sm text-muted-foreground mb-3">Submission Activity</p>
              <SubmissionHeatmap calendar={d.submissionCalendar} />
            </CardContent>
          </Card>
        )}

        {/* recent contests */}
        {cd?.contestParticipation && cd.contestParticipation.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Contests</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cd.contestParticipation.slice(0, 6).map((c, i) => (
                <Card key={i} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium mb-1">{c.contest.title}</div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {new Date(c.contest.startTime * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span>Rank <strong>{c.ranking.toLocaleString()}</strong></span>
                      <span>Rating <strong>{Math.round(c.rating)}</strong></span>
                      <span>Solved <strong>{c.problemsSolved}/{c.totalProblems}</strong></span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
