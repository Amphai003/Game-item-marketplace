# Game Item Marketplace

A single-game marketplace where users can list items for sale, chat with buyers, and search for exactly what they're looking for. This platform is designed specifically to address the pain points of chronological feeds (e.g. Facebook Groups/Discord chats) by providing structured data, faceted filters, and saved search alerts.

---

## Key Solutions Over Social Media Feeds

1. **Structured Data**: Listings are real database records with explicit categories, rarity, level, stats, price, and region.
2. **Search Index**: Uses a fast, typo-tolerant search engine (**Meilisearch**) for instant results and faceted filters (e.g. rarity, price range, server) instead of scrolling and hoping.
3. **Saved Searches & Alerts**: Users can save a set of filters and get notified immediately when a matching item is listed.
4. **Contextual Chat & Public Q&A**: 1:1 real-time messaging tied directly to listings, and public Q&A comments to keep the main chat clean.
5. **Trust & Safety**: Reputation system based on ratings and "mark as traded" confirmation, along with a moderation/reporting queue.

---

## Tech Stack

| Layer | Choice |
|---|---|
| **Frontend** | Next.js (React) |
| **Backend** | NestJS (Node.js/TypeScript) |
| **Database** | PostgreSQL |
| **Search Engine** | Meilisearch |
| **Realtime Chat** | Socket.IO |
| **Authentication** | OAuth (e.g. Discord login) / JWT |
| **Local Services** | Docker Compose |

---

## Directory Structure

```text
Game-item-marketplace/
├── docker-compose.yml       # Local services (PostgreSQL + Meilisearch)
├── README.md                # Documentation
├── .gitignore               # Root gitignore rules
└── backend/                 # NestJS Application
    ├── src/                 # TypeScript source code
    ├── database/            # Database schema and migrations
    │   └── schema.sql       # Initial Postgres schema script
    ├── .env.example         # Template for environment variables
    └── package.json         # Node dependencies & scripts
```

---

## Getting Started

### 1. Prerequisite
Ensure you have [Docker](https://www.docker.com/) and [Node.js](https://nodejs.org/) installed.

### 2. Start PostgreSQL & Meilisearch
Run the following command at the root of the project to spin up local instances:
```bash
docker compose up -d
```
- **Postgres** will automatically initialize the database and load the schema from `backend/database/schema.sql`.
- **Meilisearch** will start at `http://localhost:7700` with the master key `masterKey123!`.

### 3. Configure Backend Environment
Copy the example environment file inside the `backend` folder:
```bash
cp backend/.env.example backend/.env
```

### 4. Start NestJS Development Server
Install dependencies and run the API:
```bash
cd backend
npm install
npm run start:dev
```
The server will start running at `http://localhost:3000`.
