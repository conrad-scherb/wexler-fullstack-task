import { UploadedImageGetOneDto } from "../../../api/src/dto/uploaded-image-get.dto";

export function UploadedImage(imageDetails: UploadedImageGetOneDto) {
  return (
    <div>
      <img src={imageDetails.imgurURL} alt="Uploaded" />
      <div>{JSON.stringify(imageDetails.metadata, null, 2)}</div>
    </div>
  );
}
