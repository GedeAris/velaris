import Link from "next/link";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  createPortfolioItem,
  deletePortfolioItem,
  listAllPortfolioItems,
  updatePortfolioItem,
} from "@/lib/db";
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

const PORTFOLIO_CATEGORIES = [
  "CRM",
  "ANALYTICS",
  "AUTOMATION",
  "DASHBOARD",
  "WEB_APP",
  "INTERNAL_SYSTEM",
] as const;

const PORTFOLIO_STATUSES = ["LIVE", "INTERNAL", "PROTOTYPE"] as const;

function parseTags(input: string) {
  return input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 32);
}

export default async function AdminPortfolioPage() {
  await requireAdmin();

  const items = await listAllPortfolioItems().catch(
    () => [] as Awaited<ReturnType<typeof listAllPortfolioItems>>
  );
  const usesDatabase = Boolean(process.env.DATABASE_URL);
  const actionsEnabled = true;

  async function createAction(formData: FormData) {
    "use server";

    await requireAdmin();

    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const thumbnailUrlRaw = String(formData.get("thumbnailUrl") ?? "").trim();
    const videoUrlRaw = String(formData.get("videoUrl") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();
    const status = String(formData.get("status") ?? "").trim();
    const tags = parseTags(String(formData.get("tags") ?? ""));
    const isPublished = Boolean(formData.get("isPublished"));

    if (!title || !description || !category) {
      redirect("/admin/portfolio");
    }

    await createPortfolioItem({
      title,
      description,
      thumbnailUrl: thumbnailUrlRaw ? thumbnailUrlRaw : null,
      videoUrl: videoUrlRaw ? videoUrlRaw : null,
      category,
      tags,
      status: status || undefined,
      isPublished,
    });

    revalidatePath("/admin/portfolio");
    redirect("/admin/portfolio");
  }

  async function togglePublishAction(formData: FormData) {
    "use server";

    await requireAdmin();

    const id = String(formData.get("id") ?? "");
    const next = String(formData.get("next") ?? "") === "true";
    if (!id) redirect("/admin/portfolio");

    await updatePortfolioItem(id, { isPublished: next });
    revalidatePath("/admin/portfolio");
    redirect("/admin/portfolio");
  }

  async function deleteAction(formData: FormData) {
    "use server";

    await requireAdmin();

    const id = String(formData.get("id") ?? "");
    if (!id) redirect("/admin/portfolio");

    await deletePortfolioItem(id);
    revalidatePath("/admin/portfolio");
    redirect("/admin/portfolio");
  }

  return (
    <div className="space-y-10">
      <div>
        <div className="text-xs tracking-[0.28em] text-slate-200/60">
          PORTFOLIO CMS
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50">
          Manage selected works
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-200/70">
          Add new work, edit existing entries, and control what appears on the
          public site with the publish toggle.
        </p>
      </div>

      {!usesDatabase ? (
        <div className="rounded-3xl bg-white/5 px-6 py-5 text-sm text-slate-200/75 ring-1 ring-white/10">
          DATABASE_URL is not configured. Changes will be stored in memory until
          the app restarts.
        </div>
      ) : null}

      <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
        <div className="text-xs tracking-[0.24em] text-slate-200/55">
          NEW ITEM
        </div>
        <form
          action={createAction}
          className="mt-5 grid gap-4 md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <input
              name="title"
              placeholder="Title"
              required
              disabled={!actionsEnabled}
              className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-100 ring-1 ring-white/10 outline-none placeholder:text-slate-200/40 focus:bg-white/7 focus:ring-white/20"
            />
          </div>

          <div className="md:col-span-2">
            <textarea
              name="description"
              placeholder="Short description"
              required
              rows={4}
              disabled={!actionsEnabled}
              className="w-full resize-none rounded-2xl bg-white/5 px-4 py-3 text-sm leading-6 text-slate-100 ring-1 ring-white/10 outline-none placeholder:text-slate-200/40 focus:bg-white/7 focus:ring-white/20"
            />
          </div>

          <div>
            <select
              name="category"
              required
              defaultValue={PORTFOLIO_CATEGORIES[0]}
              disabled={!actionsEnabled}
              className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-100 ring-1 ring-white/10 outline-none focus:bg-white/7 focus:ring-white/20"
            >
              {PORTFOLIO_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              name="status"
              defaultValue={PORTFOLIO_STATUSES[0]}
              disabled={!actionsEnabled}
              className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-100 ring-1 ring-white/10 outline-none focus:bg-white/7 focus:ring-white/20"
            >
              {PORTFOLIO_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <input
              name="thumbnailUrl"
              placeholder="Thumbnail URL (optional)"
              disabled={!actionsEnabled}
              className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-100 ring-1 ring-white/10 outline-none placeholder:text-slate-200/40 focus:bg-white/7 focus:ring-white/20"
            />
          </div>

          <div className="md:col-span-2">
            <input
              name="videoUrl"
              placeholder="Video path from /public (optional, e.g. /videos/demo.mp4)"
              disabled={!actionsEnabled}
              className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-100 ring-1 ring-white/10 outline-none placeholder:text-slate-200/40 focus:bg-white/7 focus:ring-white/20"
            />
          </div>

          <div className="md:col-span-2">
            <input
              name="tags"
              placeholder="Tags (comma-separated)"
              disabled={!actionsEnabled}
              className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-100 ring-1 ring-white/10 outline-none placeholder:text-slate-200/40 focus:bg-white/7 focus:ring-white/20"
            />
          </div>

          <label className="flex items-center gap-3 md:col-span-2">
            <input
              name="isPublished"
              type="checkbox"
              disabled={!actionsEnabled}
              className="h-4 w-4 rounded border-white/20 bg-white/10"
            />
            <span className="text-sm text-slate-200/70">Publish immediately</span>
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={!actionsEnabled}
              className="rounded-2xl bg-white/5 px-5 py-3 text-sm font-medium tracking-wide text-slate-100 ring-1 ring-white/10 hover:bg-white/8 hover:ring-white/20"
            >
              Create item
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs tracking-[0.24em] text-slate-200/55">
              ITEMS
            </div>
            <div className="mt-2 text-sm text-slate-200/65">
              {items.length} total
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs tracking-[0.22em] text-slate-200/55">
                <th className="py-3 pr-4">TITLE</th>
                <th className="py-3 pr-4">CATEGORY</th>
                <th className="py-3 pr-4">STATUS</th>
                <th className="py-3 pr-4">PUBLISHED</th>
                <th className="py-3 pr-4">UPDATED</th>
                <th className="py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-white/10">
                  <td className="py-4 pr-4">
                    <div className="font-medium text-slate-100">
                      {item.title}
                    </div>
                    <div className="mt-1 line-clamp-1 text-xs text-slate-200/55">
                      {item.description}
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-slate-200/70">
                    {String(item.category).replaceAll("_", " ")}
                  </td>
                  <td className="py-4 pr-4 text-slate-200/70">
                    {String(item.status).replaceAll("_", " ")}
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={[
                        "inline-flex rounded-full px-3 py-1.5 text-[11px] tracking-[0.22em] ring-1",
                        item.isPublished
                          ? "bg-[rgb(var(--v-mint)_/_0.14)] text-slate-100 ring-white/10"
                          : "bg-white/5 text-slate-200/60 ring-white/10",
                      ].join(" ")}
                    >
                      {item.isPublished ? "LIVE" : "DRAFT"}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-slate-200/65">
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/portfolio/${item.id}`}
                        className="rounded-full bg-white/5 px-3 py-2 text-xs tracking-[0.22em] text-slate-100 ring-1 ring-white/10 hover:bg-white/8 hover:ring-white/20"
                      >
                        EDIT
                      </Link>
                      <form action={togglePublishAction}>
                        <input type="hidden" name="id" value={item.id} />
                        <input
                          type="hidden"
                          name="next"
                          value={item.isPublished ? "false" : "true"}
                        />
                        <button
                          type="submit"
                          disabled={!actionsEnabled}
                          className="rounded-full bg-white/5 px-3 py-2 text-xs tracking-[0.22em] text-slate-200/70 ring-1 ring-white/10 hover:bg-white/8 hover:text-slate-100 hover:ring-white/20"
                        >
                          {item.isPublished ? "UNPUBLISH" : "PUBLISH"}
                        </button>
                      </form>
                      <form action={deleteAction}>
                        <input type="hidden" name="id" value={item.id} />
                        <button
                          type="submit"
                          disabled={!actionsEnabled}
                          className="rounded-full bg-white/5 px-3 py-2 text-xs tracking-[0.22em] text-slate-200/70 ring-1 ring-white/10 hover:bg-white/8 hover:text-slate-100 hover:ring-white/20"
                        >
                          DELETE
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {!items.length ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-sm text-slate-200/60"
                  >
                    No portfolio items yet.
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
