const express = require('express');
const { prisma } = require('./db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        _count: {
          select: { watchHistory: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const sessions = await prisma.userSession.count({
      where: { userId: req.user.id },
    });

    res.json({
      ...user,
      activeSessions: sessions,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.get('/sessions', authenticateToken, async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const currentToken = authHeader && authHeader.split(' ')[1];

    const sessions = await prisma.userSession.findMany({
      where: {
        userId: req.user.id,
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        createdAt: true,
        expiresAt: true,
        token: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const sessionsWithCurrent = sessions.map(s => ({
      ...s,
      isCurrent: s.token === currentToken,
      token: undefined,
    }));

    res.json(sessionsWithCurrent);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

module.exports = router;
