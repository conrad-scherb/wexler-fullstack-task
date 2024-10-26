import axios from "axios";
import { Repository } from "typeorm";
import { z } from "zod";
import { UploadedImage } from "./entity/uploaded-image.entity";
import { recordUploadedImage } from "./image-database";
import { createImageThumbnail } from "./thumbnail-processor";

const ImgurImageUploadResponseSchema = z.object({
  data: z
    .object({
      link: z.string(),
    })
    .passthrough(),
});

export type ImgurImageUploadResponse = z.infer<
  typeof ImgurImageUploadResponseSchema
>;

export type UploadSingleImageResult =
  | { result: "success"; image: UploadedImage }
  | { result: "error"; message: string };

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

export async function uploadAndRecordSingleImage(
  imageRepository: Repository<UploadedImage>,
  file: Express.Multer.File
): Promise<UploadSingleImageResult> {
  try {
    const imageDetails = await uploadImageToImgur(file);

    const thumbnail = await createImageThumbnail(file.buffer);

    // Save the image details to the database
    const uploadedImageEntity = await recordUploadedImage(
      imageRepository,
      imageDetails,
      thumbnail
    );

    return { result: "success", image: uploadedImageEntity };
  } catch (e) {
    const statusCode = axios.isAxiosError(e) ? e.response?.status : 500;
    return {
      result: "error",
      message: `${statusCode ?? "Unexpected error"}: ${e.message}`,
    };
  }
}
