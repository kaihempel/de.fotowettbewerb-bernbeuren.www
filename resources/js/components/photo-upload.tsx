import { OxAlert, OxButton, OxCard, OxSpinner } from "@noxickon/onyx";
import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";
import { type FC, useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { mdiAlertCircle } from "@mdi/js";

interface PhotoUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClearFile: () => void;
  isUploading: boolean;
  preview: string | null;
  error: string | null;
  warning: string | null;
}

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB in bytes
const ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/heic": [".heic"],
};

export const PhotoUpload: FC<PhotoUploadProps> = ({
  onFileSelect,
  selectedFile,
  onClearFile,
  isUploading,
  preview,
  error,
  warning,
}) => {
  const { t } = useTranslation(["validation", "common"]);
  const [rejectionError, setRejectionError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setRejectionError(null);

      // Handle file rejections
      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        const errorCode = rejection.errors[0]?.code;

        if (errorCode === "file-too-large") {
          setRejectionError(t("validation:upload.fileTooLarge"));
        } else if (errorCode === "file-invalid-type") {
          setRejectionError(t("validation:upload.invalidType"));
        } else {
          setRejectionError(t("validation:upload.invalidFile"));
        }
        return;
      }

      // Handle accepted file
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onFileSelect(file);
      }
    },
    [onFileSelect, t],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled: isUploading,
  });

  const displayError = error || rejectionError;

  return (
    <div className="space-y-4">
      {/* Error Alert */}
      {displayError && (
        <OxAlert type="error">
          <OxAlert.Icon
            path={mdiAlertCircle}
            iconClass="text-red-400"
            iconDivClass="bg-red-500/20"
          />
          <span>
            <strong>{t("validation:upload.error")}</strong>
            <br />
            {displayError}
          </span>
        </OxAlert>
      )}

      {/* Warning Alert (for duplicates) */}
      {warning && !displayError && (
        <OxAlert type="warning">
          <OxAlert.Icon
            path={mdiAlertCircle}
            iconClass="text-yellow-400"
            iconDivClass="bg-yellow-500/20"
          />
          <span>
            <strong>{t("common:messages.warning", { defaultValue: "Warning" })}</strong>
            <br />
            {warning}
          </span>
        </OxAlert>
      )}

      {/* Preview or Drop Zone */}
      {preview && selectedFile ? (
        <OxCard>
          <OxCard.Body className="relative p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                {!isUploading && (
                  <OxButton
                    variant="ghost"
                    onClick={onClearFile}
                    className="shrink-0"
                    aria-label={t("common:accessibility.removeImage", { defaultValue: "Remove selected image" })}
                  >
                    <X className="size-4" />
                  </OxButton>
                )}
              </div>
              <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                <img
                  src={preview}
                  alt={t("common:accessibility.previewAlt", { defaultValue: "Preview of selected photo" })}
                  className="size-full object-contain"
                />
              </div>
            </div>
          </OxCard.Body>
        </OxCard>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "group relative cursor-pointer rounded-xl border-2 border-dashed p-12 transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-accent/50",
            isUploading && "pointer-events-none opacity-60",
          )}
        >
          <input {...getInputProps()} aria-label={t("common:labels.photo")} />
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div
              className={cn(
                "flex size-16 items-center justify-center rounded-full border-2 transition-colors",
                isDragActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground",
              )}
            >
              <Upload className="size-8" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragActive
                  ? t("common:upload.dropHere", { defaultValue: "Drop your photo here" })
                  : t("common:upload.dragAndDrop", { defaultValue: "Drag and drop your photo" })}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("common:upload.orClickToBrowse", { defaultValue: "or click to browse your files" })}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("common:upload.fileFormats", { defaultValue: "JPG, PNG, or HEIC" })} • {t("common:upload.maxFileSize", { defaultValue: "Maximum 15MB" })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="flex items-center justify-center gap-3 rounded-lg border bg-accent/50 p-4">
          <OxSpinner />
          <p className="text-sm font-medium">{t("common:upload.uploading", { defaultValue: "Uploading your photo..." })}</p>
        </div>
      )}
    </div>
  );
};
