type Star = {
  id: number;
  x: number;
  y: number;
  r: number;
  o: number;
  delay: number;
  layer: 0 | 1;
};

type Edge = { a: number; b: number; w: number };

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function distance(a: Star, b: Star) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function buildConstellation() {
  const rand = mulberry32(901);

  const stars: Star[] = Array.from({ length: 18 }).map((_, index) => {
    const x = rand() * 100;
    const y = rand() * 100;
    const r = 0.12 + rand() * 0.22;
    const o = 0.24 + rand() * 0.46;
    const delay = rand() * 6;
    const layer: 0 | 1 = rand() > 0.52 ? 1 : 0;
    return { id: index, x, y, r, o, delay, layer };
  });

  const edges: Edge[] = [];
  const keySet = new Set<string>();

  for (const star of stars) {
    const candidates = stars
      .filter((s) => s.id !== star.id)
      .map((s) => ({ s, d: distance(star, s) }))
      .filter(({ d }) => d < 28)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);

    for (const { s, d } of candidates) {
      const a = Math.min(star.id, s.id);
      const b = Math.max(star.id, s.id);
      const key = `${a}-${b}`;
      if (keySet.has(key)) continue;
      keySet.add(key);
      edges.push({ a, b, w: Math.max(0.08, 0.22 - d / 220) });
    }
  }

  return { stars, edges };
}

const CONSTELLATION = buildConstellation();

export function ConstellationBackdrop() {
  const { stars, edges } = CONSTELLATION;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgb(var(--v-blue)_/_0.14),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgb(var(--v-cyan)_/_0.14),transparent_55%)]" />

      <svg
        className="velaris-backdrop-svg absolute inset-0 h-full w-full opacity-85"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="velaris-constellation-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2b2c68" stopOpacity="0.34" />
            <stop offset="0.55" stopColor="#26b7cd" stopOpacity="0.40" />
            <stop offset="1" stopColor="#61bdaf" stopOpacity="0.30" />
          </linearGradient>
          <linearGradient id="velaris-arc-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#2b2c68" stopOpacity="0.26" />
            <stop offset="0.5" stopColor="#26b7cd" stopOpacity="0.28" />
            <stop offset="1" stopColor="#61bdaf" stopOpacity="0.24" />
          </linearGradient>
        </defs>

        <g className="velaris-drift-b motion-reduce:animate-none">
          <path
            d="M -10 38 C 18 10, 62 10, 110 38"
            fill="none"
            stroke="url(#velaris-arc-line)"
            strokeWidth="0.18"
            strokeOpacity="0.7"
            strokeDasharray="1.4 2.2"
            vectorEffect="non-scaling-stroke"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-18"
              dur="26s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M -10 74 C 22 96, 78 96, 110 74"
            fill="none"
            stroke="url(#velaris-arc-line)"
            strokeWidth="0.16"
            strokeOpacity="0.55"
            strokeDasharray="1.2 2.4"
            vectorEffect="non-scaling-stroke"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="16"
              dur="34s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        <g className="velaris-drift-a motion-reduce:animate-none">
          {edges.map((edge) => {
            const a = stars[edge.a];
            const b = stars[edge.b];
            return (
              <line
                key={`hint-${edge.a}-${edge.b}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="rgba(255,255,255,0.28)"
                strokeWidth={Math.max(0.08, edge.w * 0.55)}
                strokeOpacity="0.22"
                strokeDasharray="0.8 3.8"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}

          {edges.map((edge) => {
            const a = stars[edge.a];
            const b = stars[edge.b];
            return (
              <line
                key={`${edge.a}-${edge.b}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="url(#velaris-constellation-line)"
                strokeWidth={edge.w * 0.9}
                strokeOpacity="0.75"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}

          {stars
            .filter((s) => s.layer === 0)
            .map((s) => (
              <circle
                key={s.id}
                cx={s.x}
                cy={s.y}
                r={s.r}
                fill="rgba(255,255,255,0.95)"
                opacity={s.o}
              >
                <animate
                  attributeName="opacity"
                  values={`${Math.max(0.12, s.o * 0.55)};${s.o};${Math.max(0.12, s.o * 0.55)}`}
                  dur="7.2s"
                  begin={`${s.delay}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="r"
                  values={`${s.r};${s.r * 1.35};${s.r}`}
                  dur="7.2s"
                  begin={`${s.delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
        </g>

        <g className="velaris-drift-b motion-reduce:animate-none">
          {stars
            .filter((s) => s.layer === 1)
            .map((s) => (
              <g key={s.id}>
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={s.r * 6.4}
                  fill="#26b7cd"
                  opacity={s.o * 0.07}
                />
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={s.r * 1.25}
                  fill="#26b7cd"
                  opacity={s.o * 0.5}
                >
                  <animate
                    attributeName="opacity"
                    values={`${Math.max(0.08, s.o * 0.2)};${Math.max(0.12, s.o * 0.5)};${Math.max(0.08, s.o * 0.2)}`}
                    dur="9.6s"
                    begin={`${s.delay * 0.7}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            ))}
        </g>
      </svg>
    </div>
  );
}
