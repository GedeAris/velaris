import { AgreementForm } from "@/app/project-agreement/AgreementForm";
import { AmbientParticles } from "@/components/AmbientParticles";
import { createAgreementSubmission } from "@/lib/db";

type AgreementPayload = {
  clientName: string;
  companyName: string;
  email: string;
  whatsapp: string;
  projectName: string | null;
  agreedPaymentTerms: boolean;
  understoodScopeChangeImpact: boolean;
  signatureName: string;
  approvedProceed: boolean;
  signedDate: string;
};

type AgreementActionState = {
  ok: boolean;
  errors?: Partial<Record<keyof AgreementPayload, string>>;
  payload?: AgreementPayload;
  submissionId?: string;
};

function buildPayload(formData: FormData, signedDate: string): AgreementPayload {
  const clientName = String(formData.get("clientName") ?? "").trim();
  const companyName = String(formData.get("companyName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const projectNameRaw = String(formData.get("projectName") ?? "").trim();
  const agreedPaymentTerms = Boolean(formData.get("agreedPaymentTerms"));
  const understoodScopeChangeImpact = Boolean(
    formData.get("understoodScopeChangeImpact")
  );
  const signatureName = String(formData.get("signatureName") ?? "").trim();
  const approvedProceed = Boolean(formData.get("approvedProceed"));

  return {
    clientName,
    companyName,
    email,
    whatsapp,
    projectName: projectNameRaw ? projectNameRaw : null,
    agreedPaymentTerms,
    understoodScopeChangeImpact,
    signatureName,
    approvedProceed,
    signedDate,
  };
}

function validatePayload(payload: AgreementPayload) {
  const errors: Partial<Record<keyof AgreementPayload, string>> = {};

  if (!payload.clientName) errors.clientName = "Client name is required.";
  if (!payload.companyName) errors.companyName = "Company name is required.";
  if (!payload.email) errors.email = "Email is required.";
  if (!payload.whatsapp) errors.whatsapp = "WhatsApp number is required.";
  if (!payload.agreedPaymentTerms) {
    errors.agreedPaymentTerms = "You must agree before proceeding.";
  }
  if (!payload.signatureName) {
    errors.signatureName = "Full name is required as a signature.";
  }
  if (!payload.approvedProceed) {
    errors.approvedProceed = "Please enable approval to proceed.";
  }

  return errors;
}

export async function submitAgreement(
  _prevState: AgreementActionState,
  formData: FormData
): Promise<AgreementActionState> {
  "use server";

  void _prevState;
  const signedDate = String(formData.get("signedDate") ?? "").trim();
  const resolvedDate = signedDate || new Date().toISOString().slice(0, 10);
  const payload = buildPayload(formData, resolvedDate);
  const errors = validatePayload(payload);

  if (Object.keys(errors).length) {
    return { ok: false, errors };
  }

  const created = await createAgreementSubmission(payload);
  return { ok: true, payload, submissionId: created.id };
}

export default function ProjectAgreementPage() {
  const signedDate = new Date().toISOString().slice(0, 10);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[linear-gradient(180deg,rgb(var(--v-ink))_0%,#08081a_55%,#000000_100%)]">
      <div className="absolute inset-0 bg-[radial-gradient(980px_circle_at_44%_12%,rgb(var(--v-indigo)_/_0.24),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(820px_circle_at_86%_76%,rgb(var(--v-cyan)_/_0.12),transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(660px_circle_at_15%_78%,rgba(20,184,166,0.08),transparent_65%)]" />
      <div aria-hidden="true" className="absolute inset-0 opacity-40 motion-reduce:hidden">
        <AmbientParticles />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <AgreementForm signedDate={signedDate} action={submitAgreement} />
          <div className="mt-6 text-center text-xs tracking-[0.22em] text-slate-200/45">
            Velaris Analytics • CRM Systems • Data Analytics
          </div>
        </div>
      </main>
    </div>
  );
}
