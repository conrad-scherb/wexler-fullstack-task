import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UploadedImage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  imgurURL: string;

  @Column({ type: "json" })
  metadata: Record<string, unknown>;
}
