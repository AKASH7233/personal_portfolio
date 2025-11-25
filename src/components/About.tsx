
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";
import { Download, MapPin, Building, Globe, Sparkles } from "lucide-react";
import { fetchFromAPI, API_ENDPOINTS } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface AboutData {
  bio: string;
  location: string;
  company: string;
  blog: string;
  stats: {
    yearsOfExperience: number;
    projectsCompleted: number;
    totalStars: number;
  };
  highlights: string[];
}

export function About() {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "-100px",
  });

  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [useDynamic, setUseDynamic] = useState(false);

  // Static fallback data
  const staticBio = "I'm a Full Stack Developer with expertise in React.js, Next.js, MongoDB, Express.js and more modern web technologies. I build responsive, user-friendly web applications with focus on performance and best practices.";

  useEffect(() => {
    async function loadAboutData() {
      try {
        const data = await fetchFromAPI(API_ENDPOINTS.ABOUT);
        
        // Compare bio quality: use dynamic if it's substantial
        if (data.bio && data.bio.length > 50) {
          setAboutData(data);
          setUseDynamic(true);
        }
      } catch (err) {
        console.error('Error loading about data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAboutData();
  }, []);

  return (
    <section
      id="about"
      ref={elementRef as React.RefObject<HTMLElement>}
      className={cn(
        "py-16 md:py-24 transition-all duration-700",
        isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="section-title">About Me</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Profile Image */}
          <div className={cn(
            "lg:col-span-4 flex justify-center lg:justify-start transition-all duration-700 delay-100",
            isIntersecting ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          )}>
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-aqua">
              {/* Using a placeholder, would be replaced with Akash's actual photo */}
              <div className="w-full h-full bg-gradient-to-br from-aqua to-aqua/30 flex items-center justify-center text-white">
                <span className="text-7xl">AY</span>
              </div>
            </div>
          </div>
          
          {/* Bio Content */}
          <div className={cn(
            "lg:col-span-8 transition-all duration-700 delay-200",
            isIntersecting ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          )}>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-1/2" />
              </div>
            ) : (
              <div className="space-y-4 text-lg">
                {/* Dynamic Bio with AI indicator */}
                {useDynamic && aboutData?.bio && (
                  <div className="relative">
                    <div className="absolute -top-2 -right-2">
                      <Sparkles className="h-4 w-4 text-aqua animate-pulse" />
                    </div>
                    <p className="text-foreground/90 leading-relaxed">
                      {aboutData.bio}
                    </p>
                  </div>
                )}

                {/* Static content - always show */}
                {!useDynamic && (
                  <p>
                    I'm a <span className="text-aqua font-semibold">Full Stack Developer</span> with expertise in React.js, Next.js, MongoDB, Express.js and more modern web technologies. I build responsive, user-friendly web applications with focus on performance and best practices.
                  </p>
                )}
                
                <p>
                  I'm a recent graduate from Thakur College of Engineering & Technology pursuing Bachelor of Engineering in Computer Engineering with a strong academic record of 9 CGPA.
                </p>
                <p>
                  I have a passion for creating clean, efficient code and designing intuitive user interfaces. My experience spans from frontend development with React.js and Tailwind CSS to backend systems with Node.js and MongoDB.
                </p>
                <p>
                  When I'm not coding, I enjoy solving algorithmic problems on platforms like LeetCode, where I've solved over 650+ Data Structures and Algorithm problems.
                </p>

                {/* Dynamic Stats & Highlights */}
                {aboutData && aboutData.stats && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
                    {aboutData.stats.projectsCompleted > 0 && (
                      <div className="p-4 bg-card rounded-lg border-2 border-aqua/20">
                        <div className="text-3xl font-bold text-aqua">{aboutData.stats.projectsCompleted}+</div>
                        <div className="text-sm text-muted-foreground">Projects</div>
                      </div>
                    )}
                    {aboutData.stats.totalStars > 0 && (
                      <div className="p-4 bg-card rounded-lg border-2 border-aqua/20">
                        <div className="text-3xl font-bold text-aqua">{aboutData.stats.totalStars}</div>
                        <div className="text-sm text-muted-foreground">GitHub Stars</div>
                      </div>
                    )}
                    {aboutData.stats.yearsOfExperience > 0 && (
                      <div className="p-4 bg-card rounded-lg border-2 border-aqua/20">
                        <div className="text-3xl font-bold text-aqua">{aboutData.stats.yearsOfExperience}+</div>
                        <div className="text-sm text-muted-foreground">Years Coding</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Highlights */}
                {aboutData && aboutData.highlights && aboutData.highlights.length > 0 && (
                  <div className="space-y-2 py-4">
                    {aboutData.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-aqua mt-1">▸</span>
                        <span className="text-foreground/90">{highlight}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Location & Company */}
                {aboutData && (
                  <div className="flex flex-wrap gap-4 py-2 text-sm text-muted-foreground">
                    {aboutData.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {aboutData.location}
                      </div>
                    )}
                    {aboutData.company && (
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {aboutData.company}
                      </div>
                    )}
                    {aboutData.blog && (
                      <a 
                        href={aboutData.blog}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-aqua transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                        Website
                      </a>
                    )}
                  </div>
                )}
                
                {/* Download Resume Button */}
                <div className="pt-4">
                  <a 
                    href="https://drive.google.com/uc?export=download&id=1Mpyu3tKd3iZ_mzMQdeAHwbfk1dqcUafI" 
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-aqua hover:bg-aqua/80 text-white">
                      <Download className="mr-2 h-4 w-4" /> Download Resume
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
