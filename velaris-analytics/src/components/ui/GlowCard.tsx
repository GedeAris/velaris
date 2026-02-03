import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

export type GlowCardProps = ComponentPropsWithoutRef<"div">;

export function GlowCard({ className, children, ...props }: GlowCardProps) {
  return (
    <div
      className={cn(
        "velaris-card group relative overflow-hidden rounded-2xl",
        "bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))]",
        "backdrop-blur-lg sm:backdrop-blur-xl",
        "ring-1 ring-white/10",
        "shadow-[0_26px_70px_-44px_rgba(0,0,0,0.92)]",
        "transition duration-500 ease-out will-change-transform",
        "hover:-translate-y-0.5 hover:ring-white/20 hover:shadow-[0_34px_90px_-50px_rgba(0,0,0,0.95)]",
        "motion-reduce:hover:translate-y-0",
        className
      )}
      {...props}
    >
      <div className="velaris-card-glow pointer-events-none absolute -inset-1 opacity-0 blur-xl transition duration-700 ease-out group-hover:opacity-100 sm:blur-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgb(var(--v-cyan)_/_0.22),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgb(var(--v-mint)_/_0.16),transparent_58%)]" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
