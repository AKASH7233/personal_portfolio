
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import ProjectsList from "./ProjectsList";
import StatsBadges from "./StatsBadges";

export function Projects() {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "-100px",
  });

  return (
    <section
      id="projects"
      ref={elementRef as React.RefObject<HTMLElement>}
      className={cn(
        "py-16 md:py-24",
        isIntersecting ? "animate-fade-in" : "opacity-0"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 space-y-12">
        <h2 className="section-title">Projects & Stats</h2>
        
        {/* Stats Badges */}
        <div className="mb-8">
          <StatsBadges />
        </div>

        {/* Dynamic Projects from GitHub */}
        <div>
          <h3 className="text-2xl font-semibold mb-6">Latest Repositories</h3>
          <ProjectsList />
        </div>
        
        {/* View All Projects */}
        <div className="mt-12 text-center">
          <Button 
            asChild
            variant="outline"
            size="lg"
            className="border-aqua text-aqua hover:bg-aqua/10"
          >
            <a href="https://github.com/AKASH7233" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-5 w-5" /> View All Projects on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Projects;
