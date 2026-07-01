import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Admin — BharatWire" };

export default async function AdminDashboard() {
  const [
    articleCount,
    inReviewCount,
    publishedCount,
    categoryCount,
    languageCount,
    userCount,
    buyerCount,
    rssCount,
    categories,
    languages,
    rssSources,
    users,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: "IN_REVIEW" } }),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.category.count(),
    prisma.language.count(),
    prisma.user.count(),
    prisma.buyer.count(),
    prisma.rssSource.count(),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.language.findMany(),
    prisma.rssSource.findMany(),
    prisma.user.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  return (
    <div className="min-h-full bg-zinc-50 text-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="inline-block h-5 w-1.5 rounded bg-orange-500" />
            <span className="inline-block h-5 w-1.5 rounded bg-emerald-600" />
            <span className="ml-1 font-bold">
              Bharat<span className="text-orange-600">Wire</span>
            </span>
            <span className="ml-2 rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500">
              Admin
            </span>
          </div>
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
            ← View site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Live data from your database. Phase 1 — content engine.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/sources"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
          >
            RSS Sources & Run pipeline →
          </Link>
          <Link
            href="/admin/review"
            className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
          >
            Review queue{inReviewCount > 0 ? ` (${inReviewCount})` : ""} →
          </Link>
          <Link
            href="/admin/articles"
            className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
          >
            Published articles →
          </Link>
          <Link
            href="/admin/agencies"
            className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
          >
            Agencies (B2B) →
          </Link>
          <Link
            href="/admin/ai-buyers"
            className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
          >
            AI buyers (B2AI) →
          </Link>
          <Link
            href="/admin/partners"
            className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
          >
            Partners →
          </Link>
        </div>

        {/* Stat cards */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card label="Articles" value={articleCount} hint={`${publishedCount} published`} />
          <Card label="In review" value={inReviewCount} hint="awaiting 1-click approve" accent />
          <Card label="Categories" value={categoryCount} />
          <Card label="Languages" value={languageCount} />
          <Card label="RSS sources" value={rssCount} />
          <Card label="Users" value={userCount} />
          <Card label="Buyers" value={buyerCount} hint="agencies + AI" />
          <Card label="Published" value={publishedCount} />
        </div>

        {/* Tables */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Panel title="Categories">
            <Chips items={categories.map((c) => c.name)} />
          </Panel>

          <Panel title="Languages">
            <Chips items={languages.map((l) => l.name)} />
          </Panel>

          <Panel title="RSS sources (auto-news feeds)">
            {rssSources.length === 0 ? (
              <Empty text="No feeds yet." />
            ) : (
              <ul className="divide-y divide-zinc-100">
                {rssSources.map((s) => (
                  <li key={s.id} className="flex items-center justify-between py-2 text-sm">
                    <span>
                      <span className="font-medium">{s.name}</span>
                      <span className="block text-xs text-zinc-400">{s.feedUrl}</span>
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        s.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {s.isActive ? "active" : "inactive"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Team & users">
            <ul className="divide-y divide-zinc-100">
              {users.map((u) => (
                <li key={u.id} className="flex items-center justify-between py-2 text-sm">
                  <span>
                    <span className="font-medium">{u.name ?? u.email ?? u.phone}</span>
                    <span className="block text-xs text-zinc-400">{u.email}</span>
                  </span>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                    {u.role}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <p className="mt-10 text-center text-xs text-zinc-400">
          Next up: add RSS feeds → AI writes articles → you 1-click approve → publish.
        </p>
      </main>
    </div>
  );
}

function Card({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: number;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border bg-white p-4 ${
        accent && value > 0 ? "border-orange-300 ring-1 ring-orange-100" : "border-zinc-200"
      }`}
    >
      <div className="text-2xl font-bold">{value}</div>
      <div className="mt-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      {hint && <div className="mt-1 text-xs text-zinc-400">{hint}</div>}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <span
          key={t}
          className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-700"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="py-4 text-sm text-zinc-400">{text}</p>;
}
