import { useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { v4 } from "uuid";
import { removeFileExtension } from "../util";

enum FileUploadState {
  Uploading,
  Done,
}

interface FileUploadTask {
  id: string;
  file: FileWithPath;
  progress: number;
  status: FileUploadState;
}

function FilesUploadTaskGrid({ tasks }: { tasks: FileUploadTask[] }) {
  return (
    <div className="grid grid-cols-thumbnail w-full gap-4">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center flex-col gap-2">
          <img
            src={URL.createObjectURL(task.file)}
            alt={task.file.path}
            className="w-25 h-25 object-contain"
          />
          <div>{removeFileExtension(task.file.path ?? "")}</div>
        </div>
      ))}
    </div>
  );
}

export function UploadImagesForm() {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const [fileUploadTasks, updateFileUploadTasks] = useState<FileUploadTask[]>(
    []
  );

  useEffect(() => {
    const newFileUploadTasks = acceptedFiles.map((file) => ({
      id: v4(),
      file,
      progress: 0,
      status: FileUploadState.Uploading,
    }));

    updateFileUploadTasks((oldTasks) => [...oldTasks, ...newFileUploadTasks]);
  }, [acceptedFiles]);

  return (
    <div
      {...getRootProps({
        className:
          "flex place-content-center p-4 border-2 border-gray-300 border-dashed rounded-md bg-gray-100",
      })}
    >
      <input {...getInputProps()} />

      {fileUploadTasks.length > 0 ? (
        <FilesUploadTaskGrid tasks={fileUploadTasks} />
      ) : (
        <p className="text-gray-600">Drag and drop files or click to select</p>
      )}
    </div>
  );
}
