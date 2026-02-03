"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { GlowCard } from "@/components/ui/GlowCard";

function getYouTubeId(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0] ?? null;
    }
    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      if (url.pathname === "/watch") return url.searchParams.get("v");
      const parts = url.pathname.split("/").filter(Boolean);
      const embedIndex = parts.indexOf("embed");
      if (embedIndex !== -1) return parts[embedIndex + 1] ?? null;
      const shortsIndex = parts.indexOf("shorts");
      if (shortsIndex !== -1) return parts[shortsIndex + 1] ?? null;
    }
  } catch {}
  return null;
}

function getVimeoId(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, "");
    if (host !== "vimeo.com" && host !== "player.vimeo.com") return null;
    const parts = url.pathname.split("/").filter(Boolean);
    for (const p of parts) {
      if (/^\d+$/.test(p)) return p;
    }
  } catch {}
  return null;
}

function isDirectVideoFileUrl(rawUrl: string): boolean {
  try {
    const url = new URL(rawUrl);
    const path = url.pathname.toLowerCase();
    return (
      path.endsWith(".mp4") || path.endsWith(".webm") || path.endsWith(".ogg")
    );
  } catch {
    const lowered = rawUrl.toLowerCase();
    return (
      lowered.includes(".mp4") ||
      lowered.includes(".webm") ||
      lowered.includes(".ogg")
    );
  }
}

function normalizePublicUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("public/")) return `/${trimmed.slice("public/".length)}`;
  if (trimmed.startsWith("/")) return trimmed;
  return `/${trimmed}`;
}

export type PortfolioClientItem = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  category: string;
  tags: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
};

