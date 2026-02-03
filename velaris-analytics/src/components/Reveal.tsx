"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

export function Reveal({
  children,
  className,
  delayMs = 0,
  style,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { root: null, threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`velaris-reveal ${className ?? ""}`}
      data-visible={visible ? "true" : "false"}
      style={{
        ...style,
        ...(delayMs ? { transitionDelay: `${delayMs}ms` } : undefined),
      }}
    >
      {children}
    </div>
  );
}
