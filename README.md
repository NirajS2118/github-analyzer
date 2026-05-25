# GitHub Competitive Analyzer

Compare two GitHub profiles side by side — stats, languages, top repos, charts, scores, PDF export, and persistent history.

**Stack:** React + Recharts · Node/Express · MongoDB + Mongoose · Passport.js (GitHub OAuth) · jsPDF

---

## Features

- Side-by-side profile comparison with score bar and per-stat "wins" badges
- Bar chart (Recharts) for repos, stars, forks, followers
- Language breakdown with progress bars
- Top repos linked to GitHub
- **GitHub OAuth** — sign in with your GitHub account
- **MongoDB history** — every comparison auto-saved, viewable at /history
- **PDF export** — dark-themed A4 report with all stats, languages, and top repos
- Shareable URLs: `/compare/torvalds/gaearon`
- Server-side caching (5 min) and rate limiting

---

## Setup

### 1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment

```bash
cd server
cp .env.example .env
# Fill in all values (see below)
```

### 3. MongoDB

Get a free cluster at https://mongodb.com/atlas
Copy the connection string into `MONGODB_URI`.

### 4. GitHub OAuth App

Go to https://github.com/settings/developers → "New OAuth App"

| Field | Value |
|-------|-------|
| Homepage URL | http://localhost:5173 |
| Authorization callback URL | http://localhost:5000/api/auth/github/callback |

Copy the Client ID and Client Secret into `.env`.

### 5. Run

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

Open http://localhost:5173

---

## Environment variables

```env
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development

MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/github-analyzer
SESSION_SECRET=any-long-random-string

GITHUB_CLIENT_ID=from_oauth_app
GITHUB_CLIENT_SECRET=from_oauth_app
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

# Optional — 5000 req/hr instead of 60
GITHUB_TOKEN=your_personal_access_token
```

---

## Project structure

```
github-analyzer/
├── server/
│   ├── index.js                  # Express + session + passport setup
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── passport.js           # GitHub OAuth strategy
│   ├── middleware/
│   │   └── auth.js               # requireAuth middleware
│   ├── models/
│   │   ├── User.js               # GitHub user schema
│   │   └── Comparison.js         # Saved comparison schema
│   ├── routes/
│   │   ├── auth.js               # /api/auth/* (OAuth + /me + logout)
│   │   ├── github.js             # /api/github/* (compare + user)
│   │   └── history.js            # /api/history/* (CRUD)
│   └── services/
│       └── github.js             # GitHub API + caching + stats
│
└── client/
    └── src/
        ├── context/
        │   └── AuthContext.jsx   # Global auth state + loginWithGitHub
        ├── pages/
        │   ├── Home.jsx          # Search form
        │   ├── Compare.jsx       # Main view — auto-saves, PDF button
        │   └── History.jsx       # Saved comparisons list
        ├── components/
        │   ├── Navbar.jsx        # Auth-aware navbar
        │   ├── ProfileCard.jsx
        │   ├── ScoreBar.jsx
        │   ├── StatsTable.jsx
        │   ├── RepoChart.jsx
        │   ├── LangBreakdown.jsx
        │   └── TopRepos.jsx
        ├── hooks/
        │   └── useGitHub.js
        └── utils/
            └── exportPDF.js      # jsPDF dark-themed report
```

---

## API endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/github/compare/:u1/:u2` | — | Compare two users |
| GET | `/api/github/user/:username` | — | Single user stats |
| GET | `/api/auth/github` | — | Start OAuth flow |
| GET | `/api/auth/github/callback` | — | OAuth callback |
| GET | `/api/auth/me` | — | Current session user |
| POST | `/api/auth/logout` | — | Clear session |
| GET | `/api/history` | ✓ | Get saved comparisons |
| POST | `/api/history` | ✓ | Save a comparison |
| DELETE | `/api/history/:id` | ✓ | Delete one entry |

---

## Deployment

**Backend → Render**
1. New Web Service → root dir: `server`
2. Build: `npm install` · Start: `node index.js`
3. Add all env vars from `.env.example`
4. Update `GITHUB_CALLBACK_URL` to your Render URL

**Frontend → Vercel**
1. New Project → root dir: `client`
2. Add `VITE_API_URL` if needed
3. Update `CLIENT_URL` in server env to your Vercel URL
4. Update GitHub OAuth App URLs to production URLs
