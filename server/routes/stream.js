const express = require('express');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

const FOLDER_BASE = path.join(__dirname, '../folder');

function streamFile(filePath, req, res) {
  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    return res.status(404).json({ error: 'File not found' });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;
  const contentType = mime.lookup(filePath) || 'application/octet-stream';

  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Content-Type', contentType);

  if (range) {
    const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
    const start = parseInt(startStr, 10);
    const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Content-Length': chunkSize,
    });

    fs.createReadStream(filePath, { start, end }).pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
    });
    fs.createReadStream(filePath).pipe(res);
  }
}

router.get('/:type/:filename', optionalAuth, (req, res) => {
  const { type, filename } = req.params;
  
  const validTypes = ['video', 'audio', 'image', 'document', 'file'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: 'Invalid type' });
  }

  let filePath;
  if (type === 'file') {
    filePath = path.join(FOLDER_BASE, filename);
  } else if (type === 'document') {
    filePath = path.join(FOLDER_BASE, 'documents', filename);
  } else {
    filePath = path.join(FOLDER_BASE, type + 's', filename);
  }

  if (!fs.existsSync(filePath)) {
    filePath = path.join(FOLDER_BASE, filename);
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  const ext = path.extname(filePath).toLowerCase();
  const textExtensions = ['.txt', '.md', '.json', '.xml', '.csv', '.html', '.css', '.js', '.ts'];

  if (textExtensions.includes(ext) || !ext) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to read file' });
      }
      res.json({ name: filename, content: data, type: 'text' });
    });
  } else {
    streamFile(filePath, req, res);
  }
});

module.exports = router;
