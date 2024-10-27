import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ViewUploadedImages } from "./ViewUploadedImages";

describe("ViewUploadedImages.tsx", () => {
  const queryClient = new QueryClient();

  it("Loading state is displayed, then checks the images are shown", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ViewUploadedImages />
      </QueryClientProvider>
    );

    const loadingState = screen.getByTestId("loading-images-spinner");
    expect(loadingState).toBeInTheDocument();

    const grid = await screen.findByTestId("images-grid");

    // Check grid has 10 child images
    expect(grid.children.length).toBe(10);
  });
});
