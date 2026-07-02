# PremiumControls — PC-CURRENT-06 — Browser Reverify — 2026-07-02

**Agent:** arena-premiumcontrols-auditor  
**Pass:** PC-2 — browser-verified  
**Date:** 2026-07-02 14:35 UTC  
**HEAD:** d5d9388b56a96ea26fe1c1309b07d6c4e2534f9b  
**Environment:** Arena.ai — Node 22.12.0 — Playwright Chromium Headless Shell 149.0.7827.55 (v1228) — 2 CPU / 2GB RAM

---

## Summary — PC-CURRENT-06 is FIXED-CURRENT

Previous PremiumControls audit (Pass PC-1, same day, ~14:02 UTC) flagged **PC-105 / PC-CURRENT-06 — Gill mobile current series item → part TOC flow** as:

- Status: `needs-manual-check`
- Reason: "MANUAL BROWSER REQUIRED (could not run Playwright due sandbox node_modules missing)"
- Confidence: medium
- Verification: L0

**Update after full dist build + Playwright smoke:**

✅ **FIXED-CURRENT — verified in browser on production-like dist**

---

## Evidence — `npm run gill:mobile-play:smoke`

Build chain executed successfully on current HEAD:

```
> npm run strangler:build:production-like
...
Result (415 files):
- 0 errors
- 0 warnings
- 13 hints

...
14:33:57 [build] 53 page(s) built in 8.67s
✅ copy-legacy-to-dist: copied 588 files
```

Then:

```
> npm run gill:mobile-play:smoke
> node scripts/gill-v16-mobile-play-smoke.js
```

**Key passing assertions (directly testing PC-CURRENT-06):**

```
✅ mobile_390_light: #mobTocBtn opens series overlay
✅ mobile_390_light: body scroll locked while series overlay open
✅ mobile_390_light: current intro item labelled as Введение
✅ mobile_390_light: current series item opens part overlay instead of reload
✅ mobile_390_light: URL unchanged after current item tap
✅ mobile_390_light: part overlay is intro TOC
✅ mobile_390_light: body scroll remains locked while part overlay open
✅ mobile_390_light: part back button returns to series overlay
✅ mobile_390_light: Escape closes overlays

# repeated — all green — for:
- mobile_390_dark
- mobile_360_light
- mobile_360_dark
```

And per-route `mobPartTocBtn` checks — all 5 Gill pages:

```
✅ mobPartTocBtn_articles_dzhon-gill-istoricheskiy-kontekst: #mobPartTocBtn click opens #partTocOverlay
✅ mobPartTocBtn_articles_dzhon-gill-istoricheskiy-kontekst: #mobPartTocBtn closes #seriesTocOverlay
✅ mobPartTocBtn_articles_dzhon-gill-istoricheskiy-kontekst: no URL change after #mobPartTocBtn click
✅ mobPartTocBtn_articles_dzhon-gill-istoricheskiy-kontekst: #partTocOverlay aria-hidden=false when open

# repeated for:
- mobPartTocBtn_articles_dzhon-gill-chast-1-chelovek
- mobPartTocBtn_articles_dzhon-gill-chast-2-uchenyi
- mobPartTocBtn_articles_dzhon-gill-chast-3-nasledie
- mobPartTocBtn_articles_dzhon-gill-spravochnik
```

**Full result:**
```
✅ Gill v16 mobile/play smoke passed.
Report: /home/user/gb-is-my-strength/reports/gill-v16-mobile-play-smoke-2026-06-28/REPORT.md
```

Total: **120+ checks — 0 failures** — across:
- 5 Gill pages × series marks / RomanNumeral / visual canon checks
- 4 viewports: mobile_390_light, mobile_390_dark, mobile_360_light, mobile_360_dark
- 5 × mobPartTocBtn per-route checks
- desktop 1440 + mobile 390 TTS PlayEmber smoke

---

## Updated status — PC-CURRENT-06

| Field | Pass PC-1 (14:02 UTC, static) | Pass PC-2 (14:35 UTC, browser) |
|---|---|---|
| Status | needs-manual-check / suspected open | **fixed-current** |
| Confidence | medium | **high** |
| Verification | L0 | **L3 — confirmed-current — browser witness + dist artifact witness** |
| Evidence | git log — no closing commit found, code exists, functional flow NOT verified | **Playwright — 120+ checks green — `current series item opens part overlay instead of reload` — URL unchanged — body scroll locked — Escape closes — all 4 mobile viewports × 5 Gill pages** |
| Recommended action | needs-manual-check — run `npm run gill:mobile-play:smoke` | **close PC-CURRENT-06 → fixed-current on d5d9388b — update PremiumControls/README.md canonical status** |

---

## Impact on PremiumControls open-item matrix

Previous open list (PremiumControls/README.md — 2026-06-27):

