const express = require('express');
const { prisma } = require('./db');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, async (req, res) => {
  try {
    const folders = await prisma.folder.findMany({
      where: { parentId: null },
      include: {
        children: true,
        files: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { files: true, children: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    res.json(folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
});

router.get('/:id/files', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;
    
    const where = { folderId: parseInt(id) };
    if (type && ['video', 'audio', 'image', 'document'].includes(type)) {
      where.fileType = type;
    }
    
    const files = await prisma.mediaFile.findMany({
      where,
      orderBy: { name: 'asc' },
    });
    
    res.json(files);
  } catch (error) {
    console.error('Error fetching folder files:', error);
    res.status(500).json({ error: 'Failed to fetch folder files' });
  }
});

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const folder = await prisma.folder.findUnique({
      where: { id: parseInt(id) },
      include: {
        parent: true,
        children: {
          include: {
            _count: { select: { files: true, children: true } },
          },
        },
        files: {
          orderBy: { name: 'asc' },
        },
      },
    });
    
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    
    res.json(folder);
  } catch (error) {
    console.error('Error fetching folder:', error);
    res.status(500).json({ error: 'Failed to fetch folder' });
  }
});

module.exports = router;
