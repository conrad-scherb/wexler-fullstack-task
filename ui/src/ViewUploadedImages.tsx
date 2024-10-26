import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Suspense } from "react";
import {
  UploadedImageGetManyDto,
  UploadedImageGetManyDtoSchema,
} from "../../api/src/dto/uploaded-image-get.dto";
import { UploadedImage } from "./components/UploadedImage";

async function retrieveImages(): Promise<UploadedImageGetManyDto> {
  const response = await axios.get("/api/images");

  return UploadedImageGetManyDtoSchema.parse(response.data);
}

function ViewImagesLoader() {
  const { data } = useQuery({
    queryKey: ["images"],
    queryFn: retrieveImages,
  });

  return data?.map((image) => <UploadedImage key={image.id} {...image} />);
}

export function ViewUploadedImagesView() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ViewImagesLoader />
    </Suspense>
  );
}
