import { Check, Code2, Copy, FileText, Type } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const fileCodeExample = `
// Обробка файлу (.csv, .txt)

const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('${BACKEND_URL}/process_file', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log(data);
`.trim();

const textCodeExample = `
// Обробка одного рядка

const response = await fetch('${BACKEND_URL}/predict', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: "м. Київ, вул Хрещатик 1"
  })
});

const data = await response.json();
console.log(data);
`.trim();

const fileResponseExample = `{
  "filename": "addresses.csv",
  "total_processed": 5,
  "results": [
    {
      "city": "Київ",
      "street": "Хрещатик",
      "poi": "ЦУМ",
      "original": "м. Київ, біля ЦУМу...",
      "normalized": "<CITY> Київ </CITY>..."
    }
  ]
}`;

const textResponseExample = `{
  "input": "м. Київ, вул Хрещатик 1",
  "normalized": "<CITY> Київ </CITY> <STREET> Хрещатик </STREET> 1"
}`;

export function ApiGuideDialog() {
  const [activeTab, setActiveTab] = useState<"file" | "text">("file");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = activeTab === "file" ? fileCodeExample : textCodeExample;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Code2 className="w-4 h-4" />
          API Документація
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Інтеграція API</DialogTitle>
          <DialogDescription>
            Використовуйте API для нормалізації адрес у ваших проєктах.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit self-start">
            <button
              type="button"
              onClick={() => setActiveTab("file")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                activeTab === "file"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <FileText className="w-4 h-4" />
              Файли (.csv, .txt)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("text")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                activeTab === "text"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <Type className="w-4 h-4" />
              Текст
            </button>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Endpoint
            </h4>
            <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-md border border-slate-200 dark:border-slate-700 font-mono text-sm break-all">
              <span className="font-bold text-blue-600 dark:text-blue-400">
                POST
              </span>
              <span className="text-slate-600 dark:text-slate-300">
                {BACKEND_URL}/{activeTab === "file" ? "process_file" : "predict"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Приклад запиту
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-6 px-2 text-xs gap-1.5 text-slate-500 hover:text-slate-900"
              >
                {copied ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                {copied ? "Скопійовано" : "Копіювати"}
              </Button>
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="bg-slate-950 p-4 overflow-x-auto">
                <pre className="text-slate-50 font-mono text-sm leading-relaxed">
                  <code>
                    {activeTab === "file" ? fileCodeExample : textCodeExample}
                  </code>
                </pre>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Приклад відповіді
            </h4>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-900/50">
              <div className="p-4 overflow-x-auto">
                <pre className="text-slate-700 dark:text-slate-300 font-mono text-xs leading-relaxed">
                  <code>
                    {activeTab === "file"
                      ? fileResponseExample
                      : textResponseExample}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
