"use client";

import Image from "next/image";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { useActionState, useRef, useState } from "react";

import { Reveal } from "@/components/Reveal";
import { GlowCard } from "@/components/ui/GlowCard";

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

export function AgreementForm({
  signedDate,
  action,
}: {
  signedDate: string;
  action: (
    prevState: AgreementActionState,
    formData: FormData
  ) => Promise<AgreementActionState>;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const formRef = useRef<HTMLFormElement | null>(null);

  const [state, formAction, pending] = useActionState<AgreementActionState, FormData>(
    action,
    { ok: false }
  );

  const activeStep: 1 | 2 | 3 = state?.ok ? 3 : step;
  const progress = activeStep === 1 ? 0.33 : activeStep === 2 ? 0.66 : 1;
  const errors = state?.errors ?? {};

  const nextFromStep1 = () => {
    const required = ["clientName", "companyName", "email", "whatsapp"];

    for (const name of required) {
      const el = formRef.current?.elements.namedItem(name);
      if (el instanceof HTMLInputElement) {
        if (!el.value.trim()) {
          el.focus();
          el.reportValidity();
          return;
        }
      }
    }

    setStep(2);
  };

  const nextFromStep2 = () => {
    const agreed = formRef.current?.elements.namedItem("agreedPaymentTerms");
    if (agreed instanceof HTMLInputElement) {
      if (!agreed.checked) {
        agreed.focus();
        return;
      }
    }
    setStep(3);
  };

  return (
    <Reveal>
      <GlowCard className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative h-11 w-11 overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
              <Image
                src="/logo.png"
                alt="Velaris Analytics"
                width={44}
                height={44}
                className="h-full w-full object-contain p-2"
                priority
              />
            </div>
            <div>
              <div className="text-xs tracking-[0.28em] text-slate-200/60">
                PROJECT AGREEMENT
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                Project Agreement Confirmation
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200/70">
                Before we start building, let&apos;s align expectations.
              </p>
            </div>
          </div>

          <div className="hidden shrink-0 flex-col items-end gap-3 sm:flex">
            <Link
              href="/"
              className="rounded-full bg-white/5 px-4 py-2 text-xs tracking-[0.22em] text-slate-100 ring-1 ring-white/10 hover:bg-white/8 hover:ring-white/20"
            >
              BACK TO HOME
            </Link>
            <div className="rounded-2xl bg-white/5 px-4 py-3 text-right ring-1 ring-white/10">
              <div className="text-[10px] tracking-[0.28em] text-slate-200/50">
                STEP
              </div>
              <div className="mt-1 text-sm font-medium text-slate-100">
                {activeStep} of 3
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs tracking-[0.24em] text-slate-200/55">
              PROGRESS
            </div>
            <div className="text-xs tracking-[0.22em] text-slate-200/55 sm:hidden">
              STEP {activeStep} OF 3
            </div>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,rgb(var(--v-cyan)_/_0.88),rgb(var(--v-mint)_/_0.78),rgb(var(--v-blue)_/_0.78))] transition-[width] duration-700 ease-out"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <div className="mt-4 flex justify-end sm:hidden">
            <Link
              href="/"
              className="rounded-full bg-white/5 px-4 py-2 text-xs tracking-[0.22em] text-slate-100 ring-1 ring-white/10 hover:bg-white/8 hover:ring-white/20"
            >
              BACK TO HOME
            </Link>
          </div>
        </div>

        <form ref={formRef} action={formAction} className="mt-8 space-y-8">
          <fieldset
            className={[
              "rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6",
              activeStep === 1 ? "block" : "hidden",
            ].join(" ")}
          >
            <legend className="px-2 text-xs tracking-[0.28em] text-slate-200/60">
              CLIENT INFORMATION
            </legend>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field
              label="Client Name"
              name="clientName"
              autoComplete="name"
              required
              error={errors.clientName}
            />
            <Field
              label="Company Name"
              name="companyName"
              autoComplete="organization"
              required
              error={errors.companyName}
            />
            <Field
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              required
              error={errors.email}
            />
            <Field
              label="WhatsApp Number"
              name="whatsapp"
              inputMode="tel"
              autoComplete="tel"
              required
              error={errors.whatsapp}
            />
            <Field
              label="Project Name (optional)"
              name="projectName"
              className="sm:col-span-2"
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs leading-5 text-slate-200/55">
              We&apos;ll use this for project documentation and invoices.
            </div>
            <button
              type="button"
              onClick={nextFromStep1}
              className="rounded-2xl bg-white/5 px-5 py-3 text-sm font-medium tracking-wide text-slate-100 ring-1 ring-white/10 transition hover:bg-white/10 hover:ring-white/20"
            >
              Continue
            </button>
          </div>
        </fieldset>

        <fieldset
          className={[
            "rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6",
            activeStep === 2 ? "block" : "hidden",
          ].join(" ")}
        >
          <legend className="px-2 text-xs tracking-[0.28em] text-slate-200/60">
            AGREEMENT & PAYMENT
          </legend>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
              <div className="text-xs tracking-[0.24em] text-slate-200/55">
                AGREEMENT SUMMARY
              </div>
              <div className="mt-4 space-y-3">
                <SummaryItem
                  title="Scope"
                  text="Based on the approved proposal and agreed deliverables."
                />
                <SummaryItem
                  title="Payment"
                  text="50% DP before start, 50% before handover."
                />
                <SummaryItem
                  title="Changes"
                  text="Scope changes require an additional written agreement."
                />
                <SummaryItem
                  title="Source Code"
                  text="Delivered after full payment is completed."
                />
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
              <div className="text-xs tracking-[0.24em] text-slate-200/55">
                CONFIRMATION
              </div>
              <div className="mt-4 space-y-4">
                <CheckRow
                  name="agreedPaymentTerms"
                  required
                  label="I agree with the payment terms and project scope"
                  error={errors.agreedPaymentTerms}
                />
                <CheckRow
                  name="understoodScopeChangeImpact"
                  label="I understand additional scope may affect cost & timeline"
                  error={errors.understoodScopeChangeImpact}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-2xl bg-white/5 px-5 py-3 text-sm font-medium tracking-wide text-slate-200/70 ring-1 ring-white/10 transition hover:bg-white/8 hover:text-slate-100 hover:ring-white/20"
            >
              Back
            </button>
            <button
              type="button"
              onClick={nextFromStep2}
              className="rounded-2xl bg-white/5 px-5 py-3 text-sm font-medium tracking-wide text-slate-100 ring-1 ring-white/10 transition hover:bg-white/10 hover:ring-white/20"
            >
              Continue
            </button>
          </div>
        </fieldset>

        <fieldset
          className={[
            "rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6",
            activeStep === 3 ? "block" : "hidden",
          ].join(" ")}
        >
          <legend className="px-2 text-xs tracking-[0.28em] text-slate-200/60">
            DIGITAL APPROVAL
          </legend>

          {state?.ok ? (
            <div className="mt-4 rounded-2xl bg-[rgb(var(--v-mint)_/_0.10)] p-5 ring-1 ring-white/10">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[rgb(var(--v-mint)_/_0.92)]"
                  >
                    <path
                      d="M20 7L9 18l-5-5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-100">
                    Confirmation received
                  </div>
                  <div className="mt-2 text-sm leading-6 text-slate-200/70">
                    We&apos;ll follow up shortly to kick off the project.
                  </div>
                  <div className="mt-4 grid gap-2 text-xs text-slate-200/60 sm:grid-cols-2">
                    <div className="rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
                      <div className="text-[10px] tracking-[0.24em] text-slate-200/50">
                        CLIENT
                      </div>
                      <div className="mt-1 text-slate-100">
                        {state.payload?.clientName}
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
                      <div className="text-[10px] tracking-[0.24em] text-slate-200/50">
                        SIGNED
                      </div>
                      <div className="mt-1 text-slate-100">
                        {state.payload?.signedDate}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      {state.submissionId ? (
                        <Link
                          href={`/project-agreement.pdf?id=${encodeURIComponent(state.submissionId)}`}
                          className="inline-flex rounded-2xl bg-white/5 px-5 py-3 text-sm font-medium tracking-wide text-slate-100 ring-1 ring-white/10 transition hover:bg-white/10 hover:ring-white/20"
                        >
                          Download PDF
                        </Link>
                      ) : null}
                      <Link
                        href="/"
                        className="inline-flex rounded-2xl bg-white/5 px-5 py-3 text-sm font-medium tracking-wide text-slate-100 ring-1 ring-white/10 transition hover:bg-white/10 hover:ring-white/20"
                      >
                        Back to Home
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field
                  label="Full Name (Digital Signature)"
                  name="signatureName"
                  autoComplete="name"
                  required
                  error={errors.signatureName}
                />
                <Field
                  label="Date"
                  name="signedDate"
                  defaultValue={signedDate}
                  readOnly
                />
              </div>

              <div className="mt-5 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs tracking-[0.24em] text-slate-200/55">
                      APPROVAL
                    </div>
                    <div className="mt-2 text-sm text-slate-200/70">
                      Approve &amp; proceed with the project kickoff.
                    </div>
                  </div>
                  <Toggle name="approvedProceed" error={errors.approvedProceed} />
                </div>
                {errors.approvedProceed ? (
                  <div className="mt-3 text-sm text-rose-200/85">
                    {errors.approvedProceed}
                  </div>
                ) : null}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-2xl bg-white/5 px-5 py-3 text-sm font-medium tracking-wide text-slate-200/70 ring-1 ring-white/10 transition hover:bg-white/8 hover:text-slate-100 hover:ring-white/20"
                >
                  Back
                </button>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/project-agreement.pdf"
                    className="text-sm text-slate-200/70 underline underline-offset-4 transition hover:text-slate-100"
                  >
                    Download Agreement (PDF)
                  </Link>
                  <SubmitButton pending={pending} />
                </div>
              </div>
            </>
          )}
        </fieldset>
        </form>
      </GlowCard>
    </Reveal>
  );
}

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={[
        "rounded-2xl px-6 py-3 text-sm font-medium tracking-wide",
        "text-[rgb(10,16,30)] ring-1 ring-[rgb(var(--v-cyan)_/_0.18)]",
        "bg-[linear-gradient(135deg,rgb(var(--v-cyan)_/_0.96),rgb(var(--v-mint)_/_0.92),rgb(var(--v-blue)_/_0.92))]",
        "shadow-[0_14px_44px_-22px_rgb(var(--v-cyan)_/_0.68)]",
        "transition duration-300 ease-out",
        "hover:shadow-[0_18px_58px_-26px_rgb(var(--v-cyan)_/_0.86)]",
        "disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-[0_14px_44px_-22px_rgb(var(--v-cyan)_/_0.68)]",
      ].join(" ")}
    >
      {pending ? "Submitting…" : "Confirm Agreement & Start Project"}
    </button>
  );
}

