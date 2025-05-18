
import { Button } from "@/components/ui/button";
import { ChevronUp, Github, Linkedin, Mail, Phone } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  
  return (
    <footer className="bg-muted py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-center mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollToTop}
            className="rounded-full h-10 w-10 bg-aqua text-white hover:bg-aqua/80 border-none"
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Navigation Links */}
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-semibold text-base">Quick Links</h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2">
              <a href="#home" className="hover:text-aqua transition-colors text-sm">Home</a>
              <a href="#about" className="hover:text-aqua transition-colors text-sm">About</a>
              <a href="#education" className="hover:text-aqua transition-colors text-sm">Education</a>
              <a href="#skills" className="hover:text-aqua transition-colors text-sm">Skills</a>
              <a href="#experience" className="hover:text-aqua transition-colors text-sm">Experience</a>
              <a href="#projects" className="hover:text-aqua transition-colors text-sm">Projects</a>
              <a href="#achievements" className="hover:text-aqua transition-colors text-sm">Achievements</a>
              <a href="#contact" className="hover:text-aqua transition-colors text-sm">Contact</a>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-semibold text-base">Contact Info</h3>
            <div className="space-y-1">
              <div className="flex justify-center md:justify-start items-center">
                <Mail className="h-4 w-4 mr-2 text-aqua" />
                <a 
                  href="mailto:akashyadv7233@gmail.com" 
                  className="hover:text-aqua transition-colors text-sm"
                >
                  akashyadv7233@gmail.com
                </a>
              </div>
              <div className="flex justify-center md:justify-start items-center">
                <Phone className="h-4 w-4 mr-2 text-aqua" />
                <a 
                  href="tel:+917208510561" 
                  className="hover:text-aqua transition-colors text-sm"
                >
                  +91 7208510561
                </a>
              </div>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-semibold text-base">Connect</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <Button
                asChild
                variant="outline"
                size="icon"
                className="rounded-full border-aqua text-aqua hover:bg-aqua/10 h-8 w-8"
              >
                <a
                  href="https://github.com/akash7233"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="icon"
                className="rounded-full border-aqua text-aqua hover:bg-aqua/10 h-8 w-8"
              >
                <a
                  href="https://www.linkedin.com/in/akashyadav33/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-6 pt-3 border-t border-border text-center">
          <p className="text-foreground/70 text-xs">
            © 2025 Akash Yadav. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
