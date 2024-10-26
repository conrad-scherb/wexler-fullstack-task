import { z } from "zod";

export const MetadataSchema = z
  .object({
    link: z.string(),
    title: z.string().nullable(),
  })
  .and(z.record(z.unknown()));

export type Metadata = z.infer<typeof MetadataSchema>;

export const UploadedImageGetManyDtoSchema = z
  .object({
    id: z.string(),
    thumbnail: z.string(),
    metadata: MetadataSchema,
  })
  .array();

export type UploadedImageGetManyDto = z.infer<
  typeof UploadedImageGetManyDtoSchema
>;

export type UploadedImageGetOneDto = UploadedImageGetManyDto[0];
