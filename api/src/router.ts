import axios from "axios";
import express from "express";
import multer from "multer";
import { getImageRepository, setupTypeORM } from "./data-source";
import { recordUploadedImage } from "./image-database";
import { uploadImage } from "./imgur-upload";

void setupTypeORM();

const api = express();
const upload = multer();

api.post("/upload/", upload.single("image"), async (req, res) => {
  const imageRepository = await getImageRepository();

  try {
    const imageDetails = await uploadImage(req.file);

    // Save the image details to the database
    await recordUploadedImage(imageRepository, imageDetails);
  } catch (e) {
    const statusCode = axios.isAxiosError(e) ? e.response?.status : 500;
    res.sendStatus(statusCode);
  }

  res.send(201);
});

export default api;
