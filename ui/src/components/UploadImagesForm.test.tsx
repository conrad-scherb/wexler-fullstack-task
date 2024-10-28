import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vitest } from "vitest";
import { UploadImagesForm } from "./UploadImagesForm";

describe("UploadImagesForm.tsx", () => {
  global.URL.createObjectURL = vitest.fn();

  it("Uploads images and parses event-stream response", async () => {
    render(<UploadImagesForm />);

    const files = [
      new File(["test1"], "test1.png", { type: "image/png" }),
      new File(["test2"], "test2.png", { type: "image/png" }),
    ];

    const input = screen.getByTestId("file-upload-input");
    await userEvent.upload(input, files);

    // Check that 2 tasks are created
    const tasks = screen.getAllByTestId("in-progress-image-upload");
    expect(tasks).toHaveLength(2);
  });
});
