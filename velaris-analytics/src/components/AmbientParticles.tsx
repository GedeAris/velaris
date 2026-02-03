import type { CSSProperties } from "react";

type ParticleTone = "cyan" | "mint" | "indigo" | "white";

type Particle = {
  id: string;
  tone: ParticleTone;
  x: string;
  y: string;
  size: number;
  blur: number;
  opacity: number;
  dx: number;
  dy: number;
  dur: number;
  delay: number;
};

const PARTICLES: Particle[] = [
  { id: "p1", tone: "cyan", x: "16%", y: "18%", size: 7, blur: 12, opacity: 0.55, dx: 10, dy: -14, dur: 46, delay: -8 },
  { id: "p2", tone: "mint", x: "28%", y: "64%", size: 6, blur: 14, opacity: 0.42, dx: -14, dy: 10, dur: 58, delay: -22 },
  { id: "p3", tone: "indigo", x: "52%", y: "26%", size: 8, blur: 18, opacity: 0.35, dx: 16, dy: 8, dur: 72, delay: -18 },
  { id: "p4", tone: "cyan", x: "78%", y: "22%", size: 6, blur: 12, opacity: 0.45, dx: -12, dy: 16, dur: 64, delay: -30 },
  { id: "p5", tone: "white", x: "88%", y: "58%", size: 4, blur: 10, opacity: 0.26, dx: -8, dy: -10, dur: 52, delay: -14 },
  { id: "p6", tone: "mint", x: "10%", y: "78%", size: 5, blur: 12, opacity: 0.30, dx: 10, dy: 12, dur: 66, delay: -26 },
  { id: "p7", tone: "cyan", x: "44%", y: "74%", size: 5, blur: 14, opacity: 0.34, dx: 14, dy: -12, dur: 74, delay: -40 },
  { id: "p8", tone: "white", x: "62%", y: "12%", size: 3, blur: 9, opacity: 0.22, dx: -10, dy: 8, dur: 60, delay: -12 },
];

const ORBS: Particle[] = [
  { id: "o1", tone: "cyan", x: "14%", y: "34%", size: 220, blur: 48, opacity: 0.12, dx: 18, dy: -12, dur: 110, delay: -22 },
  { id: "o2", tone: "mint", x: "82%", y: "68%", size: 260, blur: 56, opacity: 0.10, dx: -14, dy: 14, dur: 140, delay: -58 },
  { id: "o3", tone: "indigo", x: "56%", y: "86%", size: 240, blur: 52, opacity: 0.10, dx: 10, dy: 10, dur: 160, delay: -90 },
];

export function AmbientParticles() {
  return (
    <div aria-hidden="true" className="velaris-particles pointer-events-none absolute inset-0">
      <div className="velaris-constellation-hints absolute inset-0" />
      {[...ORBS, ...PARTICLES].map((p) => (
        <div
          key={p.id}
          className={`velaris-particle velaris-particle--${p.tone}`}
          style={
            {
              left: p.x,
              top: p.y,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              filter: `blur(${p.blur}px)`,
              ["--v-p-dx"]: `${p.dx}px`,
              ["--v-p-dy"]: `${p.dy}px`,
              ["--v-p-dur"]: `${p.dur}s`,
              ["--v-p-delay"]: `${p.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
