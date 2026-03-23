const express = require('express');
const { prisma } = require('./db');
const { 
  scanDirectory, 
  refreshLibrary, 
  VIDEO_EXTENSIONS, 
  AUDIO_EXTENSIONS, 
  IMAGE_EXTENSIONS,
  DOCUMENT_EXTENSIONS,
  BASE_PATH 
} = require('../utils/mediaScanner');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/refresh', async (req, res) => {
  try {
    await refreshLibrary();
    res.json({ message: 'Library refreshed successfully' });
  } catch (error) {
    console.error('Error refreshing library:', error);
    res.status(500).json({ error: 'Failed to refresh library' });
  }
});

router.get('/videos', optionalAuth, async (req, res) => {
  try {
    const videos = await prisma.mediaFile.findMany({
      where: { fileType: 'video' },
      orderBy: { createdAt: 'desc' },
    });
    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

router.get('/audios', optionalAuth, async (req, res) => {
  try {
    const audios = await prisma.mediaFile.findMany({
      where: { fileType: 'audio' },
      orderBy: { createdAt: 'desc' },
    });
    res.json(audios);
  } catch (error) {
    console.error('Error fetching audios:', error);
    res.status(500).json({ error: 'Failed to fetch audios' });
  }
});

router.get('/images', optionalAuth, async (req, res) => {
  try {
    const images = await prisma.mediaFile.findMany({
      where: { fileType: 'image' },
      orderBy: { createdAt: 'desc' },
    });
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

router.get('/documents', optionalAuth, async (req, res) => {
  try {
    const documents = await prisma.mediaFile.findMany({
      where: { fileType: 'document' },
      orderBy: { createdAt: 'desc' },
    });
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

router.get('/all', optionalAuth, async (req, res) => {
  try {
    const { type, search, limit = 50, offset = 0 } = req.query;
    
    const where = {};
    
    if (type && ['video', 'audio', 'image', 'document'].includes(type)) {
      where.fileType = type;
    }
    
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    
    const [files, total] = await Promise.all([
      prisma.mediaFile.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset),
      }),
      prisma.mediaFile.count({ where }),
    ]);
    
    res.json({
      files,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + files.length < total,
      },
    });
  } catch (error) {
    console.error('Error fetching all files:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

module.exports = router;
