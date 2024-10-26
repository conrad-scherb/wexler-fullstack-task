import express from "express";
import multer from "multer";
import { getImageRepository, setupTypeORM } from "./data-source";
import { uploadAndRecordSingleImage } from "./imgur-upload";

export async function setupRouter(port: string) {
  await setupTypeORM();

  const api = express();
  const upload = multer();

  const imageRepository = await getImageRepository();

  api.get("/images/", async (_, res) => {
    const images = await imageRepository.find();

    res.json(images);
  });

  api.post("/upload/", upload.array("images"), async (req, res) => {
    const files = Array.isArray(req.files)
      ? req.files
      : Object.values(req.files).flat();

    const responses = await Promise.all(
      files.map((f) => uploadAndRecordSingleImage(imageRepository, f))
    );

    res.json(responses);
  });

  api.listen(port, () => {
    console.log("Server setup successfully on port " + port);
  });
}
