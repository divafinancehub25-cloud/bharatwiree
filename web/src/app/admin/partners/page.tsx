import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { addPartner } from "../actions";

export const metadata = { title: "Partners — BharatWire Admin" };

function rupees(paise: number) {
  return "₹" + (paise / 100).toLocaleString("en-IN");
}

export default async function PartnersPage() {
  const partners = await prisma.publisherPartner.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      ledgerEntries: true,
      _count: { select: { articles: true } },
    },
  });

  return (
    <div className="min-h-full bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm text-zinc-500 hover:text-zinc-900">
              ← Dashboard
            </Link>
            <span className="font-bold">Publisher Partners</span>
          </div>
          <Link
            href="/partner/submit"
            className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700"
          >
            Partner submit page →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <p className="mb-6 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800">
          👥 Partners submit their own content. When it&apos;s licensed to an agency/AI buyer,
          they earn their revenue share automatically (rest is platform commission).
        </p>

        <section className="mb-8 rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Add a partner
          </h2>
          <form action={addPartner} className="grid gap-3 sm:grid-cols-2">
            <input name="name" placeholder="Partner name" required
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
            <input name="email" type="email" placeholder="Email" required
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
            <input name="outletName" placeholder="Outlet name (optional)"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
            <input name="sharePct" type="number" min="0" max="100" defaultValue="50"
              placeholder="Revenue share %"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
            <div className="sm:col-span-2">
              <button className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
                + Add partner
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Partners ({partners.length})
          </h2>
          {partners.length === 0 ? (
            <p className="py-4 text-sm text-zinc-400">No partners yet.</p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {partners.map((p) => {
                const earned = p.ledgerEntries
                  .filter((l) => l.type === "PARTNER_SHARE")
                  .reduce((s, l) => s + l.amount, 0);
                return (
                  <li key={p.id} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <div className="font-medium">
                        {p.user.name}{" "}
                        {p.outletName && (
                          <span className="text-xs text-zinc-400">· {p.outletName}</span>
                        )}
                      </div>
                      <div className="text-xs text-zinc-400">
                        {p.user.email} · {Math.round(p.revenueShare * 100)}% share ·{" "}
                        {p._count.articles} articles
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-emerald-700">{rupees(earned)}</div>
                      <div className="text-xs text-zinc-400">earned</div>
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
