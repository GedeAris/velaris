"use client";

import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary";
type Size = "md" | "lg";

export type ActionButtonProps = ComponentPropsWithoutRef<"a"> & {
  variant?: Variant;
  size?: Size;
};

export function ActionButton({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ActionButtonProps) {
  return (
    <a
      className={cn(
        "velaris-btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full text-sm font-medium tracking-wide transition duration-300 ease-out select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--v-cyan)_/_0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--v-ink)_/_0.6)]",
        "active:translate-y-[1px]",
        size === "md" && "h-11 px-5",
        size === "lg" && "h-12 px-6 text-base",
        variant === "primary" &&
          cn(
            "velaris-btn-primary",
            "text-[rgb(10,16,30)]",
            "bg-[linear-gradient(135deg,rgb(var(--v-cyan)_/_0.96),rgb(var(--v-mint)_/_0.92),rgb(var(--v-blue)_/_0.92))] bg-[length:220%_220%] bg-[position:0%_0%] hover:bg-[position:100%_100%] transition-[background-position,box-shadow,transform] duration-700",
            "ring-1 ring-[rgb(var(--v-cyan)_/_0.18)]",
            "shadow-[0_10px_30px_-14px_rgb(var(--v-cyan)_/_0.55)]",
            "hover:-translate-y-[1px] hover:shadow-[0_18px_44px_-18px_rgb(var(--v-cyan)_/_0.72)]"
          ),
        variant === "secondary" &&
          cn(
            "velaris-btn-secondary",
            "text-slate-100",
            "bg-[rgba(255,255,255,0.05)] ring-1 ring-white/10",
            "transition-[background-color,box-shadow,transform] duration-500",
            "hover:-translate-y-[1px] hover:bg-[rgba(255,255,255,0.08)] hover:ring-white/15 hover:shadow-[0_14px_40px_-24px_rgba(0,0,0,0.9)]"
          ),
        className
      )}
      {...props}
    />
  );
}
