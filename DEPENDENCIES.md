# AccessPC — Dependencies

## Server Runtime

| Package | Version | Purpose |
|---------|---------|---------|
| Node.js | ^18+ | Runtime |
| express | ^5.1.0 | Web framework |
| cors | ^2.8.5 | Cross-origin requests |
| dotenv | ^17.2.0 | Environment variables |
| mime-types | ^3.0.1 | MIME type detection |
| music-metadata | ^11.7.3 | Audio metadata extraction (duration, tags) |

## Authentication & Security

| Package | Version | Purpose |
|---------|---------|---------|
| bcrypt | ^6.0.0 | Password hashing |
| jsonwebtoken | ^9.0.2 | JWT signing/verification |
| express-rate-limit | ^8.3.1 | Rate limiting middleware |
| zod | ^4.3.6 | Request validation schemas |

## Database

| Package | Version | Purpose |
|---------|---------|---------|
| @prisma/client | ^5.22.0 | ORM client |
| prisma | ^5.22.0 | Schema management and migrations |
| mysql2 | ^3.14.3 | MySQL driver (Prisma uses this) |

## Dev Tools

| Package | Version | Purpose |
|---------|---------|---------|
| nodemon | ^3.1.10 | Auto-restart during development |

## Client

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.3.1 | UI framework |
| react-dom | ^18.3.1 | DOM rendering |
| react-router-dom | ^6.26.2 | Client-side routing |
| vite | ^6.2.2 | Build tool and dev server |
| tailwindcss | ^3.4.19 | Utility-first CSS |
| autoprefixer | ^10.4.27 | CSS vendor prefixes |
| postcss | ^8.5.8 | CSS processing |
| lucide-react | ^0.462.0 | Icon library |

## Infrastructure

| Service | Purpose |
|---------|---------|
| MySQL 8+ | Primary database |
| Prisma ORM | Database access and migrations |
| NGROK (optional) | Public tunnel for testing |
