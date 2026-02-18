import Image from "next/image";

import { Reveal } from "@/components/Reveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { ActionButton } from "@/components/ui/ActionButton";
import { getWhatsAppHref } from "@/lib/whatsapp";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center">
      <div className="mx-auto w-full max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20">
        <div className="relative grid items-center gap-12 lg:grid-cols-12">
          <div className="pointer-events-none absolute -left-16 top-10 hidden h-56 w-56 rounded-full bg-[radial-gradient(circle,rgb(var(--v-cyan)_/_0.20),transparent_62%)] blur-3xl lg:block" />
          <div className="pointer-events-none absolute -bottom-20 left-10 hidden h-72 w-72 rounded-full bg-[radial-gradient(circle,rgb(var(--v-indigo)_/_0.22),transparent_62%)] blur-3xl lg:block" />

          <Reveal className="lg:col-span-7">
            <div className="max-w-[36rem]">
              <div className="flex items-center gap-5">
                <div className="relative h-10 w-10 overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <Image
                    src="/logo.png"
                    alt="Velaris Analytics"
                    width={40}
                    height={40}
                    priority
                    className="velaris-after-layer h-full w-full object-contain p-2"
                  />
                </div>
                <div className="inline-flex items-center gap-3 rounded-full bg-white/5 px-4 py-2 text-xs tracking-[0.26em] text-slate-200/70 ring-1 ring-white/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--v-cyan)_/_0.92)] shadow-[0_0_22px_rgb(var(--v-cyan)_/_0.50)]" />
                  <span className="uppercase">Constellation-grade intelligence</span>
                </div>
                <Link
                  href="/admin/portfolio"
                  aria-label="Admin login"
                  className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-slate-100 ring-1 ring-white/10 transition hover:bg-white/8 hover:ring-white/20"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="opacity-85"
                  >
                    <path
                      d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5ZM4 20a8 8 0 0 1 16 0v1H4v-1Z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>

              <h1 className="mt-10 text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.035em] text-slate-50 sm:mt-11 sm:text-7xl">
                Velaris Analytics
              </h1>
              <p className="mt-6 text-balance text-2xl font-medium leading-[1.28] text-slate-100/80 sm:text-3xl">
                Where Insights Shape{" "}
                <span className="velaris-gradient-text bg-[linear-gradient(180deg,rgb(var(--v-cyan)_/_0.98),rgb(var(--v-mint)_/_0.92))] bg-clip-text text-transparent">
                  Precision
                </span>
              </p>

              <p className="mt-8 max-w-[34rem] text-pretty text-base leading-7 text-slate-200/70 sm:text-lg sm:leading-8">
                Premium CRM systems, analytics, Power BI-style dashboards, and
                automation—built with a calm, engineering-first approach.
              </p>

              <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                <ActionButton
                  href="#services"
                  variant="primary"
                  size="lg"
                  className="velaris-after-layer"
                >
                  <span className="whitespace-nowrap">Enter the Insights</span>
                </ActionButton>
                <ActionButton
                  href={getWhatsAppHref("Halo Velaris Analytics. Saya tertarik dengan layanan CRM & data analytics-nya. Boleh diskusi sebentar terkait kebutuhan bisnis saya? Terima kasih")}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="lg"
                >
                  <span className="whitespace-nowrap">Chat on WhatsApp</span>
                </ActionButton>
                <ActionButton
                  href="/project-agreement"
                  variant="secondary"
                  size="lg"
                  className="group velaris-agreement-idle"
                >
                  <span className="inline-flex items-center gap-3 whitespace-nowrap">
                    <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition group-hover:bg-white/8 group-hover:ring-white/15">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="opacity-90"
                      >
                        <path
                          d="M8 3h8l4 4v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16 3v4h4"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9 12h6M9 16h6"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <span className="text-sm font-medium text-slate-100">
                      Project Agreement
                    </span>
                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] tracking-[0.28em] text-slate-200/60 ring-1 ring-white/10">
                      AGREEMENT
                    </span>
                  </span>
                </ActionButton>
              </div>

              <div className="mt-12 grid max-w-xl grid-cols-2 gap-3 sm:gap-4">
                <div className="rounded-2xl bg-white/5 px-4 py-4 ring-1 ring-white/10">
                  <div className="text-xs tracking-[0.22em] text-slate-200/60">
                    BUILT FOR
                  </div>
                  <div className="mt-2 text-sm font-medium text-slate-100">
                    Growing teams
                  </div>
                </div>
                <div className="rounded-2xl bg-white/5 px-4 py-4 ring-1 ring-white/10">
                  <div className="text-xs tracking-[0.22em] text-slate-200/60">
                    DELIVERY
                  </div>
                  <div className="mt-2 text-sm font-medium text-slate-100">
                    Fast, measured, secure
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="relative hidden lg:col-span-5 lg:block">
            <div className="velaris-after-layer">
              <div className="pointer-events-none absolute -right-16 -top-8 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgb(var(--v-mint)_/_0.18),transparent_62%)] blur-3xl" />

              <div className="relative">
                <div className="pointer-events-none absolute right-6 top-10 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgb(var(--v-cyan)_/_0.20),transparent_70%)] blur-2xl" />
                <div className="pointer-events-none absolute -left-6 bottom-14 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgb(var(--v-blue)_/_0.16),transparent_70%)] blur-2xl" />

                <Reveal delayMs={160} className="ml-auto w-[360px]">
                  <GlowCard className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-28 rounded-full bg-white/10" />
                      <div className="flex gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                        <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                        <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                      </div>
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-white/5 px-4 py-4 ring-1 ring-white/10">
                        <div className="text-[10px] tracking-[0.26em] text-slate-200/50">
                          SIGNAL
                        </div>
                        <div className="mt-3 h-8 w-24 rounded-lg bg-white/10" />
                      </div>
                      <div className="rounded-xl bg-white/5 px-4 py-4 ring-1 ring-white/10">
                        <div className="text-[10px] tracking-[0.26em] text-slate-200/50">
                          DRIFT
                        </div>
                        <div className="mt-3 h-8 w-24 rounded-lg bg-white/10" />
                      </div>
                    </div>
                    <div className="mt-5 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                      <div className="flex items-end justify-between">
                        <div className="h-2.5 w-24 rounded-full bg-white/10" />
                        <div className="h-2.5 w-14 rounded-full bg-white/10" />
                      </div>
                      <div className="mt-4 flex h-28 items-end gap-2">
                        {[28, 42, 35, 54, 46, 64, 56, 74].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-md bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))]"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </GlowCard>
                </Reveal>

                <Reveal delayMs={260} className="mt-6 mr-10 w-[320px]">
                  <GlowCard className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-36 rounded-full bg-white/10" />
                      <div className="h-8 w-20 rounded-full bg-white/5 ring-1 ring-white/10" />
                    </div>
                    <div className="mt-5 space-y-3">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10"
                        >
                          <div className="h-9 w-9 rounded-lg bg-white/10" />
                          <div className="flex-1">
                            <div className="h-2.5 w-28 rounded-full bg-white/10" />
                            <div className="mt-2 h-2.5 w-40 rounded-full bg-white/10" />
                          </div>
                          <div className="h-2.5 w-10 rounded-full bg-white/10" />
                        </div>
                      ))}
                    </div>
                  </GlowCard>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
