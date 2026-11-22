# W62 — G3: current-source reconciliation of the historical sticky-navigation finding

**Date:** 2026-11-22  
**AuditRepo baseline:** `ec18a519d60296e7b3182f873e289cc9f15884b5` (read-only before this branch).  
**Product source baseline:** `FedorMilovanov/gb-is-my-strength@274c3a85d525b0f92640ed569256416a732f3aae` (current main at the selected verification), and in-flight draft PR [#2357](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2357) head `1472ed29f2675203469469ba9a99d181a00230d4`.  
**Disposition:** **STALE / SUPERSEDED finding identity**, *not* a declaration that the replacement sticky navigation is universally correct.

## Historical claim, preserved without rewriting its evidence

The active MASTER row `GBS-JOURNAL-STICKY-NAV-SCROLL-OWNER` describes a specific `.dossier-nav` with `position:sticky;top:0` on G3, observed offscreen after jumping to `#finance`, and a suspected body scroll/overflow ownership defect. Original forensic witness: `incoming/arena-full-spectrum-audit/2026-10-14/REPORT.md` §23.3 and `evidence/2026-10-18-genealogy-reopen-journal-sources-sticky.json`. It was a credible earlier finding, not a false positive at its anchor.

## Independent current-source witnesses

1. Product **current main** `src/components/journal/G3Dossier.astro`, Git blob `6358fdb25d61fd7dd5c568d6984a740058def736`, has **zero** `dossier-nav` occurrences. It now renders one `JournalContents` with native `<details>`, a `returnHref="#overview"` and the compact keyboard route.
2. On the current G3 PR candidate, the same G3 component blob is `7ff76573b36ab2f7a76a6946337e983133cb65a0`, still **zero** `dossier-nav` and still uses `JournalContents`; the changed history link does not restore the old menu.
3. Current source owners: `JournalContents.astro` blob `665732039a18b7d95250cb40536b272646f24175`; `journalEditorial.css` blob `09fe0c7384a2492b3b135bffa2804824c6cb70f6`. The actual compact navigation is inside `.je-editorial-rail:has([data-journal-contents-bound])` with `position:sticky`, not the old `.dossier-nav`. **The generic body overflow/scroll-ancestor mechanism is not proven eliminated merely because the selector changed.**
4. Draft [G3 CI run 45050100913](https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/45050100913) supplied real Chromium and WebKit 32/32 native compact keyboard scenarios and 24/24 real PDFs. Those prove only their declared matrices; **Firefox did not pass** and the new 1472ed29 head requires fresh CI. This report makes no desktop sticky, full accessibility, or live-production green claim.

## Decision and residual boundary

- Retire exactly **one historical selector-specific row** from active MASTER as `stale/superseded`, with its original proof left in Git history and this explicit disposition in CLOSURE_LEDGER.
- **Do not implement** the old `body overflow` A/B patch or invent a new repair on the strength of its old geometry. If actual current `.je-editorial-rail` is offscreen under a native keyboard/anchor/scroll scenario, independently measure that route at desktop + mobile, JS/no-JS, both palettes and find the current root. Admit one contemporary root only then, with actual browser + computed scroll-ancestor evidence.
- The separate `GBS-JOURNAL-READER-SOURCE-LOCATORS-MISSING` active row concerns **Diotrophes only** (not G3). Product shared-chrome [#2359](https://github.com/FedorMilovanov/gb-is-my-strength/issues/2359) and G3 Firefox PR #2357 remain independent open verification or repair work.
- No Product changes, no release gate waiver and no declaration of project-wide ZERO arise from AuditRepo W62.

**Arithmetic:** active **45 → 44**, direct **11 → 10**, necessary improvements 8, residuals 1, systems 25, owner decisions 0. The count reflects retirement of an **obsolete historical bug identity**, not proof of fixing a current sticky bug.
