import sharp from "sharp";

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
  let result = sharp(imageBuffer)
    .resize({
      height: 100,
      width: 100,
      withoutEnlargement: true,
      fit: "contain",
      background: "#ffffff",
    })
    .flatten({ background: "#ffffff" })
    .jpeg({ force: true });

  return (await result.toBuffer()).toString("base64");
}
