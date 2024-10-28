import { Readable } from "stream";
import { DataSource } from "typeorm";
import { UploadedImage } from "./entity/uploaded-image.entity";

export const TestDataSource = new DataSource({
  type: "sqlite",
  database: "backend-tests.sqlite",
  synchronize: true,
  logging: false,
  entities: [UploadedImage],
  subscribers: [],
  migrations: [],
});

export const TEST_IMAGE_METADATA = {
  link: "https://i.imgur.com/guAqfPy.jpeg",
  id: "guAqfPy",
  deletehash: "9vqriM5ovqN5GE2",
  account_id: null,
  account_url: null,
  ad_type: null,
  ad_url: null,
  title: "a4c.jpg",
  description: null,
  name: "",
  type: "image/jpeg",
  width: 2000,
  height: 1500,
  size: 723260,
  views: 0,
  section: null,
  vote: null,
  bandwidth: 0,
  animated: false,
  favorite: false,
  in_gallery: false,
  in_most_viral: false,
  has_sound: false,
  is_ad: false,
  nsfw: null,
  tags: [],
  datetime: 1729985821,
  mp4: "",
  hls: "",
};

export function getMockReadableStream(): Readable {
  const readable = new Readable();
  readable.push("Test Image");
  readable.push(null);

  return readable;
}
