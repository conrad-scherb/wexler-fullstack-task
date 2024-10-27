import cn from "classnames";

export function ViewOrUploadSwitch({
  isInUploadMode,
  setIsInUploadMode,
}: {
  isInUploadMode: boolean;
  setIsInUploadMode: (value: boolean) => void;
}) {
  return (
    <div className="flex gap-4 text-xl">
      <button
        className={cn(
          "w-12 cursor-pointer hover:underline",
          !isInUploadMode && " font-semibold underline"
        )}
        onClick={() => setIsInUploadMode(false)}
      >
        View
      </button>
      |
      <button
        className={cn(
          "w-12 cursor-pointer hover:underline",
          isInUploadMode && " font-semibold underline"
        )}
        onClick={() => setIsInUploadMode(true)}
      >
        Upload
      </button>
    </div>
  );
}
