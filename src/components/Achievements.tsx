
import { Award, BadgeCheck, Trophy } from "lucide-react";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Achievement {
  title: string;
  description: string;
  icon: React.ReactNode;
  link?: string;
}

const achievements: Achievement[] = [
  {
    title: "Winner of Finothon",
    description: "Organized by Wealthify.me",
    icon: <Trophy className="h-10 w-10 text-aqua" />,
    link: "#" // Certificate link would go here
  },
  {
    title: "450+ DSA Problems",
    description: "Solved across LeetCode and other platforms",
    icon: <BadgeCheck className="h-10 w-10 text-aqua" />,
    link: "https://leetcode.com/u/akashyadv7233" // LeetCode profile
  },
  {
    title: "Technical Member @ RCTCET",
    description: "Coordinated tech events for 200+ attendees, boosting community engagement",
    icon: <Award className="h-10 w-10 text-aqua" />
  },
  {
    title: "Technical Member @ CSI TCET",
    description: "Developed club website, increasing event registrations by 15%",
    icon: <Award className="h-10 w-10 text-aqua" />
  }
];

export function Achievements() {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "-100px",
  });

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
        <h2 className="section-title">Achievements</h2>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <div 
              key={index}
              className={cn(
                "bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-500 border-2 hover:border-aqua border-transparent",
                "transform hover:-translate-y-2 flex flex-col items-center text-center",
                isIntersecting ? `animate-fade-in-up [animation-delay:${index * 0.15}s]` : "opacity-0"
              )}
            >
              <div className="mb-4">
                {achievement.icon}
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{achievement.title}</h3>
              <p className="text-foreground/80 mb-4">{achievement.description}</p>
              
              {achievement.link && (
                <div className="mt-auto">
                  <Button 
                    asChild
                    variant="link"
                    className="text-aqua p-0 h-auto"
                  >
                    <a href={achievement.link} target="_blank" rel="noopener noreferrer">
                      {achievement.link.includes("leetcode") ? "View LeetCode Profile" : "View Certificate"}
                    </a>
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Achievements;
