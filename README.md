# AccessPC — Self-Hosted Personal Media Server

## Overview
A self-hosted media server that lets you browse, stream, and organise your video, audio, image, and document files across your local network. Think Plex or Jellyfin — but lightweight, built from scratch with React and Express, and designed for a single user or small household.

The server scans configured directories and serves media files with HTTP Range support (seek/resume), fullscreen image galleries, and in-browser document viewing. JWT authentication keeps your media secure.

## Key Features
- **Media Streaming**: Stream videos/audio with HTTP Range support (seek and resume)
- **Image Gallery**: Fullscreen image viewer with navigation and zoom
- **Document Viewer**: View text-based documents (.txt, .md, .pdf) in the browser
- **Folder Navigation**: Browse media in nested folder structure with breadcrumbs
- **User Authentication**: JWT-based login with bcrypt password hashing
- **Watch History**: Track viewing progress across devices (resume where you left off)
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Rate Limiting**: Protection against brute-force auth attempts

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS 3, React Router 6 |
| Backend | Express 5, Node.js |
| Database | MySQL, Prisma ORM |
| Auth | JWT, bcrypt (12 rounds) |
| Security | Rate limiting, CORS |

## Architecture
```
Browser → React Client (port 4000)
              └── HTTP → Express API (port 5000)
                            ├── /api/auth (JWT login/register)
                            ├── /api/media (file listings, metadata)
                            ├── /api/folders (directory tree)
                            └── /stream/:type/:file (media streaming)
                                   └── Filesystem → /server/folder/{videos,audio,images,documents}
```

The client is a pure SPA. All data and media go through the Express API, which reads directly from the server's filesystem. Media files are stored in organised directories under `server/folder/`.

## Getting Started
```bash
# 1. Set up server
cd server
cp .env.example .env     # Edit database credentials
npm install
npx prisma generate
npx prisma db push
npm run db:seed          # Creates default user
npm run dev              # API on port 5000

# 2. Set up client
cd ../client
cp .env.example .env     # Set VITE_URL=http://localhost:5000
npm install
npm run dev              # UI on port 4000
```

### Default Login
- **Username**: `ek`
- **Password**: `ek101011`

## Project Structure
```
accessPc/
├── client/               # React frontend
│   └── src/
│       ├── components/   # UI components (Sidebar, MediaCard, etc.)
│       ├── pages/        # Page views (Home, Videos, Audio, Images, Folders)
│       └── lib/          # API client, AuthContext
├── server/               # Express backend
│   ├── prisma/           # Schema + seed data
│   ├── routes/           # API endpoints (login, stream, media, folders, etc.)
│   ├── middleware/        # Auth + rate limiting
│   ├── utils/            # Media scanner, validation
│   ├── folder/           # Directory where media files are placed
│   │   ├── videos/
│   │   ├── audio/
│   │   ├── images/
│   │   └── documents/
│   └── server.js         # Entry point
└── README.md
```

## Status
**Complete.** All core features working. JWT auth, media scanning, streaming, and responsive UI are functional.

## Known Issues
- No file upload capability (must copy files manually to `server/folder/`)
- No thumbnail/preview generation for videos and images
- No video player with subtitle support
- No Docker Compose setup yet

## Future Plans
- Docker Compose for one-command deployment
- File upload through the web UI
- Thumbnail/preview generation with FFmpeg
- Video player with subtitle support
- Search across file names and metadata
- User management (multi-user support)

## Screenshots
<!-- Add screenshots: dashboard, video player, image gallery, folder navigation -->
