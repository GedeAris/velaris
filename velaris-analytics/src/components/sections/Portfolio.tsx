import { Reveal } from "@/components/Reveal";
import { PortfolioClient } from "./PortfolioClient";
import { listPublishedPortfolioItems } from "@/lib/db";

export async function Portfolio() {
  const items = await listPublishedPortfolioItems()
    .then((data) =>
      data.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        thumbnailUrl: item.thumbnailUrl,
        videoUrl: item.videoUrl,
        category: item.category,
        tags: item.tags,
        status: item.status,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      }))
    )
    .catch(() => []);

  return (
    <section id="portfolio" className="velaris-section relative scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal>
          <div className="max-w-2xl">
            <div className="text-xs tracking-[0.28em] text-slate-200/60">SELECTED WORKS</div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
              A portfolio that feels as calm as it is capable
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-200/70 sm:text-lg sm:leading-8">
              Filter by category, search by keywords, and open each build for a
              closer look—no clutter, just signal.
            </p>
          </div>
        </Reveal>

        <div className="mt-12">
          <Reveal delayMs={120}>
            <PortfolioClient items={items} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
