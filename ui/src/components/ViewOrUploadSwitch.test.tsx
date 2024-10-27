import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ViewOrUploadSwitch } from "./ViewOrUploadSwitch";

describe("ViewOrUploadSwitch.tsx", () => {
  let isInUploadMode = false;

  function setIsInUploadMode(value: boolean) {
    isInUploadMode = value;
  }

  it("View/upload mode switch correctly updates app mode", async () => {
    render(
      <ViewOrUploadSwitch
        isInUploadMode={isInUploadMode}
        setIsInUploadMode={setIsInUploadMode}
      />
    );

    const viewModeButton = screen.getByTestId("view-mode-button");
    viewModeButton.click();
    expect(isInUploadMode).toBe(false);

    const uploadModeButton = screen.getByTestId("upload-mode-button");
    uploadModeButton.click();
    expect(isInUploadMode).toBe(true);

    viewModeButton.click();
    expect(isInUploadMode).toBe(false);
  });
});
