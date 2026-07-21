require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDatabase } = require('./routes/db');
const { authLimiter, apiLimiter } = require('./middleware/rateLimit');

const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const logoutRouter = require('./routes/logout');
const streamRouter = require('./routes/stream');
const mediaRouter = require('./routes/media');
const uploadRouter = require('./routes/upload');
const foldersRouter = require('./routes/folders');
const scanRouter = require('./routes/scan');
const statsRouter = require('./routes/stats');
const historyRouter = require('./routes/history');
const userRouter = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
}));

app.use((req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const user = req.user ? req.user.username : 'anonymous';
    const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
    const resetColor = '\x1b[0m';
    
    console.log(
      `${timestamp} | ${statusColor}${res.statusCode}${resetColor} | ${req.method.padEnd(6)} | ${user.padEnd(12)} | ${req.originalUrl} | ${duration}ms`
    );
  });
  
  next();
});

app.use('/api/auth', authLimiter, loginRouter);
app.use('/api/auth', authLimiter, signupRouter);
app.use('/api/auth', authLimiter, logoutRouter);
app.use('/api/stats', apiLimiter, statsRouter);
app.use('/api/user', apiLimiter, userRouter);
app.use('/api/media', mediaRouter);
app.use('/api/media', uploadRouter);
app.use('/api/scan', scanRouter);
app.use('/api/folders', foldersRouter);
app.use('/api/history', historyRouter);
app.use('/stream', streamRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({
    name: 'AccessPC API',
    version: '2.0.0',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/signin',
        logout: 'POST /api/auth/logout',
      },
      media: {
        videos: 'GET /api/media/videos',
        audios: 'GET /api/media/audios',
        images: 'GET /api/media/images',
        documents: 'GET /api/media/documents',
        all: 'GET /api/media/all',
      },
      folders: {
        scan: 'POST /api/scan/scan',
        list: 'GET /api/scan/folders',
        byId: 'GET /api/scan/folders/:id',
        files: 'GET /api/scan/folders/:id/files',
      },
      user: {
        profile: 'GET /api/user',
        sessions: 'GET /api/user/sessions',
      },
      stats: {
        dashboard: 'GET /api/stats',
        recent: 'GET /api/stats/recent',
      },
      history: {
        list: 'GET /api/history',
        updateProgress: 'POST /api/history/progress',
        delete: 'DELETE /api/history/:mediaFileId',
        clear: 'DELETE /api/history',
      },
      streaming: {
        video: 'GET /stream/video/:filename',
        audio: 'GET /stream/audio/:filename',
        image: 'GET /stream/image/:filename',
        document: 'GET /stream/document/:filename',
      },
    },
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

async function startServer() {
  try {
    await connectDatabase();
    
    app.listen(PORT, () => {
      console.log(`AccessPC server running on port ${PORT}`);
      console.log(`API documentation available at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
