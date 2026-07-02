import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * PUBLIC reader feed — powers the mobile app (no API key needed).
 * Only PUBLISHED articles; supports ?lang=hi & ?category=sports & ?limit=20.
 * (This is the free reading feed — full licensing data stays on /api/v1.)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const lang = searchParams.get("lang");
  const category = searchParams.get("category");
  const limit = Math.min(Number(searchParams.get("limit") ?? 20), 50);

  const [articles, categories, languages] = await Promise.all([
    prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        ...(lang ? { language: { code: lang } } : {}),
        ...(category ? { category: { slug: category } } : {}),
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
      include: { category: true, language: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.language.findMany({ where: { isActive: true } }),
  ]);

  return NextResponse.json({
    ok: true,
    categories: categories.map((c) => ({ name: c.name, slug: c.slug })),
    languages: languages.map((l) => ({ name: l.name, code: l.code })),
    articles: articles.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      body: a.body,
      coverImage: a.coverImage,
      imageIsAi: a.imageIsAi,
      category: a.category.name,
      categorySlug: a.category.slug,
      language: a.language.code,
      verified: !!a.contentHash,
      publishedAt: a.publishedAt,
    })),
  });
}
