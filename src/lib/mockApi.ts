/**
 * Mock API for Development
 * Returns fallback data when MongoDB/API is not available
 */

export const mockGitHubRepos = {
  username: "AKASH7233",
  repositories: [
    {
      id: 1080299097,
      name: "travelGuide_AI",
      description: "AI-powered travel guide application that provides personalized travel recommendations and itineraries using artificial intelligence.",
      htmlUrl: "https://github.com/AKASH7233/travelGuide_AI",
      homepage: "https://travel-guide-ai.vercel.app",
      language: "JavaScript",
      stars: 1,
      forks: 0,
      topics: ["ai", "travel", "react", "nextjs", "travel-guide"],
      updatedAt: "2025-10-23T06:43:16Z"
    },
    {
      id: 1078931875,
      name: "TeamMate",
      description: "Collaborative team management platform for organizing projects, tasks, and team communication in one place.",
      htmlUrl: "https://github.com/AKASH7233/TeamMate",
      homepage: "https://team-mate-sigma.vercel.app",
      language: "JavaScript",
      stars: 0,
      forks: 0,
      topics: ["collaboration", "team-management", "project-management", "react"],
      updatedAt: "2025-10-18T18:46:20Z"
    },
    {
      id: 985648821,
      name: "personal_portfolio",
      description: "Modern personal portfolio website showcasing projects, skills, and achievements with responsive design and dark mode support.",
      htmlUrl: "https://github.com/AKASH7233/personal_portfolio",
      homepage: "https://akash-portfolio-sage.vercel.app",
      language: "TypeScript",
      stars: 0,
      forks: 0,
      topics: ["portfolio", "react", "typescript", "vite", "tailwind"],
      updatedAt: "2025-05-18T11:45:55Z"
    },
    {
      id: 771060315,
      name: "Connectify",
      description: "Innovative social networking platform designed to enhance online interactions with modern UI and efficient state management using React and Redux.",
      htmlUrl: "https://github.com/AKASH7233/Connectify",
      homepage: "https://connectify-omega.vercel.app",
      language: "JavaScript",
      stars: 1,
      forks: 1,
      topics: ["react", "redux", "social-media", "hacktoberfest", "open-source"],
      updatedAt: "2024-10-02T11:36:00Z"
    },
    {
      id: 831804049,
      name: "Connectnow",
      description: "Dynamic web application that facilitates online social interactions. Built with React and Redux, offering users a platform to connect and engage with others.",
      htmlUrl: "https://github.com/AKASH7233/Connectnow",
      homepage: "https://connecttnow.netlify.app",
      language: "JavaScript",
      stars: 1,
      forks: 0,
      topics: ["react", "redux", "social-networking", "web-app", "javascript"],
      updatedAt: "2024-07-31T12:51:34Z"
    },
    {
      id: 677993434,
      name: "Netflix",
      description: "Netflix UI Clone designed using HTML, CSS and JavaScript. Fully responsive with interactive FAQ section showcasing modern web design patterns.",
      htmlUrl: "https://github.com/AKASH7233/Netflix",
      homepage: "https://netflix-zeta-navy.vercel.app",
      language: "HTML",
      stars: 0,
      forks: 1,
      topics: ["html", "css", "javascript", "responsive-design", "ui-clone"],
      updatedAt: "2024-07-31T13:09:35Z"
    }
  ],
  topLanguages: [
    { language: "JavaScript", count: 15 },
    { language: "TypeScript", count: 10 },
    { language: "Python", count: 5 },
    { language: "Java", count: 3 }
  ],
  badges: {
    stars: "https://img.shields.io/github/stars/AKASH7233?style=for-the-badge&logo=github&labelColor=1a1b27&color=70a5fd",
    followers: "https://img.shields.io/github/followers/AKASH7233?style=for-the-badge&logo=github&labelColor=1a1b27&color=70a5fd",
    repos: "https://img.shields.io/badge/dynamic/json?style=for-the-badge&logo=github&labelColor=1a1b27&color=70a5fd&label=Repos&query=$.public_repos&url=https://api.github.com/users/AKASH7233",
  },
  totalRepos: 6,
  totalStars: 667,
  fetchedAt: new Date().toISOString()
};

