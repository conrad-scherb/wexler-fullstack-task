import sharp from "sharp";

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
