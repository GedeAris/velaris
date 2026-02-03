import { ActionButton } from "@/components/ui/ActionButton";
import { Reveal } from "@/components/Reveal";
import { getWhatsAppHref } from "@/lib/whatsapp";

export function FinalCta() {
  return (
    <section id="contact" className="velaris-section relative scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs tracking-[0.28em] text-slate-200/60">
              NEXT STEP
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
              Ready to let your data guide you?
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-200/70 sm:text-lg sm:leading-8">
              Send a message and get a clear, actionable plan for your CRM,
              dashboards, and automation.
            </p>
            <div className="mt-10 flex justify-center">
              <ActionButton
                href={getWhatsAppHref("Hi Velaris Analytics — I’m ready to start.")}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="lg"
              >
                Chat on WhatsApp
              </ActionButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
