import axios from "axios";
import { Response } from "express";
import mimedb from "mime-db";
import { Repository } from "typeorm";
import { UploadedImageGetManyDto } from "./dto/uploaded-image-get.dto";
import { UploadedImage } from "./entity/uploaded-image.entity";
import { ImgurImageUploadResponse } from "./imgur-upload";

export async function recordUploadedImage(
  repository: Repository<UploadedImage>,
  id: string,
  imageUploadResponse: ImgurImageUploadResponse,
  thumbnailBase64String: string
): Promise<UploadedImage> {
  return await repository.save({
    id,
    metadata: imageUploadResponse.data,
    thumbnail: thumbnailBase64String,
  });
}

export async function retrieveAllImages(
  repository: Repository<UploadedImage>
): Promise<UploadedImageGetManyDto> {
  return await repository.find();
}

// We need to offer the ability to download an image through the backend
// because Imgur doesn't set the ResponseContentDisposition header with
// type "attachment".
export async function retrieveImage(
  repository: Repository<UploadedImage>,
  id: string,
  res: Response
) {
  const image = await repository.findOneByOrFail({ id });

  const response = await axios.get(image.metadata.link, {
    responseType: "stream",
  });

  const contentType = response.headers["content-type"];

  res.setHeader("Content-Type", contentType);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${
      image.metadata.title ?? mimedb[contentType].extensions[0]
    }`
  );

  response.data.pipe(res);
}
