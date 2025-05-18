
import { UserCircle2 } from "lucide-react";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";

interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  technologies: string[];
  achievements: string[];
}

const experiences: Experience[] = [
  {
    role: "Full Stack Developer Intern",
    company: "VighnoTech",
    location: "Mumbai, India",
    period: "Aug 2023 – Feb 2024",
    technologies: ["React.js", "Next.js", "MongoDB", "Express.js", "TypeScript", "Webpack", "Prisma ORM", "PostgreSQL"],
    achievements: [
      "Streamlined customer inquiry processes, reducing response time by 30% through an integrated chatbot and form generator bundle",
      "Implemented automated email responses and filtering options, improving inquiry management efficiency by 25%",
      "Enhanced CRM workflows by 40% with real-time inquiry status tracking and follow-up prioritization"
    ]
  },
  {
    role: "Frontend Developer Intern",
    company: "RCTCET",
    location: "Mumbai, India",
    period: "Aug 2023 – July 2024",
    technologies: ["HTML5", "CSS3", "React.js (v16)", "TailwindCSS", "Shadcn"],
    achievements: [
      "Led a team of 4 to design and deploy a club website, increasing member engagement by 20%",
      "Utilized React.js and TailwindCSS to improve website responsiveness by 30%, ensuring cross-device compatibility"
    ]
  }
];

export function Experience() {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "-100px",
  });

  return (
    <section
      id="experience"
      ref={elementRef as React.RefObject<HTMLElement>}
      className={cn(
        "py-16 md:py-24 relative",
        isIntersecting ? "animate-fade-in" : "opacity-0"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="section-title">Experience</h2>
        
        {/* Timeline */}
        <div className="mt-12 relative">
          {/* Vertical line for timeline */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border md:left-1/2 md:-translate-x-1/2"></div>
          
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div 
                key={index}
                className={cn(
                  "relative flex md:items-center",
                  index % 2 === 0 ? "md:justify-end" : "",
                )}
              >
                {/* Timeline marker */}
                <div className="timeline-marker">
                  <UserCircle2 className="h-4 w-4 text-white" />
                </div>
                
                {/* Experience card */}
                <div className={cn(
                  "ml-12 md:ml-0 md:w-5/12",
                  index % 2 === 0 ? "md:mr-12" : "md:ml-12",
                  "p-6 bg-card rounded-lg shadow-md transition-all duration-300 hover:shadow-lg border-2 hover:border-aqua"
                )}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <h3 className="text-xl font-semibold text-foreground">{exp.role}</h3>
                    <span className="text-sm text-aqua mt-1 md:mt-0">{exp.period}</span>
                  </div>
                  
                  <h4 className="text-lg font-medium">
                    {exp.company}, {exp.location}
                  </h4>
                  
                  {/* Technologies */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {exp.technologies.map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="px-2 py-1 bg-muted text-xs font-medium rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  {/* Achievements */}
                  <div className="mt-4">
                    <h5 className="font-medium text-aqua mb-2">Key Achievements</h5>
                    <ul className="list-disc list-inside space-y-2 text-sm text-foreground/80">
                      {exp.achievements.map((achievement, achieveIndex) => (
                        <li key={achieveIndex}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Experience;
