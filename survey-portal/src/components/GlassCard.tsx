"use client";

import clsx from "classnames";
import { PropsWithChildren } from "react";

interface GlassCardProps {
  className?: string;
  withGlow?: boolean;
}

export function GlassCard({
  children,
  className,
  withGlow = true,
}: PropsWithChildren<GlassCardProps>) {
  return (
    <div
      className={clsx(
        "glass-border glass-blur glass-sheen bg-[var(--color-card)] shadow-glass",
        "rounded-3xl border border-white/10 p-6 text-slate-100",
        withGlow && "relative overflow-hidden",
        className
      )}
    >
      {withGlow && (
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-gradient-to-br from-white/15 via-transparent to-transparent opacity-40" />
      )}
      {children}
    </div>
  );
}
