import express from "express";
import multer from "multer";
import { getImageRepository, setupTypeORM } from "./data-source";
import { uploadAndRecordSingleImage } from "./imgur-upload";

void setupTypeORM();

const api = express();
const upload = multer();

api.post("/upload/", upload.array("images"), async (req, res) => {
  const imageRepository = await getImageRepository();

  const files = Array.isArray(req.files)
    ? req.files
    : Object.values(req.files).flat();

  const responses = await Promise.all(
    files.map((f) => uploadAndRecordSingleImage(imageRepository, f))
  );

  res.json(responses);
});

export default api;
