const express = require('express');
const { prisma } = require('./db');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, async (req, res) => {
  try {
    const [totalFiles, totalSize, videoCount, audioCount, imageCount, docCount] = await Promise.all([
      prisma.mediaFile.count(),
      prisma.mediaFile.aggregate({ _sum: { size: true } }),
      prisma.mediaFile.count({ where: { fileType: 'video' } }),
      prisma.mediaFile.count({ where: { fileType: 'audio' } }),
      prisma.mediaFile.count({ where: { fileType: 'image' } }),
      prisma.mediaFile.count({ where: { fileType: 'document' } }),
    ]);

    const folderCount = await prisma.folder.count();

    let userStats = null;
    if (req.user) {
      const [watchHistoryCount, completedCount] = await Promise.all([
        prisma.watchHistory.count({ where: { userId: req.user.id } }),
        prisma.watchHistory.count({ where: { userId: req.user.id, completed: true } }),
      ]);
      userStats = { watchHistoryCount, completedCount };
    }

    res.json({
      totalFiles,
      totalSize: totalSize._sum.size || 0,
      totalSizeFormatted: formatSize(totalSize._sum.size || 0),
      folderCount,
      byType: {
        videos: videoCount,
        audios: audioCount,
        images: imageCount,
        documents: docCount,
      },
      user: userStats,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.get('/recent', optionalAuth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const recentFiles = await prisma.mediaFile.findMany({
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
    });

    res.json(recentFiles);
  } catch (error) {
    console.error('Error fetching recent files:', error);
    res.status(500).json({ error: 'Failed to fetch recent files' });
  }
});

function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(1)} ${units[i]}`;
}

module.exports = router;
