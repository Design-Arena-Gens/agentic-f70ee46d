"use client";

import { useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { buildSurveyAnalytics } from "@/lib/analytics";
import { useSurveyResponses } from "@/lib/store";
import { Survey } from "@/lib/types";
import { GlassCard } from "@/components/GlassCard";

const accentPalette = ["#8a68ff", "#00f5d4", "#ff6ec7", "#6ee7b7", "#fbbf24"];

interface AnalyticsPanelProps {
  survey: Survey;
}

export function AnalyticsPanel({ survey }: AnalyticsPanelProps) {
  const responses = useSurveyResponses(survey.id);
  const analytics = useMemo(() => buildSurveyAnalytics(survey, responses), [survey, responses]);
  const [activeQuestionId, setActiveQuestionId] = useState<string>(survey.questions[0]?.id ?? "");
  const activeAnalytics = analytics.questionAnalytics.find((item) => item.question.id === activeQuestionId) ?? analytics.questionAnalytics[0];

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Ответы"
          value={analytics.totalResponses.toString()}
          hint="Количество завершённых прохождений"
        />
        <MetricCard
          label="Конверсия"
          value={`${analytics.completionRate.toFixed(1)}%`}
          hint="Доля пользователей, завершивших опрос"
        />
        <MetricCard
          label="Среднее время"
          value={`${Math.round(analytics.averageCompletionTime)} сек.`}
          hint="По данным последней недели"
        />
        <MetricCard
          label="Последний ответ"
          value={analytics.lastResponseAt ? new Intl.DateTimeFormat("ru-RU", { dateStyle: "short", timeStyle: "short" }).format(new Date(analytics.lastResponseAt)) : "—"}
          hint="Обновляется в режиме реального времени"
        />
      </section>

      <GlassCard className="space-y-6" withGlow>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-white/40">Глубина ответов</p>
            <h3 className="text-2xl font-semibold text-white">
              Аналитика вопросов
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {survey.questions.map((question) => (
              <button
                key={question.id}
                onClick={() => setActiveQuestionId(question.id)}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${
                  activeQuestionId === question.id
                    ? "border-[var(--color-accent-secondary)]/80 bg-[var(--color-accent)]/30 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:border-white/25 hover:bg-white/10"
                }`}
              >
                {question.prompt}
              </button>
            ))}
          </div>
        </div>

        {activeAnalytics ? (
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7 h-72 w-full">
              <ResponsiveContainer>
                <BarChart data={activeAnalytics.distribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                  <XAxis dataKey="option" stroke="rgba(226, 232, 240, 0.7)" tickLine={false} tick={{ fontSize: 12 }} interval={0} angle={-10} dy={8} dx={-4} height={60} />
                  <YAxis stroke="rgba(226, 232, 240, 0.7)" tickLine={false} width={40} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15, 23, 42, 0.95)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "16px",
                      color: "#f8fafc",
                    }}
                    cursor={{ fill: "rgba(138, 104, 255, 0.15)" }}
                  />
                  <Bar dataKey="count" radius={[12, 12, 12, 12]}>
                    {activeAnalytics.distribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={accentPalette[index % accentPalette.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              {activeAnalytics.question.type === "rating" && activeAnalytics.averageScore && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/80">
                  <p className="text-sm uppercase tracking-[0.18em] text-white/40">Средний балл</p>
                  <div className="mt-2 flex items-baseline gap-3 text-4xl font-semibold">
                    {activeAnalytics.averageScore.toFixed(1)}
                    <span className="text-sm font-medium text-white/50">
                      из {activeAnalytics.question.scale?.max ?? 5}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-white/60">
                    Среднее значение по всем респондентам. Чем выше показатель, тем динамичнее воспринимается ваша речь.
                  </p>
                </div>
              )}

              <div className="h-64">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={activeAnalytics.distribution}
                      dataKey="percentage"
                      nameKey="option"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      stroke="rgba(15, 23, 42, 0.9)"
                    >
                      {activeAnalytics.distribution.map((_, index) => (
                        <Cell key={`pie-${index}`} fill={accentPalette[index % accentPalette.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: ValueType) => `${Number(value).toFixed(1)}%`}
                      contentStyle={{
                        background: "rgba(15, 23, 42, 0.95)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: "16px",
                        color: "#f8fafc",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-white/60">Недостаточно данных для визуализации. Попросите аудиторию пройти опрос.</p>
        )}
      </GlassCard>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  hint: string;
}

function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <GlassCard className="space-y-3 bg-white/6 p-5" withGlow>
      <p className="text-xs uppercase tracking-[0.22em] text-white/40">{label}</p>
      <p className="text-3xl font-semibold text-white">{value}</p>
      <p className="text-xs text-white/60">{hint}</p>
    </GlassCard>
  );
}
