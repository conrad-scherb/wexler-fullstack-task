import { z } from "zod";

const SuccessfulUploadResponseSchema = z.object({
  id: z.string(),
  result: z.literal("success"),
});

const FailedUploadResponseSchema = z.object({
  id: z.string(),
  result: z.literal("error"),
  message: z.string(),
});

export const UploadSingleImageResultSchema = z.discriminatedUnion("result", [
  SuccessfulUploadResponseSchema,
  FailedUploadResponseSchema,
]);

export type UploadSingleImageResult = z.infer<
  typeof UploadSingleImageResultSchema
>;
