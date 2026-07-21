# AccessPC — Architecture

## System Overview

AccessPC is a self-hosted personal media server. A React single-page application communicates with an Express REST API backed by MySQL. Media files are stored on the server filesystem and streamed to the browser with HTTP Range support.

```
Browser ── HTTP ──► React Client (port 4000, Vite dev server)
                     └── fetch() ──► Express API (port 5000)
                                       ├── /api/auth/*       JWT login/register/logout
                                       ├── /api/media/*      File listings (videos, audio, images, documents)
                                       ├── /api/folders/*    Folder tree with nesting
                                       ├── /api/scan/*       Trigger filesystem scan
                                       ├── /api/stats/*      Dashboard statistics
                                       ├── /api/history/*    Watch history CRUD
                                       ├── /api/user/*       User profile & sessions
                                       ├── /api/health       Health check
                                       └── /stream/:type     Media streaming (HTTP Range)
                                                              └── Filesystem reads
                                                                  server/folder/{videos,audio,images,documents}
```

## Client Architecture

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build | Vite 6 |
| Routing | React Router 6 |
| Styling | TailwindCSS 3 |

The client is a pure SPA with pages for each media type (`Videos.jsx`, `Audio.jsx`, `Images.jsx`, `Documents.jsx`) plus login, signup, settings, and folder navigation. An `AuthContext` wraps the app and provides login/logout state. The `api.js` module wraps `fetch()` with automatic token injection and 401 redirect.

## Server Architecture

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js, Express 5 |
| Database | MySQL (via Prisma ORM) |
| Auth | JWT (jsonwebtoken), bcrypt (12 rounds) |
| Validation | Zod schemas |
| Rate Limiting | express-rate-limit |

### Middleware Pipeline

```
Request ──► CORS ──► Logging ──► Rate Limiter (auth routes) ──► Auth (JWT verify) ──► Route Handler
```

Two rate limiters:
- **authLimiter**: 10 requests per 15 minutes (login/register/logout), skips successful requests
- **apiLimiter**: 100 requests per minute (stats, user)

Two auth middleware:
- `authenticateToken`: Required — returns 401 if missing/expired token
- `optionalAuth`: Attaches user if token present, continues otherwise

### Database Schema (MySQL)

**users**
| Column | Type | Notes |
|--------|------|-------|
| id | Int (PK, auto-increment) | |
| username | VarChar(255) | Unique |
| email | VarChar(255) | Unique |
| password | Text | bcrypt hash |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**media_files**
| Column | Type | Notes |
|--------|------|-------|
| id | Int (PK, auto-increment) | |
| name | VarChar(255) | |
| path | VarChar(512) | Unique, absolute filesystem path |
| fileType | VarChar(50) | video/audio/image/document |
| mimeType | VarChar(100) | |
| size | BigInt | Bytes |
| sizeFormatted | VarChar(50) | Human-readable |
| duration | Int | Seconds (null if not available) |
| durationFormatted | VarChar(20) | mm:ss or h:mm:ss |
| folderId | Int (FK → folders) | Nullable |

**folders**
| Column | Type | Notes |
|--------|------|-------|
| id | Int (PK, auto-increment) | |
| name | VarChar(255) | |
| path | VarChar(512) | Unique |
| parentId | Int (FK → folders, self) | Nullable root folders |
| createdAt | DateTime | |

**watch_history**
| Column | Type | Notes |
|--------|------|-------|
| id | Int (PK, auto-increment) | |
| userId | Int (FK → users) | |
| mediaFileId | Int (FK → media_files) | |
| progress | Float | 0.0 to 1.0 |
| completed | Boolean | |
| watchedAt | DateTime | |

Unique constraint on `(userId, mediaFileId)`.

**user_sessions**
| Column | Type | Notes |
|--------|------|-------|
| id | Int (PK, auto-increment) | |
| userId | Int (FK → users) | |
| token | VarChar(512) | Unique |
| expiresAt | DateTime | |

## Authentication Flow

1. Client sends `POST /api/auth/signin` with `{ username, password }`
2. Server validates with Zod schema, rate-limits (10/15min)
3. Server looks up user by username, compares password with bcrypt
4. On success: creates JWT (7-day expiry), stores session in `user_sessions`, returns token + user profile
5. Client stores token in `localStorage`, attaches as `Authorization: Bearer <token>` header
6. On 401 response: client clears token and redirects to `/login`

## Media Streaming Flow

1. Media files placed under `server/folder/{videos,audio,images,documents}/`
2. `POST /api/scan/scan` triggers filesystem scan — reads directory, extracts metadata (size, mime, duration via music-metadata), upserts into database
3. Client requests `GET /api/media/videos` (etc.) to list files from DB
4. Streaming via `GET /stream/video?path=<relative-path>`:
   - Checks `Range` header for byte range
   - Returns 206 Partial Content with `Content-Range` header if range present
   - Returns 200 with full file if no range header
   - Text files (.txt, .md, .json, etc.) returned as JSON `{ content, type: 'text' }`
5. When watch progress is saved: `POST /api/history/progress` with `{ mediaFileId, progress, completed }`

## Directory Structure

```
accessPc/
├── client/                          # React frontend
│   ├── client/
│   │   ├── components/              # UI components
│   │   │   ├── BottomNav.jsx        # Mobile bottom navigation
│   │   │   ├── MediaCard.jsx        # Media file card component
│   │   │   ├── Sidebar.jsx          # Desktop sidebar
│   │   │   └── ui/                  # Base UI primitives
│   │   ├── pages/                   # Page views
│   │   │   ├── Home.jsx             # Dashboard
│   │   │   ├── Videos.jsx
│   │   │   ├── Audio.jsx
│   │   │   ├── Images.jsx
│   │   │   ├── Documents.jsx
│   │   │   ├── Folders.jsx
│   │   │   ├── Files.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── playing.jsx          # Media player page
│   │   │   └── NotFound.jsx
│   │   ├── App.jsx                  # Root with router
│   │   ├── main.jsx                 # Entry point
│   │   └── global.css               # Tailwind styles
│   ├── lib/
│   │   ├── api.js                   # HTTP client + API wrappers
│   │   └── AuthContext.jsx          # Auth state management
│   ├── dist/                        # Production build output
│   ├── public/
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── server/                          # Express backend
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema
│   │   ├── seed.js                  # Default user seeder
│   │   └── migrations/              # Prisma migrations
│   ├── routes/
│   │   ├── login.js                 # POST /api/auth/signin
│   │   ├── signup.js                # POST /api/auth/register
│   │   ├── logout.js                # POST /api/auth/logout
│   │   ├── media.js                 # GET /api/media/{type}
│   │   ├── stream.js                # GET /stream/{type}
│   │   ├── folders.js               # GET /api/folders
│   │   ├── scan.js                  # POST /api/scan/scan
│   │   ├── stats.js                 # GET /api/stats
│   │   ├── history.js               # Watch history CRUD
│   │   ├── user.js                  # GET /api/user
│   │   └── db.js                    # Prisma client singleton
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification
│   │   └── rateLimit.js             # Rate limiters
│   ├── utils/
│   │   ├── mediaScanner.js          # Filesystem scanning + metadata extraction
│   │   └── validation.js            # Zod schemas
│   ├── folder/                      # Media storage root
│   │   ├── videos/
│   │   ├── audio/
│   │   ├── images/
│   │   └── documents/
│   ├── server.js                    # Express app entry point
│   ├── .env.example
│   └── package.json
├── .dockerignore
├── .npmrc
├── .prettierrc
└── README.md
```
