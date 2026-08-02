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

## Merge-time authority note (2026-08-02)

The original source inspection was performed at `2273b8c930eebf383d429b917d3636bc28a80bae`.
Before merge, source `main` advanced to `8f17085dc8411cffbcb5a4dcd2f8fc5db9c30a97`:
**45 commits ahead** of canonical `efaf2a51` and **31 commits ahead** of the original inspection SHA.
See `MERGE_TIME_REVALIDATION_2026-08-02_8f17085.md`. Its path-impact review confirms that the
SD-6 and SD-8..SD-15 source/data verdicts carry forward; only `migration/page-ownership.json`
overlapped the delta and was directly rechecked. Browser-class rows remain unverified and open.

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
- At merge review, compared `2273b8c9..8f17085d`, checked evidence-path overlap, re-read the
  changed page-ownership registry, and recalculated stale-witness distances.

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
  2026-07-09 "needs-live-recheck" note; recommend a fresh reverify on source HEAD `8f17085d`
  (or a newer exact HEAD if source moves again) after SD-5 authority sync.
- `SD-5` — **authority drift (P1-freshness):** AuditRepo canon records source main = `efaf2a51`,
  while merge-time source main = `8f17085d`, **45 commits ahead**. Needs verifier authority-only
  sync + paired same-SHA reverify; do not claim production parity.
- `SD-6` — **map-engine verdicts originally source-verified at `2273b8c9` and carried to `8f17085d`:**
  ASTRO-P1-02, ENGINE-P1-21/22/23/28, MAP-P1-14/15 are revert-close candidates; MAP-P1-11 and
  ENGINE-P1-26 remain OPEN. Do not auto-close without reverify.
- `SD-8` — **still-open cluster carried to `8f17085d`:** BASE-P1-01/02, RIVER-P1-01/02/03,
  QUAL-P1-05 remain open; QUAL-P1-04 likely fixed (browser reverify); QUAL-P1-06 partial.
- `SD-9` — **data-layer triage rechecked at `8f17085d`:** QUAL-P2-03 remains stale/fixed because
  `/karty/` plus all ten Karty subroutes remain in page-ownership; QUAL-P1-07, QUAL-P2-02,
  REG-P1-01 remain open; DATA-P2-01 remains partial.
- `SD-10` — **map-engine/Avraam triage carried to `8f17085d`:** STILL OPEN FONT-P1-01,
  TEXT-P1-01, A11Y-P1-02/03, DRAW-P1-03, MINI-P1-01; FIXED candidate A11Y-P1-01;
  REVERIFY PERF-P1-01, DRAW-P1-01.
- `SD-11` — **sheet-engine/GATE triage carried to `8f17085d`:** STILL OPEN SEA-P1-01,
  ROUTE-P1-01, ORN-P1-01, GRAT-P1-01, RELIEF-P1-01, HALO-P1-01, GLYPH-P1-01;
  FIXED candidate GATE-P1-02.
- `SD-12` — **remaining Karty units carried to `8f17085d`:** STILL OPEN MAP-P1-12, MAP-P1-20,
  SIG-P1-01, WAYP-P1-01, MEDIA-P1-01, LOD-P1-01; FIXED candidates COMP-P1-01, CSS-P1-01;
  browser/runtime/CI rows still need browser reverify.
- `SD-13` — **tour/story/a11y carried to `8f17085d`:** STILL OPEN MAP-P1-03, MAP-P1-01,
  MAP-P1-02, MAP-P1-13; FIXED candidate ASTRO-P1-04.
- `SD-14` — **GATE/DRAW carried to `8f17085d`:** GATE-P1-01 PARTIALLY FIXED; GATE-P1-04 FIXED;
  DRAW-P1-02 OPEN; GATE-P1-03 browser/CI class.
- `SD-15` — **Vosk/genealogy carried to `8f17085d`:** FIXED NEW-VOSK-FETCH-NO-ABORT and
  AR-AUDIT-17; STILL OPEN NEW-VOSK-DEAD-SPLITSENTENCES; REVERIFY NF-DEAD-ENHANCE-SHIM.
- `SD-7` — **stale-witness surface:** 65 rows on `32ae0d7d`, now **638 commits behind** source
  `8f17085d`; supplementary witnesses are `2ca2af3` (**729 behind**), `21624a3` (**689 behind**),
  and `30bf3f5c` (**1136 behind**). Recommend one batched Karty reverify lane on the exact source HEAD.
- Everything else (P0/P1/P2/P3/Refactoring/AuditRepo row counts; HEAD vs prod `abf1edba`;
  DOC_MAP and PROJECT_REGISTRY target files) synchronized OK. Coverage deep-dive clean: no
  ORPHAN-CLAIM; registry invariants hold; cross-section duplicate D-* IDs are benign.

## Files in this folder
- `REPORT.md` — original universal work package (sections 1–8) and point-in-time evidence.
- `CONSOLIDATED_DISPOSITION.md` — merge-reviewed disposition SD-1..SD-15.
- `VERIFIED_DISPOSITIONS.md` — explicit source/data verdict table (SD-6..SD-15).
- `MERGE_TIME_REVALIDATION_2026-08-02_8f17085.md` — superseding current-HEAD/delta review.
- `evidence/` — 23 files (per-finding + per-cluster).
- `proposals/` — 15 files.
- `artifacts/` — `BROWSER_REVERIFY_PLAN.md` + reverify skeleton
  `CURRENT_HEAD_REVERIFY_2026-08-01_2273b8c9_karty-browser.md`; use the exact current source SHA
  when executing it, not the historical filename SHA.

## Freedom with Evidence
All original observations are evidence-based against AuditRepo `bc067a1` and source `2273b8c9`;
the merge-time carry-forward is recorded against source `8f17085d`. No canonical matrix row,
status, severity, counter or source file was modified by this lane.