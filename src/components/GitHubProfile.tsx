import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Star, GitFork, MapPin, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";
import { fetchFromAPI, API_ENDPOINTS } from "@/lib/api";

/* ── types ─────────────────────────────────────────────────────── */
interface Repo {
  id: number;
  name: string;
  description: string;
  htmlUrl: string;
  homepage?: string;
  language: string;
  stars: number;
  forks: number;
  topics: string[];
  updatedAt: string;
}

interface Contribution { date: string; count: number; level: string }
interface TopLanguage { language: string; count: number }

interface ReposData {
  repositories: Repo[];
  topLanguages: TopLanguage[];
  totalRepos: number;
  totalStars: number;
}
interface ContribData { totalContributions: number; contributions: Contribution[] }
interface StatsData  { followers: number; following: number; publicRepos: number; location?: string }

/* ── colour helpers ────────────────────────────────────────────── */
const LANG_COLOURS: Record<string, string> = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572a5",
  Java: "#b07219", HTML: "#e34c26", CSS: "#563d7c", "C++": "#f34b7d",
  Ruby: "#701516", Go: "#00add8", Rust: "#dea584", Shell: "#89e051",
};

const LEVEL_COLOUR: Record<string, string> = {
  NONE: "bg-[#161b22] dark:bg-[#161b22]",
  FIRST_QUARTILE: "bg-[#0e4429] dark:bg-[#0e4429]",
  SECOND_QUARTILE: "bg-[#006d32] dark:bg-[#006d32]",
  THIRD_QUARTILE: "bg-[#26a641] dark:bg-[#26a641]",
  FOURTH_QUARTILE: "bg-[#39d353] dark:bg-[#39d353]",
};

/* ── ContributionHeatmap ───────────────────────────────────────── */
function ContributionHeatmap({ contributions, total }: { contributions: Contribution[]; total: number }) {
  const { weeks, months } = useMemo(() => {
    const sorted = [...contributions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    // only keep last ~52 weeks (364 days)
    const recent = sorted.slice(-371);
    // pad so the first column starts on Sunday
    const firstDay = new Date(recent[0]?.date ?? new Date()).getDay();
    const padded = [
      ...Array.from({ length: firstDay }, () => ({ date: "", count: 0, level: "NONE" })),
      ...recent,
    ];

    const ws: Contribution[][] = [];
    for (let i = 0; i < padded.length; i += 7) ws.push(padded.slice(i, i + 7));

    // month labels
    const ms: { label: string; col: number }[] = [];
    let last = "";
    ws.forEach((w, ci) => {
      const first = w.find((d) => d.date);
      if (!first) return;
      const m = new Date(first.date).toLocaleString("default", { month: "short" });
      if (m !== last) { ms.push({ label: m, col: ci }); last = m; }
    });

    return { weeks: ws, months: ms };
  }, [contributions]);

  return (
    <div className="overflow-x-auto" role="img" aria-label={`GitHub contribution graph — ${total} contributions in the last year`}>
      {/* month labels */}
      <div className="flex text-[10px] text-muted-foreground mb-1 ml-7" aria-hidden>
        {months.map((m, i) => (
          <span key={i} style={{ position: "relative", left: `${m.col * 14}px` }} className="absolute">
            {m.label}
          </span>
        ))}
      </div>
      <div className="flex gap-[3px] mt-5">
        {/* day labels */}
        <div className="flex flex-col gap-[3px] text-[10px] text-muted-foreground pr-1" aria-hidden>
          {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
            <span key={i} className="h-[11px] leading-[11px]">{d}</span>
          ))}
        </div>
        {/* grid */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day, di) => (
              <div
                key={di}
                className={cn("w-[11px] h-[11px] rounded-sm", LEVEL_COLOUR[day.level] || LEVEL_COLOUR.NONE)}
                title={day.date ? `${day.count} contributions on ${day.date}` : ""}
              />
            ))}
          </div>
        ))}
      </div>
      {/* legend */}
      <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground justify-end" aria-hidden>
        Less
        {["NONE", "FIRST_QUARTILE", "SECOND_QUARTILE", "THIRD_QUARTILE", "FOURTH_QUARTILE"].map((l) => (
          <div key={l} className={cn("w-[11px] h-[11px] rounded-sm", LEVEL_COLOUR[l])} />
        ))}
        More
      </div>
    </div>
  );
}

