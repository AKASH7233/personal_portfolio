
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ExternalLink, Github } from "lucide-react";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  image: string;
  preview: string;
  github: string;
  live: string;
}

const projects: Project[] = [
  {
    title: "ConnectiFy",
    description: "Platform to view trailers, ratings, cast details, and related videos for movies and series. Features in-app chatting, 24-hour stories (Blinks), and profile management.",
    technologies: ["React.js", "Redux", "Shadcn-ui", "SCSS", "React-Player", "Axios"],
    image: "https://via.placeholder.com/600x400?text=ConnectiFy",
    preview: "https://via.placeholder.com/800x600?text=ConnectiFy+Preview",
    github: "https://github.com/akash7233/connectify",
    live: "https://connectify-omega.vercel.app/"
  },
  {
    title: "Movix",
    description: "Social media platform fostering real-time post interaction and community engagement. Supporting 100+ concurrent users with WebSocket-powered live updates.",
    technologies: ["React.js", "Express.js", "Node.js", "MongoDB", "JWT", "TailwindCSS", "WebSocket", "Multer"],
    image: "https://via.placeholder.com/600x400?text=Movix",
    preview: "https://via.placeholder.com/800x600?text=Movix+Preview",
    github: "https://github.com/akash7233/movix",
    live: "https://movix-two-iota.vercel.app/"
  }
];

export function Projects() {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "-100px",
  });
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    // if (!projectRefs.current[index]) return;
    
    // const card = projectRefs.current[index];
    // const rect = card!.getBoundingClientRect();
    // const x = e.clientX - rect.left;
    // const y = e.clientY - rect.top;
    
    // const centerX = rect.width / 2;
    // const centerY = rect.height / 2;
    
    // const rotateX = (y - centerY) / 20;
    // const rotateY = (centerX - x) / 20;
    
    // card!.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };
  
  const handleMouseLeave = (index: number) => {
    if (!projectRefs.current[index]) return;
    projectRefs.current[index]!.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  };

  return (
    <section
      id="projects"
      ref={elementRef as React.RefObject<HTMLElement>}
      className={cn(
        "py-16 md:py-24",
        isIntersecting ? "animate-fade-in" : "opacity-0"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="section-title">Projects</h2>
        
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div 
              key={index}
              ref={(el) => (projectRefs.current[index] = el)}
              className="bg-card border-2 border-transparent hover:border-aqua rounded-xl overflow-hidden shadow-md transition-all duration-300"
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => handleMouseLeave(index)}
              style={{ transformStyle: 'preserve-3d', transition: 'transform 0.1s ease' }}
            >
              {/* Project Image with Hover Card */}
              {/* <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="relative w-full h-48 overflow-hidden">
                    <img 
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-0 overflow-hidden rounded-md">
                  {project.live !== "#" ? (
                    <iframe
                      src={project.live}
                      title={`${project.title} Live Preview`}
                      className="w-full h-60 border-none rounded-md"
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    ></iframe>
                  ) : (
                    <div className="w-full h-60 flex items-center justify-center bg-muted text-sm text-muted-foreground">
                      Live preview not available
                    </div>
                  )}
                </HoverCardContent>
              </HoverCard> */}
              
            <a 
              href={project.live} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block relative w-full h-[40vh] overflow-hidden rounded-t-xl"
            >
              {project.live !== "#" ? (
                <iframe
                  src={project.live}
                  title={`${project.title} Live Preview`}
                  className="w-full h-full border-none transition-transform duration-500 hover:scale-105"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted text-sm text-muted-foreground">
                  Live preview not available
                </div>
              )}
            </a>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 typewriter">{project.title}</h3>
                <p className="text-foreground/80 mb-4">{project.description}</p>
                
                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className="px-2 py-1 bg-accent text-foreground text-xs font-medium rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                {/* Project Links */}
                <div className="flex gap-4">
                  <Button 
                    asChild
                    variant="default"
                    className="bg-aqua hover:bg-aqua/80 text-white"
                  >
                    <a href={project.live} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" /> Live Demo
                    </a>
                  </Button>
                  <Button 
                    asChild
                    variant="outline"
                    className="border-aqua text-aqua hover:bg-aqua/10"
                  >
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" /> Code
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Projects */}
        <div className="mt-12 text-center">
          <Button 
            asChild
            variant="outline"
            size="lg"
            className="border-aqua text-aqua hover:bg-aqua/10"
          >
            <a href="https://github.com/akash7233" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-5 w-5" /> View All Projects
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Projects;