export const mockGitHubContributions = (() => {
  const contributions: { date: string; count: number; level: string }[] = [];
  const today = new Date();
  let totalContributions = 0;
  
  // Generate data for past 380 days to cover full calendar grid (53 weeks * 7 days = 371 days + buffer)
  // This ensures we have data even when the calendar starts from the previous Sunday
  for (let i = 380; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Realistic contribution pattern (more on weekdays)
    const dayOfWeek = date.getDay();
    const random = Math.random();
    let count = 0;
    
    // Weekend - less activity
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      if (random < 0.3) count = Math.floor(Math.random() * 5) + 1;
    } else {
      // Weekday - more activity
      if (random < 0.7) count = Math.floor(Math.random() * 15) + 1;
    }
    
    // Only count contributions from last 365 days for total
    if (i <= 364) {
      totalContributions += count;
    }
    
    // Determine level based on count
    let level = 'NONE';
    if (count > 0 && count <= 3) level = 'FIRST_QUARTILE';
    else if (count > 3 && count <= 6) level = 'SECOND_QUARTILE';
    else if (count > 6 && count <= 10) level = 'THIRD_QUARTILE';
    else if (count > 10) level = 'FOURTH_QUARTILE';
    
    contributions.push({ date: dateStr, count, level });
  }
  
  return {
    username: "AKASH7233",
    totalContributions,
    contributions,
    fetchedAt: new Date().toISOString()
  };
})();

export const mockGitHubStats = {
  username: "AKASH7233",
  followers: 0,
  following: 0,
  publicRepos: 0,
  publicGists: 0,
  bio: "Full Stack Developer",
  company: null,
  location: "India",
  blog: "",
  fetchedAt: new Date().toISOString()
};

export const mockLeetCodeStats = {
  username: "akashyadv7233",
  totalSolved: 627,
  easySolved: 174,
  mediumSolved: 370,
  hardSolved: 83,
  totalQuestions: 3758,
  easyTotal: 915,
  mediumTotal: 1956,
  hardTotal: 887,
  ranking: 101610,
  streak: 33,
  longestStreak: 45,
  submissionCalendar: (() => {
    // Generate realistic submission calendar for past year
    const calendar: Record<string, number> = {};
    const today = Math.floor(Date.now() / 1000);
    const oneYearAgo = today - (365 * 24 * 60 * 60);
    
    for (let timestamp = oneYearAgo; timestamp <= today; timestamp += 24 * 60 * 60) {
      // Simulate realistic activity pattern (more on weekdays, occasional breaks)
      const date = new Date(timestamp * 1000);
      const dayOfWeek = date.getDay();
      const random = Math.random();
      
      // Less activity on weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        if (random < 0.3) calendar[timestamp.toString()] = Math.floor(Math.random() * 5);
      } else {
        // More activity on weekdays
        if (random < 0.7) calendar[timestamp.toString()] = Math.floor(Math.random() * 15) + 1;
      }
    }
    
    return calendar;
  })(),
  contestData: {
    contestAttend: 9,
    contestRating: 1869.42,
    contestGlobalRanking: 39803,
    contestTopPercentage: 5.2,
    totalParticipants: 791535,
    contestBadges: {
      name: "Knight"
    },
    contestParticipation: [
      {
        attended: true,
        rating: 1869.42,
        ranking: 4597,
        trendDirection: "DOWN",
        problemsSolved: 3,
        totalProblems: 4,
        finishTimeInSeconds: 5499,
        contest: {
          title: "Weekly Contest 475",
          startTime: 1762655400
        }
      },
      {
        attended: true,
        rating: 1875.09,
        ranking: 2465,
        trendDirection: "UP",
        problemsSolved: 3,
        totalProblems: 4,
        finishTimeInSeconds: 3199,
        contest: {
          title: "Biweekly Contest 168",
          startTime: 1761402600
        }
      },
      {
        attended: true,
        rating: 1861.02,
        ranking: 266,
        trendDirection: "UP",
        problemsSolved: 4,
        totalProblems: 4,
        finishTimeInSeconds: 5096,
        contest: {
          title: "Weekly Contest 463",
          startTime: 1755397800
        }
      }
    ]
  },
  badges: [
    { id: "1", name: "50 Days Badge", displayName: "50 Days Badge 2024", icon: "" },
    { id: "2", name: "100 Days Badge", displayName: "100 Days Badge 2024", icon: "" }
  ],
  badgeUrls: {
    solved: `https://img.shields.io/badge/Solved-627-FFA116?style=for-the-badge&logo=leetcode&logoColor=white&labelColor=1a1b27`,
    easy: `https://img.shields.io/badge/Easy-174/800-00B8A3?style=for-the-badge&logo=leetcode&logoColor=white&labelColor=1a1b27`,
    medium: `https://img.shields.io/badge/Medium-370/1600-FFA116?style=for-the-badge&logo=leetcode&logoColor=white&labelColor=1a1b27`,
    hard: `https://img.shields.io/badge/Hard-83/600-FF375F?style=for-the-badge&logo=leetcode&logoColor=white&labelColor=1a1b27`,
    ranking: `https://img.shields.io/badge/Rank-101,610-FFA116?style=for-the-badge&logo=leetcode&logoColor=white&labelColor=1a1b27`,
    streak: `https://img.shields.io/badge/Streak-33_days-FFA116?style=for-the-badge&logo=leetcode&logoColor=white&labelColor=1a1b27`,
    contests: `https://img.shields.io/badge/Contests-15-FFA116?style=for-the-badge&logo=leetcode&logoColor=white&labelColor=1a1b27`,
    contestRating: `https://img.shields.io/badge/Rating-1650-FFA116?style=for-the-badge&logo=leetcode&logoColor=white&labelColor=1a1b27`
  },
  fetchedAt: new Date().toISOString()
};

