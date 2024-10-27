import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import { describe, expect, it, vitest } from "vitest";
import { FileUploadState } from "../file-upload";
import { InProgressImageUpload } from "./InProgressImageUpload";

describe("InProgressImageUpload.tsx", () => {
  global.URL.createObjectURL = vitest.fn();

  const baseFileUploadTask = {
    id: "1",
    file: new File([], "test.jpg"),
    status: FileUploadState.Uploading,
  };

  it("Renders correct icons based on the task status", async () => {
    for (const status of [
      FileUploadState.Uploading,
      FileUploadState.Done,
      FileUploadState.Failed,
    ]) {
      render(<InProgressImageUpload {...baseFileUploadTask} status={status} />);

      expect(screen.getByTestId("status-icon")).toHaveAttribute(
        "data-icon",
        {
          [FileUploadState.Uploading]: "spinner",
          [FileUploadState.Done]: "check",
          [FileUploadState.Failed]: "xmark",
        }[status]
      );

      cleanup();
    }
  });

  it("Shows error message in tooltip when upload fails", async () => {
    render(
      <InProgressImageUpload
        {...baseFileUploadTask}
        status={FileUploadState.Failed}
        error="Upload failed"
      />
    );

    expect(screen.getByTestId("error-tooltip")).toHaveAttribute(
      "data-tooltip-content",
      "Upload failed"
    );
  });
});
