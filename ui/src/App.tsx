import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import cn from "classnames";
import { useState } from "react";
import { ViewUploadedImagesView } from "./components/UploadedImagesGrid";
import { UploadImagesForm } from "./components/UploadImagesForm";

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
            className={cn(
              "w-12 cursor-pointer hover:underline",
              !isInUploadMode && " font-semibold underline"
            )}
            onClick={() => setIsInUploadMode(false)}
          >
            View
          </span>
          |
          <span
            className={cn(
              "w-12 cursor-pointer hover:underline",
              isInUploadMode && " font-semibold underline"
            )}
            onClick={() => setIsInUploadMode(true)}
          >
            Upload
          </span>
        </div>

        {isInUploadMode ? <UploadImagesForm /> : <ViewUploadedImagesView />}
      </div>
    </QueryClientProvider>
  );
}
