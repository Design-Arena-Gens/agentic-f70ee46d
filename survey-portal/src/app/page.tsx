"use client";

import Link from "next/link";
import { CSSProperties, useMemo, useState } from "react";
import { useActiveSurvey, useSurveyStore } from "@/lib/store";
import { deriveAccentSecondary } from "@/lib/utils";
import { SurveyForm } from "@/components/SurveyForm";
import { GlassCard } from "@/components/GlassCard";

export default function HomePage() {
  const survey = useActiveSurvey();
  const { addResponse, highlightArticleUrl } = useSurveyStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const highlightLink = useMemo(() => highlightArticleUrl, [highlightArticleUrl]);
  const accentStyle = useMemo(() => {
    const base = survey.accentColor || "#8a68ff";
    return {
      "--color-accent": base,
      "--color-accent-secondary": deriveAccentSecondary(base),
    } as CSSProperties;
  }, [survey.accentColor]);

  const handleSubmit = async (answers: Record<string, string>) => {
    setIsSubmitting(true);
    try {
      const submitted = addResponse(survey.id, answers);
      const resultUrl = `${window.location.origin}/admin#responses-${submitted.id}`;
      setShareUrl(resultUrl);
      setModalVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!survey) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-20">
        <GlassCard className="py-12 text-center text-lg text-white/70" withGlow>
          Добавьте первый опрос в админке, чтобы начать собирать инсайты.
        </GlassCard>
      </main>
    );
  }

  return (
    <main
      className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-16 sm:px-8 lg:px-12"
      style={accentStyle}
    >
      <header className="flex flex-wrap items-center justify-between gap-6">
        <Link
          href="/"
          className="text-sm uppercase tracking-[0.4em] text-white/40 transition hover:text-white/80"
        >
          Neuro Pulse Studio
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white/70 transition hover:border-white/40 hover:bg-white/10"
          >
            Админка
          </Link>
          <a
            href="#survey"
            className="rounded-full border border-[var(--color-accent)]/60 bg-[var(--color-accent)]/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white/90 transition hover:bg-[var(--color-accent)]/60"
          >
            Пройти опрос
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden rounded-[34px] border border-white/15 bg-white/5 p-8 text-white shadow-2xl shadow-black/30 glass-blur">
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-[var(--color-accent)]/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-20 w-[70%] bg-gradient-to-r from-[var(--color-accent)]/10 to-transparent" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
          <div className="flex-1 space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-white/40">Экспресс-анализ голоса</p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Узнайте, как звучит ваш бренд в ушах нейросетей
            </h1>
            <p className="max-w-xl text-base text-white/80">
              Пройдите опрос из {survey.questions.length} вопросов и получите доступ к детальной инструкции
              «Как обучить нейросеть под ваш стиль речи» с готовыми промптами и сценариями.
            </p>
            {survey.audienceHint && (
              <p className="text-sm text-white/60">{survey.audienceHint}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.26em] text-white/50">
              <span className="rounded-full border border-white/15 px-3 py-1">3 минуты</span>
              <span className="rounded-full border border-white/15 px-3 py-1">AI READY PACK</span>
              <span className="rounded-full border border-white/15 px-3 py-1">Кастом инсайты</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="rounded-[28px] border border-white/10 bg-black/20 p-6 text-sm text-white/70 shadow-lg shadow-[var(--color-accent)]/20">
              <p>
                «Каждый респондент получает персональный разбор речи. Алгоритм подскажет, какие эмоции вы транслируете, как распределяется динамика и где добавить акценты».
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/40">— Команда Neuro Pulse</p>
            </div>
          </div>
        </div>
      </section>

      <section id="survey" className="grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
        <GlassCard className="space-y-6 p-8" withGlow>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Главный опрос</p>
          <h2 className="text-2xl font-semibold text-white">{survey.title}</h2>
          <p className="text-sm text-white/70">{survey.description}</p>

          <SurveyForm survey={survey} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="p-6" withGlow>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Что внутри гайда</p>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>• Мастер промптов для кастомизации объяснительного стиля</li>
              <li>• Настройка тональности и темпа в Midjourney-style подсказках</li>
              <li>• Шаблоны «вопрос-ответ» для тренировки голосовых моделей</li>
            </ul>
          </GlassCard>
          <GlassCard className="p-6" withGlow>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Для кого</p>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>• Создатели подкастов и видеоблогеры</li>
              <li>• Команды контент-маркетинга и продюсеры</li>
              <li>• Эксперты, которые хотят масштабировать личный стиль речи</li>
            </ul>
          </GlassCard>
        </div>
      </section>

      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <GlassCard className="max-w-lg space-y-6 p-8 text-center" withGlow>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Доступ открыт</p>
            <h3 className="text-3xl font-semibold text-white">
              Спасибо, что прошли опрос!
            </h3>
            <p className="text-sm text-white/70">
              Вот ссылка на материал «Как любую нейросеть обучить под твой стиль речи». Скопируйте её и сохраните.
            </p>
            <a
              href={highlightLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-full border border-[var(--color-accent)]/70 bg-[var(--color-accent)]/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-accent)]/40"
            >
              Открыть статью
            </a>
            {shareUrl && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-xs text-white/60">
                <p className="uppercase tracking-[0.3em] text-white/40">Админ-отметка</p>
                <p className="mt-2 break-words text-white/70">{shareUrl}</p>
              </div>
            )}
            <button
              onClick={() => setModalVisible(false)}
              className="rounded-full border border-white/20 px-6 py-2 text-xs uppercase tracking-[0.3em] text-white/60 transition hover:border-white/40 hover:text-white/90"
            >
              Закрыть
            </button>
          </GlassCard>
        </div>
      )}
    </main>
  );
}
