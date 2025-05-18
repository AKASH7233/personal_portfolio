
import { Button } from "@/components/ui/button";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";

export function About() {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "-100px",
  });

  return (
    <section
      id="about"
      ref={elementRef as React.RefObject<HTMLElement>}
      className={cn(
        "py-16 md:py-24",
        isIntersecting ? "animate-fade-in" : "opacity-0"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="section-title">About Me</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Profile Image */}
          <div className="lg:col-span-4 flex justify-center lg:justify-start">
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-aqua">
              {/* Using a placeholder, would be replaced with Akash's actual photo */}
              <div className="w-full h-full bg-gradient-to-br from-aqua to-aqua/30 flex items-center justify-center text-white">
                <span className="text-7xl">AY</span>
              </div>
            </div>
          </div>
          
          {/* Bio Content */}
          <div className="lg:col-span-8">
            <div className="space-y-4 text-lg">
              <p>
                I'm a <span className="text-aqua font-semibold">Full Stack Developer</span> with expertise in React.js, Next.js, MongoDB, Express.js and more modern web technologies. I build responsive, user-friendly web applications with focus on performance and best practices.
              </p>
              <p>
                I'm a recent graduate from Thakur College of Engineering & Technology pursuing Bachelor of Engineering in Computer Engineering with a strong academic record of 9.20 CGPA.
              </p>
              <p>
                I have a passion for creating clean, efficient code and designing intuitive user interfaces. My experience spans from frontend development with React.js and Tailwind CSS to backend systems with Node.js and MongoDB.
              </p>
              <p>
                When I'm not coding, I enjoy solving algorithmic problems on platforms like LeetCode, where I've solved over 450+ Data Structures and Algorithm problems.
              </p>
              
              {/* Download Resume Button */}
              <div className="pt-4">
                <Button 
                  className="bg-aqua hover:bg-aqua/80 text-white"
                >
                  <Download className="mr-2 h-4 w-4" /> Download Resume
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
