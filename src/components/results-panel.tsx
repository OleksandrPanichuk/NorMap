"use client";

import { CheckCircle, Download } from "lucide-react";

interface ResultsPanelProps {
  result: any | null;
  downloadUrl?: string | null;
  fileName?: string | null;
}

export function ResultsPanel({
  result,
  downloadUrl,
  fileName,
}: ResultsPanelProps) {
  if (!result) return null;

  const previewData = Array.isArray(result) ? result.slice(0, 5) : [result];
  const downloadName = fileName
    ? `normalized_${fileName.replace(/\.[^/.]+$/, "")}.json`
    : "normalized.json";


  const columnsOrder = [
    "zip",
    "oblast",
    "city",
    "district",
    "street",
    "build",
    "corp",
    "entrance",
    "floor",
    "room",
    "code",
    "provider",
    "branch_type",
    "branch_id",
    "poi",
  ];

  const rawKeys =
    previewData.length > 0
      ? Array.from(
          new Set(
            previewData.flatMap((item: any) =>
              typeof item === "object" ? Object.keys(item) : []
            )
          )
        )
      : [];

  const filteredKeys = rawKeys.filter((k) => k !== "normalized");

  const allKeys = filteredKeys.sort((a, b) => {
    if (a === "original") return 1;
    if (b === "original") return -1;

    const indexA = columnsOrder.indexOf(a);
    const indexB = columnsOrder.indexOf(b);

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    return a.localeCompare(b);
  });

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/10 text-green-600 text-xs">
            <CheckCircle className="w-4 h-4" />
          </span>
          Результат (Попередній перегляд)
        </h3>
        {downloadUrl && (
          <a
            href={downloadUrl}
            download={downloadName}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <Download className="w-4 h-4" />
            Завантажити {Array.isArray(result) ? "повний файл" : "файл"}
          </a>
        )}
      </div>

      <div className="bg-slate-50 dark:bg-black/40 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          {previewData.length > 0 && typeof previewData[0] === "object" ? (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  {allKeys.map((key) => (
                    <th
                      key={key}
                      className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 uppercase text-xs whitespace-nowrap"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {previewData.map((item: any, idx: number) => (
                  <tr
                    key={idx}
                    className="bg-white dark:bg-gray-900/50 hover:bg-slate-50 dark:hover:bg-gray-900"
                  >
                    {allKeys.map((key) => (
                      <td
                        key={key}
                        className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap"
                      >
                        {item[key] !== undefined ? String(item[key]) : "null"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800">
              {Object.entries(result as Record<string, unknown>).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="bg-white dark:bg-gray-900 p-4 flex flex-col"
                  >
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      {key}
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-200 break-all">
                      {String(value)}
                    </span>
                  </div>
                ),
              )}
            </div>
          )}
        </div>

        {Array.isArray(result) && result.length > 5 && (
          <div className="p-3 bg-slate-100 dark:bg-slate-950/50 text-xs text-center text-slate-500 border-t border-slate-200 dark:border-slate-800">
            Показано 5 з {result.length} записів. Завантажте файл для перегляду
            всіх результатів.
          </div>
        )}
      </div>
    </div>
  );
}
