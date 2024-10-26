import { UploadedImageGetOneDto } from "../../../api/src/dto/uploaded-image-get.dto";

export function UploadedImage(imageDetails: UploadedImageGetOneDto) {
  return (
    <div>
      <img src={`data:image/jpeg;base64,${imageDetails.thumbnail}`} />
      <div>{JSON.stringify(imageDetails.metadata, null, 2)}</div>
    </div>
  );
}
