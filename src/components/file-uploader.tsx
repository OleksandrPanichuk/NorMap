import { FileText, UploadCloud, X } from "lucide-react";
import { type MouseEvent, useCallback } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { cn } from "../lib/utils";

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  disabled?: boolean;
}

export function FileUploader({
  onFileSelect,
  selectedFile,
  disabled,
}: FileUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
      if (fileRejections.length > 0) {
        console.error("File rejected", fileRejections);
      }
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "text/plain": [".txt"],
      "text/csv": [".csv"],
    },
    disabled,
  });

  const removeFile = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onFileSelect(null);
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer h-64",
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-gray-300 hover:border-primary/50 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900",
        disabled && "opacity-50 cursor-not-allowed hover:bg-transparent",
        selectedFile ? "border-primary/50 bg-primary/5" : "",
      )}
    >
      <input {...getInputProps()} />

      {selectedFile ? (
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg mb-4 text-primary">
            <FileText className="w-8 h-8" />
          </div>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100 text-center max-w-[80%] truncate">
            {selectedFile.name}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {(selectedFile.size / 1024).toFixed(2)} KB
          </p>
          <button
            type="button"
            onClick={removeFile}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium px-4 py-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <X className="w-4 h-4" />
            Видалити файл
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center p-6">
          <div
            className={cn(
              "p-4 rounded-full mb-4 transition-colors",
              isDragActive
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-400 dark:bg-gray-800",
            )}
          >
            <UploadCloud className="w-8 h-8" />
          </div>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
            {isDragActive
              ? "Відпустіть файл тут"
              : "Перетягніть файл сюди або клікніть"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
            Підтримуються текстові файли (.txt, .csv)
          </p>
        </div>
      )}
    </div>
  );
}
