
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";

interface EducationItem {
  institution: string;
  degree: string;
  percentage: string;
  period: string;
  description: string;
  isRight?: boolean;
}

const educationItems: EducationItem[] = [
  {
    institution: "Thakur College of Engineering & Technology",
    degree: "Bachelor of Engineering in Computer Engineering",
    percentage: "CGPA: 9.20",
    period: "Sep 2022 – Present",
    description: "Pursuing undergraduate degree with focus on computer science fundamentals, algorithms, and software engineering practices.",
    isRight: false,
  },
  {
    institution: "Shree T.P. Bhatia Junior College of Science",
    degree: "Higher Secondary Certificate (PCM)",
    percentage: "Percentage: 75.5%",
    period: "Mar 2020 – Mar 2022",
    description: "Completed higher secondary education with specialization in Physics, Chemistry, and Mathematics.",
    isRight: true,
  },
  {
    institution: "Pal Rajendra English High School",
    degree: "SSC (Class X)",
    percentage: "Percentage: 87.2%",
    period: "Mar 2019 – Mar 2020",
    description: "Completed secondary education with distinction in mathematics and science subjects.",
    isRight: false,
  },
];

export function Education() {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "-100px",
  });

  return (
    <section
      id="education"
      ref={elementRef as React.RefObject<HTMLElement>}
      className={cn(
        "py-16 md:py-24 relative",
        isIntersecting ? "animate-fade-in" : "opacity-0"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="section-title">Education</h2>
        
        {/* Timeline */}
        <div className="mt-12 relative">
          {/* Vertical connecting line for desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 z-0"></div>
          
          <div className="space-y-16 md:space-y-0 relative z-10">
            {educationItems.map((item, index) => (
              <div 
                key={index} 
                className={`flex flex-col md:flex-row items-center ${
                  item.isRight ? "md:flex-row-reverse" : ""
                } mb-16 md:mb-24`}
              >
                {/* Circle on timeline */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-aqua border-4 border-background"></div>
                
                {/* Timeline content */}
                <div className={cn(
                  "w-full md:w-5/12 p-6 bg-card rounded-lg shadow-md transition-all duration-300 hover:shadow-lg",
                  "hover:border-aqua border-2",
                  index % 2 === 0 ? "animate-fade-in" : "animate-fade-in"
                )}>
                  <h3 className="text-xl font-semibold text-aqua">{item.institution}</h3>
                  <h4 className="text-lg font-medium mt-1">{item.degree}</h4>
                  <div className="flex flex-wrap justify-between mt-2">
                    <p className="text-sm text-muted-foreground">{item.percentage}</p>
                    <p className="text-sm text-muted-foreground">{item.period}</p>
                  </div>
                  <p className="mt-3 text-foreground/80">{item.description}</p>
                </div>
                
                {/* Spacer for layout on desktop */}
                <div className="hidden md:block w-full md:w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Education;
