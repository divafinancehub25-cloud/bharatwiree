import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { approveArticle, rejectArticle } from "../actions";

export const metadata = { title: "Review — BharatWire Admin" };

export default async function ReviewPage() {
  const articles = await prisma.article.findMany({
    where: { status: "IN_REVIEW" },
    orderBy: { createdAt: "desc" },
    include: { category: true, language: true, rssSource: true },
  });

  return (
    <div className="min-h-full bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm text-zinc-500 hover:text-zinc-900">
              ← Dashboard
            </Link>
            <span className="font-bold">Review queue</span>
          </div>
          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
            {articles.length} waiting
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {articles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center">
            <p className="text-zinc-500">Review queue is empty.</p>
            <p className="mt-1 text-sm text-zinc-400">
              Go to{" "}
              <Link href="/admin/sources" className="text-orange-600 underline">
                RSS Sources
              </Link>{" "}
              and click “Run now” to generate articles.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((a) => (
              <article
                key={a.id}
                className="rounded-xl border border-zinc-200 bg-white p-5"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                  <Badge>{a.category.name}</Badge>
                  <Badge>{a.language.name}</Badge>
                  <Badge tone="ai">AI · {a.aiModel}</Badge>
                  <Badge tone="warn">{a.rights}</Badge>
                </div>
                <h2 className="text-lg font-semibold">{a.title}</h2>
                {a.excerpt && (
                  <p className="mt-1 text-sm text-zinc-600">{a.excerpt}</p>
                )}
                {a.body && (
                  <p className="mt-2 whitespace-pre-line text-sm text-zinc-700 line-clamp-6">
                    {a.body}
                  </p>
                )}
                {a.sourceUrl && (
                  <a
                    href={a.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs text-zinc-400 underline"
                  >
                    original source
                  </a>
                )}

                <div className="mt-4 flex gap-3">
                  <form action={approveArticle}>
                    <input type="hidden" name="id" value={a.id} />
                    <button className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
                      ✓ Approve & publish
                    </button>
                  </form>
                  <form action={rejectArticle}>
                    <input type="hidden" name="id" value={a.id} />
                    <button className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50">
                      ✕ Reject
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "ai" | "warn";
}) {
  const styles = {
    default: "bg-zinc-100 text-zinc-600",
    ai: "bg-indigo-50 text-indigo-700",
    warn: "bg-amber-50 text-amber-700",
  }[tone];
  return (
    <span className={`rounded-full px-2 py-0.5 font-medium ${styles}`}>{children}</span>
  );
}
