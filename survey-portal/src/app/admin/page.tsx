"use client";

import Link from "next/link";
import { CSSProperties, useMemo, useState } from "react";
import { AnalyticsPanel } from "@/components/AnalyticsPanel";
import { GlassCard } from "@/components/GlassCard";
import { QuestionEditor } from "@/components/QuestionEditor";
import { ResponsesTable } from "@/components/ResponsesTable";
import { SurveyMetaForm } from "@/components/SurveyMetaForm";
import { useActiveSurvey, useSurveyStore } from "@/lib/store";
import { deriveAccentSecondary } from "@/lib/utils";

const tabs = [
  { id: "analytics", label: "Аналитика" },
  { id: "responses", label: "Ответы" },
  { id: "builder", label: "Конструктор" },
  { id: "settings", label: "Настройки" },
];

export default function AdminPage() {
  const survey = useActiveSurvey();
  const store = useSurveyStore();
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id ?? "analytics");

  const surveyOptions = useMemo(() => store.surveys, [store.surveys]);
  const accentStyle = useMemo(() => {
    const base = survey?.accentColor ?? "#8a68ff";
    return {
      "--color-accent": base,
      "--color-accent-secondary": deriveAccentSecondary(base),
    } as CSSProperties;
  }, [survey?.accentColor]);

  if (!survey) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-20">
        <GlassCard className="space-y-6 p-10 text-center" withGlow>
          <h1 className="text-3xl font-semibold text-white">Создайте свой первый опрос</h1>
          <p className="text-sm text-white/70">
            Нажмите кнопку ниже, чтобы запустить новый сценарий опроса и начать собирать инсайты.
          </p>
          <button
            onClick={() => store.createSurvey()}
            className="rounded-full border border-white/20 bg-[var(--color-accent)]/50 px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-accent)]/70"
          >
            Создать опрос
          </button>
        </GlassCard>
      </main>
    );
  }

  return (
    <main
      className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-14 sm:px-8 lg:px-12"
      style={accentStyle}
    >
      <header className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Neuro Pulse Studio</p>
          <h1 className="text-4xl font-semibold text-white">Админка</h1>
          <p className="mt-2 text-sm text-white/60">
            Управляйте вопросами, следите за прохождениями и обновляйте материал после опроса.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={store.activeSurveyId}
            onChange={(event) => store.setActiveSurvey(event.target.value)}
            className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs uppercase tracking-[0.3em] text-white/70"
          >
            {surveyOptions.map((item) => (
              <option key={item.id} value={item.id} className="bg-slate-900 text-white">
                {item.title}
              </option>
            ))}
          </select>
          <button
            onClick={() => store.createSurvey()}
            className="rounded-full border border-white/15 bg-[var(--color-accent)]/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-[var(--color-accent)]/60"
          >
            Новый опрос
          </button>
          <Link
            href="/"
            className="rounded-full border border-white/20 px-5 py-2 text-xs uppercase tracking-[0.3em] text-white/70 transition hover:border-white/40 hover:text-white"
          >
            Перейти к опросу
          </Link>
        </div>
      </header>

      <nav className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.3em] transition ${
              activeTab === tab.id
                ? "border-[var(--color-accent)]/80 bg-[var(--color-accent)]/30 text-white"
                : "border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:bg-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === "analytics" && <AnalyticsPanel survey={survey} />}
      {activeTab === "responses" && <ResponsesTable survey={survey} />}
      {activeTab === "builder" && (
        <section className="space-y-6">
          <QuestionEditor surveyId={survey.id} questions={survey.questions} />
        </section>
      )}
      {activeTab === "settings" && (
        <section className="space-y-6">
          <GlassCard className="space-y-6 p-6" withGlow>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Настройки опроса</p>
            <SurveyMetaForm survey={survey} />
          </GlassCard>
          <GlassCard className="space-y-4 p-6" withGlow>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Резервное копирование</p>
            <div className="text-sm text-white/70">
              <p>Скопируйте JSON, чтобы перенести опрос в другое окружение.</p>
              <textarea
                readOnly
                value={JSON.stringify(survey, null, 2)}
                className="mt-3 h-48 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-white/70"
              />
            </div>
            <button
              onClick={() => store.resetToDefaults()}
              className="rounded-full border border-rose-500/40 bg-rose-500/10 px-5 py-2 text-xs uppercase tracking-[0.3em] text-rose-200 transition hover:bg-rose-500/20"
            >
              Сбросить демо-данные
            </button>
          </GlassCard>
        </section>
      )}
    </main>
  );
}
