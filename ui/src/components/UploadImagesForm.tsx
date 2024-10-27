import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Tooltip } from "react-tooltip";
import { v4 } from "uuid";
import { UploadSingleImageResultSchema } from "../../../api/src/dto/upload-image-response.dto";
import { removeFileExtension } from "../util";

enum FileUploadState {
  Uploading,
  Done,
  Failed,
}

interface FileUploadTask {
  id: string;
  file: FileWithPath;
  status: FileUploadState;
  error?: string;
}

function ErroredUploadTooltip({ task }: { task: FileUploadTask }) {
  const tooltipId = `error-tooltip-${task.id}`;

  return (
    <>
      <a
        data-tooltip-id={tooltipId}
        data-tooltip-content={task.error}
        data-tooltip-place="top"
      >
        <FontAwesomeIcon color="red" icon={faTimes} />
      </a>

      <Tooltip id={tooltipId} />
    </>
  );
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

          {task.status === FileUploadState.Uploading ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : task.status === FileUploadState.Done ? (
            <FontAwesomeIcon color="green" icon={faCheck} />
          ) : (
            <ErroredUploadTooltip task={task} />
          )}
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
