import { readFile } from "fs/promises";
import { createImageThumbnail } from "./thumbnail-processor";

describe("thumbnail-processor", () => {
  async function compareGeneratedWithKnownThumbnail(
    filename: string,
    extension: string
  ) {
    const image = await readFile(`./test-assets/${filename}.${extension}`);
    const correctThumbnail = await readFile(
      `./test-assets/${filename}-thumbnail.jpg`,
      {
        encoding: "base64",
      }
    );

    const generatedThumbnail = await createImageThumbnail(image);
    expect(generatedThumbnail).toEqual(correctThumbnail);
  }

  test("Generates a thumbnail from a png image", async () =>
    compareGeneratedWithKnownThumbnail("a4c", "png"));

  test("Generates a thumbnail from a jpg image", async () =>
    compareGeneratedWithKnownThumbnail("a4c", "jpg"));
});
