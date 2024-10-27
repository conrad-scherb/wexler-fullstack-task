import { DataSource } from "typeorm";
import { UploadedImage } from "./entity/uploaded-image.entity";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "wexler-test.sqlite",
  synchronize: true,
  logging: true,
  entities: [UploadedImage],
  subscribers: [],
  migrations: [],
});

export async function setupTypeORM(source: DataSource): Promise<void> {
  await source.initialize();
}

export async function getImageRepository(source: DataSource) {
  return source.getRepository(UploadedImage);
}
