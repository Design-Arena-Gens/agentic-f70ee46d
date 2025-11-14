"use client";

import { useMemo } from "react";
import { Survey } from "@/lib/types";
import { useSurveyResponses } from "@/lib/store";
import { GlassCard } from "@/components/GlassCard";

interface ResponsesTableProps {
  survey: Survey;
}

export function ResponsesTable({ survey }: ResponsesTableProps) {
  const responses = useSurveyResponses(survey.id);

  const headers = useMemo(() => {
    return survey.questions.map((question) => ({ id: question.id, title: question.prompt }));
  }, [survey.questions]);

  return (
    <GlassCard className="overflow-hidden" withGlow>
      <div className="flex items-center justify-between p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Сырые ответы</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{responses.length} результатов</h3>
        </div>
        <a
          href={`data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(responses, null, 2)
          )}`}
          download={`${survey.title.replace(/\s+/g, "-").toLowerCase()}-responses.json`}
          className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:border-white/30 hover:bg-white/15"
        >
          Экспорт JSON
        </a>
      </div>

      <div className="max-h-[420px] overflow-auto">
        <table className="min-w-full divide-y divide-white/10 text-sm text-white/80">
          <thead className="sticky top-0 bg-slate-900/90 backdrop-blur">
            <tr>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em] text-white/50">
                Дата
              </th>
              {headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em] text-white/50"
                >
                  {header.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {responses.map((response) => (
              <tr key={response.id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-xs text-white/60">
                  {new Intl.DateTimeFormat("ru-RU", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(new Date(response.submittedAt))}
                </td>
                {headers.map((header) => (
                  <td key={header.id} className="px-4 py-3 align-top text-sm text-white/80">
                    {response.answers[header.id] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}

            {responses.length === 0 && (
              <tr>
                <td colSpan={headers.length + 1} className="px-4 py-12 text-center text-sm text-white/40">
                  Пока нет ответов. Поделитесь ссылкой на опрос, чтобы собрать данные.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
