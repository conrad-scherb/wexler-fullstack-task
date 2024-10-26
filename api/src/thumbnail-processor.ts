import imageThumbnail from "image-thumbnail";

const options = {
  width: 100,
  height: 100,
  responseType: "base64",
  jpegOptions: { force: true },
};

export async function createImageThumbnail(
  imageBuffer: Buffer
): Promise<string> {
  const thumbnail = await imageThumbnail(imageBuffer, options);
  return thumbnail;
}