export function PortfolioClient({ items }: { items: PortfolioClientItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [active, setActive] = useState<PortfolioClientItem | null>(null);
  const [gridEpoch, setGridEpoch] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<string, true>>({});
  const [failedVideos, setFailedVideos] = useState<Record<string, true>>({});
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(mq.matches);
    sync();
    const legacy = mq as MediaQueryList & {
      addListener?: (listener: () => void) => void;
      removeListener?: (listener: () => void) => void;
    };

    if (mq.addEventListener) {
      mq.addEventListener("change", sync);
      return () => mq.removeEventListener("change", sync);
    }

    legacy.addListener?.(sync);
    return () => legacy.removeListener?.(sync);
  }, []);

  const runWithViewTransition = (fn: () => void) => {
    if (prefersReducedMotion) {
      fn();
      return;
    }
    const doc = document as Document & {
      startViewTransition?: (callback: () => void) => void;
    };
    if (typeof doc.startViewTransition === "function") {
      doc.startViewTransition(fn);
      return;
    }
    fn();
  };

  const markImageLoaded = (id: string) => {
    setLoadedImages((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  };

  const markVideoFailed = (id: string) => {
    setFailedVideos((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  };

  const categories = useMemo(() => {
    const uniq = new Set<string>();
    for (const item of items) uniq.add(item.category);
    return ["All", ...Array.from(uniq).sort((a, b) => a.localeCompare(b))];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (category !== "All" && item.category !== category) return false;
      if (!q) return true;
      const haystack = [
        item.title,
        item.description,
        item.category,
        item.status,
        item.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query, category]);

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    closeBtnRef.current?.focus();
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [active]);

  const activeVideoUrl = active?.videoUrl ? normalizePublicUrl(active.videoUrl) : "";
  const activeYouTubeId = activeVideoUrl ? getYouTubeId(activeVideoUrl) : null;
  const activeVimeoId = activeVideoUrl ? getVimeoId(activeVideoUrl) : null;
  const activeIsDirectVideo = activeVideoUrl
    ? isDirectVideoFileUrl(activeVideoUrl)
    : false;
  const activeThumbnailUrl = active?.thumbnailUrl
    ? normalizePublicUrl(active.thumbnailUrl)
    : "/logo.png";

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const selected = c === category;
            return (
              <button
                key={c}
                type="button"
                onClick={() => {
                  if (c === category) return;
                  runWithViewTransition(() => {
                    setCategory(c);
                    setGridEpoch((v) => v + 1);
                  });
                }}
                className={[
                  "rounded-full px-4 py-2 text-xs tracking-wide ring-1 transition duration-300 ease-out",
                  selected
                    ? "bg-white/10 text-slate-50 ring-white/20"
                    : "bg-white/5 text-slate-200/70 ring-white/10 hover:bg-white/8 hover:text-slate-100 hover:ring-white/20",
                ].join(" ")}
              >
                {c.replaceAll("_", " ")}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-xs tracking-[0.22em] text-slate-200/50 sm:block">
            {filtered.length} WORKS
          </div>
          <div className="relative w-full sm:w-[260px]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search work…"
              className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-100 ring-1 ring-white/10 outline-none placeholder:text-slate-200/40 focus:bg-white/7 focus:ring-white/20"
            />
            {query ? (
              <button
                type="button"
                onClick={() => runWithViewTransition(() => setQuery(""))}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-white/0 px-3 py-2 text-xs tracking-wide text-slate-200/60 ring-1 ring-white/0 transition hover:bg-white/5 hover:text-slate-100 hover:ring-white/10"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="velaris-view-portfolio-grid mt-8">
        {filtered.length ? (
          <div
            key={gridEpoch}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((item, idx) => {
              const imageLoaded = Boolean(loadedImages[item.id]);
              const delayMs = Math.min(idx, 9) * 65;
              const cardVideoUrl = item.videoUrl ? normalizePublicUrl(item.videoUrl) : "";
              const cardHasDirectVideo = cardVideoUrl
                ? isDirectVideoFileUrl(cardVideoUrl)
                : false;
              const cardUseVideo =
                Boolean(cardVideoUrl) &&
                cardHasDirectVideo &&
                !failedVideos[item.id];
              const cardThumbnailUrl = item.thumbnailUrl
                ? normalizePublicUrl(item.thumbnailUrl)
                : "/logo.png";

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(item)}
                  className={[
                    "text-left",
                    prefersReducedMotion ? "" : "velaris-portfolio-enter",
                  ].join(" ")}
                  style={
                    prefersReducedMotion ? undefined : { animationDelay: `${delayMs}ms` }
                  }
                >
                  <GlowCard className="h-full p-4">
                    <div className="relative overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
                      <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_30%_20%,rgb(var(--v-cyan)_/_0.16),transparent_55%)] opacity-90" />
                      <div className="absolute inset-0 bg-[radial-gradient(520px_circle_at_80%_70%,rgb(var(--v-mint)_/_0.12),transparent_60%)] opacity-90" />
                      <div className="relative aspect-[16/10]">
                        {cardUseVideo ? (
                          <video
                            aria-hidden="true"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            poster={cardThumbnailUrl}
                            className="absolute inset-0 h-full w-full object-cover opacity-90"
                            onError={() => markVideoFailed(item.id)}
                          >
                            <source src={cardVideoUrl} type="video/mp4" />
                          </video>
                        ) : (
                          <>
                            <div
                              aria-hidden="true"
                              className={[
                                "absolute inset-0 velaris-skeleton",
                                "transition-opacity duration-700 ease-out",
                                imageLoaded ? "opacity-0" : "opacity-100",
                              ].join(" ")}
                            />
                            <Image
                              src={cardThumbnailUrl}
                              alt={item.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className={[
                                "object-cover transition-opacity duration-700 ease-out",
                                imageLoaded ? "opacity-90" : "opacity-0",
                              ].join(" ")}
                              priority={idx < 3}
                              onLoadingComplete={() => markImageLoaded(item.id)}
                            />
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs tracking-[0.28em] text-slate-200/55">
                          {item.category.replaceAll("_", " ")}
                        </div>
                        <div className="mt-2 text-lg font-semibold tracking-tight text-slate-50">
                          {item.title}
                        </div>
                      </div>
                      <div className="shrink-0 rounded-full bg-white/5 px-3 py-2 text-[11px] tracking-[0.24em] text-slate-200/60 ring-1 ring-white/10">
                        {item.status.replaceAll("_", " ")}
                      </div>
                    </div>

                    <div className="mt-3 line-clamp-3 text-sm leading-6 text-slate-200/70">
                      {item.description}
                    </div>

                    {item.tags.length ? (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {item.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-white/5 px-3 py-1.5 text-[11px] tracking-wide text-slate-100 ring-1 ring-white/10"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 4 ? (
                          <span className="rounded-full bg-white/5 px-3 py-1.5 text-[11px] tracking-wide text-slate-200/60 ring-1 ring-white/10">
                            +{item.tags.length - 4}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </GlowCard>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-2 rounded-3xl bg-white/5 px-6 py-10 text-center ring-1 ring-white/10">
            <div className="text-sm font-medium text-slate-100">
              No work matches your filter.
            </div>
            <div className="mt-2 text-sm text-slate-200/65">
              Try clearing search or selecting a different category.
            </div>
          </div>
        )}
      </div>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
        >
          <button
            type="button"
            aria-label="Close modal"
            onClick={() => setActive(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-3xl">
            <GlowCard className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs tracking-[0.28em] text-slate-200/55">
                    {active.category.replaceAll("_", " ")}
                  </div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-50">
                    {active.title}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-white/5 px-3 py-2 text-[11px] tracking-[0.24em] text-slate-200/60 ring-1 ring-white/10">
                    {active.status.replaceAll("_", " ")}
                  </div>
                  <button
                    ref={closeBtnRef}
                    type="button"
                    onClick={() => setActive(null)}
                    className="rounded-full bg-white/5 px-4 py-2 text-xs tracking-[0.24em] text-slate-100 ring-1 ring-white/10 transition hover:bg-white/10 hover:ring-white/20"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
                {activeVideoUrl && (activeYouTubeId || activeVimeoId) ? (
                  <div className="relative aspect-[16/9]">
                    <div aria-hidden="true" className="absolute inset-0 velaris-skeleton opacity-70" />
                    <iframe
                      src={
                        activeYouTubeId
                          ? `https://www.youtube-nocookie.com/embed/${activeYouTubeId}`
                          : `https://player.vimeo.com/video/${activeVimeoId}`
                      }
                      title={active.title}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : activeVideoUrl && activeIsDirectVideo ? (
                  <div className="relative aspect-[16/9]">
                    <video
                      controls
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover"
                    >
                      <source src={activeVideoUrl} />
                    </video>
                  </div>
                ) : (
                  <div className="relative aspect-[16/9]">
                    <div
                      aria-hidden="true"
                      className={[
                        "absolute inset-0 velaris-skeleton",
                        "transition-opacity duration-700 ease-out",
                        loadedImages[active.id] ? "opacity-0" : "opacity-100",
                      ].join(" ")}
                    />
                    <Image
                      src={activeThumbnailUrl}
                      alt={active.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 768px"
                      className={[
                        "object-cover transition-opacity duration-700 ease-out",
                        loadedImages[active.id] ? "opacity-95" : "opacity-0",
                      ].join(" ")}
                      onLoadingComplete={() => markImageLoaded(active.id)}
                    />
                  </div>
                )}
              </div>

              <div className="mt-5 text-sm leading-7 text-slate-200/75">
                {active.description}
              </div>

              {active.tags.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {active.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/5 px-3 py-1.5 text-[11px] tracking-wide text-slate-100 ring-1 ring-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </GlowCard>
          </div>
        </div>
      ) : null}
    </div>
  );
}
