import { GlowCard } from "@/components/ui/GlowCard";
import { Reveal } from "@/components/Reveal";

const services = [
  {
    title: "CRM Systems",
    description:
      "Custom CRM platforms designed for clarity, speed, and operational fit.",
    x: 18,
    y: 28,
  },
  {
    title: "Data Analytics",
    description:
      "Decision-grade metrics, insights, and tracking that teams actually use.",
    x: 78,
    y: 22,
  },
  {
    title: "BI Dashboards",
    description:
      "Power BI-style reporting experiences with premium usability and detail.",
    x: 26,
    y: 78,
  },
  {
    title: "Automation",
    description:
      "Reduce friction with reliable workflows, integrations, and smart ops.",
    x: 82,
    y: 76,
  },
] as const;

const edges: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [0, 3],
];

export function Services() {
  return (
    <section id="services" className="velaris-section relative scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal>
          <div className="max-w-2xl">
            <div className="text-xs tracking-[0.28em] text-slate-200/60">
              SERVICES
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
              A constellation of capabilities
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-200/70 sm:text-lg sm:leading-8">
              Each service is designed as a connected system: data, workflows,
              and insight—moving in harmony.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:hidden">
          {services.map((service) => (
            <Reveal key={service.title}>
              <GlowCard className="p-6">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="text-lg font-semibold text-slate-50">
                      {service.title}
                    </div>
                    <div className="mt-3 text-sm leading-6 text-slate-200/70">
                      {service.description}
                    </div>
                  </div>
                  <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[rgb(var(--v-cyan)_/_0.92)] shadow-[0_0_26px_rgb(var(--v-cyan)_/_0.55)]" />
                </div>
              </GlowCard>
            </Reveal>
          ))}
        </div>

        <div className="relative mt-14 hidden h-[540px] w-full lg:block">
          <div className="velaris-outline-only absolute inset-0 rounded-3xl bg-white/5 ring-1 ring-white/10" />

          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="velaris-service-line" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#2b2c68" stopOpacity="0.35" />
                <stop offset="0.55" stopColor="#26b7cd" stopOpacity="0.40" />
                <stop offset="1" stopColor="#61bdaf" stopOpacity="0.32" />
              </linearGradient>
            </defs>
            {edges.map(([a, b]) => (
              <line
                key={`${a}-${b}`}
                x1={services[a].x}
                y1={services[a].y}
                x2={services[b].x}
                y2={services[b].y}
                stroke="url(#velaris-service-line)"
                strokeWidth="0.22"
                strokeOpacity="0.9"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          {services.map((service, index) => (
            <div
              key={service.title}
              className="absolute"
              style={{
                left: `${service.x}%`,
                top: `${service.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(var(--v-cyan)_/_0.12),transparent_65%)] blur-xl" />
              <div className="relative">
                <div className="mx-auto h-3 w-3 rounded-full bg-[rgb(var(--v-cyan)_/_0.92)] shadow-[0_0_28px_rgb(var(--v-cyan)_/_0.60)]" />
                <Reveal delayMs={index * 90} className="mt-4">
                  <GlowCard className="w-[260px] p-6">
                    <div className="text-lg font-semibold text-slate-50">
                      {service.title}
                    </div>
                    <div className="mt-3 text-sm leading-6 text-slate-200/70">
                      {service.description}
                    </div>
                  </GlowCard>
                </Reveal>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
