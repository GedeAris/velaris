import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_SESSION_COOKIE_NAME,
  createAdminSessionCookieValue,
} from "@/lib/adminSession";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  async function login(formData: FormData) {
    "use server";

    const expected = process.env.ADMIN_PASSWORD ?? "";
    if (!expected) {
      redirect("/admin/login?error=missing");
    }

    const password = String(formData.get("password") ?? "");
    if (password !== expected) {
      redirect("/admin/login?error=1");
    }

    const secret = process.env.ADMIN_SESSION_SECRET ?? expected;
    const value = await createAdminSessionCookieValue(secret);

    const store = await cookies();
    store.set(ADMIN_SESSION_COOKIE_NAME, value, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    redirect("/admin/portfolio");
  }

  const error = (await searchParams)?.error;

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-3xl bg-white/5 p-7 ring-1 ring-white/10">
        <div className="text-xs tracking-[0.28em] text-slate-200/60">
          ADMIN ACCESS
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-50">
          Sign in to manage portfolio
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-200/70">
          Use the admin password to publish, edit, and curate selected works.
        </p>

        {error ? (
          <div className="mt-5 rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-100 ring-1 ring-white/10">
            {error === "missing"
              ? "ADMIN_PASSWORD is not configured."
              : "Incorrect password."}
          </div>
        ) : null}

        <form action={login} className="mt-6 space-y-4">
          <div>
            <label className="text-xs tracking-[0.24em] text-slate-200/55">
              PASSWORD
            </label>
            <input
              name="password"
              type="password"
              required
              autoFocus
              className="mt-2 w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-100 ring-1 ring-white/10 outline-none placeholder:text-slate-200/40 focus:bg-white/7 focus:ring-white/20"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-2xl bg-[linear-gradient(135deg,rgb(var(--v-cyan)_/_0.96),rgb(var(--v-mint)_/_0.92),rgb(var(--v-blue)_/_0.92))] px-5 py-3 text-sm font-medium tracking-wide text-[rgb(10,16,30)] ring-1 ring-[rgb(var(--v-cyan)_/_0.18)] shadow-[0_10px_30px_-14px_rgb(var(--v-cyan)_/_0.55)] transition duration-700 hover:shadow-[0_18px_44px_-18px_rgb(var(--v-cyan)_/_0.72)]"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
