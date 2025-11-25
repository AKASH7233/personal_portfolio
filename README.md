# 🚀 AI-Powered Self-Updating Portfolio

An intelligent portfolio website that automatically updates itself using live data from GitHub and LeetCode, with AI-generated achievements powered by Google Gemini.

## ✨ Features

- **🔄 Auto-Sync**: Automatically fetches latest data from GitHub and LeetCode
- **🤖 AI Achievements**: Google Gemini generates professional achievement summaries
- **📊 Dynamic Stats**: Real-time badges, contribution heatmaps, and problem-solving statistics
- **🗄️ MongoDB Integration**: Stores all data in MongoDB for fast retrieval
- **⚡ Serverless API**: Vercel serverless functions serve data to the frontend
- **🔁 Automated Updates**: GitHub Actions runs daily syncs and triggers redeployment
- **🎨 Modern UI**: Built with React, TypeScript, Tailwind CSS, and shadcn/ui

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Query** - Data fetching

### Backend/Automation
- **Node.js** - Automation scripts
- **MongoDB** - Database
- **Google Gemini AI** - Achievement generation
- **GitHub REST + GraphQL APIs** - Repository and contribution data
- **LeetCode API** - Problem-solving statistics

### DevOps
- **GitHub Actions** - Automated daily syncs
- **Vercel** - Hosting and serverless functions

## 📋 Prerequisites

- Node.js 18+ and npm/bun
- MongoDB Atlas account (free tier works)
- GitHub Personal Access Token
- Google Gemini API Key
- Vercel account (for deployment)

## 🚀 Setup Instructions

### 1. Clone and Install

```bash
git clone https://github.com/AKASH7233/personal_portfolio.git
cd personal_portfolio
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```bash
# GitHub Configuration
GITHUB_USERNAME=AKASH7233
GITHUB_TOKEN=ghp_your_github_token_here

# LeetCode Configuration
LEETCODE_USERNAME=your_leetcode_username

# Google Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio

# Deployment Configuration (optional)
DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/...
```

### 3. Get Required API Keys

#### GitHub Personal Access Token
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Required scopes:
   - `repo` (for accessing public repositories)
   - `read:user` (for user stats)
4. Copy the token to `GITHUB_TOKEN`

#### Google Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy to `GEMINI_API_KEY`

#### MongoDB URI
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist your IP (or use 0.0.0.0/0 for all IPs)
4. Get connection string and replace `<username>` and `<password>`

### 4. Run Initial Data Sync

```bash
# Fetch GitHub data
npm run sync:github

# Fetch LeetCode data
npm run sync:leetcode

# Generate AI achievements
npm run sync:achievements

# Or run all at once
npm run sync:data
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

## 📁 Project Structure

```
personal_portfolio/
├── automation/              # Data fetching and AI generation scripts
│   ├── lib/
│   │   ├── github.js       # GitHub API integration
│   │   ├── leetcode.js     # LeetCode API integration
│   │   ├── gemini.js       # Google Gemini AI integration
│   │   └── mongodb.js      # MongoDB helper functions
│   ├── fetch-github.js     # Fetch GitHub repositories and stats
│   ├── fetch-leetcode.js   # Fetch LeetCode stats
│   ├── generate-achievements.js  # Generate AI achievements
│   └── run-sync.js         # Orchestrate all syncs
├── api/                    # Vercel serverless functions
│   ├── github/
│   │   ├── repos.js        # GET /api/github/repos
│   │   ├── contributions.js # GET /api/github/contributions
│   │   └── stats.js        # GET /api/github/stats
│   ├── leetcode/
│   │   └── stats.js        # GET /api/leetcode/stats
│   └── achievements.js     # GET /api/achievements
├── src/
│   ├── components/         # React components
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectsList.tsx
│   │   ├── GitHubHeatmap.tsx
│   │   ├── LeetCodeStats.tsx
│   │   ├── LeetCodeHeatmap.tsx
│   │   ├── StatsBadges.tsx
│   │   └── Achievements.tsx (updated with AI)
│   └── lib/
│       └── api.ts          # API client configuration
├── .github/workflows/
│   └── auto-update.yml     # Daily automation workflow
├── .env.example            # Environment variable template
└── README.md
```

