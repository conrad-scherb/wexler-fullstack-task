import axios from "axios";
import { z } from "zod";
import { getImgurAuthorization } from "./imgur-api-helpers";

const ImgurImageUploadResponseSchema = z.object({
  data: z.object({
    link: z.string(),
  }),
});

export type ImgurImageUploadResponse = z.infer<
  typeof ImgurImageUploadResponseSchema
>;

export async function uploadImage(
  image: Express.Multer.File
): Promise<ImgurImageUploadResponse> {
  // Convert the Multer image to a Blob via FormData
  const formData = new FormData();
  const blob = new Blob([image.buffer]);

  formData.append("image", blob);

  const response = await axios.post("https://api.imgur.com/3/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: getImgurAuthorization(),
    },
  });

  const body = response.data;
  const parsedBody = ImgurImageUploadResponseSchema.parse(body);

  return parsedBody;
}
