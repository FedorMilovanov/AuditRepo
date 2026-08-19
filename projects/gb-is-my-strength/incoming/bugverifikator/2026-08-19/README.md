# bugverifikator — 2026-08-19 Intake

**Report:** REPORT.md
**Type:** source-audit + live reverify (current-HEAD reverify wave of active MASTER rows)
**Status:** Raw evidence — awaiting verification / consolidation wave

## Agent
- Name: bugverifikator
- Date: 2026-08-19
- Audited anchor (SHA / artifact / live snapshot): Product `main` HEAD `cb3681e` (`feat(app): premium Bible App integration across site (#1725)`, committed 2026-08-19T00:30Z); live production fetch of `https://gospod-bog.ru/{app,rodosloviye,articles/lot-i-sodom}/` same day; open Product branch census.
- Branch/event context: active MASTER was anchored at `485db8c`; Product `main` advanced 14 commits (485db8c → cb3681e). Open Product lanes: `agent/antisovetov-title-suffix-20260818` (60ed203), `fix/biografii-recent-heading-20260818` (c942deb), `repair/dist-css-astro-admission-20260819` (d426457), `repair/wire-engine-contracts-20260819` (475a8f2).
- Signal class: Product
- Proof state: FAIL (mixed per finding; see REPORT.md §5)
- Claim boundary: current Product `main` HEAD cb3681e + live production snapshot 2026-08-19
- Preservation boundary: this intake records what cb3681e + the live fetch actually inspected; do not refresh it merely because HEAD later moved.
- Semantic owner: gb-is-my-strength Product code owners (per-file).

## Files in this folder
- `README.md` — this intake index
- `REPORT.md` — current-HEAD reverify wave report (all active MASTER rows re-tested on cb3681e + live). NOTE: the per-finding EVIDENCE files below supersede two dispositions stated in REPORT.md (see "Correction" notes).
- `BUG_RECORD_RODOSLOVIYE-OG-IMAGE.md` — canonical bug record for the source+live-confirmed OG-image defect
- `EVIDENCE_RODOSLOVIYE-OG-IMAGE.md` — source+live witness for the OG-image defect
- `EVIDENCE_GENEALOGY-ID-INVALID-SPACE.md` — source+lifecycle witness for the malformed-ID defect (impact corrected to medium-low / latent)
- `EVIDENCE_ARTICLE-LAYOUT-SERIES-HARDCODE.md` — **CORRECTION**: carrier `ArticleLayout.astro` is orphaned/dead code on cb3681e → disposition `current-local` → **invalid/stale**
- `EVIDENCE_SERIES-ORDER-INDEX-MISMATCH.md` — **CORRECTION**: production-active root is `gillSeriesData.ts` (`GILL_SERIES_ITEMS`), not the dead `site.ts` `SERIES_ORDER`; defect confirmed live

## Notes for verifier
- **Confirmed current-local on cb3681e (+ live):** `RODOSLOVIYE-OG-IMAGE` (source + live — see EVIDENCE + BUG_RECORD), `SERIES-ORDER-INDEX-MISMATCH` (root relocated to `gillSeriesData.ts` — see EVIDENCE), `GENEALOGY-ID-INVALID-SPACE` (source — see EVIDENCE; impact medium-low/latent), `ARTICLE-AUTHOR-HARDCODED`, `GENEALOGY-NO-ERROR-BOUNDARY`, `EDITORIAL-LABEL-INCONSISTENCY`, `SECURITY-CSP-INCONSISTENCY` (reframe as absorbed symptom of `FRAGMENTED-SECURITY-OWNERSHIP`).
  - ⚠️ `ARTICLE-AUTHOR-HARDCODED` and `ARTICLE-LAYOUT-SERIES-HARDCODE` were both filed against `ArticleLayout.astro`, which this wave found to be orphaned/dead code (zero `src/` importers). `ARTICLE-LAYOUT-SERIES-HARDCODE` is therefore **invalid/stale** (see its EVIDENCE). `ARTICLE-AUTHOR-HARDCODED` shares the same carrier and likely needs the same dead-code re-check before being kept — flagged here, not separately evidenced in this pass.
- **Suspected / needs owner value decision:** `MOBILE-CHROME-REGISTRY-GAPS` — narrowed residual is "Genesis-6 article pages lack a mobile bottom bar"; whether a bar is required there is an owner decision.
- **Still needs browser/runtime verification:** `GENEALOGY-NO-ERROR-BOUNDARY` (source-only here — no runtime crash reproduction performed); `SECURITY-CSP-GAPS` live coverage for `/hard-texts/genesis-6/` and `/izbrannoe/` not fetched live in this pass (only `/app/` and `/rodosloviye/` fetched live).
- **Stale / invalid (remove in closure wave):** `ANCESTOR-TRACING-INCOMPLETE`, `UI-DUPLICATE-SEARCH-BUTTONS`, `METADATA-FUTURE-DATED` (2026-08-17 is in the past vs repo's ≈2026-08-19), and now `ARTICLE-LAYOUT-SERIES-HARDCODE` (dead-code carrier).
- **audit-drift flags:** (1) MASTER state claims bound to `485db8c` are stale vs cb3681e; (2) source-vs-live CSP divergence on `/app/` and `/rodosloviye/` (live has CSP, cb3681e source does not) — source-only census under-reports CSP coverage; (3) agent shell clock (2026-07-17) disagrees with repository material timestamps (≈2026-08-19) — freshness dispositions here use the repository context; (4) **self-correction**: this agent's first-pass REPORT.md cited wrong carrier files for two findings (`site.ts` for SERIES-ORDER, and kept ARTICLE-LAYOUT-SERIES-HARDCODE as live) — corrected in the EVIDENCE files; verifying carrier *usage*, not just carrier *contents*, is the lesson.
- **Owner-sanity-check before repair:** `RODOSLOVIYE-OG-IMAGE` (alt text contradicts asset — likely copy-paste, but confirm intent), `SERIES-ORDER-INDEX-MISMATCH` (confirm intended Gill part3/part4 reading order; if order is intentional, only the roman numerals are wrong).
- **Collision-relevant:** open branch `agent/antisovetov-title-suffix-20260818` (60ed203) is an existing owner repair lane for the antisovetov title-suffix symptom (D-19). Do not open a competing lane; reference this owner lane instead.
- **What this evidence does not prove:** full local build/runtime regression; that Genesis-6 article pages *must* have a mobile bar; whether `ArticleLayout`/`SeriesArticleLayout` were live on 485db8c (confirmed dead only on cb3681e); any the-legendary-poet claim; whether the `/app/` literal date should be release-derived (parked, not active).

**Agent:** bugverifikator
**Date:** 2026-08-19