/* ── LanguageBar ───────────────────────────────────────────────── */
function LanguageBar({ languages }: { languages: TopLanguage[] }) {
  const total = languages.reduce((s, l) => s + l.count, 0);
  return (
    <div>
      <div className="flex h-2 rounded-full overflow-hidden" role="img" aria-label="Language breakdown">
        {languages.map((l) => (
          <div
            key={l.language}
            style={{ width: `${(l.count / total) * 100}%`, backgroundColor: LANG_COLOURS[l.language] || "#8b949e" }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
        {languages.map((l) => (
          <span key={l.language} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: LANG_COLOURS[l.language] || "#8b949e" }} />
            {l.language} <span className="opacity-60">{((l.count / total) * 100).toFixed(1)}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── RepoCard ──────────────────────────────────────────────────── */
function RepoCard({ repo }: { repo: Repo }) {
  return (
    <Card className="bg-card border-border hover:border-aqua/40 transition-colors h-full">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex items-start justify-between mb-1">
          <a
            href={repo.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-aqua font-semibold hover:underline text-sm flex items-center gap-1"
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            {repo.name}
          </a>
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-aqua"
              aria-label={`Live demo of ${repo.name}`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
          {repo.description || "No description"}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
          {repo.language && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: LANG_COLOURS[repo.language] || "#8b949e" }} />
              {repo.language}
            </span>
          )}
          {repo.stars > 0 && (
            <span className="flex items-center gap-0.5"><Star className="w-3 h-3" />{repo.stars}</span>
          )}
          {repo.forks > 0 && (
            <span className="flex items-center gap-0.5"><GitFork className="w-3 h-3" />{repo.forks}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ── main export ───────────────────────────────────────────────── */
export default function GitHubProfile() {
  const { elementRef, isIntersecting } = useIntersectionObserver({ threshold: 0.05, rootMargin: "-80px" });
  const [repos, setRepos] = useState<ReposData | null>(null);
  const [contribs, setContribs] = useState<ContribData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [r, c, s] = await Promise.all([
          fetchFromAPI(API_ENDPOINTS.GITHUB_REPOS),
          fetchFromAPI(API_ENDPOINTS.GITHUB_CONTRIBUTIONS),
          fetchFromAPI(API_ENDPOINTS.GITHUB_STATS),
        ]);
        setRepos(r);
        setContribs(c);
        setStats(s);
      } catch (e) {
        console.error("Error loading GitHub data:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <section id="github" className="py-16 md:py-24" aria-label="GitHub profile">
        <div className="container mx-auto px-4 md:px-6 space-y-6">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-40 w-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="github"
      ref={elementRef as React.RefObject<HTMLElement>}
      className={cn(
        "py-16 md:py-24 transition-all duration-700",
        isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      aria-label="GitHub profile and contributions"
    >
      <div className="container mx-auto px-4 md:px-6 space-y-8">
        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="section-title">GitHub</h2>
          <a
            href="https://github.com/AKASH7233"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-aqua hover:underline flex items-center gap-1"
          >
            @AKASH7233 <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* stats row */}
        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
          <span><strong className="text-foreground">{repos?.totalRepos ?? stats?.publicRepos ?? 0}</strong> repositories</span>
          <span><strong className="text-foreground">{repos?.totalStars ?? 0}</strong> stars</span>
          <span><strong className="text-foreground">{stats?.followers ?? 0}</strong> followers</span>
          {stats?.location && (
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{stats.location}</span>
          )}
        </div>

        {/* contribution heatmap */}
        {contribs && (
          <Card className="bg-card border-border">
            <CardContent className="p-4 md:p-6">
              <p className="text-sm text-muted-foreground mb-3">
                <strong className="text-foreground">{contribs.totalContributions.toLocaleString()}</strong> contributions in the last year
              </p>
              <ContributionHeatmap contributions={contribs.contributions} total={contribs.totalContributions} />
            </CardContent>
          </Card>
        )}

        {/* language bar */}
        {repos?.topLanguages && repos.topLanguages.length > 0 && (
          <LanguageBar languages={repos.topLanguages} />
        )}

        {/* repos grid */}
        {repos?.repositories && repos.repositories.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Pinned Repositories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {repos.repositories.slice(0, 6).map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
