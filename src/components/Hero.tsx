
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
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="text-foreground hover:text-aqua hover:bg-transparent"
              >
                <a
                  href="https://leetcode.com/u/akashyadv7233"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LeetCode"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path d="M20.303 16.047h-9.561c-.936 0-1.697-.803-1.697-1.79s.762-1.79 1.697-1.79h9.561c.936 0 1.697.803 1.697 1.79s-.762 1.79-1.697 1.79zm-9.561-2.58c-.385 0-.697.354-.697.79s.312.79.697.79h9.561c.385 0 .697-.354.697-.79s-.312-.79-.697-.79h-9.561z"></path>
                    <path d="M11.618 24c-1.604 0-2.977-.533-3.97-1.541L3.55 18.278C2.551 17.262 2 15.819 2 14.215c0-1.578.551-3.008 1.552-4.025L13.071.509c.66-.67 1.829-.652 2.506.036.694.706.71 1.839.034 2.524l-1.762 1.816a5.25 5.25 0 0 1 1.739 1.159l2.463 2.53c.672.684.655 1.815-.039 2.521a1.79 1.79 0 0 1-1.284.545c-.464 0-.896-.181-1.219-.509l-2.536-2.492c-.321-.327-.779-.49-1.367-.49-.606 0-1.069.157-1.375.469l-4.067 4.194c-.342.349-.521.831-.521 1.4 0 .577.189 1.101.519 1.436l4.083 4.182c.315.321.774.484 1.362.484s1.045-.163 1.36-.484l2.549-2.505a1.687 1.687 0 0 1 1.209-.503h.002c.483 0 .939.194 1.286.546.693.705.71 1.837.036 2.522l-2.457 2.525C14.586 23.438 13.176 24 11.618 24zM14.29 1a.703.703 0 0 0-.507.21l-9.519 9.681C3.449 11.72 3 12.9 3 14.215c0 1.341.449 2.535 1.265 3.363l.001.001 4.097 4.18C9.162 22.57 10.288 23 11.618 23c1.288 0 2.444-.455 3.258-1.282l2.457-2.525c.295-.301.279-.804-.034-1.122a.801.801 0 0 0-.573-.247h-.001a.703.703 0 0 0-.502.209l-2.549 2.505c-.497.507-1.214.778-2.068.778s-1.572-.271-2.076-.784L5.446 16.35c-.519-.527-.805-1.286-.805-2.136 0-.824.286-1.57.806-2.099l4.067-4.194c.503-.512 1.206-.771 2.091-.771.854 0 1.571.271 2.074.783l2.536 2.492a.705.705 0 0 0 .512.216.798.798 0 0 0 .571-.246c.313-.319.33-.822.037-1.121l-2.461-2.528a4.238 4.238 0 0 0-2.028-1.137c-.175-.041-.331-.176-.382-.349s-.021-.363.104-.492l2.325-2.398c.298-.302.282-.805-.031-1.124A.799.799 0 0 0 14.29 1z"></path>
                  </svg>

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
