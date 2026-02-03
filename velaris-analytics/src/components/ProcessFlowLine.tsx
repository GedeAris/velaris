"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/cn";

export function ProcessFlowLine({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--v-flow", "1");
      return;
    }

    const section = el.closest("[data-process-section]") as HTMLElement | null;
    if (!section) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const start = vh * 0.85;
      const end = vh * 0.35;
      const total = Math.max(1, start - end + rect.height);
      const current = start - rect.top;
      const progress = Math.min(1, Math.max(0, current / total));
      el.style.setProperty("--v-flow", progress.toFixed(4));
    };

    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn("relative h-px w-full [--v-flow:0]", className)}
    >
      <div className="absolute inset-0 rounded-full bg-white/10" />
      <div
        className="absolute inset-0 rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),rgb(var(--v-cyan)_/_0.22),rgba(255,255,255,0.12),transparent)] opacity-90"
        style={{
          maskImage:
            "linear-gradient(90deg, black 0%, black calc(var(--v-flow) * 100%), transparent calc(var(--v-flow) * 100% + 10%), transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, black 0%, black calc(var(--v-flow) * 100%), transparent calc(var(--v-flow) * 100% + 10%), transparent 100%)",
        }}
      />
    </div>
  );
}

