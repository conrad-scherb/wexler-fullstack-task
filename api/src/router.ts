import express from "express";
import multer from "multer";
import { AppDataSource, getImageRepository, setupTypeORM } from "./data-source";
import { retrieveAllImages, retrieveImage } from "./image-database";
import { uploadAndRecordSingleImage } from "./imgur-upload";

export async function setupRouter(port: number, dataSource = AppDataSource) {
  await setupTypeORM(dataSource);

  const api = express();
  const upload = multer();

  const imageRepository = await getImageRepository(dataSource);

  api.get("/api/image/:id", async (req, res) => {
    await retrieveImage(imageRepository, req.params.id, res);
  });

  api.get("/api/images/", async (_, res) => {
    res.json(await retrieveAllImages(imageRepository));
  });

  api.post("/api/upload/", upload.array("images"), async (req, res) => {
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    res.on("close", res.end);

    const files = Array.isArray(req.files)
      ? req.files
      : Object.values(req.files).flat();

    const fileIds = JSON.parse(req.body.ids);

    await Promise.all(
      files.map((f, i) =>
        uploadAndRecordSingleImage(imageRepository, res, f, fileIds[i])
      )
    );

    res.end();
  });

  return api.listen(port, () => {
    console.log("Server setup successfully on port " + port);
  });
}
