import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import { Suspense } from "react";
import {
  UploadedImageGetManyDto,
  UploadedImageGetManyDtoSchema,
} from "../../../api/src/dto/uploaded-image-get.dto";
import { UploadedImage } from "./UploadedImage";

async function retrieveImages(): Promise<UploadedImageGetManyDto> {
  const response = await axios.get("/api/images");

  return UploadedImageGetManyDtoSchema.parse(response.data);
}

function ViewImagesLoader() {
  const { data } = useSuspenseQuery({
    queryKey: ["images"],
    queryFn: retrieveImages,
  });

  return (
    <div className="grid grid-cols-thumbnail gap-2">
      {data?.map((image) => (
        <UploadedImage key={image.id} {...image} />
      ))}
    </div>
  );
}

export function ViewUploadedImagesView() {
  return (
    <div className="flex flex-col gap-2">
      <div className="italic">
        Click on a image thumbnail to download the full size image.
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <ViewImagesLoader />
      </Suspense>
    </div>
  );
}
