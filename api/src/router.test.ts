import axios from "axios";
import * as http from "http";
import request from "supertest";
import { Repository } from "typeorm";
import { getImageRepository } from "./data-source";
import { UploadedImage } from "./entity/uploaded-image.entity";
import { setupRouter } from "./router";
import {
  getMockReadableStream,
  TEST_IMAGE_METADATA,
  TestDataSource,
} from "./test-helpers";

jest.mock("axios");
const mockedAxios = jest.mocked(axios);

describe("router", () => {
  let api: http.Server;
  let imageRepository: Repository<UploadedImage>;

  beforeAll(async () => {
    api = await setupRouter(8889, TestDataSource);
    imageRepository = await getImageRepository(TestDataSource);
  });

  afterAll(() => {
    api.close();
    TestDataSource.destroy();
  });

  afterEach(async () => {
    await imageRepository.clear();
  });

  async function createImageRecord(id: string) {
    await imageRepository.save({
      id,
      metadata: TEST_IMAGE_METADATA,
      thumbnail: "test",
    });
  }

  test("GET /api/images: returns a list of images", async () => {
    await request(api)
      .get("/api/images")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect([]);

    await createImageRecord("1");

    await request(api)
      .get("/api/images")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect([
        {
          id: "1",
          metadata: TEST_IMAGE_METADATA,
          thumbnail: "test",
        },
      ]);

    for (let i = 2; i <= 10; i++) {
      await createImageRecord(i.toString());
    }

    await request(api)
      .get("/api/images")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(
        Array.from({ length: 10 }, (_, i) => ({
          id: (i + 1).toString(),
          metadata: TEST_IMAGE_METADATA,
          thumbnail: "test",
        }))
      );
  });

  test("GET /api/image/:id: returns a single image's data", async () => {
    mockedAxios.get.mockResolvedValue({
      headers: {
        "content-type": "image/jpeg",
      },
      status: 200,
      data: getMockReadableStream(),
    });

    await createImageRecord("1");

    const res = await request(api)
      .get("/api/image/1")
      .expect("Content-Type", /image/)
      .expect(200)
      .then((res) => {
        expect(res.body).toBeInstanceOf(Buffer);
        expect(res.body.toString()).toEqual("Test Image");
      });
  });
});
