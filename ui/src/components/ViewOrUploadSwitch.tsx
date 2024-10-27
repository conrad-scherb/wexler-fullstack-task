import cn from "classnames";

export function ViewOrUploadSwitch({
  isInUploadMode,
  setIsInUploadMode,
}: {
  isInUploadMode: boolean;
  setIsInUploadMode: (value: boolean) => void;
}) {
  const headerButtonClasses = "w-12 cursor-pointer hover:underline";

  return (
    <div className="flex gap-4 text-xl">
      <button
        data-testid="view-mode-button"
        className={cn(
          headerButtonClasses,
          !isInUploadMode && " font-semibold underline"
        )}
        onClick={() => setIsInUploadMode(false)}
      >
        View
      </button>
      |
      <button
        data-testid="upload-mode-button"
        className={cn(
          headerButtonClasses,
          isInUploadMode && " font-semibold underline"
        )}
        onClick={() => setIsInUploadMode(true)}
      >
        Upload
      </button>
    </div>
  );
}
