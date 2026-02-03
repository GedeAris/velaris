"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type Stage = "wireframe" | "after";

export function TransformShell({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<Stage>("wireframe");

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const id = window.setTimeout(() => setStage("after"), prefersReduced ? 0 : 850);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="velaris-stage" data-stage={stage}>
      {children}
    </div>
  );
}
