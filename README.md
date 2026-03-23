# AccessPC - Personal Media Server

A self-hosted media server that lets you browse and stream videos, audio, images, and documents from your PC to other devices on your network.

## Features

- **Media Streaming**: Stream videos and audio with HTTP Range support (seek/resume)
- **Image Gallery**: Browse and view images in a fullscreen viewer
- **Document Viewer**: View text-based documents directly in the browser
- **Folder Navigation**: Browse your media organized in nested folder structure
- **User Authentication**: Secure access with JWT-based authentication
- **Watch History**: Track your viewing progress across devices
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, TailwindCSS 3, React Router 6 |
| Backend | Express 5, Node.js |
| Database | MySQL with Prisma ORM |
| Auth | bcrypt, JWT |

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd accessPc
```

2. Set up the server:
```bash
cd server
cp .env.example .env
# Edit .env with your database credentials
npm install
npx prisma generate
npx prisma db push
npm run db:seed  # Creates default user
npm run dev
```

3. Set up the client (in a new terminal):
```bash
cd client
cp .env.example .env
# Edit .env with your server URL (VITE_URL=http://localhost:5000)
npm install
npm run dev
```

### Default Login

After running `npm run db:seed`:
- **Username**: `ek`
- **Password**: `ek101011`

### URLs

- Client: http://localhost:4000 (or next available port)
- Server API: http://localhost:5000

## Project Structure

```
accessPc/
├── client/                   # React frontend
│   ├── client/
│   │   ├── components/      # React components
│   │   │   ├── ui/           # UI components (Button, Input, etc.)
│   │   │   ├── Sidebar.jsx
│   │   │   ├── BottomNav.jsx
│   │   │   └── MediaCard.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Videos.jsx
│   │   │   ├── Audio.jsx
│   │   │   ├── Images.jsx
│   │   │   ├── Files.jsx
│   │   │   ├── Folders.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── playing.jsx
│   │   ├── lib/            # Utilities
│   │   │   ├── api.js      # API client
│   │   │   └── AuthContext.jsx
│   │   └── App.jsx          # Main app with routing
│   └── package.json
├── server/                   # Express backend
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.js          # Seed data
│   ├── routes/              # API routes
│   │   ├── login.js
│   │   ├── signup.js
│   │   ├── logout.js
│   │   ├── stream.js
│   │   ├── media.js
│   │   ├── folders.js
│   │   ├── stats.js
│   │   ├── history.js
│   │   └── user.js
│   ├── middleware/          # Express middleware
│   │   ├── auth.js
│   │   └── rateLimit.js
│   ├── utils/               # Utility functions
│   │   ├── mediaScanner.js
│   │   └── validation.js
│   └── server.js            # Main server file
└── README.md
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signin` | Login with username/password |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/logout` | Logout (requires auth) |

### Media
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/media/videos` | List all videos |
| GET | `/api/media/audios` | List all audio files |
| GET | `/api/media/images` | List all images |
| GET | `/api/media/documents` | List all documents |
| GET | `/api/media/all` | List all files (with filters) |
| POST | `/api/media/refresh` | Refresh media library |

### Folders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/folders` | List root folders |
| GET | `/api/folders/:id` | Get folder by ID |
| GET | `/api/folders/:id/files` | Get files in folder |

### Streaming (requires auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stream/:type/:filename` | Stream media file |

Types: `video`, `audio`, `image`, `document`

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get user profile (requires auth) |
| GET | `/api/stats` | Get dashboard statistics |

## Database Schema

The application uses Prisma ORM with the following models:
- **User** - User accounts with bcrypt hashed passwords
- **MediaFile** - Media file metadata
- **Folder** - Folder structure
- **WatchHistory** - User watch history with progress
- **UserSession** - Active JWT sessions

## Media Storage

Place your media files in the following directories:
```
server/folder/
├── videos/      # .mp4, .mkv, .webm, .mov, etc.
├── audio/       # .mp3, .wav, .flac, .aac, etc.
├── images/      # .jpg, .png, .gif, .webp, etc.
└── documents/   # .txt, .md, .pdf, .doc, etc.
```

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens expire after 7 days
- Rate limiting on authentication endpoints (10 attempts/15min)
- All streaming routes require valid JWT
- CORS configured for frontend origin

## Environment Variables

### Server (.env)
```env
PORT=5000
DATABASE_URL="mysql://user:password@localhost:3306/accesspc"
JWT_SECRET=your-secret-key-change-this
CORS_ORIGIN=http://localhost:4000
```

### Client (.env)
```env
VITE_URL=http://localhost:5000
```

## Scripts

### Server
```bash
npm run dev      # Development mode with hot reload
npm run start    # Production mode
npm run db:seed  # Create seed users
npm run db:push  # Push schema to database
npm run db:studio # Open Prisma Studio
```

### Client
```bash
npm run dev      # Development mode
npm run build    # Production build
npm run preview  # Preview production build
```

## License

ISC
