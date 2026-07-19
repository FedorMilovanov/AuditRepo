# EVIDENCE: TYPOGRAPHY, TOUCH TARGETS, AND MAP QUALITY AUDIT

**Project:** `gb-is-my-strength`  
**Date:** 2026-07-19  
**Source HEAD:** `32ae0d7d62bee81737a9aae1f136946d047fe4fb`  
**Auditor:** `arena-auditor-karty-verification`  
**Subsystem:** Typography, Mobile Touch Sizing, Hebrew Rendering, Photo Delegation, and Route Profile Declarations

---

## 1. Touch Target & Mobile Usability Quality Pass (`QUAL-P1-01`)

An automated CSS and JS inspection measured touch target dimensions against the WCAG AAA 44×44 px touch accessibility standard:

| Control / Class | Attribute | Measured Dimension | Target Requirement | Impact |
|---|---|---:|---:|---|
| `.me-back` | `min-height` | **36 px** | 44 px | Mobile user misclick risk when navigating back |
| `.me-story-chip` | `min-height` | **36 px** | 44 px | Story selection chips hard to tap on mobile |
| `.me-arch-more` | `min-height` | **32 px** | 44 px | Archaeology "Подробнее" button undersized |
| `.me-panel__resize` | `width` | **12 px** | 44 px | Mobile sheet drag handle too narrow for touch gesture |
| `.me-panel__stage-dot` | `width` | **8 px** | 44 px | Stage dots lack padded hit container |
| `.me-photo-dot` | `width` | **7 px** | 44 px | Gallery slide dots require precise touch accuracy |
| `.me-nav__dot` | `width` | **6 px** | 44 px | Navigation dots lack hit padding |
| `.me-timeline__dot` | `width` | **8 px** | 44 px | Timeline stage selection dots hard to tap |
| `.me-layers__dot` | `width` | **6 px** | 44 px | Layer indicators undersized |

---

## 2. Hebrew Typography & RTL Rendering Audit (`QUAL-P1-02`)

Audit of 244+ Hebrew words (`he_deep`, `title_he`, `bible_extra`) rendered in `karty/_engine/map-engine.js` and `karty/avraam/avraam-app.js`:

1. **Missing Font-Family Declaration:** Dynamically rendered Hebrew spans lack `font-family: "Noto Serif Hebrew", "SBL Hebrew", serif`, defaulting to system fallback sans-serif fonts.
2. **Missing `dir="rtl"` Attributes:** Container elements dynamically injecting Hebrew place titles omit `dir="rtl"`, causing punctuation and adjacent Russian text to misalign in RTL mixed-text blocks.

---

## 3. Scripture Verse Citation Typography (`QUAL-P1-03`)

Scan of all 38 scripture citation blocks across `route.json` files:
- **`avraam`:** 14 verse range citations use proper Russian typographic en-dashes (`Быт 12:1–9`).
- **Engine Maps (`ishod`, `early-church`, `maccabim`, `melachim`, `shoftim`, `shvatim`, `yeshua`, `pavel`):** **39 verse range citations** use ASCII hyphens `-` (e.g. `ДЕЯНИЯ 2:2-3`, `Быт 15:13-14`, `3ЦАРСТВ 12:29-30`, `СУДЕЙ 5:20-21`, `Мф 2:5-6`).

---

## 4. Single-Photo Delegation Event Conflict (`QUAL-P1-04` / `ENGINE-P1-28`)

In `map-engine.js`, clicking a single-photo thumbnail executes:
1. Direct element listener on `.me-clickable-photo` (line 1789): opens full-resolution `data-src` in `openPhoto()`.
2. Event bubbles up to `panel` delegated listener (line 2246): reads `img.src` (thumbnail URL) and calls `openPhoto(img.src)` with empty credit text, immediately overwriting the full-res photo with the low-resolution thumbnail.

---

## 5. Route Profile Status Consistency (`QUAL-P2-01`)

In `data/route-profiles/karty-*.json`:
- All 11 map route profiles specify `"currentStatus": "production-dist"`.
- However, 8 maps are holding pages with `"status": "temporary-placeholder"` in `route.json`.
- `data/route-profiles/` should align holding routes with `status: "temporary-placeholder"` to reflect their holding status in effective route matrix builds.
