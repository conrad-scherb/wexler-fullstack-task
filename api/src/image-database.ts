import { Repository } from "typeorm";
import { UploadedImage } from "./entity/uploaded-image.entity";
import { ImgurImageUploadResponse } from "./imgur-upload";

export async function recordUploadedImage(
  repository: Repository<UploadedImage>,
  imageUploadResponse: ImgurImageUploadResponse
): Promise<void> {
  await repository.save({
    imgurURL: imageUploadResponse.data.link,
    metadata: imageUploadResponse.data,
  });
}
