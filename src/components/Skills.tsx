
import { useRef, useState, useEffect } from 'react';
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";
import { fetchFromAPI, API_ENDPOINTS } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface Skill {
  name: string;
  icon: string;
  level?: string;
  proficiency?: number;
}

// Icon mappings for common technologies
const iconMap: Record<string, string> = {
  'JavaScript': '⚡',
  'TypeScript': '🔷',
  'Python': '🐍',
  'Java': '☕',
  'HTML': '🌐',
  'CSS': '🎨',
  'SCSS': '🎨',
  'React': '⚛️',
  'React Js': '⚛️',
  'Node': '🟢',
  'Node Js': '🟢',
  'Next': '▲',
  'Next Js': '▲',
  'MongoDB': '🍃',
  'Express': '🚂',
  'Express Js': '🚂',
  'Git': '🔄',
  'Docker': '🐳',
  'Kubernetes': '☸️',
  'Tailwind': '💨',
  'Tailwindcss': '💨',
  'Redux': '🔄',
  'Socket': '🔌',
  'Socket Io': '🔌',
  'WebRTC': '📱',
  'JWT': '🔑',
  'GraphQL': '◉',
  'REST': '🔗',
  'API': '🔗',
  'PostgreSQL': '🐘',
  'MySQL': '🐬',
  'Redis': '🔴',
  'AWS': '☁️',
  'Azure': '☁️',
  'Firebase': '🔥',
  'Vercel': '▲',
  'Webpack': '📦',
  'Vite': '⚡',
  'Jest': '🃏',
  'Cypress': '🌳',
};

const getIcon = (skillName: string): string => {
  return iconMap[skillName] || iconMap[skillName.replace(/\s+/g, '')] || '⭐';
};

// Fallback static skills
const fallbackProgrammingSkills: Skill[] = [
  { name: "JavaScript", icon: "⚡" },
  { name: "TypeScript", icon: "🔷" },
  { name: "Python", icon: "🐍" },
  { name: "React.js", icon: "⚛️" },
  { name: "Node.js", icon: "🟢" },
  { name: "Next.js", icon: "▲" },
  { name: "MongoDB", icon: "🍃" },
  { name: "Express.js", icon: "🚂" },
];

const fallbackToolsSkills: Skill[] = [
  { name: "Git", icon: "🔄" },
  { name: "Webpack", icon: "📦" },
  { name: "Socket.io", icon: "🔌" },
  { name: "TailwindCSS", icon: "💨" },
  { name: "Redux", icon: "🔄" },
  { name: "JWT", icon: "🔑" },
  { name: "REST APIs", icon: "🔗" },
];

export function Skills() {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "-100px",
  });
  
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  
  const [programmingSkills, setProgrammingSkills] = useState<Skill[]>(fallbackProgrammingSkills);
  const [toolsSkills, setToolsSkills] = useState<Skill[]>(fallbackToolsSkills);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSkills() {
      try {
        const data = await fetchFromAPI(API_ENDPOINTS.SKILLS);
        const skills = data.skills || {};

        // Combine languages and frameworks for programming skills
        const programming: Skill[] = [
          ...(skills.languages || []),
          ...(skills.frameworks || [])
        ].map((skill: any) => ({
          name: typeof skill === 'string' ? skill : skill.name,
          icon: getIcon(typeof skill === 'string' ? skill : skill.name),
          level: typeof skill === 'object' ? skill.level : undefined,
          proficiency: typeof skill === 'object' ? skill.proficiency : undefined
        }));

        // Combine tools, databases, and cloud for tools skills
        const tools: Skill[] = [
          ...(skills.tools || []),
          ...(skills.databases || []),
          ...(skills.cloud || [])
        ].map((skill: any) => ({
          name: typeof skill === 'string' ? skill : skill.name,
          icon: getIcon(typeof skill === 'string' ? skill : skill.name),
          level: typeof skill === 'object' ? skill.level : undefined,
          proficiency: typeof skill === 'object' ? skill.proficiency : undefined
        }));

        if (programming.length > 0) setProgrammingSkills(programming);
        if (tools.length > 0) setToolsSkills(tools);
      } catch (err) {
        console.error('Error loading skills:', err);
        // Keep fallback skills
      } finally {
        setLoading(false);
      }
    }

    loadSkills();
  }, []);
  
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
        
        {loading ? (
          <div className="mt-12 space-y-8">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
          <div className="mt-12 space-y-12">
          {/* Programming Skills */}
          <div className="relative">
            <h3 className="text-xl font-medium mb-6">Programming & Frameworks</h3>
            
            {/* First row - left to right */}
            <div 
              ref={row1Ref}
              className="flex overflow-hidden"
            >
              <div 
                className="flex animate-slow-slide-left-to-right"
                style={{
                  animationDuration: '20s',
                  animationIterationCount: 'infinite',
                  animationPlayState: 'running'
                }}
                onMouseEnter={(e) => {
                  // Set animation-play-state to paused on hover
                  (e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused';
                }}
                onMouseLeave={(e) => {
                  // Resume animation when hover is removed
                  (e.currentTarget as HTMLDivElement).style.animationPlayState = 'running';
                }}
              >
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
                {programmingSkills.map((skill, index) => (
                  <div
                    key={`prog-${index}`}
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
            <h3 className="text-xl font-medium mb-6">Tools Skills</h3>
            
            {/* First row - left to right */}
            <div 
              ref={row1Ref}
              className="flex overflow-hidden"
            >
              <div 
                className="flex animate-slow-slide-right-to-left"
                style={{
                  animationDuration: '20s',
                  animationIterationCount: 'infinite',
                  animationPlayState: 'running'
                }}
                onMouseEnter={(e) => {
                  // Set animation-play-state to paused on hover
                  (e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused';
                }}
                onMouseLeave={(e) => {
                  // Resume animation when hover is removed
                  (e.currentTarget as HTMLDivElement).style.animationPlayState = 'running';
                }}
              >
                {toolsSkills.map((skill, index) => (
                  <div
                    key={`prog-${index}`}
                    className="flex-shrink-0 w-32 md:w-40 mx-4 p-4 bg-card rounded-lg shadow-sm border-2 border-transparent hover:border-aqua transition-all duration-300"
                  >
                    <div className="text-3xl mb-2">{skill.icon}</div>
                    <div className="font-medium">{skill.name}</div>
                  </div>
                ))}
                {/* Repeat for seamless infinite scroll */}
                {toolsSkills.map((skill, index) => (
                  <div
                    key={`prog-repeat-${index}`}
                    className="flex-shrink-0 w-32 md:w-40 mx-4 p-4 bg-card rounded-lg shadow-sm border-2 border-transparent hover:border-aqua transition-all duration-300"
                  >
                    <div className="text-3xl mb-2">{skill.icon}</div>
                    <div className="font-medium">{skill.name}</div>
                  </div>
                ))}
                {toolsSkills.map((skill, index) => (
                  <div
                    key={`prog-${index}`}
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
        )}
      </div>
    </section>
  );
}

export default Skills;
