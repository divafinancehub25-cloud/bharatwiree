# 💰 BharatWire — Business Model
> 2026-07-02 · Founder ke saath discuss karke final karna hai (prices adjustable)

---

## 1. Ek line me model

> **"News ek baar banao (AI se, sasta) → teen jagah becho (readers, agencies, AI companies)
> → aur doosron ka content bhi apne marketplace se bikwa ke commission kamao."**

Hamari asli taakat: content banane ki **lagat lagbhag zero** hai (RSS + Gemini free tier),
jabki agencies ke liye ek writer hi ₹15,000–25,000/mahina padta hai.

---

## 2. Kaun paisa dega (customer segments)

| # | Customer | Kya milta hai | Kab se |
|---|----------|---------------|--------|
| 1 | **Chhote news outlets / WordPress news sites** (PRIMARY) | Ready-made verified EN+HI national news unki site pe auto | **Pehle 90 din** — yahi pehla paisa |
| 2 | AdSense/ads (readers ke traffic se) | — | 1–3 mahine (traffic ke baad) |
| 3 | AI companies (data licensing) | Verified, rights-cleared news data | 6+ mahine (BD lagega) |
| 4 | Readers premium | Ad-free + exclusive | Baad me (pehle audience banao) |

**Sabse pehla paying customer profile:** WordPress pe chal rahi chhoti news website
(district/city portals, niche news sites) jiske paas content team nahi hai. India me aise
hazaaro hain. Unka dard: roz content chahiye, writer mehenga hai. Hamara jawab: plugin
install karo, news khud aati rahegi.

---

## 3. Pricing (suggested — final aap karo)

### B2B Agency plans (main revenue)
| Plan | Price | Kya milega |
|------|-------|------------|
| **Starter** | **₹2,999/mo** | 1 language, 3 categories, 150 articles/mo, WordPress plugin |
| **Growth** | **₹6,999/mo** | EN+HI sab categories, 500 articles/mo, plugin + portal |
| **Pro** | **₹14,999/mo** | Unlimited + API access + priority support |
| Trial | **14 din free** | Starter features — card nahi chahiye (conversion hook) |

*Pitch line: "Ek writer ki aadhi salary me poora newsroom."*

### AI licensing (baad me)
- Pay-per-fetch: **₹2–5/article** ya monthly data deal (₹25k+/mo per buyer)

### Partner marketplace
- Partner ka original content bika → partner **50–60%**, hum **40–50% commission**

### Readers
- Ads (AdSense) pehle; premium ₹99/mo baad me jab MAU aaye

---

## 4. Lagat (cost structure — abhi lagbhag muft)

| Cheez | Abhi | Scale pe |
|-------|------|----------|
| Hosting (Vercel+Neon) | ₹0 (free tier) | ₹2–4k/mo |
| AI (Gemini) | ₹0 (free tier ~250/din) | ₹2–5k/mo ya Claude |
| Domain (bharatwire.in?) | ~₹1k/saal | — |
| Legal (one-time, B2B se pehle) | ₹15–30k | — |
| Founder time | 1–2 hr/din | team baad me |

**Matlab: break-even sirf 1–2 agency customers se ho jaata hai.**

---

## 5. 90-din ka go-to-market

**Din 1–30 — Foundation (chal raha hai):**
- 900+ articles publish (SEO base) · Search Console + sitemap · AdSense apply
- Target list banao: 20 WordPress news sites (Google: "district news site", "hindi news
  portal" + chhote outlets jo WP pe hain)
- 1-page pitch + demo video (plugin install → news aana — 2 min ka demo)

**Din 31–60 — Pehli sale:**
- 20 outlets ko outreach (email/WhatsApp/call) → 14-din free trial
- Goal: **2–3 paying Starter customers** (₹6–9k MRR)
- 2–3 Publisher Partners onboard (unka original content = sellable inventory)

**Din 61–90 — Repeat & scale:**
- Goal: **8–10 agencies** (₹25–50k MRR)
- Case study banao pehle customer ka ("humne inki site ka traffic X% badhaya")
- 1–2 AI-data companies se baat shuru (LLM data vendors, AI startups)

---

## 6. Unit economics (seedha hisaab)

- 10 agencies × ₹3,000 avg = **₹30,000/mo aamdani**
- Kharcha ≈ ₹5,000/mo → **₹25,000/mo profit** (founder time ke alawa)
- 50 agencies × ₹5,000 avg = **₹2.5 lakh/mo** — tab team banegi

---

## 7. Moat (koi copy kyun nahi kar payega aasani se)

1. **Provenance/✓ Verified** infra day-1 se — retrofitting mushkil
2. **Licence ledger** — har delivery ka legal proof (agencies ko bharosa)
3. WordPress plugin ki **stickiness** — ek baar laga, hatana jhanjhat
4. Partner network — jitne partners, utna exclusive inventory, utna commission

---

## 8. Risks & fixes

| Risk | Fix |
|------|-----|
| AI-rewritten content ko B2B bechne ki legal clarity | **Lawyer se policy sign-off B2B launch se pehle** (₹15–30k) — tab tak trials free rakho |
| Gemini free limit | Paid tier sasta hai; ya Claude API |
| Agencies nahi maane | Pricing girao mat — trial badhao, case study dikhao |
| Churn | Plugin stickiness + monthly nayi categories/features |

---

## 9. Founder ke decisions (aapko final karna hai)

- [ ] Prices upar wale theek hain ya badalne hain?
- [ ] Custom domain lena hai? (bharatwire.in — ~₹1k/saal, branding ke liye strongly recommended)
- [ ] Pehle 20 target outlets ki list — aapke jaan-pehchaan ke news walon se shuru karein?
- [ ] Lawyer kab tak? (pehla paid B2B deal isi pe atka hai)
