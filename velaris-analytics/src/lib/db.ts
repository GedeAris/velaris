import { randomUUID } from "crypto";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  __velarisPrisma?: PrismaClient;
  __velarisPortfolioMemory?: PortfolioItemRecord[];
  __velarisAgreementMemory?: AgreementSubmissionRecord[];
};

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

function getDb() {
  if (!hasDatabaseUrl()) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (globalForPrisma.__velarisPrisma) {
    return globalForPrisma.__velarisPrisma;
  }

  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.__velarisPrisma = client;
  }

  return client;
}

function getMemoryPortfolioStore() {
  if (!globalForPrisma.__velarisPortfolioMemory) {
    globalForPrisma.__velarisPortfolioMemory = [];
  }
  return globalForPrisma.__velarisPortfolioMemory;
}

function getMemoryAgreementStore() {
  if (!globalForPrisma.__velarisAgreementMemory) {
    globalForPrisma.__velarisAgreementMemory = [];
  }
  return globalForPrisma.__velarisAgreementMemory;
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

type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number];
type PortfolioStatus = (typeof PORTFOLIO_STATUSES)[number];

function coercePortfolioCategory(input: string): PortfolioCategory {
  const normalized = input.trim().toUpperCase().replaceAll(" ", "_");
  if (
    (PORTFOLIO_CATEGORIES as readonly string[]).includes(normalized)
  ) {
    return normalized as PortfolioCategory;
  }
  throw new Error("Invalid portfolio category");
}

function coercePortfolioStatus(input: string): PortfolioStatus {
  const normalized = input.trim().toUpperCase().replaceAll(" ", "_");
  if ((PORTFOLIO_STATUSES as readonly string[]).includes(normalized)) {
    return normalized as PortfolioStatus;
  }
  throw new Error("Invalid portfolio status");
}

export type PortfolioItemRecord = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  category: string;
  tags: string[];
  status: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AgreementSubmissionRecord = {
  id: string;
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
  createdAt: Date;
};

type DbPortfolioItemRow = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  category: unknown;
  tags: unknown;
  status: unknown;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type DbAgreementSubmissionRow = {
  id: string;
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
  createdAt: Date;
};

export type PortfolioListItem = Awaited<
  ReturnType<typeof listPublishedPortfolioItems>
>[number];

function ensureMemoryPortfolioSeeded() {
  const store = getMemoryPortfolioStore();
  if (store.length) return;

  const now = Date.now();
  const seed = (input: Omit<PortfolioItemRecord, "createdAt" | "updatedAt"> & { createdAtOffsetMs: number }) => {
    const createdAt = new Date(now - input.createdAtOffsetMs);
    const record: PortfolioItemRecord = {
      id: input.id,
      title: input.title,
      description: input.description,
      thumbnailUrl: input.thumbnailUrl,
      videoUrl: input.videoUrl,
      category: input.category,
      tags: input.tags,
      status: input.status,
      isPublished: input.isPublished,
      createdAt,
      updatedAt: createdAt,
    };
    store.push(record);
  };

  seed({
    id: "seed-bps",
    title: "BPS Insights Dashboard",
    description: "A calm, metrics-first dashboard built for executive visibility and fast decisions.",
    thumbnailUrl: null,
    videoUrl: "/BPS.mp4",
    category: "DASHBOARD",
    tags: ["Dashboard", "Analytics", "KPI"],
    status: "LIVE",
    isPublished: true,
    createdAtOffsetMs: 1000 * 60 * 60 * 24 * 18,
  });

  seed({
    id: "seed-market",
    title: "Market Performance Analytics",
    description: "A reporting workspace that connects pipeline, revenue, and customer health into one view.",
    thumbnailUrl: null,
    videoUrl: "/Market.mp4",
    category: "ANALYTICS",
    tags: ["Analytics", "BI", "Reporting"],
    status: "LIVE",
    isPublished: true,
    createdAtOffsetMs: 1000 * 60 * 60 * 24 * 14,
  });

  seed({
    id: "seed-aftersales",
    title: "Aftersales CRM Workspace",
    description: "A CRM flow that keeps support, follow-ups, and renewals organized and measurable.",
    thumbnailUrl: null,
    videoUrl: "/aftersales.mp4",
    category: "CRM",
    tags: ["CRM", "Operations"],
    status: "LIVE",
    isPublished: true,
    createdAtOffsetMs: 1000 * 60 * 60 * 24 * 11,
  });

  seed({
    id: "seed-geomapping",
    title: "Geo Mapping Intelligence",
    description: "A location-aware view for planning territory coverage and field execution.",
    thumbnailUrl: null,
    videoUrl: "/geomapping.mp4",
    category: "ANALYTICS",
    tags: ["Geo", "Mapping", "Planning"],
    status: "PROTOTYPE",
    isPublished: true,
    createdAtOffsetMs: 1000 * 60 * 60 * 24 * 9,
  });

  seed({
    id: "seed-kpi",
    title: "KPI Monitoring Suite",
    description: "A lightweight KPI monitor with quick drilldowns and a clean signal-to-noise ratio.",
    thumbnailUrl: null,
    videoUrl: "/kpi.mp4",
    category: "DASHBOARD",
    tags: ["KPI", "Monitoring"],
    status: "LIVE",
    isPublished: true,
    createdAtOffsetMs: 1000 * 60 * 60 * 24 * 7,
  });

  seed({
    id: "seed-mayung",
    title: "Web App Delivery Preview",
    description: "A polished frontend flow focused on speed, clarity, and high-quality interactions.",
    thumbnailUrl: null,
    videoUrl: "/mayung.mp4",
    category: "WEB_APP",
    tags: ["Web App", "UI"],
    status: "INTERNAL",
    isPublished: true,
    createdAtOffsetMs: 1000 * 60 * 60 * 24 * 4,
  });
}

