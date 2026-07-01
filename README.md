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

## Status
Planning complete. Next: **Phase 0** — project scaffolding + database design.

## Products (one backend → many faces)
1. Reader App (iOS + Android)
2. Agency Buyer Portal (web) + **WordPress Plugin** (primary B2B delivery)
3. AI Licensing API (pay-per-fetch + revenue share)
4. Publisher Partner Console (web)
5. Admin Dashboard (web)

## Tech stack
Expo (React Native) · Next.js · PostgreSQL (Neon) · Razorpay · MSG91 · AWS S3 · C2PA.
