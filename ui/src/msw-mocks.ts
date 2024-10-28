import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

export const getUploadedImagesMock = http.get("/api/images", async () => {
  // Add some lag to test the loading state
  await new Promise((resolve) => setTimeout(resolve, 200));

  const baseImage = {
    id: "1",
    thumbnail: "THUMBNAIL",
    metadata: {
      link: "localhost:8888/api/image/1",
      title: "Test Image.jpg",
    },
  };

  // Return a list of 10 images
  return HttpResponse.json(
    Array.from({ length: 10 }, (_, i) => ({
      ...baseImage,
      id: i.toString(),
    }))
  );
});

export const uploadImagesMock = http.post(
  "/api/upload",
  async ({ request }) => {
    const data = await request.formData();
    const ids: string[] = JSON.parse(data?.get("ids") as string);

    // For each provided ID mock a successful upload
    const stream = new ReadableStream({
      start(controller) {
        ids.forEach((id) => {
          controller.enqueue(
            Buffer.from(
              `data: ${JSON.stringify({ id, result: "success" })}\n\n`
            )
          );
        });

        controller.close();
      },
    });

    return new HttpResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*",
        Connection: "keep",
      },
    });
  }
);

export const mswServer = setupServer(getUploadedImagesMock, uploadImagesMock);
