import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ slug: string }> };

async function getArticle(rawSlug: string) {
  // Hindi/Devanagari slugs arrive URL-encoded — decode before lookup.
  const slug = decodeURIComponent(rawSlug);
  return prisma.article.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { category: true, language: true },
  });
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return { title: "Not found — BharatWire" };
  return {
    title: `${a.metaTitle || a.title} — BharatWire`,
    description: a.metaDescription || a.excerpt || undefined,
    openGraph: {
      title: a.title,
      description: a.excerpt || undefined,
      images: a.coverImage ? [a.coverImage] : undefined,
      type: "article",
    },
  };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) notFound();

  // Google News structured data (SEO) — generated from the article fields.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: a.title,
    description: a.excerpt || undefined,
    image: a.coverImage ? [a.coverImage] : undefined,
    datePublished: a.publishedAt?.toISOString(),
    dateModified: a.updatedAt.toISOString(),
    inLanguage: a.language.code,
    articleSection: a.category.name,
    author: [{ "@type": "Organization", name: "BharatWire" }],
    publisher: { "@type": "Organization", name: "BharatWire" },
  };

  return (
    <div className="min-h-full bg-white text-zinc-900">
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
          <Link
            href={`/category/${a.category.slug}`}
            className="rounded-full bg-orange-50 px-3 py-1 font-medium text-orange-700"
          >
            {a.category.name}
          </Link>
          <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-600">
            {a.language.name}
          </span>
          {a.contentHash && (
            <span
              className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700"
              title={`Digitally signed on publish. Fingerprint: ${a.contentHash.slice(0, 16)}…`}
            >
              ✓ Verified
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold leading-tight tracking-tight">{a.title}</h1>
        {a.excerpt && <p className="mt-3 text-lg text-zinc-600">{a.excerpt}</p>}
        {a.publishedAt && (
          <p className="mt-2 text-sm text-zinc-400">
            {a.publishedAt.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}

        {a.coverImage && (
          <div className="mt-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={a.coverImage}
              alt={a.title}
              className="w-full rounded-xl border border-zinc-200"
            />
            {a.imageIsAi && (
              <p className="mt-1 text-xs text-zinc-400">🖼️ AI-generated image</p>
            )}
          </div>
        )}

        {a.body && (
          <div className="mt-6 whitespace-pre-line text-[17px] leading-8 text-zinc-800">
            {a.body}
          </div>
        )}

        {a.sourceUrl && (
          <p className="mt-8 border-t border-zinc-100 pt-4 text-sm text-zinc-400">
            Based on reporting from{" "}
            <a href={a.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
              original source
            </a>
          </p>
        )}
      </article>
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="border-b border-zinc-200">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block h-6 w-1.5 rounded bg-orange-500" />
          <span className="inline-block h-6 w-1.5 rounded bg-emerald-600" />
          <span className="ml-1 text-xl font-bold tracking-tight">
            Bharat<span className="text-orange-600">Wire</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
