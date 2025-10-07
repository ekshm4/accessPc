# AccessPC — Personal Media Server

AccessPC is a self‑hosted media server that lets you browse and stream videos, audio, images, and basic documents stored on your PC to other devices on your network (or remotely, if exposed securely). It provides a clean web UI to discover content and play it on phones, tablets, laptops, or a smart TV’s browser.

Note: Use AccessPC only for content you own or have rights to stream.

## What it does
- Scans dedicated folders on your PC for media:
  - Videos: server/folder/videos
  - Audio: server/folder/audio
  - Images: server/folder/images
  - Documents: server/folder/documents
- Shows your media in a modern React UI with categories (Videos, Audio, Images, Files).
- Streams videos and audio with HTTP Range support (seek/resume) directly to the browser.
- Displays images inline in the browser.
- Fetches basic file metadata (size, type; duration for many audio/video formats).
- Includes basic user authentication endpoints (register, sign in) backed by MySQL and JWT.

## How it functions (high level)
- Server (Node.js + Express, default port 5000):
  - Directory listing endpoints under /show/* return metadata for files in the configured folders.
  - Streaming endpoints under /stream/* serve file content efficiently:
    - /stream/video/:filename — streams video with Range requests.
    - /stream/audio/:filename — streams audio with Range requests.
    - /stream/images/:filename — returns image bytes.
    - /stream/documents/:filename — returns a JSON payload with name and content for text-based files.
  - Auth endpoints (backed by MySQL + bcrypt + JWT):
    - POST /api/register
    - POST /api/signin
- Client (React + Vite):
  - Fetches lists from /show/videos, /show/audios, /show/images, /show/documents.
  - Renders media cards with name, size, and duration where available.
  - On selection:
    - Videos open the “Playing” page and stream via /stream/video/:filename.
    - Audio plays in an inline player via /stream/audio/:filename.
    - Images preview via /stream/images/:filename.
    - Documents fetch content via /stream/documents/:filename and display inline (best for text files).

### Key API endpoints (implemented)
- Listing
  - GET /show/videos
  - GET /show/audios
  - GET /show/images
  - GET /show/documents
- Streaming
  - GET /stream/video/:filename
  - GET /stream/audio/:filename
  - GET /stream/images/:filename
  - GET /stream/documents/:filename (returns { name, content } for text-based docs)
- Authentication
  - POST /api/register
  - POST /api/signin

## Where it can be used (and why it’s useful)
- Home media hub: Watch videos stored on your computer from other devices on your Wi‑Fi (phone, tablet, smart TV browser) without copying files or using USB drives.
- Personal music server: Stream your audio library anywhere on your LAN.
- Household or small office sharing: Share training clips, screen recordings, and images with others in the same network.
- Remote access (advanced): With proper, secure exposure (e.g., via VPN or reverse proxy), stream your library when away from home.

## Who can use it
- Home users who want a simple, private alternative to cloud media services.
- Students and creators who manage lots of recordings and need easy cross‑device playback.
- Small teams/offices that need a lightweight internal media portal.
- Tinkerers and self‑hosters who prefer local control and privacy.

## Minimum Viable Product (MVP)
- Media scanning and listing
  - Read files from server/folder/{videos,audio,images,documents}.
  - Return file metadata (type, size, duration where applicable).
- Playback and viewing
  - Video and audio streaming with HTTP Range support (seek/resume in browser players).
  - Image preview via direct image responses.
  - Basic document viewing for text-based files (UTF‑8). Non‑text formats may require future conversion.
- Web UI
  - Categories: Videos, Audio, Images, Files.
  - Media list with essential info and click‑to‑play/open.
- Basic authentication
  - POST /api/register and /api/signin with MySQL user store, bcrypt hashing, and JWT issuance.
  - (Optional for MVP) Gate streaming endpoints behind JWT.
- Configuration
  - Server: Environment variables for DB connection and JWT secret.
  - Client: Environment variables for server URL/port.

### Explicit non‑goals for MVP (deferred)
- On‑the‑fly transcoding (e.g., converting MKV → MP4).
- Thumbnail generation and rich previews.
- Full folder browser and search across nested directories.
- Multi‑user libraries, roles/permissions, and activity logs.
- Public Internet exposure out‑of‑the‑box (requires separate secure setup).

## Architecture notes
- Server: Node.js + Express (port 5000 by default), CORS enabled.
- Storage location: Place files under server/folder/{videos,audio,images,documents}.
- Metadata: music-metadata is used to parse duration for many media formats.
- Auth: JWT middleware exists; integrate it with protected routes as needed.
- Client: React (Vite) SPA pages for Videos, Audio, Images, Files, and a Playing view.

## Using it to watch video on other devices
- Ensure your PC (server) and the other device are on the same network.
- Start the server so it’s reachable on your PC’s IP address at the configured port.
- Start or deploy the client UI and open it from your phone/tablet/TV browser using http://<your-pc-ip>:<client-port>.
- Open the Videos section, pick a file, and play — the player streams directly from the PC.

## Security and privacy
- By default, CORS is open and not all endpoints are protected. Lock down endpoints with JWT auth and restrict origin for production.
- Keep your JWT secret and DB credentials in environment variables (never commit them).
- Only expose the server to the Internet via secure methods (VPN or hardened reverse proxy with auth).

---

This document describes the current implementation in this repository and outlines a realistic MVP you can build and iterate on. If you’d like, I can add a Quick Start section with environment variables, run commands, and deployment notes.

