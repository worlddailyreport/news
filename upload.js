const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.World Daily Report,
  api_key: process.env.c570c784-acca-432f-82d7-cb5c21898782,
});

const uploadImage = async (imageBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { upload_preset: "your_unsigned_preset" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    ).end(imageBuffer);
  });
};
