import { UploadedImageGetOneDto } from "../../../api/src/dto/uploaded-image-get.dto";
import { removeFileExtension } from "../util";

export function UploadedImage(imageDetails: UploadedImageGetOneDto) {
  const titleWithoutExtension = removeFileExtension(
    imageDetails.metadata.title ?? ""
  );

  return (
    <div className="flex flex-col items-center">
      <a href={`/api/image/${imageDetails.id}`} download>
        <img src={`data:image/jpeg;base64,${imageDetails.thumbnail}`} />
      </a>
      <div>{titleWithoutExtension}</div>
    </div>
  );
}
