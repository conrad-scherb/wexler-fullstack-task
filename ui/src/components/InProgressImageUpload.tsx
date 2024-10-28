import { faCheck, faSpinner, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "react-tooltip";
import { FileUploadState, FileUploadTask } from "../file-upload";
import { removeFileExtension } from "../util";

function StatusIcon({ status }: { status: FileUploadState }) {
  const color = {
    [FileUploadState.Uploading]: "black",
    [FileUploadState.Done]: "green",
    [FileUploadState.Failed]: "red",
  }[status];

  const icon = {
    [FileUploadState.Uploading]: faSpinner,
    [FileUploadState.Done]: faCheck,
    [FileUploadState.Failed]: faXmark,
  }[status];

  return (
    <FontAwesomeIcon
      data-testid="status-icon"
      color={color}
      icon={icon}
      spin={status === FileUploadState.Uploading}
    />
  );
}

function ErroredUploadTooltip({ task }: { task: FileUploadTask }) {
  const tooltipId = `error-tooltip-${task.id}`;

  return (
    <>
      <a
        className="grid place-content-center h-4"
        data-testid="error-tooltip"
        data-tooltip-id={tooltipId}
        data-tooltip-content={task.error}
        data-tooltip-place="top"
      >
        <StatusIcon status={task.status} />
      </a>

      <Tooltip id={tooltipId} />
    </>
  );
}

export function InProgressImageUpload(task: FileUploadTask) {
  return (
    <div data-testid="in-progress-image-upload" className="flex items-center flex-col gap-2">
      <img
        src={URL.createObjectURL(task.file)}
        alt={task.file.path}
        className="w-25 h-25 object-contain"
      />

      <div>{removeFileExtension(task.file.path ?? "")}</div>

      {task.status !== FileUploadState.Failed ? (
        <StatusIcon status={task.status} />
      ) : (
        <ErroredUploadTooltip task={task} />
      )}
    </div>
  );
}
