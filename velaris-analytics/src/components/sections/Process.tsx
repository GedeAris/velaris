import { GlowCard } from "@/components/ui/GlowCard";
import { Reveal } from "@/components/Reveal";
import { ProcessFlowLine } from "@/components/ProcessFlowLine";

const steps = [
  {
    title: "Discover",
    description:
      "Clarify goals, audit data, map operations, and align on success metrics.",
  },
  {
    title: "Design",
    description:
      "Model the system, design the dashboard language, and prototype flows.",
  },
  {
    title: "Build",
    description:
      "Ship reliable CRM, analytics pipelines, and UI with tested integrations.",
  },
  {
    title: "Optimize",
    description:
      "Measure adoption, refine performance, and evolve automation over time.",
  },
] as const;

export function Process() {
  return (
    <section
      id="process"
      data-process-section="true"
      className="velaris-section relative scroll-mt-24"
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal>
          <div className="max-w-2xl">
            <div className="text-xs tracking-[0.28em] text-slate-200/60">
              PROCESS
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
              Flow from intent to impact
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-200/70 sm:text-lg sm:leading-8">
              A calm, structured cadence—designed for teams that value
              precision.
            </p>
          </div>
        </Reveal>

        <div className="mt-12">
          <div className="relative">
            <div className="pointer-events-none absolute left-3 right-3 top-[22px] hidden lg:block">
              <ProcessFlowLine />
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {steps.map((step, index) => (
                <Reveal
                  key={step.title}
                  delayMs={index * 90}
                  className="h-full"
                >
                  <div className="flex h-full flex-col">
                    <div className="flex justify-center">
                      <div className="relative z-10 mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[rgb(var(--v-ink)_/_0.62)] text-sm font-semibold text-[rgb(var(--v-cyan)_/_0.95)] ring-1 ring-white/10 shadow-[0_0_26px_rgb(var(--v-cyan)_/_0.16)]">
                        {index + 1}
                      </div>
                    </div>

                    <GlowCard className="flex-1 min-h-[210px] p-6">
                      <div className="text-lg font-semibold text-slate-50">
                        {step.title}
                      </div>
                      <div className="mt-3 text-sm leading-6 text-slate-200/70">
                        {step.description}
                      </div>
                    </GlowCard>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
