import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

// Change this to your real domain when you go live.
const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
      take: 1000,
    }),
    prisma.category.findMany({ select: { slug: true } }),
  ]);

  return [
    { url: BASE, changeFrequency: "hourly", priority: 1 },
    ...categories.map((c) => ({
      url: `${BASE}/category/${c.slug}`,
      changeFrequency: "hourly" as const,
      priority: 0.7,
    })),
    ...articles.map((a) => ({
      url: `${BASE}/news/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
  ];
}
