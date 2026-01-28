"use client";

import { AlertTriangle, MapPin } from "lucide-react";
import { useState } from "react";
import { ApiGuideDialog } from "./components/api-guide-dialog";
import { FileInputPanel } from "./components/file-input-panel";
import { InputModeToggle } from "./components/input-mode-toggle";
import { ResultsPanel } from "./components/results-panel";
import { TextInputPanel } from "./components/text-input-panel";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export function App() {
  const [file, setFile] = useState<File | null>(null);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<"text" | "file">("text");

  const processFile = async (fileToProcess: File) => {
    setIsLoading(true);
    setResult(null);
    setDownloadUrl(null);
    setError(null);
    setFile(fileToProcess);

    try {
      const formData = new FormData();
      formData.append("file", fileToProcess);

      const response = await fetch(`${BACKEND_URL}/process_file`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process file");
      }

      const data = await response.json();
      const results = data.results || data;
      setResult(results);

      const blob = new Blob([JSON.stringify(results, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);


    } catch (err) {
      setError("Виникла помилка при обробці файлу. Спробуйте ще раз.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  

  const handleProcessFile = async () => {
    if (!file) return;
    await processFile(file);
  };

  const handleProcessText = async () => {
    if (!inputText.trim()) return;
    const textFile = new File([inputText], "input.txt", {
      type: "text/plain",
    });
    await processFile(textFile);
  };

  return (
    <div className="relative overflow-hidden bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 min-h-screen">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.15] dark:opacity-[0.08]"
        style={{
          backgroundImage: `
						linear-gradient(to right, rgb(148 163 184) 1px, transparent 1px),
						linear-gradient(to bottom, rgb(148 163 184) 1px, transparent 1px)
					`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full px-4 flex flex-col items-center min-h-screen py-10 md:py-20">
        <div className="w-full max-w-4xl mb-12 text-center space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-2xl shadow-sm mb-4">
            <MapPin className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight  dark:text-white bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            NorMap
          </h1>
          <p className="text-xl md:text-2xl font-medium text-slate-700 dark:text-slate-200">
            Сервіс семантичної нормалізації геоданих на базі NLP
          </p>
          <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 leading-relaxed">
            Наше API автоматично виправляє помилки, знаходить структуру в
            неструктурованому тексті та приводить українські адреси до єдиного
            машиночитаного формату.
            <br />
            <span className="text-sm font-semibold text-primary mt-2 inline-block">
              Core Tech: Fine-tuned T5 Transformer (Seq2Seq)
            </span>
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <ApiGuideDialog />
          </div>
        </div>

        <div className="w-full max-w-5xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-900/20">
          <div className="p-1.5 md:p-8 space-y-8">
            <InputModeToggle
              value={inputMode}
              onChange={setInputMode}
              disabled={isLoading}
            />
            {inputMode === "text" && (
              <TextInputPanel
                value={inputText}
                onChange={setInputText}
                onSubmit={handleProcessText}
                disabled={isLoading}
                isLoading={isLoading}
              />
            )}
            {inputMode === "file" && (
              <FileInputPanel
                file={file}
                onFileSelect={setFile}
                onSubmit={handleProcessFile}
                disabled={isLoading}
                isLoading={isLoading}
              />
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3 text-red-800 dark:text-red-200 animate-in fade-in slide-in-from-bottom-2">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <ResultsPanel
              result={result}
              downloadUrl={downloadUrl}
              fileName={file?.name ?? null}
            />
          </div>
        </div>

        <footer className="mt-12 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} NorMap. Всі права захищено.</p>
        </footer>
      </div>
    </div>
  );
}
