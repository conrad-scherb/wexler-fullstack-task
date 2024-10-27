import axios from "axios";
import { execSync } from "child_process";
import { readFile } from "fs/promises";
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
    execSync("rm -f backend-tests.sqlite");
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
      .expect(200);

    expect(res.body).toBeInstanceOf(Buffer);
    expect(res.body.toString()).toEqual("Test Image");
  });

  test("POST /api/upload: uploads a multiple images and returns error & success states", async () => {
    // Mock the Imgur API POST request
    mockedAxios.post.mockResolvedValue({
      headers: {
        "content-type": "application/json",
      },
      status: 200,
      data: {
        data: TEST_IMAGE_METADATA,
      },
    });

    const invalidFile = {
      buffer: Buffer.from("Test Image"),
      originalname: "invalid.jpg",
    };

    const validFileBuffer = await readFile("./test-assets/a4c.jpg");

    const validFile = {
      buffer: validFileBuffer,
      originalname: "valid.jpg",
    };

    const res = await request(api)
      .post("/api/upload")
      .attach("images", invalidFile.buffer, invalidFile.originalname)
      .attach("images", validFile.buffer, validFile.originalname)
      .field("ids", JSON.stringify(["1", "2"]))
      .expect(200);

    expect(res.text).toEqual(
      `data: {"id":"1","result":"error","message":"500: Input buffer contains unsupported image format"}\n\ndata: {"id":"2","result":"success"}\n\n`
    );

    const images = await imageRepository.find();
    expect(images).toHaveLength(1);
    expect(images[0].id).toEqual("2");
    expect(images[0].metadata).toEqual(TEST_IMAGE_METADATA);
  });
});
