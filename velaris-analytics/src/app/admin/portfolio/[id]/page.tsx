import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  deletePortfolioItem,
  getPortfolioItem,
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

export default async function AdminPortfolioEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const usesDatabase = Boolean(process.env.DATABASE_URL);
  const actionsEnabled = true;

  const { id } = await params;
  const item = await getPortfolioItem(id);
  if (!item) redirect("/admin/portfolio");

  async function saveAction(formData: FormData) {
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
      redirect(`/admin/portfolio/${id}`);
    }

    await updatePortfolioItem(id, {
      title,
      description,
      thumbnailUrl: thumbnailUrlRaw ? thumbnailUrlRaw : null,
      videoUrl: videoUrlRaw ? videoUrlRaw : null,
      category,
      status: status || undefined,
      tags,
      isPublished,
    });

    revalidatePath("/admin/portfolio");
    revalidatePath(`/admin/portfolio/${id}`);
    redirect("/admin/portfolio");
  }

  async function deleteAction(_formData: FormData) {
    "use server";

    void _formData;
    await requireAdmin();
    await deletePortfolioItem(id);
    revalidatePath("/admin/portfolio");
    redirect("/admin/portfolio");
  }

  const tagsValue = item.tags.join(", ");

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs tracking-[0.28em] text-slate-200/60">
          EDIT ITEM
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50">
          {item.title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-200/70">
          Update details and control visibility on the public portfolio.
        </p>
      </div>

      {!usesDatabase ? (
        <div className="rounded-3xl bg-white/5 px-6 py-5 text-sm text-slate-200/75 ring-1 ring-white/10">
          DATABASE_URL is not configured. Changes will be stored in memory until
          the app restarts.
        </div>
      ) : null}

      <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
        <form action={saveAction} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-xs tracking-[0.24em] text-slate-200/55">
              TITLE
            </label>
            <input
              name="title"
              defaultValue={item.title}
              required
              disabled={!actionsEnabled}
              className="mt-2 w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-100 ring-1 ring-white/10 outline-none placeholder:text-slate-200/40 focus:bg-white/7 focus:ring-white/20"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs tracking-[0.24em] text-slate-200/55">
              DESCRIPTION
            </label>
            <textarea
              name="description"
              defaultValue={item.description}
              required
              rows={5}
              disabled={!actionsEnabled}
              className="mt-2 w-full resize-none rounded-2xl bg-white/5 px-4 py-3 text-sm leading-6 text-slate-100 ring-1 ring-white/10 outline-none placeholder:text-slate-200/40 focus:bg-white/7 focus:ring-white/20"
            />
          </div>

          <div>
            <label className="text-xs tracking-[0.24em] text-slate-200/55">
              CATEGORY
            </label>
            <select
              name="category"
              required
              defaultValue={item.category}
              disabled={!actionsEnabled}
              className="mt-2 w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-100 ring-1 ring-white/10 outline-none focus:bg-white/7 focus:ring-white/20"
            >
              {PORTFOLIO_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs tracking-[0.24em] text-slate-200/55">
              STATUS
            </label>
            <select
              name="status"
              defaultValue={item.status || PORTFOLIO_STATUSES[0]}
              disabled={!actionsEnabled}
              className="mt-2 w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-100 ring-1 ring-white/10 outline-none focus:bg-white/7 focus:ring-white/20"
            >
              {PORTFOLIO_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs tracking-[0.24em] text-slate-200/55">
              THUMBNAIL URL
            </label>
            <input
              name="thumbnailUrl"
              defaultValue={item.thumbnailUrl ?? ""}
              disabled={!actionsEnabled}
              className="mt-2 w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-100 ring-1 ring-white/10 outline-none placeholder:text-slate-200/40 focus:bg-white/7 focus:ring-white/20"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs tracking-[0.24em] text-slate-200/55">
              VIDEO PATH
            </label>
            <input
              name="videoUrl"
              defaultValue={item.videoUrl ?? ""}
              disabled={!actionsEnabled}
              placeholder="/videos/demo.mp4"
              className="mt-2 w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-100 ring-1 ring-white/10 outline-none placeholder:text-slate-200/40 focus:bg-white/7 focus:ring-white/20"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs tracking-[0.24em] text-slate-200/55">
              TAGS (COMMA-SEPARATED)
            </label>
            <input
              name="tags"
              defaultValue={tagsValue}
              disabled={!actionsEnabled}
              className="mt-2 w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-100 ring-1 ring-white/10 outline-none placeholder:text-slate-200/40 focus:bg-white/7 focus:ring-white/20"
            />
          </div>

          <label className="flex items-center gap-3 md:col-span-2">
            <input
              name="isPublished"
              type="checkbox"
              defaultChecked={item.isPublished}
              disabled={!actionsEnabled}
              className="h-4 w-4 rounded border-white/20 bg-white/10"
            />
            <span className="text-sm text-slate-200/70">Published</span>
          </label>

          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button
              type="submit"
              disabled={!actionsEnabled}
              className="rounded-2xl bg-white/5 px-5 py-3 text-sm font-medium tracking-wide text-slate-100 ring-1 ring-white/10 hover:bg-white/8 hover:ring-white/20"
            >
              Save changes
            </button>
            <button
              type="submit"
              formAction={deleteAction}
              formNoValidate
              disabled={!actionsEnabled}
              className="rounded-2xl bg-white/5 px-5 py-3 text-sm font-medium tracking-wide text-slate-200/70 ring-1 ring-white/10 hover:bg-white/8 hover:text-slate-100 hover:ring-white/20"
            >
              Delete item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
