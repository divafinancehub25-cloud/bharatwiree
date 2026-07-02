# 🚀 BharatWire — Deploy Guide (go live on the internet)

The app is production-ready and committed to git. This guide takes it live on
**Vercel** (free) using your **Neon** database (already set up).

> You must do the account/login steps yourself (I can't create accounts or enter
> your passwords). Everything else — the code, build, config — is ready.

---

## Step 1 — Put the code on GitHub (easiest: GitHub Desktop)

You already have **GitHub Desktop** installed.

1. Open **GitHub Desktop** → sign in to GitHub (create a free account if needed).
2. **File → Add local repository** → choose `C:\news-platform`.
3. Click **Publish repository**.
   - Name: `bharatwire`
   - Keep **"Keep this code private"** ticked (recommended).
   - Click **Publish**.

Done — your code is now on GitHub.

---

## Step 2 — Deploy on Vercel

1. Go to **https://vercel.com** → **Sign up** with your **GitHub** account (free).
2. Click **Add New… → Project**.
3. Find and **Import** the `bharatwire` repository.
4. ⚠️ **IMPORTANT — set Root Directory to `web`**
   (click "Edit" next to Root Directory and choose the `web` folder).
   The app lives in `web/`, not the repo root.
5. Framework Preset should auto-detect **Next.js**. Leave build settings default.
6. Open **Environment Variables** and add these (copy values carefully):

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | your Neon connection string (same one in `web/.env`) |
   | `ADMIN_USER` | `admin` |
   | `ADMIN_PASSWORD` | a strong password you choose (needed to open /admin) |
   | `GEMINI_API_KEY` | your free Gemini key (optional — needed for AI article generation online) |

7. Click **Deploy**. Wait ~2 minutes.
8. You'll get a live URL like `https://bharatwire.vercel.app`. 🎉

---

## Step 3 — After first deploy

- Add one more env var: `NEXT_PUBLIC_SITE_URL` = your live URL
  (e.g. `https://bharatwire.vercel.app`) → then **Redeploy**.
  (This makes the SEO sitemap use the correct address.)
- Open `https://your-url/admin` — it will ask for the username/password you set.
- Submit `https://your-url/sitemap.xml` to **Google Search Console** so Google
  starts indexing your news.

---

## Important notes

- **AI generation online:** the free *local* AI (Ollama) only runs on your laptop,
  NOT on Vercel. For the "Run now" pipeline to work on the live site, set
  `GEMINI_API_KEY` (free). Reader pages, admin, and the buyer APIs work regardless.
- **Database:** the live site uses the **same Neon database** as your laptop, so all
  your articles/agencies/partners are already there. No re-migration needed.
- **Admin safety:** in production the admin is **locked** until `ADMIN_PASSWORD` is set —
  so it can never be left open by accident.
- **Custom domain** (e.g. bharatwire.in) can be added later in Vercel → Settings → Domains.

---

## Quick checklist
- [ ] Code on GitHub (Step 1)
- [ ] Vercel project imported with **Root Directory = web**
- [ ] Env vars added (DATABASE_URL, ADMIN_USER, ADMIN_PASSWORD, GEMINI_API_KEY)
- [ ] Deployed & got live URL
- [ ] NEXT_PUBLIC_SITE_URL set + redeploy
- [ ] Site opened & admin login works
