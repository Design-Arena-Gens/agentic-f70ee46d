"use client";

import { useSurveyStore } from "@/lib/store";
import { Survey } from "@/lib/types";
import { useState } from "react";

interface SurveyMetaFormProps {
  survey: Survey;
}

const accentPresets = ["#8a68ff", "#ff6ec7", "#00f5d4", "#38bdf8", "#f97316"];

export function SurveyMetaForm({ survey }: SurveyMetaFormProps) {
  const store = useSurveyStore();
  const [accentDraft, setAccentDraft] = useState(survey.accentColor);

  const handleAccentChange = (color: string) => {
    setAccentDraft(color);
    store.updateSurveyMeta(survey.id, { accentColor: color });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] text-white/40">Название</label>
          <input
            value={survey.title}
            onChange={(event) => store.updateSurveyMeta(survey.id, { title: event.target.value })}
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white focus:border-[var(--color-accent)]/60 focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] text-white/40">Хук для аудитории</label>
          <input
            value={survey.audienceHint ?? ""}
            onChange={(event) => store.updateSurveyMeta(survey.id, { audienceHint: event.target.value })}
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white focus:border-[var(--color-accent-secondary)]/60 focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.2em] text-white/40">Описание</label>
        <textarea
          value={survey.description}
          onChange={(event) => store.updateSurveyMeta(survey.id, { description: event.target.value })}
          rows={4}
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-[var(--color-accent-secondary)]/60 focus:outline-none"
        />
      </div>

      <div className="space-y-4">
        <label className="text-xs uppercase tracking-[0.2em] text-white/40">Акцентные цвета</label>
        <div className="flex flex-wrap items-center gap-4">
          {accentPresets.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleAccentChange(color)}
              className={`h-12 w-12 rounded-full border-2 transition ${
                accentDraft === color ? "border-white/80 scale-110" : "border-transparent"
              }`}
              style={{ background: color }}
            />
          ))}
          <input
            type="color"
            value={accentDraft}
            onChange={(event) => handleAccentChange(event.target.value)}
            className="h-12 w-20 cursor-pointer rounded-2xl border border-white/20 bg-white/10"
          />
        </div>
      </div>

      <ArticleLinkField />
    </div>
  );
}

function ArticleLinkField() {
  const store = useSurveyStore();
  const url = store.highlightArticleUrl;

  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-[0.2em] text-white/40">
        Ссылка на гайд после опроса
      </label>
      <input
        value={url}
        onChange={(event) => store.setHighlightArticleUrl(event.target.value)}
        placeholder="https://..."
        className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-[var(--color-accent)]/60 focus:outline-none"
      />
      <p className="text-xs text-white/50">
        После прохождения опроса пользователю появится окно с этой ссылкой. Позже вы сможете заменить её на статью с промптами.
      </p>
    </div>
  );
}
