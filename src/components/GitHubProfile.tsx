import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Star, GitFork, MapPin, BookOpen, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";
import { GitHubCalendar } from "react-github-calendar";

const GITHUB_USERNAME = "AKASH7233";

/* ── types ─────────────────────────────────────────────────────── */
interface GitHubUser {
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  location: string | null;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  fork: boolean;
}

interface TopLanguage { language: string; count: number }

/* ── colour helpers ────────────────────────────────────────────── */
const LANG_COLOURS: Record<string, string> = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572a5",
  Java: "#b07219", HTML: "#e34c26", CSS: "#563d7c", "C++": "#f34b7d",
  Ruby: "#701516", Go: "#00add8", Rust: "#dea584", Shell: "#89e051",
};

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
function RepoCard({ repo }: { repo: GitHubRepo }) {
  return (
    <Card className="bg-card border-border hover:border-aqua/40 transition-colors h-full">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex items-start justify-between mb-1">
          <a
            href={repo.html_url}
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
          {repo.stargazers_count > 0 && (
            <span className="flex items-center gap-0.5"><Star className="w-3 h-3" />{repo.stargazers_count}</span>
          )}
          {repo.forks_count > 0 && (
            <span className="flex items-center gap-0.5"><GitFork className="w-3 h-3" />{repo.forks_count}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ── main export ───────────────────────────────────────────────── */
export default function GitHubProfile() {
  const { elementRef, isIntersecting } = useIntersectionObserver({ threshold: 0.05, rootMargin: "-80px" });
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [topLangs, setTopLangs] = useState<TopLanguage[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`),
        ]);

        if (!userRes.ok) throw new Error(`GitHub user API error: ${userRes.status}`);
        if (!reposRes.ok) throw new Error(`GitHub repos API error: ${reposRes.status}`);

        const userData: GitHubUser = await userRes.json();
        const reposData: GitHubRepo[] = await reposRes.json();

        // Filter out forks, compute top languages and stars
        const ownRepos = reposData.filter((r) => !r.fork);
        const langMap: Record<string, number> = {};
        let stars = 0;
        ownRepos.forEach((r) => {
          if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1;
          stars += r.stargazers_count;
        });
        const langs = Object.entries(langMap)
          .map(([language, count]) => ({ language, count }))
          .sort((a, b) => b.count - a.count);

        setUser(userData);
        setRepos(ownRepos);
        setTopLangs(langs);
        setTotalStars(stars);
      } catch (e: any) {
        console.error("Error loading GitHub data:", e);
        setError(e.message || "Failed to load GitHub data");
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
          <div className="flex items-center gap-6">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
          </div>
          <Skeleton className="h-40 w-full" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="github" className="py-16 md:py-24" aria-label="GitHub profile">
        <div className="container mx-auto px-4 md:px-6 text-center text-muted-foreground">
          <p>Unable to load GitHub data. Please try again later.</p>
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
            href={user?.html_url || `https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-aqua hover:underline flex items-center gap-1"
          >
            @{GITHUB_USERNAME} <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* ── profile card ─────────────────────────────────────── */}
        {user && (
          <Card className="bg-card border-border">
            <CardContent className="p-5 md:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-20 h-20 rounded-full ring-2 ring-aqua/30"
                  loading="lazy"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold">{user.name}</h3>
                  {user.bio && (
                    <p className="text-sm text-muted-foreground mt-1 max-w-xl">{user.bio}</p>
                  )}
                  {user.location && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 justify-center sm:justify-start">
                      <MapPin className="w-3 h-3" /> {user.location}
                    </p>
                  )}
                  {/* follower / following / repos / stars row */}
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm justify-center sm:justify-start">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <strong className="text-foreground">{user.followers}</strong>
                      <span className="text-muted-foreground">followers</span>
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span>
                      <strong className="text-foreground">{user.following}</strong>{" "}
                      <span className="text-muted-foreground">following</span>
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span>
                      <strong className="text-foreground">{user.public_repos}</strong>{" "}
                      <span className="text-muted-foreground">repos</span>
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      <strong className="text-foreground">{totalStars}</strong>{" "}
                      <span className="text-muted-foreground">stars</span>
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── pinned / popular repositories ────────────────────── */}
        {repos.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Pinned Repositories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {repos.slice(0, 6).map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          </div>
        )}

        {/* ── language bar ─────────────────────────────────────── */}
        {topLangs.length > 0 && <LanguageBar languages={topLangs} />}

        {/* ── contribution heatmap (bottom) ─────────────────────── */}
        <Card className="bg-card border-border">
          <CardContent className="p-4 md:p-6">
            <p className="text-sm text-muted-foreground mb-3">Contribution Activity</p>
            <div className="overflow-x-auto">
              <GitHubCalendar
                username={GITHUB_USERNAME}
                colorScheme="dark"
                fontSize={12}
                blockSize={11}
                blockMargin={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
