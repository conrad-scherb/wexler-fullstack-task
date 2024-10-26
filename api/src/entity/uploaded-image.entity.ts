import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Metadata } from "../dto/uploaded-image-get.dto";

@Entity()
export class UploadedImage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /** The metadata for the image uploaded to Imgur, which includes the link & title. */
  @Column({ type: "json" })
  metadata: Metadata;

  /**
   * NOTE: I would not normally store image thumbnails in a relational DB - I would normally
   * store them in S3 or similar and instead serve a presigned URL to the client rather
   * than the base64 encoded string here. However, Imgur dosen't seem to provide a way
   * to get image thumbnails in their current API - I could only find a reference to
   * thumbnails in their deprecated API which doesn't work anymore (https://api.imgur.com/models/image),
   * so given the scope of this task I've decided to store the thumbnail in the DB.
   *
   * The 100x100 thumbnail for the image as a base64 string. This is about 4kb per image.
   */
  @Column({ type: "text" })
  thumbnail: string;
}
