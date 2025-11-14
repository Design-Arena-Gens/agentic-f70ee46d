"use client";

import { Survey } from "@/lib/types";
import { useMemo, useState } from "react";
import clsx from "classnames";

interface SurveyFormProps {
  survey: Survey;
  onSubmit: (answers: Record<string, string>) => Promise<void> | void;
  isSubmitting?: boolean;
}

export function SurveyForm({ survey, onSubmit, isSubmitting = false }: SurveyFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const requiredMissing = useMemo(() => {
    return survey.questions.filter(
      (question) => question.required && !answers[question.id]?.trim()
    );
  }, [answers, survey.questions]);

  const handleTextChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleChoiceSelect = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (requiredMissing.length > 0) {
      return;
    }
    await onSubmit(answers);
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        {survey.questions.map((question) => {
          const value = answers[question.id] ?? "";
          const showError = submitted && question.required && !value;
          return (
            <div key={question.id} className="flex flex-col gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-white/90">
                    {question.prompt}
                  </h3>
                  {question.required && (
                    <span className="rounded-full border border-white/20 px-2 py-0.5 text-xs uppercase tracking-wide text-white/60">
                      Обязательно
                    </span>
                  )}
                </div>
                {question.description && (
                  <p className="mt-1 text-sm text-slate-300/80">
                    {question.description}
                  </p>
                )}
              </div>

              {question.type === "multiple_choice" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {question.options?.map((option) => {
                    const isActive = value === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleChoiceSelect(question.id, option)}
                        className={clsx(
                          "rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition",
                          "hover:border-white/30 hover:bg-white/10",
                          isActive &&
                            "border-[var(--color-accent-secondary)]/60 bg-[var(--color-accent)]/20 text-white"
                        )}
                      >
                        <span className="block text-sm font-medium text-white/90">
                          {option}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {question.type === "rating" && (
                <div className="space-y-4">
                  <input
                    type="range"
                    min={question.scale?.min ?? 1}
                    max={question.scale?.max ?? 5}
                    step={question.scale?.step ?? 1}
                    value={value ? Number(value) : question.scale?.min ?? 1}
                    onChange={(event) => handleChoiceSelect(question.id, event.target.value)}
                    className="w-full accent-[var(--color-accent)]"
                  />
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-white/50">
                    <span>{question.scale?.labels?.[0] ?? "Минимум"}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white">
                      {value || question.scale?.min || 1}
                    </span>
                    <span>{question.scale?.labels?.[1] ?? "Максимум"}</span>
                  </div>
                </div>
              )}

              {question.type === "text" && (
                <textarea
                  value={value}
                  onChange={(event) => handleTextChange(question.id, event.target.value)}
                  placeholder="Ваш ответ..."
                  rows={4}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[var(--color-accent)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                />
              )}

              {showError && (
                <p className="text-sm text-rose-300/90">
                  Пожалуйста, заполните обязательный вопрос.
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/60">
          Ответы сохраняются в вашей админке. Вы всегда сможете изменить структуру опроса.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="group flex items-center gap-3 rounded-full border border-white/20 bg-gradient-to-r from-[var(--color-accent)]/90 via-[var(--color-accent-secondary)]/80 to-[var(--color-accent)]/70 px-8 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-[var(--color-accent)]/30 transition hover:shadow-[var(--color-accent)]/50 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Отправляем ответы..." : "Получить доступ к статье"}
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/20 text-xs text-white/90">
            →
          </span>
        </button>
      </div>
    </form>
  );
}
