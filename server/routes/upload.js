const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authenticateToken } = require("../middleware/auth");

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /\.(mp4|avi|mkv|mov|wmv|flv|mp3|wav|flac|ogg|jpg|jpeg|png|gif|webp|pdf|doc|docx|txt|srt|vtt)$/i;
    if (allowed.test(path.extname(file.originalname))) return cb(null, true);
    cb(new Error("File type not supported"));
  },
});

function extToFileType(ext) {
  const map = {
    mp4: "video", avi: "video", mkv: "video", mov: "video", wmv: "video", flv: "video",
    mp3: "audio", wav: "audio", flac: "audio", ogg: "audio",
    jpg: "image", jpeg: "image", png: "image", gif: "image", webp: "image",
    pdf: "document", doc: "document", docx: "document", txt: "document",
  };
  return map[ext] || "other";
}

router.post("/upload", authenticateToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file provided" });
    const { prisma } = require("./db");
    const ext = path.extname(req.file.originalname).slice(1).toLowerCase();
    const sizeGb = req.file.size / (1024 * 1024 * 1024);
    const sizeFormatted = sizeGb >= 1
      ? `${sizeGb.toFixed(2)} GB`
      : `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`;

    const media = await prisma.mediaFile.create({
      data: {
        name: req.file.originalname,
        path: req.file.path,
        fileType: extToFileType(ext),
        mimeType: req.file.mimetype,
        size: BigInt(req.file.size),
        sizeFormatted,
      },
    });
    res.status(201).json(media);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

router.get("/upload", authenticateToken, async (req, res) => {
  const { prisma } = require("./db");
  const files = await prisma.mediaFile.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(files);
});

module.exports = router;
