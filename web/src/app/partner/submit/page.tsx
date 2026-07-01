import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { submitPartnerArticle } from "../actions";

export const metadata = { title: "Submit article — BharatWire Partners" };

type Search = { searchParams: Promise<{ ok?: string; error?: string }> };

export default async function PartnerSubmitPage({ searchParams }: Search) {
  const { ok, error } = await searchParams;
  const [categories, languages] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.language.findMany({ where: { isActive: true } }),
  ]);

  return (
    <div className="min-h-full bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-6 py-4">
          <span className="inline-block h-6 w-1.5 rounded bg-orange-500" />
          <span className="inline-block h-6 w-1.5 rounded bg-emerald-600" />
          <span className="ml-1 text-xl font-bold">
            Bharat<span className="text-orange-600">Wire</span>
          </span>
          <span className="ml-2 text-sm text-zinc-500">Partner submission</span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-2xl font-bold">Submit your article</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Approved partners only. Your article goes to review, then earns you a revenue
          share when it&apos;s licensed.
        </p>

        {ok && (
          <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
            ✓ Submitted! It&apos;s now in review.
          </div>
        )}
        {error === "notpartner" && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            That email isn&apos;t a registered/approved partner.
          </div>
        )}
        {error === "missing" && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            Please fill all fields.
          </div>
        )}

        <form action={submitPartnerArticle} className="mt-6 space-y-3">
          <input name="email" type="email" placeholder="Your partner email" required
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
          <input name="title" placeholder="Headline" required
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <select name="categoryId" required
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm">
              <option value="">Category…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select name="languageId" required
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm">
              <option value="">Language…</option>
              {languages.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
          <textarea name="body" placeholder="Write your article here…" rows={10} required
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
          <button className="rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500">
            Submit for review
          </button>
        </form>

        <p className="mt-6 text-xs text-zinc-400">
          <Link href="/" className="underline">← Back to BharatWire</Link>
        </p>
      </main>
    </div>
  );
}
