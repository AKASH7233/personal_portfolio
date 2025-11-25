import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchFromAPI, API_ENDPOINTS } from "@/lib/api";
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface PortfolioData {
  github?: any;
  leetcode?: any;
  achievements?: any;
  skills?: any;
  about?: any;
}

export function PortfolioChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load portfolio data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [github, leetcode, achievements, skills, about] = await Promise.all([
          fetchFromAPI(API_ENDPOINTS.GITHUB_REPOS),
          fetchFromAPI(API_ENDPOINTS.LEETCODE_STATS),
          fetchFromAPI(API_ENDPOINTS.ACHIEVEMENTS),
          fetchFromAPI(API_ENDPOINTS.SKILLS),
          fetchFromAPI(API_ENDPOINTS.ABOUT),
        ]);

        setPortfolioData({ github, leetcode, achievements, skills, about });
      } catch (error) {
        console.error("Error loading portfolio data:", error);
      }
    }

    loadData();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content:
            "👋 Hi! I'm Akash's AI assistant. Ask me anything about his projects, skills, LeetCode stats, or experience!",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  const generateResponse = (userQuestion: string): string => {
    const question = userQuestion.toLowerCase();

    // GitHub Projects
    if (question.includes("project") || question.includes("github") || question.includes("repo")) {
      const repos = portfolioData.github?.repositories || [];
      const topRepos = repos
        .sort((a: any, b: any) => b.stars - a.stars)
        .slice(0, 5);
      
      if (topRepos.length > 0) {
        const repoList = topRepos
          .map((r: any) => `• **${r.name}** - ${r.description || "No description"} (⭐ ${r.stars} stars)`)
          .join("\n");
        return `Akash has ${repos.length} public repositories on GitHub! Here are the top projects:\n\n${repoList}\n\nTotal stars: ${repos.reduce((sum: number, r: any) => sum + r.stars, 0)} ⭐`;
      }
    }

    // LeetCode Stats
    if (question.includes("leetcode") || question.includes("problem") || question.includes("dsa") || question.includes("coding")) {
      const lc = portfolioData.leetcode;
      if (lc) {
        let response = `🏆 **LeetCode Stats:**\n\n`;
        response += `• Total Problems Solved: **${lc.totalSolved}**\n`;
        response += `• Easy: ${lc.easySolved}/${lc.easyTotal}\n`;
        response += `• Medium: ${lc.mediumSolved}/${lc.mediumTotal}\n`;
        response += `• Hard: ${lc.hardSolved}/${lc.hardTotal}\n`;
        response += `• Current Streak: ${lc.streak} days 🔥\n`;
        response += `• Global Ranking: ${lc.ranking?.toLocaleString()}`;
        
        if (lc.contestData?.contestAttend > 0) {
          response += `\n\n**Contest Performance:**\n`;
          response += `• Contests Attended: ${lc.contestData.contestAttend}\n`;
          response += `• Rating: ${lc.contestData.contestRating}`;
        }
        
        return response;
      }
    }

    // Skills
    if (question.includes("skill") || question.includes("technology") || question.includes("tech stack") || question.includes("language")) {
      const skills = portfolioData.skills?.skills;
      if (skills) {
        let response = `💻 **Technical Skills:**\n\n`;
        if (skills.languages?.length) response += `**Languages:** ${skills.languages.join(", ")}\n`;
        if (skills.frameworks?.length) response += `**Frameworks:** ${skills.frameworks.join(", ")}\n`;
        if (skills.tools?.length) response += `**Tools:** ${skills.tools.join(", ")}\n`;
        if (skills.databases?.length) response += `**Databases:** ${skills.databases.join(", ")}\n`;
        if (skills.cloud?.length) response += `**Cloud:** ${skills.cloud.join(", ")}`;
        return response;
      }
    }

    // About/Bio
    if (question.includes("about") || question.includes("who") || question.includes("introduce") || question.includes("bio")) {
      const about = portfolioData.about;
      if (about) {
        let response = `👤 **About Akash:**\n\n${about.bio || "Full Stack Developer passionate about building scalable applications."}\n\n`;
        if (about.location) response += `📍 Location: ${about.location}\n`;
        if (about.school) response += `🎓 Education: ${about.school}\n`;
        if (about.stats?.yearsOfExperience) response += `💼 Experience: ${about.stats.yearsOfExperience}+ years\n`;
        if (about.highlights?.length) {
          response += `\n**Highlights:**\n${about.highlights.slice(0, 3).map((h: string) => `• ${h}`).join("\n")}`;
        }
        return response;
      }
    }

    // Education
    if (question.includes("education") || question.includes("college") || question.includes("university") || question.includes("degree")) {
      return `🎓 **Education:**\n\nAkash undergraduate from **Thakur College of Engineering & Technology** with a Bachelor of Engineering in Computer Engineering, achieving an impressive **9 CGPA**.`;
    }

    // Achievements
    if (question.includes("achievement") || question.includes("accomplishment")) {
      const achievements = portfolioData.achievements;
      if (achievements?.bulletPoints?.length) {
        return `🏆 **Key Achievements:**\n\n${achievements.bulletPoints.map((a: string) => `• ${a}`).join("\n")}`;
      }
    }

    // Contact/Social
    if (question.includes("contact") || question.includes("email") || question.includes("reach") || question.includes("social")) {
      return `📧 **Get in Touch:**\n\nYou can reach Akash through:\n• GitHub: [github.com/AKASH7233](https://github.com/AKASH7233)\n• LeetCode: [leetcode.com/akashyadv7233](https://leetcode.com/u/akashyadv7233)\n• LinkedIn: Check the contact section on the portfolio\n• Resume: Available for download on the About section`;
    }

    // Experience
    if (question.includes("experience") || question.includes("work") || question.includes("job")) {
      const github = portfolioData.github;
      const stats = portfolioData.about?.stats;
      return `💼 **Experience:**\n\nAkash has ${stats?.yearsOfExperience || 2}+ years of coding experience with:\n• ${github?.totalRepos || 30}+ projects built\n• ${github?.totalStars || 0} GitHub stars\n• ${portfolioData.leetcode?.totalSolved || 627}+ problems solved on LeetCode\n• Proficient in full-stack development with modern technologies`;
    }

    // Contest
    if (question.includes("contest") || question.includes("competitive")) {
      const contest = portfolioData.leetcode?.contestData;
      if (contest?.contestAttend > 0) {
        return `🏅 **Contest Performance:**\n\n• Contests Attended: ${contest.contestAttend}\n• Contest Rating: ${contest.contestRating}\n• Top ${contest.contestTopPercentage}% globally\n• Global Rank: ${contest.contestGlobalRanking?.toLocaleString()}`;
      }
      return `Akash has participated in coding contests on LeetCode. Check the LeetCode section for more details!`;
    }

    // Default response
    const suggestions = [
      "Tell me about your projects",
      "What are your LeetCode stats?",
      "What skills do you have?",
      "Tell me about your education",
      "What are your achievements?",
      "How can I contact you?",
    ];

    return `I can help you learn more about Akash! Here are some things you can ask:\n\n${suggestions.map(s => `• ${s}`).join("\n")}`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-aqua hover:bg-aqua/90 z-50 transition-transform hover:scale-110"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col border-2 border-aqua/20">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-aqua/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-aqua flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">Ask me about Akash</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-aqua/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="h-8 w-8 rounded-full bg-aqua/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-aqua" />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                      message.role === "user"
                        ? "bg-aqua text-white"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <div className="text-sm prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                      {message.role === "assistant" ? (
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 my-2">{children}</ul>,
                            li: ({ children }) => <li className="text-sm">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                            a: ({ href, children }) => (
                              <a href={href} target="_blank" rel="noopener noreferrer" className="text-aqua hover:underline">
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        <p>{message.content}</p>
                      )}
                    </div>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {message.role === "user" && (
                    <div className="h-8 w-8 rounded-full bg-aqua flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-aqua/20 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-aqua" />
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-muted">
                    <Loader2 className="h-4 w-4 animate-spin text-aqua" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="bg-aqua hover:bg-aqua/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Powered by the portfolio data
            </p>
          </div>
        </Card>
      )}
    </>
  );
}
