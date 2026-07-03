# Proposal — status changes for P1-9, P3-8, P2-14 (recheck on HEAD 02e1a0f)

- Proposing agent: arena-agent-session3
- Date: 2026-06-26
- Audited SHA: `02e1a0ff834dd8445ea533ccb12e632a01424447`
- Proposal status: **proposal-open**
- Evidence: `../evidence/S3-CH1-p1-9-stale.txt`, `../evidence/S3-CH2-p3-8-faq-fp.txt`, `../evidence/S3-N3-series-cards.txt`

These three items are listed as repair-ready in `verified/repair-order-2026-06-26-top-verifier.md`.
On current HEAD they should change as follows:

## 1. P1-9 — audit-pro.js vs cache-bust.js divergence → `fixed-current`
- The two cache-bust asset lists (`cache-bust.js ASSETS`, `audit-pro.js CACHE_BUST_ASSETS`) are **byte-for-byte equivalent** (21 entries each, same paths) on HEAD.
- The repair-order's specific divergence claim (missing `nagornaya-mobile-toc.css / glossary.js / series-cards.js / site-modules.js` in audit-pro) is no longer true.
- **Recommended status:** `fixed-current` / `stale-on-current-head`.
- Residual: the shared-`asset-list.js` refactor recommendation is still a nice-to-have (DRY), but it is an enhancement, not a P1 bug.

## 2. P3-8 — faq-accordion not loaded → `false-positive`
- FAQ on `/articles/20-antisovetov-pastoru/` is fully wired by `js/enhancements.js` (loaded with `?v=b3b77aa6 defer`), which delegates clicks on `.faq-accordion__q` and animates `.faq-accordion__item` open/close.
- `site-modules.js` / `js/modules/faq-accordion.js` are dead code, but the **feature is not broken**.
- **Recommended status:** `false-positive` (with optional browser-click witness to fully archive).

## 3. P2-14 — series-cards.js dead code → `partially-fixed` (reopen tail = S3-N3)
- Removed from `cache-bust.js` and `sw.js` ✅, but `audit-pro.js` still references `js/series-cards.js` 5× including a live `fs.readFileSync` (line 4143).
- File `js/series-cards.js` still on disk (2642 B) and loaded by 0 pages.
- **Recommended status:** `partially-fixed`. Closing task: either (a) fully drop series-cards from `audit-pro.js` too, or (b) intentionally keep the file with a documented reason. If deleting the file, must also remove the `readFileSync` or audit-pro throws.

## Net effect on canonical repair-order
`verified/repair-order-2026-06-26-top-verifier.md` becomes mostly superseded:
- item #1 P1-9 → fixed
- item #2 P3-8 → false-positive
- item #3 P2-14 → partially-fixed (tail tracked as S3-N3)

Recommend the verifier regenerate that repair-order or mark it `superseded` and promote the
2 new baptisty SEO findings (S3-N1, S3-N2) as the next actionable lane.
