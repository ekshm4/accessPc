const express = require("express");
const route = express.Router();
const path = require("path");
const fs = require("fs");
const mime = require("mime-types");
const mm = require("music-metadata");

const videoPath = path.join(__dirname, "../folder/videos");
const audioPath = path.join(__dirname, "../folder/audio");
const documentPath = path.join(__dirname, "../folder/documents")
const imagePath = path.join(__dirname, "../folder/images");



function formatFileSize(bytes) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(1)} ${units[i]}`;
}


function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return null;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}


function getMediaType(mimeType) {
  if (!mimeType) return "unknown";
  if (mimeType.startsWith("video")) return "video";
  if (mimeType.startsWith("audio")) return "audio";
  return "file";
}

const extensions = {
  video: [
    "mp4", "mkv", "webm", "mov", "avi", "flv", "wmv", "mpeg", "mpg",
    "m4v", "3gp", "3g2", "ogv", "ts", "vob", "rm", "rmvb", "f4v", "m2ts"
  ],
  audio: [
    "mp3", "wav", "flac", "aac", "ogg", "wma", "m4a", "aiff", "alac",
    "opus", "amr", "mid", "midi", "au", "mp2"
  ],
  image: [
    "jpg", "jpeg", "png", "gif", "bmp", "webp", "tiff", "svg", "ico", "avif"
  ],
  document: [
    "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx",
    "txt", "rtf", "odt", "ods", "odp", "csv", "epub"
  ]
};

function checkMediaType(filename) {
  const ext = path.extname(filename).toLowerCase().replace('.', '');

  for (const [type, list] of Object.entries(extensions)) {
    if (list.includes(ext)) return type;
  }

  return 'unknown';
}


async function getFileMetadata(file, basePath,id) {
  const fullPath = path.join(basePath, file);
  const mimeType = mime.lookup(fullPath);
  const stats = fs.statSync(fullPath);
  
  let duration = null;
  try {
    const metadata = await mm.parseFile(fullPath);
    duration = metadata.format.duration;
  } catch (e) {
    console.warn("Failed to get duration for:", file);
  }
  
  return {
    id,
    name: file,
    isFile: stats.isFile(),
    fileType: checkMediaType(file),
    size: formatFileSize(stats.size),
    type: getMediaType(mimeType),
    mimetype: mimeType,
    duration: formatDuration(duration) || null,
    lastModified: stats.mtime,
  };
}



route.get("/videos", async (req, res) => {
  try {
    const files = fs.readdirSync(videoPath);
    const results = await Promise.all(
      files.map((file,idx) => getFileMetadata(file, videoPath, idx + 1))
    );
    res.json(results);
  } catch (err) {
    console.error("Error reading video dir:", err);
    res.status(500).json({ error: "Failed to process video directory" });
  }
});


route.get("/audios", async (req, res) => {
  try {
    const files = fs.readdirSync(audioPath);
    const results = await Promise.all(
      files.map((file,idx) => getFileMetadata(file, audioPath, idx + 1))
    );
    res.json(results);
  } catch (err) {
    console.error("Error reading audio dir:", err);
    res.status(500).json({ error: "Failed to process audio directory" });
  }
});



route.get("/documents", async (req, res) => {
  try {
    const files = fs.readdirSync(documentPath);
    const results = await Promise.all(
      files.map((file,idx) => getFileMetadata(file, documentPath, idx + 1))
    );
    res.json(results);
  } catch (err) {
    console.error("Error reading document dir:", err);
    res.status(500).json({ error: "Failed to process document directory" });
  }
});



route.get("/images", async (req, res) => {
  try {
    const files = fs.readdirSync(imagePath);
    const results = await Promise.all(
      files.map((file,idx) => getFileMetadata(file, imagePath, idx + 1))
    );
    res.json(results);
  } catch (err) {
    console.error("Error reading image dir:", err);
    res.status(500).json({ error: "Failed to process image directory" });
  }
});




module.exports = route;

