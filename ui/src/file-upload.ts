import { FileWithPath } from "react-dropzone";

export enum FileUploadState {
  Uploading,
  Done,
  Failed,
}

export interface FileUploadTask {
  id: string;
  file: FileWithPath;
  status: FileUploadState;
  error?: string;
}
