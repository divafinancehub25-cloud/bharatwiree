# 📰 News Distribution & Licensing Platform — Master Plan

> Working title: **(to be decided — e.g. "BharatWire", "KhabarHub", "VeriNews")**
> Last updated: 2026-06-22
> Owner: Founder (non-technical)
> Build partner: Claude Code

---

## 1. One-line vision

> A **provenance-verified news marketplace** that lets India's regional & independent
> publishers create, distribute, and **license news content — to readers, to other news
> agencies, AND to AI companies — with proof of authenticity built into every article.**

We are not building "another news app." We are building the **trust + licensing layer**
for Indian (regional-first) news that the global market is racing to build, and which
nobody has built for India's vernacular long tail.

---

## 2. Why this is unique (the market shift we're riding)

- **AI companies are the new high-value buyer.** OpenAI alone has 24+ publisher deals
  (News Corp = $250M / 5 yrs). Platforms like **ProRata** (50/50 revenue share) and
  **TollBit / Cloudflare Pay-Per-Crawl** (AI bots pay per fetch) prove the model.
  No one is doing this for **Indian regional news**.
- **Regional/vernacular is the growth engine.** Hindi + regional news grows **6–8×
  faster** than English; ~536M non-English internet users; a **$27B underserved market**.
- **Authenticity is becoming law.** **C2PA "Content Credentials"** (ISO standard)
  cryptographically sign each article. EU AI Act enforcement starts **Aug 2026**.
  AI buyers and serious agencies will only pay for **verified, rights-cleared** content.

**Our 5 differentiators**
1. Third buyer type: **AI companies** (pay-per-crawl + revenue share).
2. **C2PA provenance** on every article = "verified & rights-cleared" badge.
3. **Regional/vernacular-first** (target the underserved high-growth gap).
4. **Rights ledger / automated licensing** (solves the legal problem AND is the product).
5. **Dual-layer delivery**: human reader app + machine-optimized API feed for AI agents.

---

## 3. ⚠️ Legal foundation (non-negotiable design rule)

Indian copyright law (reaffirmed Feb 2026, Delhi HC, *Associated Broadcasting v. Google*):
- **Own original content** → we own it → **sellable / AI-licensable**. ✅
- **Aggregated content** (RSS, other agencies, news APIs) → we do **NOT** own it.
  Credit ≠ permission. Reselling it = infringement. ❌
  → Used **display-only** in the reader app (headline + summary + "read at source" link).
- Every article is tagged with a **machine-readable rights status**:
  `OWN_SELLABLE` · `PARTNER_LICENSED` · `DISPLAY_ONLY` · `AI_LICENSABLE`.
- The system **physically prevents** selling/AI-licensing anything not marked sellable.
- **Action item (founder):** lawyer to review Terms, partner agreements, and AI-licensing
  contracts before first paid B2B/B2AI deal.
