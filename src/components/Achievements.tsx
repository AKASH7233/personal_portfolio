
import { useState, useEffect } from "react";
import { Award, CheckCircle2 } from "lucide-react";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";
import { fetchFromAPI, API_ENDPOINTS } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AchievementsData {
  summary: string;
  bulletPoints: string[];
  bio: string;
  generatedAt: string;
}

export function Achievements() {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "-100px",
  });

  const [data, setData] = useState<AchievementsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAchievements() {
      try {
        const achievementsData = await fetchFromAPI(API_ENDPOINTS.ACHIEVEMENTS);
        setData(achievementsData);
      } catch (err) {
        console.error('Error loading achievements:', err);
        setError('Failed to load achievements');
      } finally {
        setLoading(false);
      }
    }

    loadAchievements();
  }, []);

  return (
    <section
      id="achievements"
      ref={elementRef as React.RefObject<HTMLElement>}
      className={cn(
        "py-16 md:py-24 bg-muted/50 transition-all duration-700",
        isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="">
          {/* <Award className="h-7 w-7 text-aqua" /> */}
          <h2 className="section-title">Achievements</h2>
        </div>
        
        {loading ? (
          <div className="space-y-6 max-w-4xl mx-auto">
            <Skeleton className="h-24 w-full" />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="max-w-4xl mx-auto">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : data ? (
          <div className="mt-12 max-w-4xl mx-auto space-y-8">
            {/* Summary */}
            <div className={cn(
              "bg-card rounded-lg p-8 shadow-lg border-2 border-aqua/20",
              isIntersecting ? "animate-fade-in-up" : "opacity-0"
            )}>
              <div className="flex items-start gap-4">
                <Award className="h-8 w-8 text-aqua shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-3">Professional Summary</h3>
                  <p className="text-foreground/90 leading-relaxed">{data.summary}</p>
                </div>
              </div>
            </div>

            {/* Bullet Points */}
            <div className={cn(
              "bg-card rounded-lg p-8 shadow-lg",
              isIntersecting ? "animate-fade-in-up [animation-delay:0.2s]" : "opacity-0"
            )}>
              <h3 className="text-xl font-semibold mb-6">Key Achievements</h3>
              <ul className="space-y-4">
                {data.bulletPoints.map((point, index) => (
                  <li 
                    key={index}
                    className="flex gap-3 items-start"
                  >
                    <CheckCircle2 className="w-5 h-5 text-aqua mt-0.5 shrink-0" />
                    <span className="text-foreground/90">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Updated date */}
            <p className="text-center text-sm text-muted-foreground">
              Last updated: {data.generatedAt && !isNaN(new Date(data.generatedAt).getTime()) 
                ? new Date(data.generatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                : 'Recently'}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default Achievements;
