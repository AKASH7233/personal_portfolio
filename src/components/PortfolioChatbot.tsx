import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';

const GITHUB_USERNAME = "AKASH7233";
const LEETCODE_USERNAME = "akashyadv7233";
const LEETCODE_API = "https://alfa-leetcode-api.onrender.com";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface PortfolioData {
  github?: { user: any; repos: any[] };
  leetcode?: { profile: any; solved: any; contest: any };
  pinned?: any[];
}

/* ── fetch real data from the same APIs the sections use ─────── */
async function fetchPortfolioData(): Promise<PortfolioData> {
  const data: PortfolioData = {};

  try {
    const [ghUser, ghRepos] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`).then(r => r.ok ? r.json() : null),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`).then(r => r.ok ? r.json() : []),
    ]);
    data.github = { user: ghUser, repos: ghRepos };
  } catch { /* skip */ }

  try {
    const pinned = await fetch(`https://pinned.berrysauce.dev/get/${GITHUB_USERNAME}`).then(r => r.ok ? r.json() : []);
    data.pinned = pinned;
  } catch { /* skip */ }

  try {
    const [profile, solved, contest] = await Promise.all([
      fetch(`${LEETCODE_API}/${LEETCODE_USERNAME}`).then(r => r.ok ? r.json() : null),
      fetch(`${LEETCODE_API}/${LEETCODE_USERNAME}/solved`).then(r => r.ok ? r.json() : null),
      fetch(`${LEETCODE_API}/${LEETCODE_USERNAME}/contest`).then(r => r.ok ? r.json() : null),
    ]);
    data.leetcode = { profile, solved, contest };
  } catch { /* skip */ }

  return data;
}

