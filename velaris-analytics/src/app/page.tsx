import { AmbientParticles } from "@/components/AmbientParticles";
import { ConstellationBackdrop as SiteBackdrop } from "@/components/ConstellationBackdrop";
import { TransformShell } from "@/components/TransformShell";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Portfolio } from "@/components/sections/Portfolio";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";

export default function Home() {
  return (
    <TransformShell>
      <div className="velaris-page relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,rgb(var(--v-ink))_0%,#08081a_55%,#000000_100%)]">
        <div className="velaris-after-layer">
          <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_45%_12%,rgb(var(--v-indigo)_/_0.34),transparent_62%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(760px_circle_at_12%_70%,rgb(var(--v-blue)_/_0.14),transparent_62%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(820px_circle_at_88%_78%,rgb(var(--v-cyan)_/_0.14),transparent_64%)]" />
          <div className="absolute inset-0 opacity-[0.10] [mask-image:radial-gradient(900px_circle_at_50%_18%,black,transparent_70%)] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.06)_0,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_72px),repeating-linear-gradient(0deg,rgba(255,255,255,0.04)_0,rgba(255,255,255,0.04)_1px,transparent_1px,transparent_72px)]" />
          <AmbientParticles />
          <SiteBackdrop />
        </div>

        <main className="relative">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute inset-x-0 top-[84px] h-[1px] bg-gradient-to-r from-transparent via-white/6 to-transparent sm:top-[96px]" />

          <div className="relative">
            <div className="velaris-after-layer pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgb(var(--v-mint)_/_0.10),transparent_60%)]" />
            </div>
            <Hero />
          </div>

          <div className="relative">
            <Divider />
            <Services />
            <Divider />
            <Portfolio />
            <Divider />
            <Process />
            <Divider />
            <FinalCta />
          </div>

          <footer className="relative pb-14 pt-6">
            <div className="mx-auto w-full max-w-6xl px-5 text-center text-xs tracking-[0.22em] text-slate-200/45 sm:px-8">
              Velaris Analytics
            </div>
          </footer>
        </main>
      </div>
    </TransformShell>
  );
}

function Divider() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
