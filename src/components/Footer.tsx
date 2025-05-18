
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
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-center mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollToTop}
            className="rounded-full h-12 w-12 bg-aqua text-white hover:bg-aqua/80 border-none"
          >
            <ChevronUp className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Navigation Links */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <a href="#home" className="hover:text-aqua transition-colors">Home</a>
              <a href="#about" className="hover:text-aqua transition-colors">About</a>
              <a href="#education" className="hover:text-aqua transition-colors">Education</a>
              <a href="#skills" className="hover:text-aqua transition-colors">Skills</a>
              <a href="#experience" className="hover:text-aqua transition-colors">Experience</a>
              <a href="#projects" className="hover:text-aqua transition-colors">Projects</a>
              <a href="#achievements" className="hover:text-aqua transition-colors">Achievements</a>
              <a href="#contact" className="hover:text-aqua transition-colors">Contact</a>
            </nav>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="font-semibold text-lg">Contact Info</h3>
            <div className="space-y-2">
              <div className="flex justify-center md:justify-start items-center">
                <Mail className="h-4 w-4 mr-2 text-aqua" />
                <a 
                  href="mailto:akashyadv7233@gmail.com" 
                  className="hover:text-aqua transition-colors"
                >
                  akashyadv7233@gmail.com
                </a>
              </div>
              <div className="flex justify-center md:justify-start items-center">
                <Phone className="h-4 w-4 mr-2 text-aqua" />
                <a 
                  href="tel:+917208510561" 
                  className="hover:text-aqua transition-colors"
                >
                  +91 7208510561
                </a>
              </div>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="font-semibold text-lg">Connect</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <Button
                asChild
                variant="outline"
                size="icon"
                className="rounded-full border-aqua text-aqua hover:bg-aqua/10"
              >
                <a
                  href="https://github.com/akash7233"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="icon"
                className="rounded-full border-aqua text-aqua hover:bg-aqua/10"
              >
                <a
                  href="https://www.linkedin.com/in/akashyadav33/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 pt-4 border-t border-border text-center">
          <p className="text-foreground/70 text-sm">
            © 2025 Akash Yadav. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
