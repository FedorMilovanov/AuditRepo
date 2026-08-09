# Lot media / placement readiness audit — 2026-08-09

## Finding

`LOT-MEDIA-PLACEMENT-01` — **release-readiness mismatch / in-flight implementation gap** — `CONFIRMED-CURRENT`, **not a shipped Product regression**.

The active Lot publication PR #1339 declares a final media barrier of **14 verified visual families**, each with honest `600/900/1200` WebP variants, plus a dedicated 1200×630 OG, and a browser witness that checks **all 14 raster illustrations**.

The active placement work has now progressed to a coherent **9 registered / 9 rendered** figure set, but the dedicated media branch still carries no unique bytes and the publication PR still declares 14 visible raster figures. The mismatch is therefore narrower than the earlier 6-placement snapshot but remains release-relevant.

## Exact current Product anchors

Latest Product main observed during this refresh:

- `3c7b3c199dcf3d2464f38a55550d730a3279c171` — merged reader #1267.

Current Lot-related branch state against that main:

- `lane/lot-media-20260809` — **identical to current main**: `ahead=0`, `behind=0`; no unique media-byte delta;
- `lane/lot-illustration-placement-20260809` — `ahead=11`, `behind=4`; semantic compare contains seven Lot source files and no raster assets;
- `lane/lot-source-polish-20260809` — stale historical branch, `ahead=1`, `behind=36`, no open PR; not treated as current publication authority;
- active publication owner remains PR #1339 / `release/lot-publication-20260809-r2`, itself `behind=7` from current Product main.

The placement branch is separate parallel work; this AuditRepo pass remains read-only toward it.

## What the placement branch actually contains

### Shared figure component

`LotFigure.astro` defines the expected canonical asset family shape:

```text
/images/articles/lot/<name>-600w.webp
/images/articles/lot/<name>-900w.webp
/images/articles/lot/<name>-1200w.webp
```

with width descriptors, a 1200×675 intrinsic fallback and metadata-driven alt/caption.

That structure is compatible with the stated 16:9 media contract **if** the eventual bytes have truthful dimensions/ratios and all declared paths resolve.

### Registry count: 9 publication metadata rows

Current `lotFigures.ts` declares exactly nine publication names:

1. `lot-two-roads`
2. `lot-jordan-plain`
3. `lot-sodom-gate`
4. `lot-sodom-crowd`
5. `lot-judgment`
6. `lot-wife-back`
7. `lot-cave`
8. `lot-ruth-naomi`
9. `lot-remember-wife`

The same file explicitly names five conceptual families that are deliberately **kept out / reserve**:

- `lot-abraham-smoke`
- `lot-moab-settlement`
- `lot-ammon-settlement`
- `lot-gen19-judges19`
- `lot-ruth-boaz`

Thus the conceptual set is still 14, but the current editorial placement contract encoded in source is nine visible families plus five reserves.

### Actual rendered placement count: 9

A fresh source census of every modified placement section now finds **one `<LotFigure>` for every registry entry**:

- `LotSectionOrientation.astro`: `lot-two-roads` — 1;
- `LotSectionChoiceAndRescue.astro`: `lot-jordan-plain` — 1;
- `LotSectionSodom.astro`: `lot-sodom-gate`, `lot-sodom-crowd`, `lot-judgment`, `lot-wife-back` — 4;
- `LotSectionAftermath.astro`: `lot-cave`, `lot-ruth-naomi` — 2;
- `LotSectionReading.astro`: `lot-remember-wife` — 1.

Total: **9 registry rows / 9 rendered placements**.

This supersedes the earlier in-flight snapshot that reported only six placements. That older count was truthful for an earlier branch state but is no longer current.

## Asset-byte state

The dedicated `lane/lot-media-20260809` now points exactly at current Product main and still has **zero unique media delta**.

The placement branch's seven-file semantic compare contains only Astro/TS source and no `public/images/articles/lot/*.webp` paths. Therefore the nine mounted figure contracts still do not bring their own 27 responsive raster bytes (9 × 600/900/1200) into that branch.

Disposition: placement semantics have caught up to their nine-row registry, but the referenced media byte families are still not present through the dedicated media lane/current main. This is expected for split in-flight work, but it is not publication-ready evidence.

## Why the declared gate and current plan still disagree

#1339 still says final browser evidence must exercise **all 14 raster illustrations**.

Current placement source intentionally publishes **9** and explicitly reserves **5**.

There are two legitimate end states, but one must be selected explicitly:

### A. Preserve the 14-visible-image publication contract

- promote all five reserve families into reviewed publication metadata/placement;
- create all 42 responsive WebP variants + dedicated OG;
- browser-test exactly 14 rendered figures.

### B. Accept the current 9-visible-image editorial contract

If nine figures is the intended reading density:

- owner changes #1339/final checklist from 14 to **9** visible raster figures;
- generate exactly 27 in-article responsive WebPs for those nine families, plus dedicated OG;
- browser witness asserts `expectedLotFigures === 9`, not merely “iterate whatever exists”;
- the five reserve concepts remain reserves and are not counted as delivered publication media.

What is **not** acceptable is to leave #1339 claiming 14 while source intentionally renders nine and a browser loop silently passes over only those nine.

## Correct closure checks

For final media/placement closure require:

1. declared expected visible figure count equals actual DOM `[data-lot-figure]` count;
2. declared published asset-family count equals registry count;
3. every published registry family has exactly the required 600/900/1200 bytes;
4. no `<source srcset>` or fallback `src` points to a missing file;
5. file dimensions, intrinsic ratio, `naturalWidth`, `currentSrc` and responsive selection are checked at 390/412/1024/1366;
6. every `alt` and `figcaption` preserves the exact evidence boundary of the scene;
7. reserve/unpublished families are not counted as delivered merely because a prompt or generated candidate exists;
8. dedicated Lot OG is verified separately from in-article figures;
9. placement/media/publication branches are refreshed to then-current main and exact-head checks are rerun;
10. final browser evidence asserts a **positive exact expected count**, never a vacuous DOM iteration.

## Current truthful status

```text
Product main: 3c7b3c199dcf3d2464f38a55550d730a3279c171
media branch: identical to main; 0 unique media-byte delta
placement branch: ahead=11 / behind=4
conceptual families named: 14
publication registry rows: 9
actual rendered figure placements: 9
explicit reserve / kept-out families: 5
publication PR declared final raster count: 14
status: IN-FLIGHT / NOT RELEASE-READY
```

Final disposition remains `CONFIRMED-CURRENT READINESS MISMATCH`, not a production defect and not permission to take over the active placement/media work.