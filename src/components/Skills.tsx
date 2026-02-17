
import { useRef } from 'react';
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";

const DI = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";
const SI = "https://cdn.simpleicons.org";

interface SkillItem {
  name: string;
  icon: string;
  darkInvert?: boolean;
}

const programmingSkills: SkillItem[] = [
  { name: "Java", icon: `${DI}/java/java-original.svg` },
  { name: "JavaScript", icon: `${DI}/javascript/javascript-original.svg` },
  { name: "TypeScript", icon: `${DI}/typescript/typescript-original.svg` },
  { name: "Python", icon: `${DI}/python/python-original.svg` },
  { name: "React.js", icon: `${DI}/react/react-original.svg` },
  { name: "Next.js", icon: `${DI}/nextjs/nextjs-original.svg`, darkInvert: true },
  { name: "Node.js", icon: `${DI}/nodejs/nodejs-original.svg` },
  { name: "Express.js", icon: `${DI}/express/express-original.svg`, darkInvert: true },
  { name: "Spring Boot", icon: `${DI}/spring/spring-original.svg` },
  { name: "TailwindCSS", icon: `${DI}/tailwindcss/tailwindcss-original.svg` },
  { name: "Redux", icon: `${DI}/redux/redux-original.svg` },
  { name: "HTML5", icon: `${DI}/html5/html5-original.svg` },
  { name: "CSS3", icon: `${DI}/css3/css3-original.svg` },
];

const toolsSkills: SkillItem[] = [
  { name: "Git", icon: `${DI}/git/git-original.svg` },
  { name: "Docker", icon: `${DI}/docker/docker-original.svg` },
  { name: "MongoDB", icon: `${DI}/mongodb/mongodb-original.svg` },
  { name: "PostgreSQL", icon: `${DI}/postgresql/postgresql-original.svg` },
  { name: "Redis", icon: `${DI}/redis/redis-original.svg` },
  { name: "Kafka", icon: `${DI}/apachekafka/apachekafka-original.svg`, darkInvert: true },
  { name: "MySQL", icon: `${DI}/mysql/mysql-original.svg`, darkInvert: true },
  { name: "Prisma", icon: `${DI}/prisma/prisma-original.svg`, darkInvert: true },
  { name: "Webpack", icon: `${DI}/webpack/webpack-original.svg` },
  { name: "Socket.io", icon: `${DI}/socketio/socketio-original.svg`, darkInvert: true },
  { name: "OpenAI", icon: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/openai.svg", darkInvert: true },
  { name: "LangGraph", icon: `${SI}/langchain/1C3C3C`, darkInvert: true },
  { name: "RAG", icon: `${SI}/semanticscholar/1857B6` },
];

function SkillCard({ skill, keyPrefix, index }: { skill: SkillItem; keyPrefix: string; index: number }) {
  return (
    <div
      key={`${keyPrefix}-${index}`}
      className="flex-shrink-0 w-28 md:w-36 mx-3 p-4 bg-card rounded-xl shadow-sm border-2 border-transparent hover:border-aqua transition-all duration-300 flex flex-col items-center gap-2"
    >
      <img
        src={skill.icon}
        alt={skill.name}
        className={cn("w-10 h-10 object-contain", skill.darkInvert && "dark:invert")}
        loading="lazy"
      />
      <span className="font-medium text-sm text-center leading-tight">{skill.name}</span>
    </div>
  );
}

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
          {/* Programming & Frameworks */}
          <div className="relative">
            <h3 className="text-xl font-medium mb-6">Programming & Frameworks</h3>

            <div ref={row1Ref} className="flex overflow-hidden">
              <div
                className="flex animate-slow-slide-left-to-right"
                style={{ animationDuration: '20s', animationIterationCount: 'infinite', animationPlayState: 'running' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.animationPlayState = 'running'; }}
              >
                {[...programmingSkills, ...programmingSkills, ...programmingSkills].map((skill, i) => (
                  <SkillCard key={`prog-${i}`} skill={skill} keyPrefix="prog" index={i} />
                ))}
              </div>
            </div>
          </div>

          {/* Tools, Databases & AI */}
          <div className="relative">
            <h3 className="text-xl font-medium mb-6">Tools & Technologies</h3>

            <div ref={row2Ref} className="flex overflow-hidden">
              <div
                className="flex animate-slow-slide-right-to-left"
                style={{ animationDuration: '20s', animationIterationCount: 'infinite', animationPlayState: 'running' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.animationPlayState = 'running'; }}
              >
                {[...toolsSkills, ...toolsSkills, ...toolsSkills].map((skill, i) => (
                  <SkillCard key={`tool-${i}`} skill={skill} keyPrefix="tool" index={i} />
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
