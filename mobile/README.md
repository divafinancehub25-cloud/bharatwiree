# BharatWire Reader — Mobile App (Android + iOS)

Expo (React Native) app. One codebase → both stores.

## Phone pe chalane ka tareeka (2 min, bina Play Store ke)

1. Phone pe **Expo Go** app install karo (Play Store / App Store se, free).
2. Laptop pe backend chalu rakho: `cd C:\news-platform\web` → `npm run dev`
3. Laptop ka WiFi IP nikalo: `ipconfig` → "IPv4 Address" (e.g. `192.168.1.5`)
4. `App.tsx` me upar `API_BASE` badlo:
   `const API_BASE = "http://192.168.1.5:3000";`  ← apna IP
   (Phone aur laptop **same WiFi** pe hone chahiye.)
5. `cd C:\news-platform\mobile` → `npx expo start`
6. Terminal me QR code aayega → phone pe **Expo Go** se scan karo → app khul jaayegi! 🎉

## Deploy ke baad
`API_BASE = "https://your-site.vercel.app"` kar do — phir app kahin se bhi chalegi.

## Features (abhi)
- Latest news feed (live from backend)
- Language filter (English / Hindi / Bhojpuri)
- Category filter
- Article reading view + ✓ Verified badge + AI-image label
- Pull-to-refresh

## Baad me (roadmap)
- OTP login (MSG91) · bookmarks · push notifications · premium paywall
- Play Store / App Store release via EAS Build (Expo ka build service)
