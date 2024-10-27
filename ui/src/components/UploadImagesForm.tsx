import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { v4 } from "uuid";
import { UploadSingleImageResultSchema } from "../../../api/src/dto/upload-image-response.dto";
import { FileUploadState, FileUploadTask } from "../file-upload";
import { InProgressImageUpload } from "./InProgressImageUpload";

function FilesUploadTaskGrid({ tasks }: { tasks: FileUploadTask[] }) {
  return (
    <div className="grid grid-cols-thumbnail w-full gap-4">
      {tasks.map((task) => (
        <InProgressImageUpload key={task.id} {...task} />
      ))}
    </div>
  );
}

export function UploadImagesForm() {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/gif": [".gif"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
  });

  const [fileUploadTasks, updateFileUploadTasks] = useState<FileUploadTask[]>(
    []
  );

  const handleUploadResponseMessage = useCallback((message: unknown) => {
    const parsedMessage = UploadSingleImageResultSchema.parse(message);
    const status =
      parsedMessage.result === "success"
        ? FileUploadState.Done
        : FileUploadState.Failed;

    const error =
      parsedMessage.result === "error" ? parsedMessage.message : undefined;

    updateFileUploadTasks((oldTasks) =>
      oldTasks.map((task) =>
        task.id === parsedMessage.id
          ? {
              ...task,
              status,
              error,
            }
          : task
      )
    );
  }, []);

  const performImageUpload = useCallback(
    async (tasks: FileUploadTask[]) => {
      const formData = new FormData();
      for (const task of tasks) {
        formData.append("images", task.file);
      }

      formData.append("ids", JSON.stringify(tasks.map((task) => task.id)));

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "text/event-stream",
        },
      });

      if (!response.ok || response.body === null) {
        throw Error(response.statusText);
      }

      for (const reader = response.body.getReader(); ; ) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        const chunk = new TextDecoder().decode(value);
        const subChunks = chunk.split(/(?<=})\n\ndata: (?={)/);

        for (const subChunk of subChunks) {
          const message = JSON.parse(subChunk.replace(/^data: /, ""));
          handleUploadResponseMessage(message);
        }
      }
    },
    [handleUploadResponseMessage]
  );

  useEffect(() => {
    const newFileUploadTasks = acceptedFiles.map((file) => ({
      id: v4(),
      file,
      status: FileUploadState.Uploading,
    }));

    performImageUpload(newFileUploadTasks);

    updateFileUploadTasks((oldTasks) => [...oldTasks, ...newFileUploadTasks]);
  }, [acceptedFiles, performImageUpload]);

  return (
    <div
      {...getRootProps({
        className:
          "flex place-content-center p-4 border-2 border-gray-300 border-dashed rounded-md bg-gray-100 cursor-pointer",
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
