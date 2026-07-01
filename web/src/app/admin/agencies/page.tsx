import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { addAgency } from "../actions";
import { KeyGen } from "./KeyGen";

export const metadata = { title: "Agencies — BharatWire Admin" };

export default async function AgenciesPage() {
  const agencies = await prisma.buyer.findMany({
    where: { type: "AGENCY" },
    orderBy: { createdAt: "desc" },
    include: { apiKeys: true, _count: { select: { licences: true } } },
  });

  return (
    <div className="min-h-full bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm text-zinc-500 hover:text-zinc-900">
              ← Dashboard
            </Link>
            <span className="font-bold">Agency buyers (B2B)</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Add agency */}
        <section className="mb-8 rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Add an agency
          </h2>
          <form action={addAgency} className="grid gap-3 sm:grid-cols-3">
            <input
              name="name"
              placeholder="Agency name"
              required
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:col-span-1"
            />
            <input
              name="contactEmail"
              placeholder="Contact email (optional)"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:col-span-1"
            />
            <button className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
              + Add agency
            </button>
          </form>
          <p className="mt-3 text-xs text-zinc-500">
            After adding, generate an API key for them. They (or their WordPress plugin)
            use it to pull licensed news.
          </p>
        </section>

        {/* List */}
        <section className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Agencies ({agencies.length})
          </h2>
          {agencies.length === 0 ? (
            <p className="py-4 text-sm text-zinc-400">No agencies yet.</p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {agencies.map((ag) => (
                <li key={ag.id} className="py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-medium">{ag.name}</div>
                      <div className="text-xs text-zinc-400">
                        {ag.contactEmail || "no email"} · {ag.apiKeys.length} key(s) ·{" "}
                        {ag._count.licences} articles licensed
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      {ag.status}
                    </span>
                  </div>
                  <div className="mt-3">
                    <KeyGen buyerId={ag.id} />
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