type FieldProps = ComponentPropsWithoutRef<"input"> & {
  label: string;
  name: string;
  error?: string;
};

function Field({ label, name, error, className, ...props }: FieldProps) {
  const invalid = Boolean(error);

  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="text-xs tracking-[0.24em] text-slate-200/55"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        className={[
          "mt-2 w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-100 ring-1 outline-none transition",
          invalid
            ? "ring-rose-200/30 focus:bg-white/7 focus:ring-rose-200/40"
            : "ring-white/10 focus:bg-white/7 focus:ring-white/20",
          props.readOnly ? "text-slate-200/70" : "",
        ].join(" ")}
        {...props}
      />
      {error ? (
        <div className="mt-2 text-sm text-rose-200/85">{error}</div>
      ) : null}
    </div>
  );
}

function SummaryItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
      <div className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[rgb(var(--v-cyan)_/_0.92)] shadow-[0_0_22px_rgb(var(--v-cyan)_/_0.35)]" />
      <div className="flex-1">
        <div className="text-xs tracking-[0.22em] text-slate-200/55">
          {title.toUpperCase()}
        </div>
        <div className="mt-1 text-sm leading-6 text-slate-200/75">{text}</div>
      </div>
    </div>
  );
}

function CheckRow({
  name,
  label,
  required,
  error,
}: {
  name: string;
  label: string;
  required?: boolean;
  error?: string;
}) {
  const invalid = Boolean(error);

  return (
    <div>
      <label className="group flex cursor-pointer items-start gap-3 rounded-2xl bg-white/0 p-2 transition hover:bg-white/5">
        <span className="relative mt-1.5 inline-flex h-5 w-5 shrink-0 items-center justify-center">
          <input
            name={name}
            type="checkbox"
            required={required}
            className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <span
            aria-hidden="true"
            className={[
              "absolute inset-0 rounded-md ring-1 transition",
              invalid
                ? "bg-[rgba(244,63,94,0.08)] ring-rose-200/30"
                : "bg-white/5 ring-white/10",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-white/20",
              "peer-checked:bg-[rgb(var(--v-cyan)_/_0.20)] peer-checked:ring-white/20",
            ].join(" ")}
          />
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative text-[rgb(var(--v-cyan)_/_0.92)] opacity-0 transition peer-checked:opacity-100"
          >
            <path
              d="M20 7L9 18l-5-5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="text-sm leading-6 text-slate-200/75">{label}</span>
      </label>
      {error ? (
        <div className="mt-2 text-sm text-rose-200/85">{error}</div>
      ) : null}
    </div>
  );
}

function Toggle({ name, error }: { name: string; error?: string }) {
  const invalid = Boolean(error);
  const [checked, setChecked] = useState(false);

  return (
    <label className="inline-flex cursor-pointer items-center gap-3">
      <span className="sr-only">Approve & Proceed</span>
      <input
        name={name}
        type="checkbox"
        required
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={[
          "relative inline-flex h-9 w-16 items-center rounded-full ring-1 transition",
          "bg-white/5 ring-white/10",
          checked ? "bg-[rgb(var(--v-cyan)_/_0.20)] ring-white/20" : "",
          invalid ? "ring-rose-200/30" : "",
        ].join(" ")}
      >
        <span
          className={[
            "inline-block h-7 w-7 translate-x-1 rounded-full bg-white/10 ring-1 ring-white/10 transition",
            "shadow-[0_12px_32px_-22px_rgba(0,0,0,0.9)]",
            checked ? "translate-x-8 bg-white/15" : "",
          ].join(" ")}
        />
      </span>
    </label>
  );
}
