
import { Button } from "@/components/ui/button";
import DeveloperGif from "./ThreeScene";
import { Github, Linkedin } from "lucide-react";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";

export function Hero() {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "0px",
  });

  return (
    <section
      id="home"
      ref={elementRef as React.RefObject<HTMLElement>}
      className={cn(
        "min-h-screen flex flex-col justify-center pt-16 transition-all duration-700",
        isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Developer GIF Container */}
          <div className="order-2 lg:order-1">
            <DeveloperGif />
          </div>

          {/* Text Content */}
          <div className="order-1 lg:order-2 space-y-6 text-center lg:text-left">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                <span className="text-aqua">Akash</span> Yadav
              </h1>
              <div className="h-12">
                <p className="typewriter-text text-xl md:text-2xl font-medium">
                  Software Developer Engineer
                </p>
              </div>
              <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
                Building innovative solutions with modern technologies
              </p>
            </div>

            {/* Call-to-action buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button
                asChild
                className="bg-aqua hover:bg-aqua/80 text-white"
              >
                <a href="#projects">View Work</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-aqua text-aqua hover:bg-aqua/10"
              >
                <a href="#contact">Contact Me</a>
              </Button>
            </div>

            {/* Social links */}
            <div className="flex gap-4 justify-center lg:justify-start pt-2">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="text-foreground hover:text-aqua hover:bg-transparent"
              >
                <a
                  href="https://www.github.com/akash7233"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Github className="h-6 w-6" />
                </a>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="text-foreground hover:text-aqua hover:bg-transparent"
              >
                <a
                  href="https://www.linkedin.com/in/akashyadav33/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
