"use client";

import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { SurveyQuestion, QuestionType } from "@/lib/types";
import { useSurveyStore } from "@/lib/store";
import { generateId } from "@/lib/utils";

interface QuestionEditorProps {
  surveyId: string;
  questions: SurveyQuestion[];
}

const typeLabels: Record<QuestionType, string> = {
  multiple_choice: "Варианты",
  rating: "Оценка",
  text: "Свободный ответ",
};

const typeOptions: { value: QuestionType; label: string }[] = [
  { value: "multiple_choice", label: "Выбор из вариантов" },
  { value: "rating", label: "Шкала оценки" },
  { value: "text", label: "Свободный ответ" },
];

export function QuestionEditor({ surveyId, questions }: QuestionEditorProps) {
  const store = useSurveyStore();
  const [newQuestionType, setNewQuestionType] = useState<QuestionType>("multiple_choice");

  const handleAddQuestion = () => {
    const base: SurveyQuestion = {
      id: generateId("question"),
      prompt: "Новый вопрос",
      description: "Уточните, какой ответ ждёте от аудитории.",
      type: newQuestionType,
      required: false,
    };
    if (newQuestionType === "multiple_choice") {
      base.options = ["Первый вариант", "Второй вариант"];
    }
    if (newQuestionType === "rating") {
      base.scale = { min: 1, max: 5, step: 1, labels: ["Минимум", "Максимум"] };
    }
    store.addQuestion(surveyId, base);
  };

  const handleTypeChange = (questionId: string, type: QuestionType) => {
    const baseUpdates: Partial<SurveyQuestion> = { type };
    if (type === "multiple_choice") {
      baseUpdates.options = ["Вариант 1", "Вариант 2"];
      baseUpdates.scale = undefined;
    }
    if (type === "rating") {
      baseUpdates.scale = { min: 1, max: 5, step: 1, labels: ["Минимум", "Максимум"] };
      baseUpdates.options = undefined;
    }
    if (type === "text") {
      baseUpdates.options = undefined;
      baseUpdates.scale = undefined;
    }
    store.updateQuestion(surveyId, questionId, baseUpdates);
  };

  const handleOptionChange = (questionId: string, index: number, value: string) => {
    const question = questions.find((item) => item.id === questionId);
    if (!question || !question.options) return;
    const next = [...question.options];
    next[index] = value;
    store.updateQuestion(surveyId, questionId, { options: next });
  };

  const handleAddOption = (questionId: string) => {
    const question = questions.find((item) => item.id === questionId);
    if (!question) return;
    const options = question.options ? [...question.options, "Новый вариант"] : ["Новый вариант"];
    store.updateQuestion(surveyId, questionId, { options });
  };

  const handleRemoveOption = (questionId: string, index: number) => {
    const question = questions.find((item) => item.id === questionId);
    if (!question?.options) return;
    const options = question.options.filter((_, idx) => idx !== index);
    store.updateQuestion(surveyId, questionId, { options });
  };

  const handleScaleChange = (
    questionId: string,
    target: "min" | "max" | "step" | "labelMin" | "labelMax",
    value: string
  ) => {
    const question = questions.find((item) => item.id === questionId);
    if (!question) return;
    const scale = question.scale ?? { min: 1, max: 5, step: 1 };
    if (target === "labelMin" || target === "labelMax") {
      const labels: [string, string] = scale.labels ?? ["Минимум", "Максимум"];
      if (target === "labelMin") labels[0] = value;
      if (target === "labelMax") labels[1] = value;
      store.updateQuestion(surveyId, questionId, { scale: { ...scale, labels } });
      return;
    }
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return;
    store.updateQuestion(surveyId, questionId, { scale: { ...scale, [target]: numeric } });
  };

  return (
    <div className="space-y-6">
      <GlassCard withGlow className="space-y-4 bg-white/5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
              Структура
            </p>
            <h3 className="text-xl font-semibold text-white">
              Вопросы опроса
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={newQuestionType}
              onChange={(event) => setNewQuestionType(event.target.value as QuestionType)}
              className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 focus:border-[var(--color-accent)] focus:outline-none"
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-slate-900 text-white">
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="rounded-full border border-white/15 bg-[var(--color-accent)]/70 px-5 py-2 text-sm font-semibold text-black transition hover:bg-[var(--color-accent)]"
            >
              Добавить
            </button>
          </div>
        </div>
      </GlassCard>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <GlassCard key={question.id} className="space-y-4 bg-white/5" withGlow>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <input
                  value={question.prompt}
                  onChange={(event) => store.updateQuestion(surveyId, question.id, { prompt: event.target.value })}
                  className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-lg font-semibold text-white focus:border-[var(--color-accent)]/60 focus:outline-none"
                />
                <textarea
                  value={question.description ?? ""}
                  onChange={(event) => store.updateQuestion(surveyId, question.id, { description: event.target.value })}
                  placeholder="Добавьте подсказку..."
                  rows={2}
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/80 placeholder:text-white/40 focus:border-[var(--color-accent-secondary)]/50 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-3 md:w-48">
                <label className="text-xs uppercase tracking-[0.2em] text-white/40">
                  Тип вопроса
                </label>
                <select
                  value={question.type}
                  onChange={(event) => handleTypeChange(question.id, event.target.value as QuestionType)}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white focus:border-[var(--color-accent)]/60 focus:outline-none"
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-slate-900 text-white">
                      {option.label}
                    </option>
                  ))}
                </select>

                <label className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/40">
                  <input
                    type="checkbox"
                    checked={Boolean(question.required)}
                    onChange={(event) => store.updateQuestion(surveyId, question.id, { required: event.target.checked })}
                    className="h-4 w-4 rounded border-white/30 bg-white/5 text-[var(--color-accent)]"
                  />
                  Обязательный
                </label>
              </div>
            </div>

            {question.type === "multiple_choice" && (
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                  Варианты ответов
                </p>
                <div className="space-y-3">
                  {question.options?.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-3">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-widest text-white/60">
                        {optionIndex + 1}
                      </span>
                      <input
                        value={option}
                        onChange={(event) => handleOptionChange(question.id, optionIndex, event.target.value)}
                        className="flex-1 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white focus:border-[var(--color-accent)]/60 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(question.id, optionIndex)}
                        className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/70 transition hover:border-rose-400/50 hover:bg-rose-500/20"
                      >
                        Удалить
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleAddOption(question.id)}
                  className="rounded-full border border-dashed border-white/25 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:border-white/40 hover:bg-white/10"
                >
                  Добавить вариант
                </button>
              </div>
            )}

            {question.type === "rating" && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.18em] text-white/40">Минимум</label>
                  <input
                    type="number"
                    value={question.scale?.min ?? 1}
                    onChange={(event) => handleScaleChange(question.id, "min", event.target.value)}
                    className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-white focus:border-[var(--color-accent)]/60 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.18em] text-white/40">Максимум</label>
                  <input
                    type="number"
                    value={question.scale?.max ?? 5}
                    onChange={(event) => handleScaleChange(question.id, "max", event.target.value)}
                    className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-white focus:border-[var(--color-accent)]/60 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.18em] text-white/40">Шаг</label>
                  <input
                    type="number"
                    value={question.scale?.step ?? 1}
                    onChange={(event) => handleScaleChange(question.id, "step", event.target.value)}
                    className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-white focus:border-[var(--color-accent)]/60 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.18em] text-white/40">Подписи краёв</label>
                  <div className="flex gap-3">
                    <input
                      value={question.scale?.labels?.[0] ?? "Минимум"}
                      onChange={(event) => handleScaleChange(question.id, "labelMin", event.target.value)}
                      className="flex-1 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs text-white focus:border-[var(--color-accent)]/60 focus:outline-none"
                    />
                    <input
                      value={question.scale?.labels?.[1] ?? "Максимум"}
                      onChange={(event) => handleScaleChange(question.id, "labelMax", event.target.value)}
                      className="flex-1 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs text-white focus:border-[var(--color-accent)]/60 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                {typeLabels[question.type]}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => store.reorderQuestions(surveyId, index, Math.max(0, index - 1))}
                  disabled={index === 0}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs text-white/70 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => store.reorderQuestions(surveyId, index, Math.min(questions.length - 1, index + 1))}
                  disabled={index === questions.length - 1}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs text-white/70 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => store.removeQuestion(surveyId, question.id)}
                  className="rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-1 text-xs text-rose-200 transition hover:bg-rose-500/20"
                >
                  Удалить
                </button>
              </div>
            </div>
          </GlassCard>
        ))}

        {questions.length === 0 && (
          <GlassCard withGlow className="py-12 text-center text-white/60">
            Добавьте первый вопрос, чтобы настроить опрос под вашу аудиторию.
          </GlassCard>
        )}
      </div>
    </div>
  );
}
