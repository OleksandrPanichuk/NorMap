
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { FileUploader } from "./file-uploader";

interface FileInputPanelProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  onSubmit: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function FileInputPanel({
  file,
  onFileSelect,
  onSubmit,
  disabled,
  isLoading,
  className,
}: FileInputPanelProps) {
  const isSubmitDisabled = disabled || !file;

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
        Завантажте файл
      </h3>
      <FileUploader
        onFileSelect={onFileSelect}
        selectedFile={file}
        disabled={disabled}
      />
      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={onSubmit}
          disabled={isSubmitDisabled}
          className={cn(
            "w-full md:w-auto transition-all",
            isLoading ? "opacity-90" : "hover:scale-105",
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Обробка...
            </>
          ) : (
            <>
              Нормалізувати
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
