# AccessPC — Next Steps

## High Priority ✅

1. **Docker Compose setup**
   - [x] Created `docker-compose.yml` with MySQL + server + client services
   - [x] Server Dockerfile (Node 20 Alpine + FFmpeg)
   - [x] Client Dockerfile (Vite build → Nginx)
   - [x] Nginx config with API proxy
   - [x] `.env.example` for compose vars

2. **File upload through web UI**
   - [x] Created `POST /api/media/upload` with multer (500MB limit, media type filter)
   - [x] `GET /api/media/upload` lists uploaded files
   - [x] Stores files in `uploads/` dir, creates DB record
   - [x] Wired into server.js

## Medium Priority

3. **Thumbnail/preview generation**
   - Use FFmpeg for video thumbnails
   - Generate image thumbnails with sharp or similar
   - Store thumbnails in a cache directory or DB blob

4. **Search across files**
   - Full-text search across file names and metadata
   - Add `/api/media/search` endpoint or use Prisma full-text capabilities
   - Client-side search bar with debounced input

5. **Video player with subtitle support**
   - Integrate subtitle track loading (.srt, .vtt)
   - Add subtitle selector in `playing.jsx`

## Lower Priority

6. **Multi-user support with admin panel**
   - Role-based access (admin, viewer)
   - User management UI (admin can create/delete users)
   - Share media between users or per-user media libraries

7. **Music metadata display**
   - `music-metadata` already extracts audio metadata (artist, album, etc.)
   - Display these in the audio player UI

8. **Continuous media scanning**
   - Watch filesystem for changes (chokidar) instead of manual scan trigger
   - Real-time library updates

9. **HTTPS support**
   - Add TLS via Let's Encrypt or reverse proxy (Caddy, nginx)
   - Document how to run securely behind a reverse proxy
