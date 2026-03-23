const express = require('express');
const { prisma } = require('./db');
const { authenticateToken } = require('../middleware/auth');
const { updateProgressSchema, validate } = require('../utils/validation');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { limit = 20, type } = req.query;
    
    const where = { userId: req.user.id };
    
    const history = await prisma.watchHistory.findMany({
      where,
      include: {
        mediaFile: true,
      },
      orderBy: { watchedAt: 'desc' },
      take: parseInt(limit),
    });

    const filtered = type 
      ? history.filter(h => h.mediaFile.fileType === type)
      : history;

    res.json(filtered);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

router.post('/progress', authenticateToken, validate(updateProgressSchema), async (req, res) => {
  try {
    const { mediaFileId, progress, completed } = req.body;

    const mediaFile = await prisma.mediaFile.findUnique({
      where: { id: mediaFileId },
    });

    if (!mediaFile) {
      return res.status(404).json({ error: 'Media file not found' });
    }

    const watchHistory = await prisma.watchHistory.upsert({
      where: {
        userId_mediaFileId: {
          userId: req.user.id,
          mediaFileId,
        },
      },
      update: {
        progress,
        completed: completed || false,
        watchedAt: new Date(),
      },
      create: {
        userId: req.user.id,
        mediaFileId,
        progress,
        completed: completed || false,
      },
      include: {
        mediaFile: true,
      },
    });

    res.json(watchHistory);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

router.delete('/:mediaFileId', authenticateToken, async (req, res) => {
  try {
    const { mediaFileId } = req.params;

    await prisma.watchHistory.deleteMany({
      where: {
        userId: req.user.id,
        mediaFileId: parseInt(mediaFileId),
      },
    });

    res.json({ message: 'History entry deleted' });
  } catch (error) {
    console.error('Error deleting history:', error);
    res.status(500).json({ error: 'Failed to delete history entry' });
  }
});

router.delete('/', authenticateToken, async (req, res) => {
  try {
    await prisma.watchHistory.deleteMany({
      where: { userId: req.user.id },
    });

    res.json({ message: 'All history cleared' });
  } catch (error) {
    console.error('Error clearing history:', error);
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

module.exports = router;
