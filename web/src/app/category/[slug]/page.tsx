import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/ArticleCard";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const cat = await prisma.category.findUnique({ where: { slug } });
  return { title: cat ? `${cat.name} — BharatWire` : "BharatWire" };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED", categoryId: category.id },
    orderBy: { publishedAt: "desc" },
    include: { category: true, language: true },
  });

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
        <h1 className="text-2xl font-bold">{category.name}</h1>
        <p className="mt-1 text-sm text-zinc-500">{articles.length} articles</p>

        {articles.length === 0 ? (
          <p className="mt-10 text-zinc-400">No published articles in this category yet.</p>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
