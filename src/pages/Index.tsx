
import { useEffect, useState } from "react";
import { API_ENDPOINTS, fetchFromAPI } from "@/lib/api";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Education from "@/components/Education";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Achievements from "@/components/Achievements";
import LeetCodeStats from "@/components/LeetCodeStats";
import { LeetCodeContest } from "@/components/LeetCodeContest";
import { LeetCodeBadges } from "@/components/LeetCodeBadges";
import { LeetCodeProfile } from "@/components/LeetCodeProfile";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { PortfolioChatbot } from "@/components/PortfolioChatbot";

const Index = () => {
  const [leetcodeData, setLeetcodeData] = useState<any>(null);

  useEffect(() => {
    // Update the document title with SEO-optimized version
    document.title = "Akash Yadav | Full Stack Developer | React, Node.js, MongoDB Expert";
    
    // Check for user's theme preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Fetch LeetCode data for contest section
    async function loadLeetCodeData() {
      try {
        const data = await fetchFromAPI(API_ENDPOINTS.LEETCODE_STATS);
        setLeetcodeData(data);
      } catch (err) {
        console.error('Error loading LeetCode data:', err);
      }
    }
    loadLeetCodeData();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <main>
        <Hero />
        <About />
        <Education />
        <Skills />
        <Experience />
        <Projects />
        
        {/* LeetCode Section */}
        <section id="leetcode" className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6 space-y-12">
            <div className="flex items-center justify-between">
              <h2 className="section-title">Problem Solving & Competitive Programming</h2>
              <a 
                href="https://leetcode.com/u/akashyadv7233" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-aqua hover:underline flex items-center gap-1"
              >
                View Profile →
              </a>
            </div>
            
            {/* Profile Cards */}
            {leetcodeData && <LeetCodeProfile data={leetcodeData} />}

            {/* Contest Details */}
            {leetcodeData?.contestData && (
              <div className="mt-8">
                <LeetCodeContest contestData={leetcodeData.contestData} />
              </div>
            )}
          </div>
        </section>
        
        <Achievements />
        <Contact />
      </main>
      <Footer />
      
      {/* AI Chatbot */}
      <PortfolioChatbot />
    </div>
  );
};

export default Index;
