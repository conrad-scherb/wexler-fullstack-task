import { z } from "zod";

export const UploadedImageGetManyDtoSchema = z
  .object({
    id: z.string(),
    imgurURL: z.string(),
    metadata: z.record(z.unknown()),
  })
  .array();

export type UploadedImageGetManyDto = z.infer<
  typeof UploadedImageGetManyDtoSchema
>;

export type UploadedImageGetOneDto = UploadedImageGetManyDto[0];
