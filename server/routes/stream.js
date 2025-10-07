
const express = require("express");
const route = express.Router();
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

const AUDIO_FILE = path.join(__dirname, '../folder/audio');
const VIDEO_FILE = path.join(__dirname, '../folder/videos');
const DOCUMENT_FILE = path.join(__dirname, '../folder/documents');
const IMAGE_FILE = path.join(__dirname, '../folder/images');




//Documents streaming route
route.get('/documents/:filename', (req,res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(DOCUMENT_FILE,filename);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).json({ error: "file not found"});
      console.log(err);
    }
    res.send({ name: filename, content: data });
  });  
});


//Images streaming route
route.get('/images/:filename', (req,res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(IMAGE_FILE,filename);

  console.log("streamFile", filePath);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("image not found");
  }

  const contentType = mime.lookup(filePath) || 'application/octet-stream';
  res.setHeader('Content-Type', contentType);
  fs.createReadStream(filePath).pipe(res);
})




//Audio streaming route
route.get('/audio/:filename', (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(AUDIO_FILE, filename);

  
  console.log("streamFile", filePath);
  console.log("Range", req.headers.range);
  
  streamFile(filePath, req, res);
});




//Video streaming route
route.get('/video/:filename', (req, res) => {
  const filename = path.basename (req.params.filename);
  const filePath = path.join(VIDEO_FILE, filename);

  
  console.log("streamFile", filePath);
  console.log("Range", req.headers.range);
  streamFile(filePath, req, res);
});

//streaming function
function streamFile(filePath, req, res) {
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;
  const contentType = mime.lookup(filePath) || 'application/octet-stream';

  if (range) {
    const [startStr,endStr] = range.replace(/bytes=/, '').split('-');
    const start = parseInt(startStr, 10);
    const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    const file = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': contentType
    });

    file.pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': contentType
    });

    fs.createReadStream(filePath).pipe(res);
  }

  
}

module.exports = route;
