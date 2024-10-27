import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    <div data-testid="images-grid" className="grid grid-cols-thumbnail gap-2">
      {data?.map((image) => (
        <UploadedImage key={image.id} {...image} />
      ))}
    </div>
  );
}

export function ViewUploadedImages() {
  return (
    <div className="flex flex-col gap-2">
      <em>Click on a image thumbnail to download the full size image.</em>

      <Suspense
        fallback={
          <FontAwesomeIcon
            data-testid="loading-images-spinner"
            icon={faSpinner}
            spin
            size="2xl"
            className="pt-4"
          />
        }
      >
        <ViewImagesLoader />
      </Suspense>
    </div>
  );
}
