import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UploadedImage {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text" })
  imgurURL: string;
}
