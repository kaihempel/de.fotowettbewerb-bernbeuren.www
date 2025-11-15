import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { AlertCircle, Upload, X } from "lucide-react";
import { type FC, useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";

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
  const [rejectionError, setRejectionError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setRejectionError(null);

      // Handle file rejections
      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        const errorCode = rejection.errors[0]?.code;

        if (errorCode === "file-too-large") {
          setRejectionError(
            "Photo must not exceed 15MB. Please select a smaller file.",
          );
        } else if (errorCode === "file-invalid-type") {
          setRejectionError(
            "Only JPG, PNG, and HEIC images are accepted. Please select a valid image file.",
          );
        } else {
          setRejectionError("Invalid file. Please select a valid image.");
        }
        return;
      }

      // Handle accepted file
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onFileSelect(file);
      }
    },
    [onFileSelect],
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
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Upload Error</AlertTitle>
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}

      {/* Warning Alert (for duplicates) */}
      {warning && !displayError && (
        <Alert>
          <AlertCircle className="size-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>{warning}</AlertDescription>
        </Alert>
      )}

      {/* Preview or Drop Zone */}
      {preview && selectedFile ? (
        <Card>
          <CardContent className="relative p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                {!isUploading && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClearFile}
                    className="shrink-0"
                    aria-label="Remove selected image"
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </div>
              <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                <img
                  src={preview}
                  alt="Preview of selected photo"
                  className="size-full object-contain"
                />
              </div>
            </div>
          </CardContent>
        </Card>
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
          <input {...getInputProps()} aria-label="Photo file input" />
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
                  ? "Drop your photo here"
                  : "Drag and drop your photo"}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse your files
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, or HEIC • Maximum 15MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="flex items-center justify-center gap-3 rounded-lg border bg-accent/50 p-4">
          <Spinner />
          <p className="text-sm font-medium">Uploading your photo...</p>
        </div>
      )}
    </div>
  );
};
