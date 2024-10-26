import imageThumbnail from "image-thumbnail";

const options = {
  width: 100,
  height: 100,
  responseType: "base64",
  flattenBackgroundColor: "#ff0000",
  jpegOptions: { force: true },
};

export async function createImageThumbnail(
  imageBuffer: Buffer
): Promise<string> {
  return await imageThumbnail(imageBuffer, options);
}
