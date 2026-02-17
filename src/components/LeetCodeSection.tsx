import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Trophy, Swords, Hash, Award, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";

const LEETCODE_USERNAME = "akashyadv7233";

const API_BASE = "https://alfa-leetcode-api.onrender.com";

/* ── types ─────────────────────────────────────────────────────── */
interface LeetCodeProfile {
  username: string;
  name: string;
  avatar: string;
  ranking: number;
  reputation: number;
  school: string | null;
}

interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
}

interface LeetCodeContest {
  contestRating: number;
  contestGlobalRanking: number;
  contestAttend: number;
  contestTopPercentage: number;
  contestBadge: string | null;
}

/* ── cache helpers ─────────────────────────────────────────────── */
const CACHE_KEY = "lc-data-cache";
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

interface CachedData {
  profile: LeetCodeProfile;
  stats: LeetCodeStats;
  contest: LeetCodeContest;
  ts: number;
}

function readCache(): CachedData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached: CachedData = JSON.parse(raw);
    if (Date.now() - cached.ts < CACHE_TTL) return cached;
  } catch { /* ignore */ }
  return null;
}

function writeCache(data: Omit<CachedData, "ts">) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...data, ts: Date.now() }));
  } catch { /* ignore */ }
}

function readStaleCache(): CachedData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

/* ── fetch with single-retry on 429 ──────────────────────────── */
async function fetchWithRetry(url: string, retries = 1): Promise<Response> {
  const res = await fetch(url);
  if (res.status === 429 && retries > 0) {
    await new Promise(r => setTimeout(r, 2000));
    return fetchWithRetry(url, retries - 1);
  }
  return res;
}

/* ── fetch all data (with cache + retry + stale fallback) ────── */
async function fetchLeetCodeData(username: string) {
  // Return fresh cache if available
  const cached = readCache();
  if (cached) return { profile: cached.profile, stats: cached.stats, contest: cached.contest };

  const [profileRes, solvedRes, contestRes] = await Promise.all([
    fetchWithRetry(`${API_BASE}/${username}`),
    fetchWithRetry(`${API_BASE}/${username}/solved`),
    fetchWithRetry(`${API_BASE}/${username}/contest`),
  ]);

  // If any response is a 429, try stale cache before failing
  if (!profileRes.ok || !solvedRes.ok || !contestRes.ok) {
    const stale = readStaleCache();
    if (stale) return { profile: stale.profile, stats: stale.stats, contest: stale.contest };
    throw new Error("LeetCode API rate limited");
  }

  const profileData = await profileRes.json();
  const solvedData = await solvedRes.json();
  const contestData = await contestRes.json();

  // acSubmissionNum has { difficulty, count, submissions }
  const acStats = solvedData.acSubmissionNum || [];
  const allAc = acStats.find((s: any) => s.difficulty === "All");

  const profile: LeetCodeProfile = {
    username: profileData.username ?? username,
    name: profileData.name ?? username,
    avatar: profileData.avatar ?? "",
    ranking: profileData.ranking ?? 0,
    reputation: profileData.reputation ?? 0,
    school: profileData.school ?? null,
  };

  const stats: LeetCodeStats = {
    totalSolved: solvedData.solvedProblem ?? 0,
    easySolved: solvedData.easySolved ?? 0,
    mediumSolved: solvedData.mediumSolved ?? 0,
    hardSolved: solvedData.hardSolved ?? 0,
    totalSubmissions: allAc?.submissions ?? 0,
    acceptedSubmissions: allAc?.count ?? 0,
  };

  const contest: LeetCodeContest = {
    contestRating: contestData.contestRating ?? 0,
    contestGlobalRanking: contestData.contestGlobalRanking ?? 0,
    contestAttend: contestData.contestAttend ?? 0,
    contestTopPercentage: contestData.contestTopPercentage ?? 0,
    contestBadge: contestData.contestBadges?.name ?? null,
  };

  writeCache({ profile, stats, contest });
  return { profile, stats, contest };
}

/* ── colours ───────────────────────────────────────────────────── */
const EASY = "#00b8a3";
const MEDIUM = "#ffa116";
const HARD = "#ff375f";

/* ── SolvedDonut ───────────────────────────────────────────────── */
function SolvedDonut({ easy, medium, hard }: { easy: number; medium: number; hard: number }) {
  const r = 60, stroke = 10, circ = 2 * Math.PI * r;
  const all = easy + medium + hard;
  const eLen = (easy / (all || 1)) * circ;
  const mLen = (medium / (all || 1)) * circ;
  const hLen = (hard / (all || 1)) * circ;

  return (
    <div className="relative w-36 h-36 mx-auto" role="img" aria-label={`${all} problems solved`}>
      <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
        <circle cx={70} cy={70} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-muted/30" />
        <circle cx={70} cy={70} r={r} fill="none" stroke={EASY} strokeWidth={stroke}
          strokeDasharray={`${eLen} ${circ - eLen}`} strokeDashoffset={0} strokeLinecap="round" />
        <circle cx={70} cy={70} r={r} fill="none" stroke={MEDIUM} strokeWidth={stroke}
          strokeDasharray={`${mLen} ${circ - mLen}`} strokeDashoffset={-eLen} strokeLinecap="round" />
        <circle cx={70} cy={70} r={r} fill="none" stroke={HARD} strokeWidth={stroke}
          strokeDasharray={`${hLen} ${circ - hLen}`} strokeDashoffset={-(eLen + mLen)} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{all}</span>
        <span className="text-[10px] text-muted-foreground">Solved</span>
      </div>
    </div>
  );
}

