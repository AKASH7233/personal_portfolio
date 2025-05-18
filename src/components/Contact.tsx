import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Github, Linkedin, Mail, Phone } from "lucide-react";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";
import emailjs from "emailjs-com";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "-100px",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm() || !formRef.current) return;

    setIsSubmitting(true);

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID, // Replace with your actual EmailJS service ID
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID, // Replace with your actual EmailJS template ID
        formRef.current,
        import.meta.env.VITE_EMAILJS_API_KEY   // Replace with your actual EmailJS public key
      )
      .then(() => {
        toast({
          title: "Message Sent!",
          description: "Thank you for your message. I'll get back to you soon.",
        });

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        setIsSubmitting(false);
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        toast({
          title: "Failed to Send",
          description: "Something went wrong. Please try again later.",
          variant: "destructive",
        });
        setIsSubmitting(false);
      });
  };

  return (
    <section
      id="contact"
      ref={elementRef as React.RefObject<HTMLElement>}
      className={cn(
        "py-16 md:py-24 transition-all duration-700",
        isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="section-title">Contact Me</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          <div className="bg-card p-6 rounded-lg shadow-md border border-border">
            <h3 className="text-xl font-semibold mb-6">Get In Touch</h3>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              {/* Same form fields, unchanged */}
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" className={errors.name ? "border-destructive" : ""} />
                {errors.name && <span className="text-destructive text-xs mt-1">{errors.name}</span>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your.email@example.com" className={errors.email ? "border-destructive" : ""} />
                {errors.email && <span className="text-destructive text-xs mt-1">{errors.email}</span>}
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" className={errors.subject ? "border-destructive" : ""} />
                {errors.subject && <span className="text-destructive text-xs mt-1">{errors.subject}</span>}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Your message..." rows={5} className={errors.message ? "border-destructive" : ""} />
                {errors.message && <span className="text-destructive text-xs mt-1">{errors.message}</span>}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full bg-aqua hover:bg-aqua/80 text-white">
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Contact Info Section – unchanged */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-aqua mr-4" />
                  <div>
                    <h4 className="text-sm font-medium">Email</h4>
                    <a 
                      href="mailto:akashyadv7233@gmail.com" 
                      className="text-foreground hover:text-aqua"
                    >
                      akashyadv7233@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-aqua mr-4" />
                  <div>
                    <h4 className="text-sm font-medium">Phone</h4>
                    <a 
                      href="tel:+917208510561" 
                      className="text-foreground hover:text-aqua"
                    >
                      +91 7208510561
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-6">Connect With Me</h3>
              
              <div className="flex space-x-4">
                <Button
                  asChild
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full border-aqua text-aqua hover:bg-aqua/10"
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
                  className="h-12 w-12 rounded-full border-aqua text-aqua hover:bg-aqua/10"
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
        </div>
      </div>
    </section>
  );
}

export default Contact;
