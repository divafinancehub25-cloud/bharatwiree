import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { addAiBuyer } from "../actions";
import { KeyGen } from "../agencies/KeyGen";

export const metadata = { title: "AI Buyers — BharatWire Admin" };

export default async function AiBuyersPage() {
  const buyers = await prisma.buyer.findMany({
    where: { type: "AI" },
    orderBy: { createdAt: "desc" },
    include: { apiKeys: true, _count: { select: { licences: true } } },
  });

  const totalFetches = buyers.reduce(
    (sum, b) => sum + b.apiKeys.reduce((s, k) => s + k.requestCount, 0),
    0,
  );

  return (
    <div className="min-h-full bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm text-zinc-500 hover:text-zinc-900">
              ← Dashboard
            </Link>
            <span className="font-bold">AI buyers (B2AI)</span>
          </div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            {totalFetches} total fetches (billable)
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <p className="mb-6 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-800">
          🤖 AI companies pull licensed news via the API. Each fetch is metered
          (pay-per-fetch, TollBit-style). Only sellable / AI-licensable articles are served.
        </p>

        <section className="mb-8 rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Add an AI buyer
          </h2>
          <form action={addAiBuyer} className="grid gap-3 sm:grid-cols-3">
            <input
              name="name"
              placeholder="AI company name"
              required
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
            <input
              name="contactEmail"
              placeholder="Contact email (optional)"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
            <button className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              + Add AI buyer
            </button>
          </form>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            AI buyers ({buyers.length})
          </h2>
          {buyers.length === 0 ? (
            <p className="py-4 text-sm text-zinc-400">No AI buyers yet.</p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {buyers.map((b) => {
                const fetches = b.apiKeys.reduce((s, k) => s + k.requestCount, 0);
                return (
                  <li key={b.id} className="py-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="font-medium">{b.name}</div>
                        <div className="text-xs text-zinc-400">
                          {b.contactEmail || "no email"} · {b.apiKeys.length} key(s) ·{" "}
                          {b._count.licences} articles licensed
                        </div>
                      </div>
                      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                        {fetches} fetches
                      </span>
                    </div>
                    <div className="mt-3">
                      <KeyGen buyerId={b.id} />
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
