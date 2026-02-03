import Link from "next/link";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_SESSION_COOKIE_NAME } from "@/lib/adminSession";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const store = await cookies();

  async function logout() {
    "use server";

    const store = await cookies();
    store.set(ADMIN_SESSION_COOKIE_NAME, "", {
      path: "/",
      maxAge: 0,
    });
    redirect("/");
  }

  const hasSession = Boolean(store.get(ADMIN_SESSION_COOKIE_NAME)?.value);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[linear-gradient(180deg,rgb(var(--v-ink))_0%,#08081a_55%,#000000_100%)]">
      <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_45%_12%,rgb(var(--v-indigo)_/_0.26),transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(820px_circle_at_88%_78%,rgb(var(--v-cyan)_/_0.12),transparent_64%)]" />

      <div className="relative">
        <header className="border-b border-white/10">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
            <Link
              href="/"
              className="text-xs tracking-[0.28em] text-slate-200/70 hover:text-slate-100"
            >
              VELARIS ADMIN
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/portfolio"
                className="rounded-full bg-white/5 px-4 py-2 text-xs tracking-[0.22em] text-slate-100 ring-1 ring-white/10 hover:bg-white/8 hover:ring-white/20"
              >
                PORTFOLIO
              </Link>
              <Link
                href="/admin/agreements"
                className="rounded-full bg-white/5 px-4 py-2 text-xs tracking-[0.22em] text-slate-100 ring-1 ring-white/10 hover:bg-white/8 hover:ring-white/20"
              >
                AGREEMENTS
              </Link>
              {hasSession ? (
                <form action={logout}>
                  <button
                    type="submit"
                    className="rounded-full bg-white/5 px-4 py-2 text-xs tracking-[0.22em] text-slate-200/70 ring-1 ring-white/10 hover:bg-white/8 hover:text-slate-100 hover:ring-white/20"
                  >
                    LOG OUT
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          {children}
        </main>
      </div>
    </div>
  );
}
