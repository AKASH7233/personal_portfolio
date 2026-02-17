import { useEffect, lazy, Suspense } from "react";
import SEOHead from "@/components/SEOHead";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Education from "@/components/Education";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { PortfolioChatbot } from "@/components/PortfolioChatbot";

const GitHubProfile = lazy(() => import("@/components/GitHubProfile"));
const LeetCodeSection = lazy(() => import("@/components/LeetCodeSection"));
const Achievements = lazy(() => import("@/components/Achievements"));

const Index = () => {
  useEffect(() => {
    document.title = "Akash Yadav | Full Stack Developer | React, Node.js, MongoDB Expert";

    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Akash Yadav | Full Stack Developer | React, Node.js, MongoDB Expert"
        description="Experienced Full Stack Developer specializing in React.js, Next.js, Node.js, MongoDB, and TypeScript. 627+ LeetCode problems solved. View my portfolio, projects, and achievements."
        keywords={[
          "Akash Yadav",
          "Full Stack Developer",
          "MERN Stack",
          "React.js",
          "Node.js",
          "LeetCode",
          "GitHub AKASH7233",
          "Competitive Programming",
        ]}
        url="https://akashyadav-one.vercel.app"
      />
      <NavBar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Suspense fallback={<div className="py-24 text-center text-muted-foreground">Loading…</div>}>
          <GitHubProfile />
          <LeetCodeSection />
          <Education />
          <Achievements />
        </Suspense>

        <Contact />
      </main>
      <Footer />
      <PortfolioChatbot />
    </div>
  );
};

export default Index;