- **AI-rewrite rule:** AI must rewrite from **multiple sources into genuinely new wording**
  (facts aren't copyrightable; close copying is). Output goes to **review (1-click approve)**,
  not straight to publish — a human safety gate before anything becomes sellable.
- **AI-image rule:** AI cover images carry an **"AI-generated" label** (EU AI Act / C2PA).
  Never fabricate a photo of a real event/person — AI images are symbolic only; for real
  events use the source's credited photo.

---

## 4. The products (one backend + one database → many faces)

| # | Product | Audience | Platform |
|---|---------|----------|----------|
| 1 | Reader App | General public (free + premium) | iOS + Android |
| 2 | Agency Buyer Portal | Other news agencies (browse + manage subscription) | Web |
| 2b | **Agency WordPress Plugin** (PRIMARY delivery) | Other news agencies (most run WordPress) | WP plugin on their own site |
| 3 | AI Licensing Feed/API | AI companies / LLM crawlers | API (pay-per-fetch + rev-share) |
| 4 | Publisher Partner Console | Independent journalists / small outlets | Web |
| 5 | Admin Dashboard | Super Admin, Admin, Editor | Web |

---

## 5. Roles

**Internal:** Super Admin → Admin → Editor → (in-house) Journalist.
**External:**
- **Reader** — public; free + premium subscription.
- **Publisher Partner** — contributes content, earns revenue share when licensed.
- **Agency Buyer** — licenses content (approved by Super Admin).
- **AI Buyer** — API/crawler access, billed per-fetch or revenue-share.

---

## 6. Technology stack (2026, India-first, hireable)

| Layer | Choice | Why |
|-------|--------|-----|
| Mobile (iOS+Android) | **Expo (React Native)** | Officially recommended for new RN apps; OTA updates; one codebase. |
| Backend + APIs | **Next.js** | Shared logic with web; existing team familiarity. |
| Web portals (buyer/partner/admin) | **Next.js (web)** | Same backend, fast. |
| Database | **PostgreSQL (Neon)** | Reliable; already in use. |
| Payments | **Razorpay Subscriptions** | UPI AutoPay + cards; dunning; India-first. |
| OTP / SMS | **MSG91** | Already integrated. |
| Media storage | **AWS S3** | Article images/assets. |
| Provenance | **C2PA Content Credentials** (signing on publish) | Authenticity + AI-licensing readiness. |
| Search | Postgres full-text → (later) dedicated search | Browse by category/language/date. |
| AI rewriting | **Claude API** | Turns RSS news into original, sellable articles (no manual writing). |
| AI images | Image-generation service | Auto cover images, labelled "AI-generated". |
| Scheduling | Cron / scheduled jobs | Pulls RSS feeds on a timer and runs the pipeline. |

**Fresh project** in `C:\news-platform` — kept separate from the unrelated apps in `C:\otg`.
NOTE: per AGENTS.md, the Next.js in `C:\otg` is a customized fork; the new project will use
a clean, standard setup and we will read the installed Next.js docs before coding.

---

## 7. Core data model (high level — detailed in Phase 0)

- **User** (role, language pref, auth)
- **Article** (title, body, language, category, status, rights_status, provenance_manifest,
  author/partner, prices)
- **Category** & **Language**
- **Subscription** (reader plans, agency plans) + **Plan**
- **Agency** / **AIBuyer** (approval status, API keys, rate limits)
- **Licence** (who licensed which article, when, terms, watermark/record) — the legal proof
- **PayoutLedger** (partner revenue shares, platform commission)
- **AuditLog** (every publish/approve/licence action)

---

## 8. Features by product

**Reader App** — categories; English/Hindi/regional toggle; free + premium (paywall);
search, bookmarks, share; phone-OTP login; breaking-news push; Razorpay premium.

**Agency Buyer Portal** — signup → admin approval; browse sellable catalog; subscription
tiers (category bundle / volume / seats); licensed download w/ watermark + licence record;
usage dashboard + invoices; **generate API key + download the WordPress plugin.**

**Agency WordPress Plugin (PRIMARY B2B delivery)** — agency installs our plugin on their
WordPress site, pastes their API key, selects subscribed categories/languages. Licensed
articles auto-flow into their WordPress (full text + images + attribution + C2PA stamp),
landing as **DRAFT by default** (configurable to auto-publish). Built on the WordPress REST
API; every imported article is recorded in the licence ledger. (Standard proven pattern via
WP REST API — but uniquely handling paid/licensed content + provenance.)

**AI Licensing API** — API keys; machine-readable feed of `AI_LICENSABLE` content with
provenance; per-fetch metering (TollBit-style) and/or revenue share (ProRata-style);
billing + usage analytics.

**Publisher Partner Console** — apply/onboard; submit articles (→ editor review); see
licensing performance; revenue-share earnings + payout history.

**Admin Dashboard** — content workflow (write → editor approve → publish + sign with C2PA);
tag rights status; manage categories/languages/users/agencies/AI buyers/partners; pricing &
plans; revenue + payout ledger; aggregation feed settings; audit trail.

---

## 8b. Automated content pipeline (RSS → AI → image → SEO → review → publish)

No manual writing required. A scheduled job runs this for each active RSS source:

```
1. FETCH    pull new items from RSS feeds (RssSource table), skip duplicates
2. REWRITE  Claude reads the item (ideally cross-checks 2+ sources) and writes an
            ORIGINAL article in the chosen language → marked contentSource = RSS_AI
3. IMAGE    generate a symbolic AI cover image (labelled "AI-generated"); if the source
            has a credited photo for a real event, use that instead
4. SEO      auto-fill metaTitle / metaDescription + NewsArticle structured data + sitemap
5. REVIEW   save as IN_REVIEW (NOT auto-published) → staff click "Approve" → PUBLISHED
6. RIGHTS   AI-rewritten originals become OWN_SELLABLE; raw/uncertain items stay DISPLAY_ONLY
```

**Why the review gate:** it's the safety check that keeps you legally clean and stops bad/
wrong news going live — without needing a full manual editor. (Can be switched to auto-publish
per category later, once you trust the pipeline.)

**SEO delivered:** per-article meta tags, Google-News `NewsArticle` structured data, auto
`sitemap.xml`, fast server-rendered pages, clean URLs, and social share cards — the full
"top-level SEO" package, handled automatically by Next.js.

---

## 9. Monetization (4 streams)

1. **B2C** — reader premium subscriptions (e.g. ₹99/mo, ₹999/yr).
2. **B2B** — news-agency subscriptions (category bundles / volume / seats).
3. **B2AI** — AI-company licensing: pay-per-fetch + revenue share. *(highest upside)*
4. **Marketplace commission** — platform cut on every partner licence/payout.

---

## 10. Phased roadmap (build incrementally — do NOT build all at once)

> Timeline is indicative for one focused build stream.

- **Phase 0 — Foundation (Wk 1–2):** fresh project, DB design, auth, roles,
  **provenance + rights-ledger scaffolding from day 1.**
- **Phase 1 — Admin + Content Engine (Wk 3–5):** write→approve→publish workflow,
  categories/languages, C2PA signing, rights tagging, audit log.
- **Phase 1b — Automated pipeline (Wk 5–7):** RSS sources, AI rewriting (Claude), AI image
  generation, auto-SEO, and the 1-click review queue. **← Content flows in automatically.**
- **Phase 2 — Reader App MVP (Wk 6–9):** browse, read, categories, regional language,
  OTP login, push. **← First public launch.**
- **Phase 3 — Reader Premium (Wk 10–11):** paywall + Razorpay B2C subscriptions.
  (Mind Apple/Google in-app billing rules for consumer digital subscriptions.)
- **Phase 4 — Publisher Partner network (Wk 12–14):** onboarding, submission, revenue-share
  ledger. **← Content volume scales.**
- **Phase 5 — Agency Buyer Portal + WordPress Plugin (Wk 15–18):** approval, catalog, B2B
  subscriptions, API keys, licensed downloads, **and the WordPress plugin that auto-delivers
  licensed articles into the agency's WP site.** **← First B2B revenue.**
- **Phase 6 — AI Licensing API (Wk 19–22):** machine feed, per-fetch metering, rev-share,
  billing. **← B2AI upside switches on.**
- **Phase 7 — Aggregation engine (Wk 23–24):** licensed feed ingestion for DISPLAY_ONLY.

---

## 11. Rough running costs (India)

| Item | Approx |
|------|--------|
| Hosting (Vercel/Neon/S3) | ₹2k–8k/mo to start |
| Razorpay | ~2.99% + GST per txn |
| News aggregation API | free tier → ₹4k–40k/mo |
| Claude API (AI rewriting) | per-article cost; scales with volume (≈ a few ₹/article) |
| AI image generation | per-image cost; scales with volume |
| Apple Developer | $99/yr |
| Google Play | $25 one-time |
| MSG91 SMS | pay per SMS |
| Legal review | one-time, before B2B/B2AI launch |

---

## 12. Success metrics (KPIs)

- Readers (MAU), premium conversion %.
- Original articles published / week; partners onboarded.
- Agency subscribers; AI fetches & licensing revenue; partner payouts.

---

## 13. Top risks & mitigations

1. **Legal (resale of aggregated content)** → strict rights-status separation; lawyer review.
2. **App Store billing rules** (15–30% on consumer digital subs) → design paywall carefully;
   B2B/B2AI/web billing via Razorpay is unaffected.
3. **Scope (5 products)** → strict phasing; launch reader app early.
4. **Content volume** → Publisher Partner network + regional focus instead of huge newsroom.
5. **AI-buyer business development is hard** → build the layer, but treat B2AI revenue as
   later-phase upside, not launch dependency.

---

## 14. Immediate next steps

1. Founder: pick a product name; create Apple, Google Play, Razorpay accounts (when needed).
2. Claude: **Phase 0** — scaffold fresh project + design the database schema (incl. rights
   ledger + provenance fields) for founder review.
3. Then Phase 1 (admin + content engine).

---

## Sources
- OpenAI publisher deals — https://llmpulse.ai/blog/openai-publisher-deals/
- AI content licensing (Jun 2026) — https://mediaandthemachine.substack.com/p/ai-content-licensing-deals-june-2026
- TollBit vs ProRata — https://mediacopilot.ai/ai-revenue-platforms-comparison/
- AI tollbooths (Brookings) — https://www.brookings.edu/articles/same-gatekeepers-new-tollbooths-in-the-ai-content-licensing-market/
- C2PA provenance 2026 — https://editorsweblog.org/2026/03/28/ai-watermarking-standards-c2pa-content-credentials-provenance
- India regional news growth — https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2026/india
- Razorpay Subscriptions — https://razorpay.com/subscriptions/
- Expo + Next.js — https://docs.expo.dev/guides/using-nextjs/
- Delhi HC copyright — https://www.managingip.com/article/2gamq1iivdq3tgxnr5xj4/sponsored-content/digital-news-reporting-and-copyright-law-delhi-court-addresses-key-issues
