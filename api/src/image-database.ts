import { Repository } from "typeorm";
import { UploadedImageGetManyDto } from "./dto/uploaded-image-get.dto";
import { UploadedImage } from "./entity/uploaded-image.entity";
import { ImgurImageUploadResponse } from "./imgur-upload";

export async function recordUploadedImage(
  repository: Repository<UploadedImage>,
  imageUploadResponse: ImgurImageUploadResponse,
  thumbnailBase64String: string
): Promise<UploadedImage> {
  return await repository.save({
    metadata: imageUploadResponse.data,
    thumbnail: thumbnailBase64String,
  });
}

export async function retrieveAllImages(
  repository: Repository<UploadedImage>
): Promise<UploadedImageGetManyDto> {
  return await repository.find();
}