## 🔄 How It Works

### Data Flow

1. **GitHub Actions** runs daily (2 AM UTC)
2. Executes `automation/run-sync.js`
3. Scripts fetch data from:
   - GitHub API (repos, contributions, stats)
   - LeetCode API (problems solved, calendar)
4. Data is stored in **MongoDB** collections:
   - `github_repositories`
   - `github_contributions`
   - `github_stats`
   - `leetcode_stats`
5. **Google Gemini** analyzes the data and generates achievements
6. Stored in `achievements` collection
7. **Vercel Deploy Hook** is triggered
8. Frontend fetches data via serverless API endpoints

### MongoDB Collections Schema

#### `github_repositories`
```javascript
{
  username: "AKASH7233",
  repositories: [...],
  topLanguages: [...],
  badges: {...},
  totalRepos: 20,
  totalStars: 45,
  fetchedAt: Date
}
```

#### `leetcode_stats`
```javascript
{
  username: "akashyadv7233",
  totalSolved: 300,
  easySolved: 150,
  mediumSolved: 120,
  hardSolved: 30,
  submissionCalendar: [...],
  streak: { current: 5, longest: 30 },
  badges: {...},
  fetchedAt: Date
}
```

#### `achievements`
```javascript
{
  username: "AKASH7233",
  summary: "AI-generated professional summary...",
  bulletPoints: ["Achievement 1", "Achievement 2", ...],
  bio: "Short bio for hero section",
  sourceHash: "abc123...",
  generatedAt: Date
}
```

## 🚢 Deployment

### Vercel Deployment

1. **Import Project** to Vercel
2. **Add Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env`
3. **Deploy**

### GitHub Secrets

Add these secrets to your GitHub repository:
- Settings → Secrets and variables → Actions → New repository secret

Required secrets:
- `GH_USERNAME`
- `GH_TOKEN`
- `LEETCODE_USERNAME`
- `GEMINI_API_KEY`
- `MONGODB_URI`
- `DEPLOY_HOOK_URL` (Vercel Deploy Hook URL)

### Get Vercel Deploy Hook

1. Go to Vercel Project Settings → Git → Deploy Hooks
2. Create a new hook (e.g., "Auto Update")
3. Copy the URL to `DEPLOY_HOOK_URL`

## 🧪 Manual Sync

```bash
# Sync all data
npm run sync:data

# Sync individual sources
npm run sync:github
npm run sync:leetcode
npm run sync:achievements

# Dry run (test without saving)
node automation/run-sync.js --dry-run
```

## 📊 API Endpoints

All endpoints return JSON and are accessible at `/api/*`:

- `GET /api/github/repos` - GitHub repositories with badges
- `GET /api/github/contributions` - Contribution heatmap data
- `GET /api/github/stats` - Profile statistics
- `GET /api/leetcode/stats` - LeetCode stats and heatmap
- `GET /api/achievements` - AI-generated achievements

## 🎨 Customization

### Change Sync Schedule

Edit `.github/workflows/auto-update.yml`:

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
    # Change to '0 */6 * * *' for every 6 hours
```

### Customize AI Prompts

Edit `automation/lib/gemini.js` → `buildAchievementPrompt()` function

### Add More Badges

Edit `automation/lib/github.js` → `generateBadges()` function

## 🐛 Troubleshooting

### MongoDB Connection Errors
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has read/write permissions

### GitHub API Rate Limits
- Use a Personal Access Token (increases limit to 5000/hour)
- Check remaining quota: `curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/rate_limit`

### Gemini API Errors
- Verify API key is valid
- Check quota at [Google AI Studio](https://makersuite.google.com/)
- Free tier has rate limits; add retry logic if needed

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules bun.lockb
npm install
npm run build
```

## 📝 License

MIT License - feel free to use this for your own portfolio!

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a PR.

## 📧 Contact

**Akash Yadav**
- GitHub: [@AKASH7233](https://github.com/AKASH7233)
- LeetCode: [@akashyadv7233](https://leetcode.com/akashyadv7233)

---

Built with ❤️ using React, TypeScript, MongoDB, and Google Gemini AI
