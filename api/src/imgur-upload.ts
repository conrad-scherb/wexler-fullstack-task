import axios from "axios";
import { Response } from "express";
import { Repository } from "typeorm";
import { z } from "zod";
import { MetadataSchema } from "./dto/uploaded-image-get.dto";
import { UploadedImage } from "./entity/uploaded-image.entity";
import { recordUploadedImage } from "./image-database";
import { createImageThumbnail } from "./thumbnail-processor";

const ImgurImageUploadResponseSchema = z.object({
  data: MetadataSchema,
});

export type ImgurImageUploadResponse = z.infer<
  typeof ImgurImageUploadResponseSchema
>;

export async function uploadImageToImgur(
  image: Express.Multer.File
): Promise<ImgurImageUploadResponse> {
  // Convert the Multer image to a Blob via FormData
  const formData = new FormData();
  const blob = new Blob([image.buffer]);

  formData.append("image", blob);
  formData.append("title", image.originalname);

  const response = await axios.post("https://api.imgur.com/3/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
    },
  });

  const body = response.data;
  const parsedBody = ImgurImageUploadResponseSchema.parse(body);

  return parsedBody;
}

function streamJSONEvent(res: Response, json: unknown): void {
  // Use the data: prefix and the \n\n separator to conform with event stream standard
  // See https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format
  res.write(`data: ${JSON.stringify(json)}\n\n`);
}

export async function uploadAndRecordSingleImage(
  imageRepository: Repository<UploadedImage>,
  res: Response,
  file: Express.Multer.File,
  id: string
): Promise<void> {
  try {
    const imageDetails = await uploadImageToImgur(file);

    const thumbnail = await createImageThumbnail(file.buffer);

    // Save the image details to the database
    await recordUploadedImage(imageRepository, id, imageDetails, thumbnail);

    streamJSONEvent(res, { id, result: "success" });
  } catch (e) {
    const statusCode = axios.isAxiosError(e) ? e.response?.status : 500;
    streamJSONEvent(res, {
      id,
      result: "error",
      message: `${statusCode ?? "Unexpected error"}: ${e.message}`,
    });
  }
}
