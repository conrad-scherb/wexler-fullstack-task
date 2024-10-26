import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import cn from "classnames";
import { useState } from "react";
import { ViewUploadedImagesView } from "./ViewUploadedImages";

export function App() {
  const queryClient = new QueryClient();

  const [isInUploadMode, setIsInUploadMode] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col gap-4">
        <div className="pt-4 text-3xl font-semibold">
          Image Management System
        </div>
        <div className="flex gap-4 text-xl">
          <span
            className={cn("w-12", !isInUploadMode && " font-semibold")}
            onClick={() => setIsInUploadMode(false)}
          >
            View
          </span>
          |
          <span
            className={cn("w-12", isInUploadMode && " font-semibold")}
            onClick={() => setIsInUploadMode(true)}
          >
            Upload
          </span>
        </div>

        <ViewUploadedImagesView />
      </div>
    </QueryClientProvider>
  );
}
