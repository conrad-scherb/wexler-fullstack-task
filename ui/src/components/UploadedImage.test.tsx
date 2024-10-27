import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UploadedImageGetOneDto } from "../../../api/src/dto/uploaded-image-get.dto";
import { UploadedImage } from "./UploadedImage";

describe("UploadedImage.tsx", () => {
  const imageDetails: UploadedImageGetOneDto = {
    id: "1",
    thumbnail: "THUMBNAIL",
    metadata: {
      link: "localhost:8888/api/image/1",
      title: "Test Image.jpg",
    },
  };

  it("Uploaded image displays thumbnail, does not display file extension & links to API to download image", async () => {
    render(<UploadedImage {...imageDetails} />);

    const thumbnail = screen.getByRole("img");
    expect(thumbnail).toHaveAttribute(
      "src",
      `data:image/jpeg;base64,THUMBNAIL`
    );

    const title = screen.getByTestId("image-title");
    expect(title).toHaveTextContent("Test Image");

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/api/image/1");
  });
});
