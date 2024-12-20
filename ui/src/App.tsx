import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { UploadImagesForm } from "./components/UploadImagesForm";
import { ViewOrUploadSwitch } from "./components/ViewOrUploadSwitch";
import { ViewUploadedImages } from "./components/ViewUploadedImages";

export function App() {
  const queryClient = new QueryClient();

  const [isInUploadMode, setIsInUploadMode] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col gap-4">
        <h1 className="pt-4 text-3xl font-semibold">Image Management System</h1>

        <ViewOrUploadSwitch
          isInUploadMode={isInUploadMode}
          setIsInUploadMode={setIsInUploadMode}
        />

        {isInUploadMode ? <UploadImagesForm /> : <ViewUploadedImages />}
      </div>
    </QueryClientProvider>
  );
}
