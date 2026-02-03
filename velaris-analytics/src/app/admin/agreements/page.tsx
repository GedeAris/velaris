import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { listAgreementSubmissions } from "@/lib/db";
import {
  ADMIN_SESSION_COOKIE_NAME,
  verifyAdminSessionCookieValue,
} from "@/lib/adminSession";

async function requireAdmin() {
  const secret =
    process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "";
  if (!secret) redirect("/admin/login");

  const store = await cookies();
  const cookieValue = store.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!cookieValue) redirect("/admin/login");

  const ok = await verifyAdminSessionCookieValue(secret, cookieValue);
  if (!ok) redirect("/admin/login");
}

export default async function AdminAgreementsPage() {
  await requireAdmin();

  const items = await listAgreementSubmissions().catch(
    () => [] as Awaited<ReturnType<typeof listAgreementSubmissions>>
  );
  const usesDatabase = Boolean(process.env.DATABASE_URL);

  return (
    <div className="space-y-10">
      <div>
        <div className="text-xs tracking-[0.28em] text-slate-200/60">
          AGREEMENTS
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50">
          Project agreement submissions
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-200/70">
          View confirmations submitted from the Project Agreement page.
        </p>
      </div>

      {!usesDatabase ? (
        <div className="rounded-3xl bg-white/5 px-6 py-5 text-sm text-slate-200/75 ring-1 ring-white/10">
          DATABASE_URL is not configured. Submissions will be stored in memory
          until the app restarts.
        </div>
      ) : null}

      <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
        <div className="text-xs tracking-[0.24em] text-slate-200/55">
          SUBMISSIONS
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-[980px] w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs tracking-[0.22em] text-slate-200/55">
              <tr>
                <th className="py-4 pr-4">CREATED</th>
                <th className="py-4 pr-4">CLIENT</th>
                <th className="py-4 pr-4">COMPANY</th>
                <th className="py-4 pr-4">EMAIL</th>
                <th className="py-4 pr-4">WHATSAPP</th>
                <th className="py-4 pr-4">PROJECT</th>
                <th className="py-4 pr-4">SIGNED</th>
                <th className="py-4 pr-4">APPROVED</th>
                <th className="py-4 pr-4">PDF</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-white/10">
                  <td className="py-4 pr-4 text-slate-200/70">
                    {item.createdAt.toISOString().slice(0, 10)}
                  </td>
                  <td className="py-4 pr-4">
                    <div className="font-medium text-slate-100">
                      {item.clientName}
                    </div>
                    <div className="mt-1 text-xs text-slate-200/55">
                      {item.signatureName}
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-slate-200/70">
                    {item.companyName}
                  </td>
                  <td className="py-4 pr-4 text-slate-200/70">{item.email}</td>
                  <td className="py-4 pr-4 text-slate-200/70">
                    {item.whatsapp}
                  </td>
                  <td className="py-4 pr-4 text-slate-200/70">
                    {item.projectName ?? "—"}
                  </td>
                  <td className="py-4 pr-4 text-slate-200/70">
                    {item.signedDate}
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={[
                        "inline-flex rounded-full px-3 py-2 text-[10px] tracking-[0.22em] ring-1",
                        item.approvedProceed
                          ? "bg-[rgb(var(--v-mint)_/_0.10)] text-slate-100 ring-white/10"
                          : "bg-white/5 text-slate-200/70 ring-white/10",
                      ].join(" ")}
                    >
                      {item.approvedProceed ? "YES" : "NO"}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <Link
                      href={`/project-agreement.pdf?id=${encodeURIComponent(item.id)}`}
                      className="rounded-full bg-white/5 px-3 py-2 text-[10px] tracking-[0.22em] text-slate-200/70 ring-1 ring-white/10 hover:bg-white/8 hover:text-slate-100 hover:ring-white/20"
                    >
                      DOWNLOAD
                    </Link>
                  </td>
                </tr>
              ))}
              {!items.length ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-10 text-center text-sm text-slate-200/60"
                  >
                    No agreement submissions yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
