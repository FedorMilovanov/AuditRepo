# MASTER re-admission wave — bugverifikator — 2026-07-17

Companion to intake report `incoming/bugverifikator/2026-07-17/REPORT_matrix_integrity.md`.
Target file: `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md`.
Patch file: `readmit.patch` (unified diff against PR #331 head `7547faba`).

## What this wave does

Restores row↔counter parity for the `GB-MASTER-COUNT-DRIFT-20260818` defect. Five of the six findings whose row bodies were silently dropped by direct-to-`main` commits `86e4400a` / `8ef37c99` are re-admitted as **`current-confirmed`** narrowed residuals, each verified against Product `main` `485db8c25287fa9bd2f53a5356885f02e4b81f4b`:

| Re-admitted ID | Class | Source witness on `485db8c` |
|---|---|---|
| `BUG-SW-MISSING-PRECACHE` | offline resilience | `sw.js` precaches 11 of 13 `css/` files; missing `/css/series-manuscript.css`, `/css/tts-download-notice.css` |
| `BUG-CSS-VAL-COMMENT-SENSITIVITY` | audit-tooling defect | `scripts/css-layer-validator.js` applies regex to raw text with no comment stripping → false pass on `/* @layer base; */` |
| `BUG-CSS-VAL-ANONYMOUS-LAYER-BYPASS` | audit-tooling defect (latent) | `blockRegex` requires a named layer → spec-valid anonymous `@layer { … }` ignored |
| `BUG-PATH-RESOLVE-DOTS` | broken assets | `BiografiiRecentSection.astro` emits 12 `../`-relative paths for a subdirectory page |
| `SEO-ORPHAN-PAGE` | discovery/SEO | `/baptisty-rossii/` in `sitemap.xml`, no internal link from `index.astro` / `BaseLayout.astro` |

Counters move: Active work units `12 → 17`; Narrowed residuals `5 → 10`; section header `NARROWED RESIDUALS — 5 → — 10`. A provenance blockquote records the wave and anchors it to AuditRepo HEAD `7547faba` + Product `485db8c`.

## What this wave deliberately does NOT do

- **`A11Y-LANG-MISSING` is NOT re-admitted to MASTER.** Its only witness is a SHA-less live report; a source recheck at `485db8c` did not locate the Greek/Hebrew text in home/biografii `.astro` sources, so it likely renders from prerendered/data content. Per the operating model ("suspected-only claims without a current witness do not stay in MASTER"), it remains a `candidate` in `incoming/`/`verification/` and needs a browser/live reverify with an exact route + anchor before any promotion. Its evidence report `verified/verification/2026-07-17-a11y-lang-missing/REPORT.md` stays on disk.
- **No absorption into `D-2` / `SYS-BRAND-TITLE-AUTHORITY`.** The two `css-layer-validator.js` findings share an owner with `D-2`, but collapsing them into one system lane is deferred until a class-level validator-hardening lane is owned (system-fix absorption needs a demonstrated common owner + class-level guard; not yet established).
- **No mutation of the three pre-existing orphan rows** (`AR-IDX-JS-02`, `D-2`, `HTML-BTN-TYPE`) owned by PR #331. See collision analysis.

## Collision analysis — PR #328 / #331 / #332 (per CONCURRENT_EDIT_PROTOCOL §2 + operating model Collision rule)

| PR | Files touched | Relationship to this wave |
|---|---|---|
| **#328** `audit(gb): brand-title writer authority…` | `incoming/bugverifikator/…/README.md`, `…/REPORT_PASS2_BRAND_TITLE_AUTHORITY.md` | **No collision.** Intake/evidence only, no MASTER mutation. Different file paths. |
| **#331** `matrix(gb): admit brand-title system root + search/RSS defect, repair red matrix counters` | `incoming/bugverifikator/…/README.md`, **`verified/MASTER_BUG_MATRIX.md`** | **Same file — direct surface collision.** #331 is the current owner of the matrix counter-repair. **But it is complementary, not competing:** #331 repairs the counters *down* to the rows that physically exist (residuals 11→5) and explicitly delegates the missing rows: *"repairs the counters but deliberately does not invent the missing rows — I do not hold their evidence. They should be re-admitted with real rows and witnesses by whoever owns that intake."* This wave is exactly that delegated re-admission. It is built **on top of the #331 tree** (base = #331 head `7547faba`), so it applies cleanly after #331 merges and will not re-introduce the drift. |
| **#332** `evidence(gb): comments on foreign incoming audits` | 3 incoming template-comment files | **No collision.** Does not touch MASTER. |

### Recommended merge order

1. Merge **#331** first (repairs the counter drift, makes `main` internally consistent at 12/5).
2. Merge **this wave** second, rebased onto the post-#331 `main`. Because the patch is generated against `7547faba` (#331 head) and `main` is currently *at* `7547faba`, the rebase is trivial; if #331's head advances, re-resolve only the `Current state` table and the `NARROWED RESIDUALS` block, which this patch owns exclusively.
3. Do **not** push this wave directly to `main` — `main` is unprotected (the very `SYS-MAIN-ADMISSION-ENFORCEMENT` owner-decision row), and a direct push would repeat the uncontrolled-admission pattern that caused the original drift.

If #331 is instead closed without merging, rebase this wave onto current `main` directly; the only conflict surface is the same two regions, and the row bodies this wave adds do not exist on `main` today.

## Validation — run against the repo's own `scripts/matrix_coverage_lib.py` (W3 artifact witness)

Built two minimal project trees (MASTER + every evidence file referenced) and ran `build_report` exactly as the `auditrepo-validate` CI step `Validate matrix/evidence owners when changed` does:

```
BASE (#331 head 7547faba):    12 open rows,  3 diagnostics  [3 pre-existing ORPHAN: AR-IDX-JS-02, D-2, HTML-BTN-TYPE]
PATCHED (this wave):          17 open rows,  3 diagnostics  [the SAME 3 pre-existing ORPHAN]

diagnostics ONLY in BASE   (fixed by this wave): []   ← BROKEN-EVIDENCE-PATH for the 5 re-admitted rows eliminated
diagnostics ONLY in PATCHED (regressions):        []   ← zero new diagnostics introduced
```

The five re-admitted rows each carry `verified-source at Product 485db8c25287…` (a 40-char immutable SHA), so `row_direct_witness` resolves them via the `immutable_witness` path — they are **not** orphan, and no `BROKEN-EVIDENCE-PATH` is emitted.

### Why evidence paths are not written into the rows

The repo's `matrix_coverage_lib.PATH_RE` only matches paths beginning with `reverify|verification|incoming|working|legacy|archive`. The six evidence reports physically live at `verified/verification/…/REPORT.md`, so any in-row path is matched as the inner `verification/…` substring and resolves to a non-existent `verification/…` file → `BROKEN-EVIDENCE-PATH`. Using the `verified-source + 40-hex-SHA` immutable witness instead is the validator-supported, path-ambiguity-free option and keeps this wave a pure MASTER edit (no evidence-layout mutation).

### Remaining CI state after this wave

The 3 pre-existing `ORPHAN-ACTIVE-WORK` diagnostics (`AR-IDX-JS-02`, `D-2`, `HTML-BTN-TYPE`) are owned by PR #331's row wording (those rows carry no `verified-*` token, no SHA, no resolvable evidence path). They are **not caused by this wave and not fixed by it** — fixing them is a separate narrow edit to those three rows (add `verified-source at Product <SHA>` or a resolvable evidence path), best done by the #331 owner or as a distinct follow-up to avoid editing rows this wave does not own. This wave's contract is: **zero new diagnostics, parity restored for the 5 re-admitted findings.**

## How to apply

```bash
# from AuditRepo root, on a fresh branch off current main (== 7547faba today)
git checkout -b agent/bugverifikator-master-readmit-wave-20260717
git apply readmit.patch          # or: patch -p1 < readmit.patch
python3 scripts/check_matrix_coverage.py --verbose   # expect 3 pre-existing ORPHAN only
git add projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md
git commit -m "matrix(gb): re-admit 5 dropped findings (SW precache, CSS val comment/anon, path dots, SEO orphan) — GB-MASTER-COUNT-DRIFT-20260818"
# open PR; do NOT push to main
```

## Claim / preservation boundary

- Claim boundary: AuditRepo `main` at `7547faba` (post-#331 tree) for the matrix shape; Product `main` at `485db8c25287…` for the five `current-confirmed` witnesses.
- Preservation boundary: this wave becomes STALE if (a) a later commit re-inserts these five rows independently (deduplicate before merging), (b) Product `main` advances past `485db8c` on any of the five owners (`sw.js`, `scripts/css-layer-validator.js`, `src/components/biografii/BiografiiRecentSection.astro`, `sitemap.xml`/home nav), or (c) #331 is closed without merging and `main` diverges from `7547faba`.
