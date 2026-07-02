import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/ArticleCard";

export const metadata = { title: "Search — BharatWire" };

type Search = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Search) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const results = query
    ? await prisma.article.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { excerpt: { contains: query, mode: "insensitive" } },
            { body: { contains: query, mode: "insensitive" } },
          ],
        },
        orderBy: { publishedAt: "desc" },
        take: 30,
        include: { category: true, language: true },
      })
    : [];

  return (
    <div className="min-h-full bg-white text-zinc-900">
      <header className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-block h-6 w-1.5 rounded bg-orange-500" />
            <span className="inline-block h-6 w-1.5 rounded bg-emerald-600" />
            <span className="ml-1 text-xl font-bold tracking-tight">
              Bharat<span className="text-orange-600">Wire</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <form action="/search" className="flex gap-2">
          <input
            name="q"
            defaultValue={query}
            placeholder="Khabar dhoondhein… / Search news…"
            className="w-full rounded-full border border-zinc-300 px-5 py-2.5 text-sm"
            autoFocus
          />
          <button className="rounded-full bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-500">
            Search
          </button>
        </form>

        {query && (
          <p className="mt-6 text-sm text-zinc-500">
            {results.length} result(s) for “{query}”
          </p>
        )}

        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </main>
    </div>
  );
}
