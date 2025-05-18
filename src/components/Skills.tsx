
import { useRef } from 'react';
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";

interface Skill {
  name: string;
  icon: string;
}

const programmingSkills: Skill[] = [
  { name: "JavaScript", icon: "⚡" },
  { name: "TypeScript", icon: "🔷" },
  { name: "Python", icon: "🐍" },
  { name: "HTML5", icon: "🌐" },
  { name: "CSS3", icon: "🎨" },
  { name: "React.js", icon: "⚛️" },
  { name: "Node.js", icon: "🟢" },
  { name: "Next.js", icon: "▲" },
  { name: "MongoDB", icon: "🍃" },
];

const toolsSkills: Skill[] = [
  { name: "Git", icon: "🔄" },
  { name: "Webpack", icon: "📦" },
  { name: "Socket.io", icon: "🔌" },
  { name: "WebRTC", icon: "📱" },
  { name: "TailwindCSS", icon: "💨" },
  { name: "Shadcn", icon: "🎭" },
  { name: "JWT", icon: "🔑" },
  { name: "REST APIs", icon: "🔗" },
  { name: "DSA", icon: "🧮" },
];

export function Skills() {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "-100px",
  });
  
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  
  return (
    <section
      id="skills"
      ref={elementRef as React.RefObject<HTMLElement>}
      className={cn(
        "py-16 md:py-24 overflow-hidden transition-all duration-700",
        isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="section-title">Skills</h2>
        
        <div className="mt-12 space-y-12">
          {/* Programming Skills */}
          <div className="relative">
            <h3 className="text-xl font-medium mb-6">Programming & Frameworks</h3>
            
            {/* First row - left to right */}
            <div 
              ref={row1Ref}
              className="flex overflow-hidden"
              onMouseEnter={() => {
                if (row1Ref.current) {
                  row1Ref.current.style.animationPlayState = 'paused';
                }
              }}
              onMouseLeave={() => {
                if (row1Ref.current) {
                  row1Ref.current.style.animationPlayState = 'running';
                }
              }}
            >
              <div className="flex animate-slow-slide-left-to-right">
                {programmingSkills.map((skill, index) => (
                  <div
                    key={`prog-${index}`}
                    className="flex-shrink-0 w-32 md:w-40 mx-4 p-4 bg-card rounded-lg shadow-sm border-2 border-transparent hover:border-aqua transition-all duration-300"
                  >
                    <div className="text-3xl mb-2">{skill.icon}</div>
                    <div className="font-medium">{skill.name}</div>
                  </div>
                ))}
                {/* Repeat for seamless infinite scroll */}
                {programmingSkills.map((skill, index) => (
                  <div
                    key={`prog-repeat-${index}`}
                    className="flex-shrink-0 w-32 md:w-40 mx-4 p-4 bg-card rounded-lg shadow-sm border-2 border-transparent hover:border-aqua transition-all duration-300"
                  >
                    <div className="text-3xl mb-2">{skill.icon}</div>
                    <div className="font-medium">{skill.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Tools & Databases */}
          <div className="relative">
            <h3 className="text-xl font-medium mb-6">Tools & Databases</h3>
            
            {/* Second row - right to left */}
            <div 
              ref={row2Ref}
              className="flex overflow-hidden"
              onMouseEnter={() => {
                if (row2Ref.current) {
                  row2Ref.current.style.animationPlayState = 'paused';
                }
              }}
              onMouseLeave={() => {
                if (row2Ref.current) {
                  row2Ref.current.style.animationPlayState = 'running';
                }
              }}
            >
              <div className="flex animate-slow-slide-right-to-left">
                {toolsSkills.map((skill, index) => (
                  <div
                    key={`tool-${index}`}
                    className="flex-shrink-0 w-32 md:w-40 mx-4 p-4 bg-card rounded-lg shadow-sm border-2 border-transparent hover:border-aqua transition-all duration-300"
                  >
                    <div className="text-3xl mb-2">{skill.icon}</div>
                    <div className="font-medium">{skill.name}</div>
                  </div>
                ))}
                {/* Repeat for seamless infinite scroll */}
                {toolsSkills.map((skill, index) => (
                  <div
                    key={`tool-repeat-${index}`}
                    className="flex-shrink-0 w-32 md:w-40 mx-4 p-4 bg-card rounded-lg shadow-sm border-2 border-transparent hover:border-aqua transition-all duration-300"
                  >
                    <div className="text-3xl mb-2">{skill.icon}</div>
                    <div className="font-medium">{skill.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Skills;
