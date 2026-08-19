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
- `REPORT.md` — current-HEAD reverify wave report (all active MASTER rows re-tested on cb3681e + live)
- `BUG_RECORD_RODOSLOVIYE-OG-IMAGE.md` — canonical bug record for the source+live-confirmed OG-image defect

## Notes for verifier
- **Confirmed current-local on cb3681e (+ live):** `RODOSLOVIYE-OG-IMAGE` (source + live witness — see BUG_RECORD), `ARTICLE-LAYOUT-SERIES-HARDCODE`, `SERIES-ORDER-INDEX-MISMATCH`, `ARTICLE-AUTHOR-HARDCODED`, `GENEALOGY-NO-ERROR-BOUNDARY`, `GENEALOGY-ID-INVALID-SPACE`, `EDITORIAL-LABEL-INCONSISTENCY`, `SECURITY-CSP-INCONSISTENCY` (reframe as absorbed symptom of `FRAGMENTED-SECURITY-OWNERSHIP`).
- **Suspected / needs owner value decision:** `MOBILE-CHROME-REGISTRY-GAPS` — narrowed residual is "Genesis-6 article pages lack a mobile bottom bar"; whether a bar is required there is an owner decision.
- **Still needs browser/runtime verification:** `GENEALOGY-NO-ERROR-BOUNDARY` (source-only here — no runtime crash reproduction performed); `SECURITY-CSP-GAPS` live coverage for `/hard-texts/genesis-6/` and `/izbrannoe/` not fetched live in this pass (only `/app/` and `/rodosloviye/` fetched live).
- **Stale (remove in closure wave):** `ANCESTOR-TRACING-INCOMPLETE`, `UI-DUPLICATE-SEARCH-BUTTONS`.
- **Invalid as framed (remove; literal-date concern → Work Queue):** `METADATA-FUTURE-DATED` — `2026-08-17` is in the past vs the repository's effective today (≈2026-08-19), not in the future.
- **audit-drift flags:** (1) MASTER state claims bound to `485db8c` are stale vs cb3681e; (2) source-vs-live CSP divergence on `/app/` and `/rodosloviye/` (live has CSP, cb3681e source does not) — source-only census under-reports CSP coverage; (3) agent shell clock (2026-07-17) disagrees with repository material timestamps (≈2026-08-19) — freshness dispositions here use the repository context.
- **Collision-relevant:** open branch `agent/antisovetov-title-suffix-20260818` (60ed203) is an existing owner repair lane for the antisovetov title-suffix symptom (D-19). Do not open a competing lane; reference this owner lane instead.
- **What this evidence does not prove:** full local build/runtime regression; that Genesis-6 article pages *must* have a mobile bar; any the-legendary-poet claim; whether the `/app/` literal date should be release-derived (parked, not active).

**Agent:** bugverifikator
**Date:** 2026-08-19
