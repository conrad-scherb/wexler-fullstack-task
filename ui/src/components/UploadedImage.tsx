import { UploadedImageGetOneDto } from "../../../api/src/dto/uploaded-image-get.dto";

export function UploadedImage(imageDetails: UploadedImageGetOneDto) {
  return (
    <div className="flex flex-col items-center">
      <a href={`/api/image/${imageDetails.id}`} download>
        <img src={`data:image/jpeg;base64,${imageDetails.thumbnail}`} />
      </a>
      <div>
        {imageDetails.metadata.title?.split(".").slice(0, -1).join(".")}
      </div>
    </div>
  );
}
