# Arena Agent 6 — FINAL SUMMARY
**Date:** 2026-06-25
**Agent:** arena-agent-6
**Total commits pushed:** 4
**SHA analyzed:** 2f2e2bb6 (main HEAD)

---

## NEW BUGS DISCOVERED (7)

| # | ID | Sev | Title | Status |
|---|---|---|---|---|
| 1 | NEW-01 | **P0** | sw.js source-repo SYNTAX ERROR (2 malformed strings) — production OK | CONFIRMED |
| 2 | NEW-02 | P1 | fc-controller hash stale (efd81d3a≠5200bc9b) in 15 Astro components | CONFIRMED |
| 3 | NEW-03 | P1 | floating-cluster.css missing ?v= in 3 PageHead components | CONFIRMED |
| 4 | NEW-04 | P2 | feed.xml lastBuildDate changes every build → false RSS updates | CONFIRMED |
| 5 | NEW-05 | P1 | 8 karty subroutes missing from sitemap.xml AND search-manifest.json | CONFIRMED |
| 6 | NEW-06 | P1 | readTime 3+ conflicting sources of truth (32 vs 35 vs 50) | CONFIRMED |
| 7 | NEW-07 | P2 | data-gbs2-offline button NOT handled by any JS | CONFIRMED |

---

## BUGS CONFIRMED (12)

| ID | Notes |
|---|---|
| PS-01 | IIFE defect — fix in progress (commit 2f2e2bb6) |
| P0-10 | Partially fixed — NEW-02/NEW-03 are residual |
| V2-1 | Gill Part1: 2 broken TOC anchors (#sec-early-years, #sec-gill-spirituality) |
| V2-1 | Gill Part3: 5 broken TOC anchors (#sec-legacy-main, #sec-rome-proverbs, #sec-wesley, #sec-coffee-house-polity, #sec-evaluations-map) |
| V2-2 | Nagornaya font buttons DEAD — no JS handles nagFontDec/nagFontInc |
| V2-4 | feed.xml: 9 of 18 dates have wrong weekday (3×Sat→Sun, 6×Thu→Fri) |
| P0-6 | CI cascade — fixed in commit 5425b292 |
| P1-2 | sitemap.xml incomplete (43/52 routes) |
| P1-7 | search.js hardcoded fallback readTime |
| P1-9 | audit-pro.js CACHE_BUST_ASSETS diverged from cache-bust.js (6 entries) |
| P2-6 | feed.xml UTC vs Moscow timezone inconsistency |

---

## BUGS DISPUTED / FALSE POSITIVES (4)

| ID | Action | Reason |
|---|---|---|
| P0-NEW | **FALSE POSITIVE** | Production sw.js includes site-layered.css + site-modules.js |
| P0-3 | **POLICY DECISION** | robots.txt header says "Bulk training/scraping agents are blocked" — intentional |
| P1-13 | **FALSE POSITIVE** | enhancements.js wires ALL GBS2 controls (theme, search, share, font) |
| P1-14 | **FALSE POSITIVE** | Same reason — enhancements.js handles GBS2 |

---

## COUNT IMPACT

If verifier accepts my challenges:
- Remove P0-NEW (64→63)
- Remove P1-13, P1-14 (63→61)
- Downgrade P0-3 to policy (61→60)
- Add NEW-01 as P0 (60→61)
- Add NEW-02..NEW-07 (61→67)

**Net: 67 bugs (10 P0, ~20 P1, ~22 P2, ~15 P3)** — subject to verifier approval.

---

## EVIDENCE FILES

- `evidence/sw-syntax-error.log` — Node.js syntax error proof + production comparison
- `evidence/hash-mismatch-analysis.log` — fc-controller hash stale proof

---

## COMMITS

1. `973a2a8` — REPORT.md + evidence (P0 sw.js syntax error + 5 new findings)
2. `3a473b4` — comment-on-P0-NEW.md + proposal-NEW-01-P0.md
3. `240933b` — comment-on-P1-13-P1-14.md (FALSE POSITIVE challenge)
4. `11f6b20` — (this summary)
