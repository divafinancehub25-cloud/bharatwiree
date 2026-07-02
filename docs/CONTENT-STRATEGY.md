# 📰 BharatWire — Content Strategy
> Decided 2026-07-02 with founder: **1–2 hrs/day · English primary + Hindi secondary · Pan-India national news**

---

## 1. Positioning (kya alag hai hum me)

National English news me competition bahut hai (TOI, NDTV, HT...). Hum unse
**news me nahi, MODEL me** jeetenge:

1. **Speed + volume via AI** — RSS se story aate hi Gemini original article likhta hai;
   1-click approve; minutes me live.
2. **"✓ Verified" provenance** — har article cryptographically signed. Ye badge hamara
   brand hai (koi aur Indian outlet ye nahi karta).
3. **B2B licensing** — readers se pehle paisa **agencies/AI buyers** se aayega.
   Chhote outlets jo khud content nahi bana sakte, unko ready-made verified English+Hindi
   national coverage chahiye — wahi hamara asli customer hai.

## 2. Languages

- **English — primary** (~70% articles). Buyers (agencies) ke liye bhi primary.
- **Hindi — secondary** (~30%). Reader growth yahan se aayegi (6–8× faster market).
- Bhojpuri — HOLD (feeds nahi milte; jab partner mile tab).

## 3. Categories (focus > spread)

**Roz zaroor:** India (national), Politics, Business, Sports (cricket!), World
**Jab mile:** Technology, Entertainment, Health
**Regional** — tabhi jab partner/regional feed aaye.

## 4. Volume & limits (realistic maths)

- Gemini free tier: ~250 articles/din tak — humein itna nahi chahiye.
- **Target: 30–40 articles/din** (2 pipeline runs × ~8-10 feeds × 2 articles/feed).
- Review time: ~1–1.5 sec/article padhne + approve = **~45 min/din total.** Fits budget.

## 5. Daily routine (founder ka 1–2 ghanta)

**Subah (~45 min, 8–9 baje):**
1. Admin → RSS Sources → **Run now** (2 baar dabao agar zyada feeds hain)
2. Review queue → har article: headline sahi? fact ajeeb to nahi? → **Approve/Reject**
3. Ho gaya — sab live + signed.

**Shaam (~30-45 min, 6–7 baje):** wahi repeat (din ki taaza news).

**Weekly (30 min, Sunday):**
- Google Search Console dekho — kaunsi category rank ho rahi hai → us category ke feeds badhao
- Ek-do feeds jo kachra de rahe hain → off karo

## 6. Approval checklist (kya REJECT karna hai)

❌ Headline clickbait/galat lag raha hai
❌ Communal/danga-bhadkau angle, ya kisi pe bina source ke ilzaam (defamation risk)
❌ Court case me sub-judice cheez pe faisla-type likha ho
❌ AI ne facts mila diye hon (source link kholke 10-sec check jab shak ho)
❌ Duplicate story (pipeline usually rok deta hai, par mil jaye to)
✅ Baaki sab — Approve. Perfect mat banao, publish karo.

## 7. Rights reality (IMPORTANT — paisa isi se hai)

- RSS→AI content = **reader app ka fuel** (traffic, SEO, brand). Rights pe dhyan:
  ye AI-rewritten hai, isko sellable mark karne se pehle lawyer se ek baar policy
  confirm karni hai.
- **Asli sellable inventory** = khud ka / partner ka original content.
  → Isliye agla business goal: **2–3 Publisher Partners onboard karo** (independent
  journalists) jinka original content agencies ko bike (unko revenue share, humein commission).

## 8. RSS feed list (English primary + Hindi secondary)

**English (roz ke main feeds):**
| Feed | Category |
|------|----------|
| NDTV Top Stories | India |
| The Hindu — National | India |
| Times of India — Top Stories | India |
| Indian Express | India |
| Business Standard — Latest | Business |
| ESPNcricinfo | Sports |
| BBC News (already added) | World |

**Hindi (secondary):**
| Feed | Category |
|------|----------|
| BBC Hindi (already added) | World |
| NDTV Khabar (Hindi) | India |
| Amar Ujala — Breaking | India |
| Jagran — National | India |

(Feeds kabhi-kabhi block/change hote hain — jo na chale usse admin me OFF karke doosra
add kar denge. List evolve hogi.)

## 9. KPIs (har Sunday dekho)

- Articles published/din (target 30+)
- Google me indexed pages (Search Console)
- Reader visits/din (Vercel Analytics)
- Partner count · Agency leads

## 10. 30-din ka lakshya

- 900+ signed articles live (SEO base)
- Search Console setup + sitemap submitted
- 1–2 Publisher Partners onboard
- Pehli agency ko demo (WordPress plugin ke saath)
