import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { aiProvider } from "@/lib/ai";
import { addSource, toggleSource, runPipelineAction } from "../actions";

export const metadata = { title: "RSS Sources — BharatWire Admin" };

export default async function SourcesPage() {
  const [sources, categories, languages] = await Promise.all([
    prisma.rssSource.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.language.findMany({ where: { isActive: true } }),
  ]);
  const provider = aiProvider();

  return (
    <div className="min-h-full bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm text-zinc-500 hover:text-zinc-900">
              ← Dashboard
            </Link>
            <span className="font-bold">RSS Sources</span>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            AI engine: {provider.name} · {provider.model}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Run pipeline */}
        <section className="mb-8 rounded-xl border border-orange-200 bg-orange-50 p-5">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold">Run the pipeline now</h2>
              <p className="mt-1 text-sm text-zinc-600">
                Fetch latest news from active feeds → AI writes original articles →
                they appear in <b>Review</b> for your approval.
              </p>
            </div>
            <form action={runPipelineAction}>
              <button className="whitespace-nowrap rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700">
                ▶ Run now
              </button>
            </form>
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Note: local AI is slow — a run can take 1–3 minutes. Please wait.
          </p>
        </section>

        {/* Add source */}
        <section className="mb-8 rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Add a news feed
          </h2>
          <form action={addSource} className="grid gap-3 sm:grid-cols-2">
            <input
              name="name"
              placeholder="Feed name (e.g. BBC News)"
              required
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
            <input
              name="feedUrl"
              placeholder="RSS URL (https://...)"
              required
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
            <select
              name="categoryId"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            >
              <option value="">Default category…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              name="languageId"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            >
              <option value="">Default language…</option>
              {languages.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
            <div className="sm:col-span-2">
              <button className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
                + Add feed
              </button>
            </div>
          </form>
        </section>

        {/* Sources list */}
        <section className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Feeds ({sources.length})
          </h2>
          {sources.length === 0 ? (
            <p className="py-4 text-sm text-zinc-400">No feeds yet.</p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {sources.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <div className="font-medium">{s.name}</div>
                    <div className="truncate text-xs text-zinc-400">{s.feedUrl}</div>
                    {s.lastFetchedAt && (
                      <div className="text-xs text-zinc-400">
                        Last fetched: {s.lastFetchedAt.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        s.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {s.isActive ? "active" : "inactive"}
                    </span>
                    <form action={toggleSource}>
                      <input type="hidden" name="id" value={s.id} />
                      <button className="rounded-lg border border-zinc-300 px-3 py-1 text-xs font-medium hover:bg-zinc-50">
                        {s.isActive ? "Turn off" : "Turn on"}
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
