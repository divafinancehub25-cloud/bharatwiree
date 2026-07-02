import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyApiKey } from "@/lib/apikey";

export const dynamic = "force-dynamic";

/**
 * Public licensing API for AGENCY / AI buyers (and the WordPress plugin).
 * Auth: header  x-api-key: bw_live_xxx
 * Returns only PUBLISHED, sellable articles (never DISPLAY_ONLY).
 * Records a licence for each article delivered to this buyer (the legal proof).
 */
export async function GET(req: NextRequest) {
  const auth = await verifyApiKey(req.headers.get("x-api-key"));
  if (!auth) {
    return NextResponse.json(
      { ok: false, error: "Invalid or missing API key" },
      { status: 401 },
    );
  }

  const { searchParams } = req.nextUrl;
  const categorySlug = searchParams.get("category");
  const languageCode = searchParams.get("language");
  const limit = Math.min(Number(searchParams.get("limit") ?? 20), 50);

  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      rights: { in: ["OWN_SELLABLE", "PARTNER_LICENSED", "AI_LICENSABLE"] },
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      ...(languageCode ? { language: { code: languageCode } } : {}),
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { category: true, language: true, partner: true },
  });

  const LICENCE_PRICE = 10000; // demo price per licence: ₹100 (in paise)

  // Record a licence for each newly delivered article (skip duplicates),
  // and split the money: partner share + platform commission.
  for (const a of articles) {
    const already = await prisma.licence.findFirst({
      where: { articleId: a.id, buyerId: auth.buyer.id },
    });
    if (already) continue;

    const licence = await prisma.licence.create({
      data: {
        articleId: a.id,
        buyerId: auth.buyer.id,
        channel: auth.buyer.type === "AI" ? "API" : "WORDPRESS",
        priceCharged: LICENCE_PRICE,
      },
    });

    if (a.partner) {
      const partnerShare = Math.round(LICENCE_PRICE * a.partner.revenueShare);
      await prisma.ledgerEntry.create({
        data: {
          type: "PARTNER_SHARE",
          amount: partnerShare,
          licenceId: licence.id,
          partnerId: a.partner.id,
        },
      });
      await prisma.ledgerEntry.create({
        data: {
          type: "PLATFORM_COMMISSION",
          amount: LICENCE_PRICE - partnerShare,
          licenceId: licence.id,
        },
      });
    } else {
      await prisma.ledgerEntry.create({
        data: { type: "PLATFORM_COMMISSION", amount: LICENCE_PRICE, licenceId: licence.id },
      });
    }
  }

  return NextResponse.json({
    ok: true,
    buyer: auth.buyer.name,
    count: articles.length,
    articles: articles.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      body: a.body,
      coverImage: a.coverImage,
      category: a.category.name,
      language: a.language.code,
      rights: a.rights,
      publishedAt: a.publishedAt,
      sourceUrl: a.sourceUrl,
      // Provenance proof: fingerprint + signed manifest (authenticity for buyers)
      contentHash: a.contentHash,
      provenance: a.provenanceManifest,
    })),
  });
}