/* ── response generator ──────────────────────────────────────── */
function generateResponse(q: string, data: PortfolioData): string {
  const question = q.toLowerCase().trim();

  // Identity questions
  if (
    question.match(/who\s*are\s*you/) ||
    question.match(/what\s*are\s*you/) ||
    question.match(/which\s*model/) ||
    question.match(/what\s*model/) ||
    question.match(/your\s*name/) ||
    question.match(/are\s*you\s*(ai|bot|gpt|chatgpt|gemini|llm)/)
  ) {
    return "I am a bot serving on behalf of Akash for you. I can answer questions about his skills, projects, LeetCode stats, experience, and more.";
  }

  // --- LeetCode: rating specifically ---
  if (question.match(/rating/) && (question.match(/leetcode|contest|lc/) || !question.match(/github/))) {
    const c = data.leetcode?.contest;
    if (c?.contestRating) {
      return `Akash's LeetCode contest rating is **${Math.round(c.contestRating)}**.${c.contestBadges?.name ? ` He holds the **${c.contestBadges.name}** badge.` : ""}\n\nProfile: [leetcode.com/u/${LEETCODE_USERNAME}](https://leetcode.com/u/${LEETCODE_USERNAME})`;
    }
    return "Contest rating data is currently unavailable.";
  }

  // --- LeetCode: rank specifically ---
  if (question.match(/rank/) && (question.match(/leetcode|contest|lc|global/) || !question.match(/github/))) {
    const c = data.leetcode?.contest;
    const p = data.leetcode?.profile;
    if (question.match(/contest/) && c?.contestGlobalRanking) {
      return `Akash's LeetCode contest global rank is **#${c.contestGlobalRanking.toLocaleString()}** (top ${c.contestTopPercentage?.toFixed(1)}%).`;
    }
    if (p?.ranking) {
      return `Akash's overall LeetCode ranking is **#${p.ranking.toLocaleString()}**.`;
    }
    return "Ranking data is currently unavailable.";
  }

  // --- LeetCode: solved count ---
  if (question.match(/how\s*many.*solved|total.*solved|problems?\s*solved|solved.*problem/) && (question.match(/leetcode|lc/) || !question.match(/github/))) {
    const s = data.leetcode?.solved;
    if (s) {
      return `Akash has solved **${s.solvedProblem}** problems on LeetCode -- ${s.easySolved} Easy, ${s.mediumSolved} Medium, and ${s.hardSolved} Hard.\n\nProfile: [leetcode.com/u/${LEETCODE_USERNAME}](https://leetcode.com/u/${LEETCODE_USERNAME})`;
    }
    return "Solved count data is currently unavailable.";
  }

  // --- LeetCode: contest performance ---
  if (question.match(/contest/) && (question.match(/leetcode|lc/) || !question.match(/github/))) {
    const c = data.leetcode?.contest;
    if (c) {
      let r = `**Akash's LeetCode Contest Performance:**\n\n`;
      r += `- Contest Rating: **${Math.round(c.contestRating)}**\n`;
      r += `- Global Rank: **#${c.contestGlobalRanking?.toLocaleString()}**\n`;
      r += `- Contests Attended: **${c.contestAttend}**\n`;
      r += `- Top **${c.contestTopPercentage?.toFixed(1)}%** globally`;
      if (c.contestBadges?.name) r += `\n- Badge: **${c.contestBadges.name}**`;
      r += `\n\nProfile: [leetcode.com/u/${LEETCODE_USERNAME}](https://leetcode.com/u/${LEETCODE_USERNAME})`;
      return r;
    }
    return "Contest data is currently unavailable.";
  }

  // --- LeetCode: general ---
  if (question.match(/leetcode|lc\b/)) {
    const s = data.leetcode?.solved;
    const c = data.leetcode?.contest;
    if (s) {
      let r = `**Akash's LeetCode Profile:**\n\n`;
      r += `- Problems Solved: **${s.solvedProblem}** (Easy: ${s.easySolved}, Medium: ${s.mediumSolved}, Hard: ${s.hardSolved})\n`;
      if (c?.contestRating) r += `- Contest Rating: **${Math.round(c.contestRating)}**\n`;
      if (c?.contestGlobalRanking) r += `- Global Rank: **#${c.contestGlobalRanking.toLocaleString()}**\n`;
      if (c?.contestAttend) r += `- Contests Attended: **${c.contestAttend}**`;
      if (c?.contestBadges?.name) r += `\n- Badge: **${c.contestBadges.name}**`;
      r += `\n\nProfile: [leetcode.com/u/${LEETCODE_USERNAME}](https://leetcode.com/u/${LEETCODE_USERNAME})`;
      return r;
    }
    return "LeetCode data is currently unavailable. You can check his profile at [leetcode.com/u/" + LEETCODE_USERNAME + "](https://leetcode.com/u/" + LEETCODE_USERNAME + ").";
  }

  // --- GitHub: pinned repos ---
  if (question.match(/pinned|pin/)) {
    const pinned = data.pinned;
    if (pinned?.length) {
      const list = pinned.map((r: any) => `- [${r.name}](https://github.com/${r.author}/${r.name}) -- ${r.description || "No description"} (${r.language})`).join("\n");
      return `**Akash's Pinned Repositories:**\n\n${list}`;
    }
    return "Pinned repos data is currently unavailable.";
  }

  // --- GitHub: projects / repos ---
  if (question.match(/project|github|repo/)) {
    const gh = data.github;
    const pinned = data.pinned;
    if (gh?.user) {
      let r = `Akash has **${gh.user.public_repos}** public repositories on GitHub.`;
      if (pinned?.length) {
        r += `\n\n**Pinned Repositories:**\n`;
        r += pinned.map((p: any) => `- [${p.name}](https://github.com/${p.author}/${p.name}) -- ${p.description || "No description"}`).join("\n");
      }
      r += `\n\nGitHub: [github.com/${GITHUB_USERNAME}](https://github.com/${GITHUB_USERNAME})`;
      return r;
    }
    return `You can view Akash's projects at [github.com/${GITHUB_USERNAME}](https://github.com/${GITHUB_USERNAME}).`;
  }

  // --- GitHub: followers ---
  if (question.match(/follower|following/)) {
    const u = data.github?.user;
    if (u) {
      return `Akash has **${u.followers}** followers and is following **${u.following}** people on GitHub.\n\nGitHub: [github.com/${GITHUB_USERNAME}](https://github.com/${GITHUB_USERNAME})`;
    }
  }

  // --- GitHub: stars ---
  if (question.match(/star/) && question.match(/github/)) {
    const repos = data.github?.repos;
    if (repos?.length) {
      const total = repos.reduce((s: number, r: any) => s + (r.stargazers_count || 0), 0);
      return `Akash has a total of **${total}** stars across his GitHub repositories.`;
    }
  }

  // --- Skills ---
  if (question.match(/skill|tech\s*stack|technolog|language.*know|what.*use/)) {
    return `**Akash's Technical Skills:**\n\n` +
      `- **Languages:** Java, JavaScript, TypeScript, Python, C++, SQL\n` +
      `- **Frontend:** React.js, Next.js, TailwindCSS, Redux, HTML5, CSS3\n` +
      `- **Backend:** Node.js, Express.js, Spring Boot, Apache Kafka\n` +
      `- **Databases:** MongoDB, PostgreSQL, MySQL, Prisma ORM\n` +
      `- **Tools:** Git, Docker, Webpack, Vite, Prometheus, Grafana\n\n` +
      `Portfolio: [akashyadav-one.vercel.app](https://akashyadav-one.vercel.app/)`;
  }

  // --- Education ---
  if (question.match(/education|college|university|degree|cgpa|school/)) {
    return `Akash is an undergraduate from **Thakur College of Engineering and Technology**, Mumbai, pursuing a Bachelor of Engineering in Computer Engineering with a **9 CGPA**.`;
  }

  // --- Experience ---
  if (question.match(/experience|work|intern|job|company/)) {
    return `**Akash's Experience:**\n\n` +
      `1. **Full Stack Developer Intern** at VighnoTech (Aug 2023 - Feb 2024)\n` +
      `   - Built an integrated chatbot and form generator reducing customer response time by 30%\n` +
      `   - Implemented automated email workflows improving inquiry management by 25%\n` +
      `   - Technologies: React.js, Next.js, MongoDB, Express.js, TypeScript, Prisma ORM, PostgreSQL\n\n` +
      `2. **Technical Member** at RCTCET (Aug 2023 - July 2024)\n` +
      `   - Created the About Us and Events pages\n` +
      `   - Coordinated tech events for 200+ attendees`;
  }

  // --- Achievements ---
  if (question.match(/achievement|accomplish/)) {
    const c = data.leetcode?.contest;
    return `**Akash's Key Achievements:**\n\n` +
      `- Solved **${data.leetcode?.solved?.solvedProblem || "700+"}** problems on LeetCode\n` +
      (c?.contestRating ? `- LeetCode contest rating of **${Math.round(c.contestRating)}**${c.contestBadges?.name ? ` (${c.contestBadges.name} badge)` : ""}\n` : "") +
      `- Reduced customer response time by 30% during internship at VighnoTech\n` +
      `- Coordinated tech events for 200+ attendees at RCTCET\n` +
      `- Maintains ${data.github?.user?.public_repos || "40+"}  open-source repositories on GitHub`;
  }

  // --- Contact ---
  if (question.match(/contact|email|mail|phone|number|reach|call|social|linkedin/)) {
    return `**Contact Akash:**\n\n` +
      `- Email: [akashyadv7233@gmail.com](mailto:akashyadv7233@gmail.com)\n` +
      `- Phone: [+91 7208510561](tel:+917208510561)\n` +
      `- GitHub: [github.com/${GITHUB_USERNAME}](https://github.com/${GITHUB_USERNAME})\n` +
      `- LinkedIn: [linkedin.com/in/akashyadav33](https://www.linkedin.com/in/akashyadav33/)\n` +
      `- LeetCode: [leetcode.com/u/${LEETCODE_USERNAME}](https://leetcode.com/u/${LEETCODE_USERNAME})\n` +
      `- Portfolio: [akashyadav-one.vercel.app](https://akashyadav-one.vercel.app/)`;
  }

  // --- About / Who is Akash ---
  if (question.match(/about|who\s*is\s*akash|introduce|tell.*about.*akash|bio/)) {
    const u = data.github?.user;
    return `Akash Yadav is a Software Engineer and Computer Engineering student at Thakur College of Engineering and Technology, Mumbai.` +
      (u?.bio ? ` ${u.bio}.` : "") +
      `\n\nHe has solved ${data.leetcode?.solved?.solvedProblem || "700+"} LeetCode problems, holds a contest rating of ${data.leetcode?.contest?.contestRating ? Math.round(data.leetcode.contest.contestRating) : "~1989"}, and maintains ${u?.public_repos || "40+"} open-source repositories.\n\n` +
      `Portfolio: [akashyadav-one.vercel.app](https://akashyadav-one.vercel.app/)`;
  }

  // --- Resume ---
  if (question.match(/resume|cv|download/)) {
    return "Akash's resume is available for download in the About section of the portfolio at [akashyadav-one.vercel.app](https://akashyadav-one.vercel.app/).";
  }

  // --- Hire ---
  if (question.match(/hire|available|open to|looking for/)) {
    return "Akash is open to opportunities. You can reach him at [akashyadv7233@gmail.com](mailto:akashyadv7233@gmail.com) or connect on [LinkedIn](https://www.linkedin.com/in/akashyadav33/).";
  }

  // --- Default ---
  return "I can answer questions about Akash. Try asking about:\n\n" +
    "- His LeetCode rating, rank, or problems solved\n" +
    "- His GitHub projects or pinned repos\n" +
    "- His skills and tech stack\n" +
    "- His education or work experience\n" +
    "- How to contact him";
}

export function PortfolioChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load real data on mount (same APIs as GitHub/LeetCode sections)
  useEffect(() => {
    fetchPortfolioData().then(setPortfolioData);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: "Hi, I am a bot serving on behalf of Akash. Feel free to ask me about his projects, skills, LeetCode stats, experience, or how to get in touch with him.",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

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

    setTimeout(() => {
      const response = generateResponse(input, portfolioData);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    }, 400);
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
                <h3 className="font-semibold text-foreground">Akash's Assistant</h3>
                <p className="text-xs text-muted-foreground">Ask me anything about Akash</p>
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
          </div>
        </Card>
      )}
    </>
  );
}
