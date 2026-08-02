# Intake — gb-is-my-strength — arena-sync-assessment — 2026-08-01

## Identity
- Project: gb-is-my-strength
- Agent: arena-sync-assessment
- Date: 2026-08-01
- Audited branch: arena/019fbded-auditrepo (AuditRepo)
- Audited SHA (AuditRepo): `bc067a1cbaf33ed3cafa72cf6f4e5201056125db`
- Current source HEAD at start: `efaf2a51b1fcc7b7d3f8c9558ecb5acf849df3b3` (per `NEXT_AGENT_PROMPT.md`)
- Last exact production authority: `abf1edba190280e554dfda085bef9fb6594c896d`
- Environment: Arena sandbox
- Build mode: source (AuditRepo documents; no product build run)

## Scope
- **Object of assessment:** synchronization of canonical AuditRepo data — bug counters, bug rows,
  HEAD/deploy authority and cross-document references between:
  `verified/MASTER_BUG_MATRIX.md`, `NEXT_AGENT_PROMPT.md`, `DOC_MAP.md`,
  `reverify/CURRENT_HEAD_REVERIFY_2026-08-01_efaf2a51_source-vs-production.md`,
  root `PROJECT_REGISTRY.md` and `DOC_MAP`/`PROJECT_REGISTRY` target files.
- **Systems checked:** matrix counter vs physical row counts; HEAD/deploy authority consistency;
  document-reference integrity (single-writer-per-fact targets); matrix internal status/severity consistency.
- **Out of scope:** source repo `FedorMilovanov/gb-is-my-strength` product code, Research repo,
  PremiumControls owner zone, the-legendary-poet corpus. No product bug is claimed.

## Method
- Counted physical data rows per matrix section (python, exact boundaries between `##` headers).
- Compared against the section-header counts, the `## Статистика` block and `NEXT_AGENT_PROMPT.md`.
- Grepped HEAD/deploy SHAs across the canonical docs for cross-document equality.
- Checked existence of every file referenced by `DOC_MAP.md` and `PROJECT_REGISTRY.md`.

## Findings summary
- `SD-1` — **resolved as NOT a counter bug (P3):** closed table physically holds 166 rows but the
  canonical closed counter 165 is correct (per `check_matrix_coverage.py`: 356 canonical / 191 open).
  The single non-canonical row is `NEW-68/69` (two distinct fixed bugs, slash makes it invisible to
  canonical ID counting). Options: split into `NEW-68`+`NEW-69` (counter→167) or rename to one
  slash-free ID (counter→166).
- `SD-2` — `AR-006` is marked CLOSED but is listed in the 🟣 AUDITREPO open section and is included
  in the canonical open total (191). Confirmed as the ONLY genuine closed-in-open row (full sweep).
- `SD-3` — `check_matrix_coverage.py` fails-closed on 2 unregistered evidence IDs
  (`RIGHT-4Q204-OPEN-SCHEMATIC`, `RIGHT-P72-TEXT-LINK-ONLY`) referenced in
  `reverify/..._9407cc92_genesis-b594-production.md:27`. They are Research rights-decisions, not
  bugs; recommended fix = two `informational` registry records.
- `SD-4` — `AUDIT-P3-OG-LCP-MISMATCH` (open, P3) has archive-only evidence (2026-07-05) + a
  2026-07-09 "needs-live-recheck" note; recommend a fresh reverify on the ACTUAL current source HEAD
  `2273b8c9` (after SD-5 authority sync).
- `SD-5` — **authority drift (P1-freshness):** AuditRepo canon records source main = `efaf2a51`
  (PR #669/#691 era), but the actual source main HEAD is `2273b8c9` (PR #730), **14 commits ahead**
  (live `gh api compare` => ahead_by=14). Needs verifier authority-only sync + paired reverify.
- `SD-6` — **map-engine fixes landed on actual HEAD (P2), source-verified:** on `2273b8c9` the engine
  fixes ASTRO-P1-02, ENGINE-P1-21/22/23/28, MAP-P1-14/15 (revert-close candidates); MAP-P1-11 (scale bar
  still `cfg.W0/view.w`) and ENGINE-P1-26 remain OPEN. Schedule reverify on `2273b8c9`; do NOT auto-close.
- `SD-8` — **source-verified still-open cluster on `2273b8c9` (P2):** BASE-P1-01/02, RIVER-P1-01/02/03,
  QUAL-P1-05 confirmed STILL OPEN (not fixed by PR #709); QUAL-P1-04 likely fixed (browser reverify to
  close); QUAL-P1-06 partial (timers 58→21). Fold into SD-7 reverify lane.
- `SD-9` — **data-layer triage on `2273b8c9` (P2):** QUAL-P2-03 stale/fixed (karty routes now in
  page-ownership); QUAL-P1-07, QUAL-P2-02, REG-P1-01 still open; DATA-P2-01 partial (avraam has paths,
  ishod doesn't).
- `SD-7` — **65 open Karty-cluster rows witnessed on `32ae0d7d`, 607 commits behind actual source main
  `2273b8c9` (P2):** none repair-ready per SHA-first without a fresh reverify; recommend one batched
  Karty reverify lane on `2273b8c9` (reuse SD-6 map-engine subset). **Supplementary:** +7 rows on
  other stale SHAs (`2ca2af3`/`21624a3`/`30bf3f5c`, 658-1105 behind) → ~72-row stale-witness surface.
- Everything else (P0/P1/P2/P3/Refactoring/AuditRepo row counts; HEAD vs prod `abf1edba`;
  DOC_MAP and PROJECT_REGISTRY target files) synchronized OK. Coverage deep-dive clean: no
  ORPHAN-CLAIM; registry invariants hold; cross-section duplicate D-* IDs are benign.

## Files in this folder
- `REPORT.md` — universal work package (sections 1–8) with full evidence.
- `evidence/` — grep/python output backing SD-1 and SD-2.
- `proposals/` — status/severity/repair-lane proposals.
- `comments/` — (none)
- `commands.log` — audit commands used.

## Freedom with Evidence
All observations are evidence-based against the AuditRepo current HEAD `bc067a1`. No canonical
matrix row, status, severity, counter or source file was modified by this lane.
