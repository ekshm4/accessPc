const express = require('express');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const { prisma } = require('./db');

const router = express.Router();

const FOLDER_BASE = path.join(__dirname, '../folder');

const VIDEO_EXTENSIONS = ['mp4', 'mkv', 'webm', 'mov', 'avi', 'flv', 'wmv', 'mpeg', 'mpg', 'm4v', '3gp'];
const AUDIO_EXTENSIONS = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'];
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico'];
const DOCUMENT_EXTENSIONS = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'csv', 'epub', 'md'];

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(1)} ${units[i]}`;
}

function getMediaType(filename) {
  const ext = path.extname(filename).toLowerCase().replace('.', '');
  if (VIDEO_EXTENSIONS.includes(ext)) return 'video';
  if (AUDIO_EXTENSIONS.includes(ext)) return 'audio';
  if (IMAGE_EXTENSIONS.includes(ext)) return 'image';
  if (DOCUMENT_EXTENSIONS.includes(ext)) return 'document';
  if (!ext && !filename.includes('.')) return 'document';
  return null;
}

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

async function scanDirectory(dirPath, relativePath, parentId = null) {
  const stats = { folders: 0, files: 0 };
  
  if (!fs.existsSync(dirPath)) {
    return stats;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const entryRelativePath = path.join(relativePath, entry.name);

    if (entry.isDirectory()) {
      let folder = await prisma.folder.findFirst({
        where: { path: entryRelativePath }
      });

      if (!folder) {
        folder = await prisma.folder.create({
          data: {
            name: entry.name,
            path: entryRelativePath,
            parentId: parentId
          }
        });
      } else if (folder.parentId !== parentId) {
        folder = await prisma.folder.update({
          where: { id: folder.id },
          data: { parentId: parentId }
        });
      }

      const subStats = await scanDirectory(fullPath, entryRelativePath, folder.id);
      stats.folders += subStats.folders + 1;
      stats.files += subStats.files;
    } else {
      const mediaType = getMediaType(entry.name);
      if (mediaType) {
        const fileStats = fs.statSync(fullPath);
        const mimeType = mime.lookup(fullPath) || 'application/octet-stream';

        await prisma.mediaFile.upsert({
          where: { path: entryRelativePath },
          update: {
            name: entry.name,
            fileType: mediaType,
            mimeType: mimeType,
            size: fileStats.size,
            sizeFormatted: formatFileSize(fileStats.size),
            folderId: parentId
          },
          create: {
            name: entry.name,
            path: entryRelativePath,
            fileType: mediaType,
            mimeType: mimeType,
            size: fileStats.size,
            sizeFormatted: formatFileSize(fileStats.size),
            folderId: parentId
          }
        });
        stats.files++;
      }
    }
  }

  return stats;
}

router.post('/scan', async (req, res) => {
  try {
    console.log('Starting media library scan...');

    const stats = {
      folders: 0,
      files: 0,
      types: { video: 0, audio: 0, image: 0, document: 0 }
    };

    const categories = ['videos', 'audio', 'images', 'documents'];
    
    for (const category of categories) {
      const categoryPath = path.join(FOLDER_BASE, category);
      const relativePath = category;
      
      if (fs.existsSync(categoryPath)) {
        let categoryFolder = await prisma.folder.findFirst({
          where: { path: relativePath }
        });

        if (!categoryFolder) {
          categoryFolder = await prisma.folder.create({
            data: {
              name: category,
              path: relativePath,
              parentId: null
            }
          });
        }

        const categoryStats = await scanDirectory(categoryPath, relativePath, categoryFolder.id);
        stats.folders += categoryStats.folders;
        stats.files += categoryStats.files;
      }
    }

    const fileCounts = await prisma.mediaFile.groupBy({
      by: ['fileType'],
      _count: true
    });

    fileCounts.forEach(item => {
      if (stats.types[item.fileType] !== undefined) {
        stats.types[item.fileType] = item._count;
      }
    });

    console.log('Scan complete:', stats);

    res.json({
      message: 'Scan complete',
      stats: stats
    });
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: 'Scan failed', details: error.message });
  }
});

router.get('/folders', async (req, res) => {
  try {
    const { parentId } = req.query;
    
    const where = parentId ? { parentId: parseInt(parentId) } : { parentId: null };
    
    const folders = await prisma.folder.findMany({
      where,
      include: {
        _count: { select: { files: true, children: true } },
        files: {
          take: 5,
          orderBy: { name: 'asc' }
        },
        children: {
          select: { id: true, name: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json(folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
});

router.get('/folders/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const folder = await prisma.folder.findUnique({
      where: { id: parseInt(id) },
      include: {
        parent: true,
        children: {
          include: {
            _count: { select: { files: true, children: true } }
          }
        },
        files: {
          orderBy: { name: 'asc' }
        }
      }
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

router.get('/folders/:id/files', async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;

    const where = { folderId: parseInt(id) };
    if (type && ['video', 'audio', 'image', 'document'].includes(type)) {
      where.fileType = type;
    }

    const files = await prisma.mediaFile.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    res.json(files);
  } catch (error) {
    console.error('Error fetching folder files:', error);
    res.status(500).json({ error: 'Failed to fetch folder files' });
  }
});

module.exports = router;
