# EVIDENCE: SEO, OPENGRAPH META TAGS, AND MIGRATION REGISTRY ALIGNMENT

**Project:** `gb-is-my-strength`  
**Date:** 2026-07-19  
**Source HEAD:** `32ae0d7d62bee81737a9aae1f136946d047fe4fb`  
**Auditor:** `arena-auditor-karty-verification`  
**Subsystem:** OpenGraph Tags, Social Preview Cards, `data/route-profiles/`, and Migration Ownership Registry

---

## 1. OpenGraph & Meta Tag Audit Across All 11 Maps (`QUAL-P1-08`)

An audit of `<meta property="og:image">`, `<meta property="og:title">`, and `<meta name="robots">` across all 11 map routes:

| Route | `robots` Content | `og:image` URL | Image File Exists | `og:title` Text | Quality Assessment |
|---|---|---|:---:|---|---|
| `/karty/avraam/` | `index, follow` | `https://gospod-bog.ru/images/og-karty-avraam.webp` | ✅ | `Путь Авраама — интерактивная карта` | Custom route image |
| `/karty/ishod/` | `index, follow` | `https://gospod-bog.ru/images/og-karty-1200x630.webp` | ✅ | `Исход из Египта — интерактивная карта` | Generic fallback card |
| `/karty/pavel/` | `noindex, follow` | `https://gospod-bog.ru/images/og-karty-1200x630.webp` | ✅ | `Путешествия Павла — визуальный аудит` | Generic fallback card |
| `/karty/shoftim/` | `noindex, follow` | `https://gospod-bog.ru/images/og-karty-1200x630.webp` | ✅ | `Эпоха Судей — визуальный аудит` | Generic fallback card |
| `/karty/melachim/` | `noindex, follow` | `https://gospod-bog.ru/images/og-karty-1200x630.webp` | ✅ | `Царства Израиля и Иуды — визуальный аудит` | Generic fallback card |
| `/karty/shvatim/` | `noindex, follow` | `https://gospod-bog.ru/images/og-karty-1200x630.webp` | ✅ | `12 колен Израиля — визуальный аудит` | Generic fallback card |
| `/karty/yeshua/` | `noindex, follow` | `https://gospod-bog.ru/images/og-karty-1200x630.webp` | ✅ | `Жизнь Христа — визуальный аудит` | Generic fallback card |
| `/karty/maccabim/` | `noindex, follow` | `https://gospod-bog.ru/images/og-karty-1200x630.webp` | ✅ | `Межзаветный период — визуальный аудит` | Generic fallback card |
| `/karty/early-church/` | `noindex, follow` | `https://gospod-bog.ru/images/og-karty-1200x630.webp` | ✅ | `Ранняя Церковь — визуальный аудит` | Generic fallback card |
| `/karty/revelation/` | `noindex, follow` | `https://gospod-bog.ru/images/og-karty-1200x630.webp` | ✅ | `7 церквей Откровения — визуальный аудит` | Generic fallback card |
| `/karty/` | `index, follow` | `https://gospod-bog.ru/images/og-karty-1200x630.webp` | ✅ | `Библейские карты` | Hub main OG banner |

**Finding:** 8 holding maps use the generic hub image `og-karty-1200x630.webp`. When social previews or link cards render, they display generic hub graphics instead of individual historical map artwork.

---

## 2. Route Profile Status Drift (`QUAL-P1-09`)

In `data/route-profiles/karty-*.json`:
- All 11 route profile files specify `"currentStatus": "production-dist"` and `"migrationMode": "strict-native-app"`.
- However, 8 maps are holding pages rendering `KartyHoldingPage` with `"status": "temporary-placeholder"` in `route.json`.
- Profiles in `data/route-profiles/` should accurately differentiate live maps (`production-dist`) from holding pages (`temporary-placeholder`) to prevent status drift in effective route matrix tools.

---

## 3. Page Ownership Centralization (`QUAL-P2-03`)

- `migration/page-ownership.json` contains 0 entries under `/karty/`.
- Ownership verification relies solely on individual JSON files in `data/route-profiles/`, skipping the centralized `page-ownership.json` validator loop.