export async function listPublishedPortfolioItems(): Promise<
  PortfolioItemRecord[]
> {
  if (!hasDatabaseUrl()) {
    ensureMemoryPortfolioSeeded();
    return getMemoryPortfolioStore()
      .filter((item) => item.isPublished)
      .slice()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  const db = getDb();
  const items = await db.portfolioItem.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return items.map((item: DbPortfolioItemRow) => {
    const tags = Array.isArray(item.tags) ? (item.tags as string[]) : [];

    return {
      id: item.id,
      title: item.title,
      description: item.description,
      thumbnailUrl: item.thumbnailUrl ?? null,
      videoUrl: item.videoUrl ?? null,
      category: String(item.category),
      tags,
      status: String(item.status),
      isPublished: item.isPublished,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  });
}

export async function listAllPortfolioItems(): Promise<PortfolioItemRecord[]> {
  if (!hasDatabaseUrl()) {
    ensureMemoryPortfolioSeeded();
    return getMemoryPortfolioStore()
      .slice()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  const db = getDb();
  const items = await db.portfolioItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  return items.map((item: DbPortfolioItemRow) => {
    const tags = Array.isArray(item.tags) ? (item.tags as string[]) : [];

    return {
      id: item.id,
      title: item.title,
      description: item.description,
      thumbnailUrl: item.thumbnailUrl ?? null,
      videoUrl: item.videoUrl ?? null,
      category: String(item.category),
      tags,
      status: String(item.status),
      isPublished: item.isPublished,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  });
}

export async function getPortfolioItem(
  id: string
): Promise<PortfolioItemRecord | null> {
  if (!hasDatabaseUrl()) {
    ensureMemoryPortfolioSeeded();
    return getMemoryPortfolioStore().find((item) => item.id === id) ?? null;
  }
  const db = getDb();
  const item = await db.portfolioItem.findUnique({ where: { id } });
  if (!item) return null;

  const tags = Array.isArray(item.tags) ? (item.tags as string[]) : [];

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    thumbnailUrl: item.thumbnailUrl ?? null,
    videoUrl: item.videoUrl ?? null,
    category: String(item.category),
    tags,
    status: String(item.status),
    isPublished: item.isPublished,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export async function createPortfolioItem(input: {
  title: string;
  description: string;
  thumbnailUrl?: string | null;
  videoUrl?: string | null;
  category: string;
  tags: string[];
  status?: string;
  isPublished?: boolean;
}): Promise<PortfolioItemRecord> {
  const tags = input.tags.filter(Boolean).slice(0, 32);
  const category = coercePortfolioCategory(input.category);
  const status = coercePortfolioStatus(input.status ?? "LIVE");

  if (!hasDatabaseUrl()) {
    const now = new Date();
    const created: PortfolioItemRecord = {
      id: randomUUID(),
      title: input.title,
      description: input.description,
      thumbnailUrl: input.thumbnailUrl ?? null,
      videoUrl: input.videoUrl ?? null,
      category,
      tags,
      status,
      isPublished: input.isPublished ?? false,
      createdAt: now,
      updatedAt: now,
    };
    getMemoryPortfolioStore().unshift(created);
    return created;
  }

  const db = getDb();
  const created = await db.portfolioItem.create({
    data: {
      title: input.title,
      description: input.description,
      thumbnailUrl: input.thumbnailUrl ?? null,
      videoUrl: input.videoUrl ?? null,
      category,
      tags,
      status,
      isPublished: input.isPublished ?? false,
    },
  });

  const outTags = Array.isArray(created.tags) ? (created.tags as string[]) : [];

  return {
    id: created.id,
    title: created.title,
    description: created.description,
    thumbnailUrl: created.thumbnailUrl ?? null,
    videoUrl: created.videoUrl ?? null,
    category: String(created.category),
    tags: outTags,
    status: String(created.status),
    isPublished: created.isPublished,
    createdAt: created.createdAt,
    updatedAt: created.updatedAt,
  };
}

export async function updatePortfolioItem(
  id: string,
  input: {
    title?: string;
    description?: string;
    thumbnailUrl?: string | null;
    videoUrl?: string | null;
    category?: string;
    tags?: string[];
    status?: string;
    isPublished?: boolean;
  }
): Promise<PortfolioItemRecord> {
  if (!hasDatabaseUrl()) {
    const store = getMemoryPortfolioStore();
    const idx = store.findIndex((item) => item.id === id);
    if (idx === -1) {
      throw new Error("Portfolio item not found");
    }

    const prev = store[idx];
    const next: PortfolioItemRecord = {
      ...prev,
      title: input.title ?? prev.title,
      description: input.description ?? prev.description,
      thumbnailUrl:
        input.thumbnailUrl === undefined ? prev.thumbnailUrl : input.thumbnailUrl,
      videoUrl: input.videoUrl === undefined ? prev.videoUrl : input.videoUrl,
      category: input.category ? coercePortfolioCategory(input.category) : prev.category,
      tags: input.tags ? input.tags.filter(Boolean).slice(0, 32) : prev.tags,
      status: input.status ? coercePortfolioStatus(input.status) : prev.status,
      isPublished: input.isPublished ?? prev.isPublished,
      updatedAt: new Date(),
    };

    store[idx] = next;
    return next;
  }

  const db = getDb();
  const updated = await db.portfolioItem.update({
    where: { id },
    data: {
      title: input.title,
      description: input.description,
      thumbnailUrl: input.thumbnailUrl,
      videoUrl: input.videoUrl,
      category: input.category
        ? coercePortfolioCategory(input.category)
        : undefined,
      tags: input.tags ? input.tags.filter(Boolean).slice(0, 32) : undefined,
      status: input.status ? coercePortfolioStatus(input.status) : undefined,
      isPublished: input.isPublished,
    },
  });

  const outTags = Array.isArray(updated.tags) ? (updated.tags as string[]) : [];

  return {
    id: updated.id,
    title: updated.title,
    description: updated.description,
    thumbnailUrl: updated.thumbnailUrl ?? null,
    videoUrl: updated.videoUrl ?? null,
    category: String(updated.category),
    tags: outTags,
    status: String(updated.status),
    isPublished: updated.isPublished,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
}

export async function deletePortfolioItem(id: string) {
  if (!hasDatabaseUrl()) {
    const store = getMemoryPortfolioStore();
    const next = store.filter((item) => item.id !== id);
    globalForPrisma.__velarisPortfolioMemory = next;
    return;
  }
  const db = getDb();
  await db.portfolioItem.delete({ where: { id } });
}

export async function listAgreementSubmissions(): Promise<
  AgreementSubmissionRecord[]
> {
  if (hasDatabaseUrl()) {
    try {
      const db = getDb();
      const items = await db.agreementSubmission.findMany({
        orderBy: { createdAt: "desc" },
      });

      return items.map((item: DbAgreementSubmissionRow) => ({
        id: item.id,
        clientName: item.clientName,
        companyName: item.companyName,
        email: item.email,
        whatsapp: item.whatsapp,
        projectName: item.projectName ?? null,
        agreedPaymentTerms: item.agreedPaymentTerms,
        understoodScopeChangeImpact: item.understoodScopeChangeImpact,
        signatureName: item.signatureName,
        approvedProceed: item.approvedProceed,
        signedDate: item.signedDate,
        createdAt: item.createdAt,
      }));
    } catch {
      return getMemoryAgreementStore()
        .slice()
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
  }

  return getMemoryAgreementStore()
    .slice()
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getAgreementSubmission(
  id: string
): Promise<AgreementSubmissionRecord | null> {
  if (hasDatabaseUrl()) {
    try {
      const db = getDb();
      const item = await db.agreementSubmission.findUnique({ where: { id } });
      if (!item) return null;

      return {
        id: item.id,
        clientName: item.clientName,
        companyName: item.companyName,
        email: item.email,
        whatsapp: item.whatsapp,
        projectName: item.projectName ?? null,
        agreedPaymentTerms: item.agreedPaymentTerms,
        understoodScopeChangeImpact: item.understoodScopeChangeImpact,
        signatureName: item.signatureName,
        approvedProceed: item.approvedProceed,
        signedDate: item.signedDate,
        createdAt: item.createdAt,
      };
    } catch {
      return getMemoryAgreementStore().find((s) => s.id === id) ?? null;
    }
  }

  return getMemoryAgreementStore().find((s) => s.id === id) ?? null;
}

export async function createAgreementSubmission(input: {
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
}): Promise<AgreementSubmissionRecord> {
  if (hasDatabaseUrl()) {
    try {
      const db = getDb();
      const created = await db.agreementSubmission.create({
        data: {
          clientName: input.clientName,
          companyName: input.companyName,
          email: input.email,
          whatsapp: input.whatsapp,
          projectName: input.projectName ?? null,
          agreedPaymentTerms: input.agreedPaymentTerms,
          understoodScopeChangeImpact: input.understoodScopeChangeImpact,
          signatureName: input.signatureName,
          approvedProceed: input.approvedProceed,
          signedDate: input.signedDate,
        },
      });

      return {
        id: created.id,
        clientName: created.clientName,
        companyName: created.companyName,
        email: created.email,
        whatsapp: created.whatsapp,
        projectName: created.projectName ?? null,
        agreedPaymentTerms: created.agreedPaymentTerms,
        understoodScopeChangeImpact: created.understoodScopeChangeImpact,
        signatureName: created.signatureName,
        approvedProceed: created.approvedProceed,
        signedDate: created.signedDate,
        createdAt: created.createdAt,
      };
    } catch {
      const now = new Date();
      const created: AgreementSubmissionRecord = {
        id: randomUUID(),
        clientName: input.clientName,
        companyName: input.companyName,
        email: input.email,
        whatsapp: input.whatsapp,
        projectName: input.projectName ?? null,
        agreedPaymentTerms: input.agreedPaymentTerms,
        understoodScopeChangeImpact: input.understoodScopeChangeImpact,
        signatureName: input.signatureName,
        approvedProceed: input.approvedProceed,
        signedDate: input.signedDate,
        createdAt: now,
      };
      getMemoryAgreementStore().unshift(created);
      return created;
    }
  }

  const now = new Date();
  const created: AgreementSubmissionRecord = {
    id: randomUUID(),
    clientName: input.clientName,
    companyName: input.companyName,
    email: input.email,
    whatsapp: input.whatsapp,
    projectName: input.projectName ?? null,
    agreedPaymentTerms: input.agreedPaymentTerms,
    understoodScopeChangeImpact: input.understoodScopeChangeImpact,
    signatureName: input.signatureName,
    approvedProceed: input.approvedProceed,
    signedDate: input.signedDate,
    createdAt: now,
  };
  getMemoryAgreementStore().unshift(created);
  return created;
}
