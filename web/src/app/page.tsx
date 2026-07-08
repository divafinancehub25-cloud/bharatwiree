import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/ArticleCard";

type Search = { searchParams: Promise<{ lang?: string }> };

export default async function Home({ searchParams }: Search) {
  const { lang } = await searchParams;
  const [categories, languages, latest] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.language.findMany({ where: { isActive: true } }),
    prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        ...(lang ? { language: { code: lang } } : {}),
      },
      orderBy: { publishedAt: "desc" },
      take: 12,
      include: { category: true, language: true },
    }),
  ]);

  return (
    <div className="min-h-full bg-white text-zinc-900">
      {/* Top bar */}
      <header className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="inline-block h-6 w-1.5 rounded bg-orange-500" />
            <span className="inline-block h-6 w-1.5 rounded bg-emerald-600" />
            <span className="ml-1 text-xl font-bold tracking-tight">
              Bharat<span className="text-orange-600">Wire</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <form action="/search" className="hidden sm:block">
              <input
                name="q"
                placeholder="Search…"
                className="w-44 rounded-full border border-zinc-300 px-4 py-1.5 text-sm"
              />
            </form>
            <Link
              href="/pricing"
              className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500"
            >
              For Agencies · Pricing
            </Link>
            <Link
              href="/admin"
              className="hidden rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 sm:block"
            >
              Admin →
            </Link>
          </div>
        </div>
      </header>

      {/* Language filter */}
      <div className="border-b border-zinc-100">
        <div className="mx-auto flex max-w-5xl gap-2 px-6 py-2">
          <Link
            href="/"
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              !lang ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            All
          </Link>
          {languages.map((l) => (
            <Link
              key={l.id}
              href={`/?lang=${l.code}`}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                lang === l.code
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {l.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Category nav */}
      <nav className="border-b border-zinc-100 bg-zinc-50">
        <div className="mx-auto flex max-w-5xl flex-wrap gap-2 px-6 py-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm font-medium text-zinc-700 hover:border-orange-300 hover:text-orange-700"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {latest.length === 0 ? (
          <section className="rounded-xl border border-dashed border-zinc-300 p-10 text-center">
            <h1 className="text-2xl font-bold">Abhi koi published news nahi.</h1>
            <p className="mt-2 text-zinc-500">
              Admin me jaake “Run now” chalao aur articles approve karo — yahan dikhne lagenge.
            </p>
            <Link
              href="/admin/review"
              className="mt-4 inline-block rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white"
            >
              Go to Review →
            </Link>
          </section>
        ) : (
          <>
            <h1 className="mb-1 text-2xl font-bold">Taaza Khabrein</h1>
            <p className="mb-6 text-sm text-zinc-500">
              {languages.map((l) => l.name).join("  ·  ")}
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-zinc-100 py-8 text-center text-xs text-zinc-400">
        BharatWire · Verified, regional-first news ·{" "}
        <Link href="/pricing" className="underline hover:text-orange-600">
          News agencies ke liye plans
        </Link>{" "}
        ·{" "}
        <Link href="/partner/submit" className="underline hover:text-orange-600">
          Journalist ho? Partner bano
        </Link>
      </footer>
    </div>
  );
}