/* ── main export ───────────────────────────────────────────────── */
export default function LeetCodeSection() {
  const { elementRef, isIntersecting } = useIntersectionObserver({ threshold: 0.05, rootMargin: "-80px" });
  const [profile, setProfile] = useState<LeetCodeProfile | null>(null);
  const [stats, setStats] = useState<LeetCodeStats | null>(null);
  const [contest, setContest] = useState<LeetCodeContest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heatmapError, setHeatmapError] = useState(false);

  // Detect site theme for leetcard
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined" ? document.documentElement.classList.contains("dark") : true
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchLeetCodeData(LEETCODE_USERNAME);
        setProfile(data.profile);
        setStats(data.stats);
        setContest(data.contest);
      } catch (e: any) {
        console.error("Error loading LeetCode data:", e);
        setError(e.message || "Failed to load LeetCode data");
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
          <div className="flex items-center gap-5">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-60" />
            <Skeleton className="h-60" />
          </div>
          <Skeleton className="h-48 w-full" />
        </div>
      </section>
    );
  }

  if (error && !stats) {
    return (
      <section id="leetcode" className="py-16 md:py-24 bg-muted/50" aria-label="LeetCode profile">
        <div className="container mx-auto px-4 md:px-6 text-center text-muted-foreground">
          <p>Unable to load LeetCode data. Please try again later.</p>
        </div>
      </section>
    );
  }

  const d = stats ?? { totalSolved: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0, totalSubmissions: 0, acceptedSubmissions: 0 };
  const c = contest ?? { contestRating: 0, contestGlobalRanking: 0, contestAttend: 0, contestTopPercentage: 0, contestBadge: null };

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
            href={`https://leetcode.com/u/${LEETCODE_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-aqua hover:underline flex items-center gap-1"
          >
            @{LEETCODE_USERNAME} <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* ── profile card ─────────────────────────────────────── */}
        {profile && (
          <Card className="bg-card border-border">
            <CardContent className="p-5 md:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                {profile.avatar && (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-20 h-20 rounded-full ring-2 ring-amber-400/30"
                    loading="lazy"
                  />
                )}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground">@{profile.username}</p>
                  {profile.school && (
                    <p className="text-xs text-muted-foreground mt-1">{profile.school}</p>
                  )}
                  {/* key stats row */}
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm justify-center sm:justify-start">
                    <span className="flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <strong className="text-foreground">#{profile.ranking.toLocaleString()}</strong>
                      <span className="text-muted-foreground">ranking</span>
                    </span>
                    {c.contestBadge && (
                      <>
                        <span className="text-muted-foreground">·</span>
                        <span className="flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-amber-400" />
                          <strong className="text-foreground">{c.contestBadge}</strong>
                        </span>
                      </>
                    )}
                    <span className="text-muted-foreground">·</span>
                    <span>
                      <strong className="text-foreground">{d.totalSolved}</strong>{" "}
                      <span className="text-muted-foreground">solved</span>
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── questions solved + contest rating ────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* solved breakdown card */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">Problems Solved</h3>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <SolvedDonut easy={d.easySolved} medium={d.mediumSolved} hard={d.hardSolved} />
                <div className="flex-1 space-y-3 w-full">
                  {[
                    { label: "Easy", solved: d.easySolved, color: EASY },
                    { label: "Medium", solved: d.mediumSolved, color: MEDIUM },
                    { label: "Hard", solved: d.hardSolved, color: HARD },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-3">
                      <span className="w-16 text-sm font-medium" style={{ color: row.color }}>{row.label}</span>
                      <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(row.solved / (d.totalSolved || 1)) * 100}%`,
                            backgroundColor: row.color,
                          }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground font-mono w-10 text-right">{row.solved}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* contest & rank card */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">Contest Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-muted-foreground">Contest Rating</span>
                  </div>
                  <p className="text-3xl font-bold">{Math.round(c.contestRating)}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-aqua" />
                    <span className="text-xs text-muted-foreground">Global Rank</span>
                  </div>
                  <p className="text-3xl font-bold">#{c.contestGlobalRanking.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Swords className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-muted-foreground">Contests</span>
                  </div>
                  <p className="text-2xl font-bold">{c.contestAttend}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-muted-foreground">Top %</span>
                  </div>
                  <p className="text-2xl font-bold">{c.contestTopPercentage.toFixed(1)}%</p>
                </div>
              </div>
              {c.contestBadge && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="text-sm font-semibold">{c.contestBadge}</span>
                    <span className="text-xs text-muted-foreground">badge</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── LeetCard heatmap embed (bottom) ──────────────────── */}
        {!heatmapError && (
          <Card className="bg-card border-border">
            <CardContent className="p-4 md:p-6">
              <p className="text-sm text-muted-foreground mb-3">Submission Activity</p>
              <div className="overflow-hidden rounded">
                {/* The leetcard ext=heatmap image includes stats on top + heatmap below.
                    We crop the top ~55% (stats) away with negative margin + overflow hidden
                    so only the heatmap portion is visible. */}
                <img
                  key={isDark ? "dark" : "light"}
                  src={`https://leetcard.jacoblin.cool/${LEETCODE_USERNAME}?theme=${isDark ? "dark" : "light"}&font=Noto%20Sans&ext=heatmap`}
                  alt={`LeetCode submission heatmap for ${LEETCODE_USERNAME} showing daily coding activity`}
                  className="w-full select-none"
                  style={{ marginTop: "-45%" }}
                  loading="lazy"
                  onError={() => setHeatmapError(true)}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
