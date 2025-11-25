/**
 * Projects List Component
 * Fetches and displays GitHub repositories dynamically with preview and load more
 */

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ExternalLink, Star, GitFork, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fetchFromAPI, API_ENDPOINTS } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Repository {
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

const INITIAL_DISPLAY = 3;

export default function ProjectsList() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>("");

  useEffect(() => {
    async function loadRepos() {
      try {
        const data = await fetchFromAPI(API_ENDPOINTS.GITHUB_REPOS);
        setRepos(data.repositories || []);
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
        console.error('Error loading repos:', err);
      } finally {
        setLoading(false);
      }
    }

    loadRepos();
  }, []);

  const handlePreview = (url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 3, repos.length));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-96 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (repos.length === 0) {
    return (
      <Alert>
        <AlertDescription>No projects found.</AlertDescription>
      </Alert>
    );
  }

  const displayedRepos = repos.slice(0, displayCount);
  const hasMore = displayCount < repos.length;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedRepos.map((repo) => (
          <div key={repo.id} className="flex flex-col h-full">
            {/* Project Card with embedded preview */}
            <div className="flex flex-col h-full bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden hover:border-aqua/50 transition-all duration-300">
              {/* Live Preview iframe (compact card size) */}
              {repo.homepage && (
                <div className="relative w-full bg-gray-950" style={{ height: '200px' }}>
                  <iframe
                    src={repo.homepage}
                    className="w-full h-full"
                    title={`${repo.name} preview`}
                    sandbox="allow-scripts allow-same-origin"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handlePreview(repo.homepage!, repo.name)}
                      className="bg-gray-900/90 hover:bg-gray-800 text-white"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Project Info */}
              <div className="flex-1 flex flex-col p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-white truncate flex-1">{repo.name}</h3>
                  {repo.language && (
                    <Badge variant="secondary" className="ml-2 shrink-0 text-xs">
                      {repo.language}
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-gray-400 line-clamp-2 mb-3 flex-1">
                  {repo.description || "No description available"}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {repo.topics.slice(0, 3).map((topic) => (
                    <Badge key={topic} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    <span>{repo.stars}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="h-3 w-3" />
                    <span>{repo.forks}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-1 h-3 w-3" />
                      Code
                    </a>
                  </Button>
                  {repo.homepage && (
                    <Button asChild size="sm" className="flex-1 bg-aqua hover:bg-aqua/80 text-black">
                      <a href={repo.homepage} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1 h-3 w-3" />
                        Live
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-8">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            size="lg"
            className="border-aqua text-aqua hover:bg-aqua/10"
          >
            Load More Projects ({repos.length - displayCount} remaining)
          </Button>
        </div>
      )}

      {/* Fullscreen Preview Dialog */}
      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent className="max-w-7xl h-[90vh] p-0">
          <DialogHeader className="px-6 py-4 border-b border-gray-800">
            <DialogTitle className="flex items-center justify-between">
              <span>{previewTitle} - Live Preview</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(previewUrl!, '_blank')}
                className="text-aqua hover:text-aqua/80"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="h-full p-4">
            <iframe
              src={previewUrl || ''}
              className="w-full h-full rounded border border-gray-800"
              title={`${previewTitle} fullscreen preview`}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
