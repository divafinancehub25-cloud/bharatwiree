# News Distribution & Licensing Platform

> ⚠️ **SEPARATE PROJECT.** This lives in `C:\news-platform` and is **completely independent**
> from the unrelated apps in `C:\otg` (vehicle rental / "Diva" finance). It has its own git
> repository, its own database, and its own dependencies. Do not mix the two.

A provenance-verified news marketplace (regional/vernacular-first, India) that lets
publishers create, distribute, and **license news content to readers, news agencies, and
AI companies** — with proof of authenticity (C2PA) built into every article.

## Documents
- **[docs/PROJECT-PLAN.md](docs/PROJECT-PLAN.md)** — the full master plan (vision, products, roles,
  tech stack, monetization, phased roadmap, risks). Start here.

## Status (working & verified)
✅ Content engine (RSS → AI rewrite → 1-click review → publish, provenance-signed)
✅ Reader website (feed, article, category, search, language filter, SEO/sitemap)
✅ Agency B2B (admin, API keys, licensing API, WordPress plugin, licence ledger)
✅ AI licensing (pay-per-fetch metering) · ✅ Partner network (auto revenue share)
✅ Mobile app (Expo — see mobile/README.md to run on your phone)
✅ Production build passing · deploy guide: docs/DEPLOY.md

⏳ Pending (needs founder): Gemini API key (better AI quality), GitHub+Vercel deploy,
   Razorpay premium (later), Play Store/App Store release (later).

## Products (one backend → many faces)
1. Reader App (iOS + Android)
2. Agency Buyer Portal (web) + **WordPress Plugin** (primary B2B delivery)
3. AI Licensing API (pay-per-fetch + revenue share)
4. Publisher Partner Console (web)
5. Admin Dashboard (web)

## Tech stack
Expo (React Native) · Next.js · PostgreSQL (Neon) · Razorpay · MSG91 · AWS S3 · C2PA.
