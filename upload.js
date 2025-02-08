const admin = require("firebase-admin");
const express = require("express");
const multer = require("multer");
const shortid = require("shortid");

admin.initializeApp({
  credential: admin.credential.cert(require("../../firebase-admin.json")),
  storageBucket: "your-firebase-app.appspot.com",
});

const app = express();
const bucket = admin.storage().bucket();
const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");

  const fileId = shortid.generate();
  const file = bucket.file(`uploads/${fileId}.jpg`);

  await file.save(req.file.buffer, { contentType: req.file.mimetype });
  const imageUrl = `https://storage.googleapis.com/${bucket.name}/uploads/${fileId}.jpg`;

  res.json({ imageUrl, shortLink: `https://your-netlify-site.netlify.app/prank/${fileId}` });
});

module.exports = app;
