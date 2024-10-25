import { DataSource } from "typeorm";
import { UploadedImage } from "./entity/uploaded-image.entity";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "wexler-test.sqlite",
  synchronize: true,
  logging: true,
  entities: [UploadedImage],
  subscribers: [],
  migrations: [],
});

export async function setupTypeORM(): Promise<void> {
  await AppDataSource.initialize();
}
