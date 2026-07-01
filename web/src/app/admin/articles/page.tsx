import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toggleSellable } from "../actions";

export const metadata = { title: "Articles — BharatWire Admin" };

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { category: true, language: true },
    take: 100,
  });

  return (
    <div className="min-h-full bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm text-zinc-500 hover:text-zinc-900">
              ← Dashboard
            </Link>
            <span className="font-bold">Published articles</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <p className="mb-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
          ⚖️ Only <b>Sellable</b> articles are offered to agencies/AI buyers. AI-rewritten
          content is legally borderline to resell — mark as Sellable only content you own
          or have rights to.
        </p>

        <section className="rounded-xl border border-zinc-200 bg-white p-5">
          {articles.length === 0 ? (
            <p className="py-4 text-sm text-zinc-400">No published articles yet.</p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {articles.map((a) => {
                const sellable = a.rights !== "DISPLAY_ONLY";
                return (
                  <li key={a.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{a.title}</div>
                      <div className="text-xs text-zinc-400">
                        {a.category.name} · {a.language.name}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          sellable
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        {sellable ? "Sellable" : "Display-only"}
                      </span>
                      <form action={toggleSellable}>
                        <input type="hidden" name="id" value={a.id} />
                        <button className="rounded-lg border border-zinc-300 px-3 py-1 text-xs font-medium hover:bg-zinc-50">
                          {sellable ? "Make display-only" : "Make sellable"}
                        </button>
                      </form>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
