const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const mm = require('music-metadata');
const { prisma } = require('../routes/db');

const BASE_PATH = path.join(__dirname, '../folder');

const VIDEO_EXTENSIONS = [
  'mp4', 'mkv', 'webm', 'mov', 'avi', 'flv', 'wmv', 'mpeg', 'mpg',
  'm4v', '3gp', '3g2', 'ogv', 'ts', 'vob', 'rm', 'rmvb', 'f4v', 'm2ts'
];

const AUDIO_EXTENSIONS = [
  'mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a', 'aiff', 'alac',
  'opus', 'amr', 'mid', 'midi', 'au', 'mp2'
];

const IMAGE_EXTENSIONS = [
  'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg', 'ico', 'avif'
];

const DOCUMENT_EXTENSIONS = [
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
  'txt', 'rtf', 'odt', 'ods', 'odp', 'csv', 'epub', 'md'
];

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

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getMediaType(filename) {
  const ext = path.extname(filename).toLowerCase().replace('.', '');
  
  if (VIDEO_EXTENSIONS.includes(ext)) return 'video';
  if (AUDIO_EXTENSIONS.includes(ext)) return 'audio';
  if (IMAGE_EXTENSIONS.includes(ext)) return 'image';
  if (DOCUMENT_EXTENSIONS.includes(ext)) return 'document';
  if (!ext && !filename.includes('.')) return 'document';
  return 'file';
}

async function getFileMetadata(filePath, relativePath, parentFolderId = null) {
  try {
    const stats = fs.statSync(filePath);
    const filename = path.basename(filePath);
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';
    
    let duration = null;
    try {
      const metadata = await mm.parseFile(filePath);
      duration = metadata.format.duration;
    } catch (e) {
      // Duration not available for this file type
    }

    return {
      name: filename,
      path: relativePath,
      fileType: getMediaType(filename),
      size: stats.size,
      sizeFormatted: formatFileSize(stats.size),
      mimeType,
      duration: duration ? Math.floor(duration) : null,
      durationFormatted: formatDuration(duration),
      isDirectory: stats.isDirectory(),
      parentFolderId,
      lastModified: stats.mtime,
    };
  } catch (error) {
    console.error(`Error getting metadata for ${filePath}:`, error);
    return null;
  }
}

async function scanDirectory(dirPath, relativeBase = '', parentFolderId = null) {
  const items = [];
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.join(relativeBase, entry.name);
      
      if (entry.isDirectory()) {
        const folder = await prisma.folder.upsert({
          where: { path: fullPath },
          update: {},
          create: {
            name: entry.name,
            path: fullPath,
            parentId: parentFolderId,
          },
        });
        
        const subItems = await scanDirectory(fullPath, relativePath, folder.id);
        items.push({
          id: folder.id,
          name: entry.name,
          path: relativePath,
          fileType: 'folder',
          isDirectory: true,
          children: subItems,
        });
      } else {
        const metadata = await getFileMetadata(fullPath, relativePath, parentFolderId);
        if (metadata) {
          const mediaFile = await prisma.mediaFile.upsert({
            where: { path: fullPath },
            update: {
              name: metadata.name,
              fileType: metadata.fileType,
              mimeType: metadata.mimeType,
              size: metadata.size,
              sizeFormatted: metadata.sizeFormatted,
              duration: metadata.duration,
              durationFormatted: metadata.durationFormatted,
              folderId: metadata.parentFolderId,
            },
            create: {
              name: metadata.name,
              path: fullPath,
              fileType: metadata.fileType,
              mimeType: metadata.mimeType,
              size: metadata.size,
              sizeFormatted: metadata.sizeFormatted,
              duration: metadata.duration,
              durationFormatted: metadata.durationFormatted,
              folderId: metadata.parentFolderId,
            },
          });
          
          items.push({
            id: mediaFile.id,
            ...metadata,
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
  }
  
  return items;
}

async function refreshLibrary() {
  console.log('Refreshing media library...');
  
  const categories = ['videos', 'audio', 'images', 'documents'];
  let total = 0;
  
  for (const category of categories) {
    total += await scanMediaFolder(category);
  }
  
  console.log(`Media library refreshed. Total: ${total} files`);
}

async function scanMediaFolder(folderName) {
  const folderPath = path.join(BASE_PATH, folderName);
  console.log(`Scanning ${folderName} folder...`);
  
  if (!fs.existsSync(folderPath)) {
    console.log(`Folder not found: ${folderPath}`);
    return [];
  }
  
  const entries = fs.readdirSync(folderPath, { withFileTypes: true });
  let count = 0;
  
  for (const entry of entries) {
    if (entry.isFile()) {
      const fullPath = path.join(folderPath, entry.name);
      const ext = path.extname(entry.name).toLowerCase().replace('.', '');
      const isMedia = getMediaType(entry.name) !== 'file';
      
      if (isMedia) {
        const stats = fs.statSync(fullPath);
        const mimeType = mime.lookup(fullPath) || 'application/octet-stream';
        let duration = null;
        
        try {
          const metadata = await mm.parseFile(fullPath);
          duration = metadata.format.duration;
        } catch (e) {}
        
        await prisma.mediaFile.upsert({
          where: { path: fullPath },
          update: {
            name: entry.name,
            fileType: getMediaType(entry.name),
            mimeType,
            size: stats.size,
            sizeFormatted: formatFileSize(stats.size),
            duration: duration ? Math.floor(duration) : null,
            durationFormatted: formatDuration(duration),
          },
          create: {
            name: entry.name,
            path: fullPath,
            fileType: getMediaType(entry.name),
            mimeType,
            size: stats.size,
            sizeFormatted: formatFileSize(stats.size),
            duration: duration ? Math.floor(duration) : null,
            durationFormatted: formatDuration(duration),
          },
        });
        count++;
      }
    }
  }
  
  console.log(`Scanned ${count} files from ${folderName}`);
  return count;
}

module.exports = {
  scanDirectory,
  scanMediaFolder,
  refreshLibrary,
  formatFileSize,
  formatDuration,
  getMediaType,
  BASE_PATH,
  VIDEO_EXTENSIONS,
  AUDIO_EXTENSIONS,
  IMAGE_EXTENSIONS,
  DOCUMENT_EXTENSIONS,
};
