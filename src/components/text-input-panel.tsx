"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Textarea } from "./textarea";

interface TextInputPanelProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function TextInputPanel({
  value,
  onChange,
  onSubmit,
  disabled,
  isLoading,
  className,
}: TextInputPanelProps) {
  const isSubmitDisabled = disabled || !value.trim();

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
        Вставте текст
      </h3>
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-40"
        disabled={disabled}
        placeholder="Вставте сюди адреси або неструктурований текст для нормалізації..."
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