export const mockAchievements = {
  username: "AKASH7233",
  summary: "Full Stack Developer with expertise in modern web technologies, building scalable applications and solving complex problems.",
  bulletPoints: [
    "Developed multiple full-stack web applications using React, Node.js, and MongoDB",
    "Solved 650+ Data Structures and Algorithm problems on LeetCode",
    "Built responsive and user-friendly interfaces with modern design principles",
    "undergraduate with 9 CGPA in Computer Engineering"
  ],
  bio: "Passionate developer focused on creating efficient, scalable solutions.",
  generatedAt: new Date().toISOString()
};

export const mockSkills = {
  username: "AKASH7233",
  skills: {
    languages: ["JavaScript", "TypeScript", "Python", "Java", "C++"],
    frameworks: ["React", "Next.js", "Node.js", "Express", "Tailwind CSS"],
    tools: ["Git", "Docker", "VS Code", "Postman", "Figma"],
    databases: ["MongoDB", "PostgreSQL", "MySQL", "Redis"],
    cloud: ["Vercel", "AWS", "Firebase", "Netlify"]
  },
  extractedFrom: [],
  fetchedAt: new Date().toISOString()
};

export const mockAbout = {
  username: "AKASH7233",
  bio: "Full Stack Developer with expertise in React.js, Next.js, MongoDB, Express.js and modern web technologies. Building responsive, user-friendly web applications with focus on performance and best practices.",
  location: "India",
  company: null,
  blog: "",
  email: null,
  social: {
    github: "https://github.com/AKASH7233",
    linkedin: null,
    twitter: null
  },
  stats: {
    yearsOfExperience: 2,
    projectsCompleted: 10,
    totalStars: 0
  },
  highlights: [
    "undergraduate with 9 CGPA in Computer Engineering",
    "Solved 650+ DSA problems on competitive programming platforms",
    "Built multiple full-stack applications with modern tech stack",
    "Passionate about clean code and intuitive user interfaces"
  ],
  fetchedAt: new Date().toISOString()
};
