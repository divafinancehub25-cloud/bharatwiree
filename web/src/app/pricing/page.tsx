import Link from "next/link";
import { requestTrial } from "./actions";

export const metadata = {
  title: "Pricing — BharatWire | News content for your website",
  description:
    "Ready-made verified English + Hindi news for your news website. WordPress plugin, API access. Plans from ₹2,999/month. 14-day free trial.",
};

type Search = { searchParams: Promise<{ ok?: string; error?: string }> };

const PLANS = [
  {
    name: "Starter",
    price: "₹2,999",
    tagline: "Chhoti news site ke liye",
    features: [
      "1 language (English ya Hindi)",
      "3 categories",
      "150 articles / month",
      "WordPress plugin included",
      "✓ Verified provenance stamp",
    ],
    highlight: false,
  },
  {
    name: "Growth",
    price: "₹6,999",
    tagline: "Sabse popular",
    features: [
      "English + Hindi dono",
      "Saari categories",
      "500 articles / month",
      "WordPress plugin + web portal",
      "✓ Verified provenance stamp",
      "Priority email support",
    ],
    highlight: true,
  },
  {
    name: "Pro",
    price: "₹14,999",
    tagline: "Agencies & networks ke liye",
    features: [
      "Unlimited articles",
      "Full API access (automation)",
      "Multiple sites / seats",
      "Licence ledger & usage reports",
      "Priority support",
    ],
    highlight: false,
  },
];

export default async function PricingPage({ searchParams }: Search) {
  const { ok, error } = await searchParams;

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
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
            ← News padhein
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pt-14 pb-8 text-center">
        <p className="mb-3 inline-block rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
          For news websites & agencies
        </p>
        <h1 className="text-4xl font-bold tracking-tight">
          Aapki news website ke liye <span className="text-orange-600">ready-made content</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600">
          Verified English + Hindi national news — seedha aapki WordPress site me, roz,
          automatically. <b>Ek writer ki aadhi salary me poora newsroom.</b>
        </p>
      </section>

      {/* Plans */}
      <section className="mx-auto max-w-5xl px-6 pb-12">
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl border p-6 ${
                p.highlight
                  ? "border-orange-400 shadow-lg ring-2 ring-orange-100"
                  : "border-zinc-200"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange-600 px-3 py-0.5 text-xs font-bold text-white">
                  POPULAR
                </span>
              )}
              <h2 className="text-lg font-bold">{p.name}</h2>
              <p className="text-xs text-zinc-500">{p.tagline}</p>
              <div className="mt-3">
                <span className="text-3xl font-extrabold">{p.price}</span>
                <span className="text-sm text-zinc-500"> /month</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-emerald-600">✓</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href="#trial"
                className={`mt-6 block rounded-full px-4 py-2.5 text-center text-sm font-semibold ${
                  p.highlight
                    ? "bg-orange-600 text-white hover:bg-orange-500"
                    : "border border-zinc-300 text-zinc-800 hover:bg-zinc-50"
                }`}
              >
                14 din FREE trial lo
              </a>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-zinc-400">
          Sabhi plans me: content aapki site pe draft ya auto-publish · licence record har
          article ka · koi setup fee nahi · kabhi bhi cancel karo.
        </p>
      </section>

      {/* Trial form */}
      <section id="trial" className="border-t border-zinc-100 bg-zinc-50 py-14">
        <div className="mx-auto max-w-xl px-6">
          <h2 className="text-center text-2xl font-bold">
            14 din ka <span className="text-orange-600">free trial</span> shuru karein
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-500">
            Koi card nahi chahiye. Form bharo — hum 24 ghante me contact karke aapki
            WordPress site pe setup kara denge.
          </p>

          {ok && (
            <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-center text-sm font-medium text-emerald-800">
              ✓ Dhanyavaad! Aapki request mil gayi — hum 24 ghante me contact karenge.
            </div>
          )}
          {error && (
            <div className="mt-6 rounded-xl bg-red-50 p-4 text-center text-sm text-red-700">
              Outlet ka naam aur email dono zaroori hain.
            </div>
          )}

          {!ok && (
            <form action={requestTrial} className="mt-8 space-y-3">
              <input
                name="outlet"
                required
                placeholder="Aapki news site / outlet ka naam *"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email *"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="website"
                  placeholder="Website (optional)"
                  className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm"
                />
                <input
                  name="phone"
                  placeholder="Phone/WhatsApp (optional)"
                  className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm"
                />
              </div>
              <button className="w-full rounded-full bg-orange-600 px-6 py-3 text-sm font-bold text-white hover:bg-orange-500">
                Free trial request karo →
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="border-t border-zinc-100 py-8 text-center text-xs text-zinc-400">
        BharatWire · Verified, regional-first news · <Link href="/" className="underline">Home</Link>
      </footer>
    </div>
  );
}