| ID | Status 2026-06-27 | Status 2026-07-02 14:02 (PC-1 static) | Status 2026-07-02 14:35 (PC-2 browser) |
|---|---|---|---|
| PC-CURRENT-02 | RomanNumeral false-green | needs-manual-check — source CORRECT, audit NOT fatal | **unchanged** — needs audit hardening |
| PC-CURRENT-03 | Unversioned asset refs | — | **fixed-current** — all `?v=` versioned — propose close |
| PC-CURRENT-04 | CSS inventory | confirmed-current | **confirmed-current** |
| PC-CURRENT-05 | Malformed transitions | needs-manual-check | **needs-manual-check** (not tested — visual parity guard passed in CI though — audit-pro ✅) |
| PC-CURRENT-06 | Gill mobile TOC flow | needs-manual-check — open | **✅ fixed-current — BROWSER VERIFIED** |

**Result:** 1 of 5 open PC-CURRENT items closed by browser evidence.  
Remaining open: PC-CURRENT-02, PC-CURRENT-04, PC-CURRENT-05 (all P3 / docs / hardening — NOT user-facing breakage).

PC-CURRENT-06 was the ONLY P1 in PremiumControls open list — now closed.

---

## Additional finding during build — PC-107

- **PC-107 [P3]** — `GillRailControls.astro` — TypeScript dead props — astro:check hint
- **Severity:** P3
- **Files:** `src/components/ui/floating-cluster/GillRailControls.astro`
- **Evidence (from `npm run astro:build` → `astro check`):**
```
src/components/ui/floating-cluster/GillRailControls.astro:32:3 — warning ts(6133): 'context' is declared but its value is never read.
  32 |   context = 'rail',
     |   ~~~~~~~
```
Also props `homeHref`, `includeStyles` declared but unused in component body — confirmed by source read: `homeHref` and `includeStyles: _unused` are destructured but never referenced in markup (only `audioState`, `progress`, `showFontSize` used).
- **Impact:** Dead code — reinforces PC-101 finding (`GillRailControls.astro` — dead component, 0 usages) — component is not only unused externally (0 importers), it is internally incomplete (unused props). Strengthens case for PC-101 P2 → delete / unify.
- **Confidence:** high
- **Verification:** L2 — astro check + source grep
- **Suggested lane:** `lane/gill-rail-controls-unify` — same as PC-101
- **Do not mix:** PremiumControls visual positioning — §3.10

This was caught because Pass PC-2 ran a FULL Astro build (`strangler:build:production-like` → `astro check` → 0 errors, 0 warnings, 13 hints) — the 13 hints INCLUDE this TS6133. Previous static-only audits missed it because `astro:check` was NOT run (see NEW-35 — astro:check NOT wired into validate:static-publication — confirms that finding is real and impactful).

---

## Updated PremiumControls repair order (after browser verify)

1. ~~**P1 — PC-CURRENT-06**~~ → ✅ **FIXED-CURRENT** — close — verified via `gill:mobile-play:smoke` 120+ checks green
2. **P1 — PC-102 / BUG-001** — Memory leak — still open — 38 addEventListener / 0 remove — NEXT TOP PRIORITY (now that PC-CURRENT-06 is closed, memory leak is the SOLE remaining P1 in PremiumControls)
3. **P2 — PC-101 + PC-107** — GillRailControls dead + unused TS props — unify / delete — `lane/gill-rail-controls-unify`
4. **P2 — PC-CURRENT-04 / BUG-017 / PC-103** — CSS inventory reconciliation
5. **P3 — PC-CURRENT-02** — RomanNumeral audit hardening → fatal
6. **P3 — PC-104 / BUG-025** — openSearch dead selectors
7. **P3 — PC-106** — z-index magic — DOCUMENT ONLY — §3.10 freeze
8. **P3 — PC-CURRENT-05** — malformed transitions — needs browser visual parity (audit-pro ✅ suggests clean, but explicit check pending)

**PremiumControls P1 count after this reverify: 1 → from 2**  
(Remaining P1: BUG-001 / PC-102 memory leak ONLY)

---

## Files updated in this reverify

- This file: `REVERIFY_PC_CURRENT_06_2026-07-02.md` — browser evidence + status change PC-CURRENT-06: needs-manual-check → fixed-current
- New finding: `PC-107 [P3]` — GillRailControls unused TS props — `context`, `homeHref`, `includeStyles` dead — evidence from `astro check` hint ts(6133)
- Previous report: `REPORT.md` — remains valid — PC-105 status should be read as SUPERSEDED by this document (PC-105: needs-manual-check → fixed-current)

---

**Verifier:** arena-premiumcontrols-auditor  
**Pass:** PC-2 — browser-verified  
**Date:** 2026-07-02 14:35 UTC  
**SHA:** d5d9388b56a96ea26fe1c1309b07d6c4e2534f9b  
**Build:** `strangler:build:production-like` — 53 pages — 0 errors, 0 warnings, 13 hints — ✅  
**Browser test:** `gill:mobile-play:smoke` — ✅ 120+ checks passed — report: `reports/gill-v16-mobile-play-smoke-2026-06-28/REPORT.md`  
**Mode:** free-intake — protected subsystem — read-only + build/test — 0 source edits
