"use client";

import { cn } from "../lib/utils";
import { Button } from "./button";

type InputMode = "text" | "file";

interface InputModeToggleProps {
  value: InputMode;
  onChange: (mode: InputMode) => void;
  disabled?: boolean;
  className?: string;
}

export function InputModeToggle({
  value,
  onChange,
  disabled,
  className,
}: InputModeToggleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={value === "text" ? "default" : "outline"}
          onClick={() => onChange("text")}
          disabled={disabled}
        >
          Вставити текст
        </Button>
        <Button
          size="sm"
          variant={value === "file" ? "default" : "outline"}
          onClick={() => onChange("file")}
          disabled={disabled}
        >
          Завантажити файл
        </Button>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Оберіть спосіб додавання даних
      </p>
    </div>
  );
}
