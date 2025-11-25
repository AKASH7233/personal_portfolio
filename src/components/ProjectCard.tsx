/**
 * Project Card Component
 * Displays individual GitHub repository with stats and links
 */

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Star, GitFork } from "lucide-react";

interface ProjectCardProps {
  name: string;
  description: string;
  htmlUrl: string;
  homepage?: string;
  language: string;
  stars: number;
  forks: number;
  topics: string[];
  updatedAt: string;
  onPreview?: () => void;
}

export default function ProjectCard({
  name,
  description,
  htmlUrl,
  homepage,
  language,
  stars,
  forks,
  topics,
  updatedAt,
  onPreview
}: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{name}</span>
          {language && (
            <Badge variant="secondary" className="ml-2 shrink-0">
              {language}
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="line-clamp-2 min-h-[2.5rem]">
          {description || "No description available"}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2 mb-3">
          {topics.slice(0, 3).map((topic) => (
            <Badge key={topic} variant="outline" className="text-xs">
              {topic}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            <span>{stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="h-4 w-4" />
            <span>{forks}</span>
          </div>
          <span>Updated {formatDate(updatedAt)}</span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <a href={htmlUrl} target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-4 w-4" />
            Code
          </a>
        </Button>
        {homepage && (
          <Button asChild size="sm" className="flex-1">
            <a href={homepage} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Live Demo
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
