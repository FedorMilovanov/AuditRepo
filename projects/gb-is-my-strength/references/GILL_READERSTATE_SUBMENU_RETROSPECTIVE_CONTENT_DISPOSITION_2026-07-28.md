# Gill ReaderState submenu retrospective content disposition

**Date:** 2026-07-28  
**Audited site main:** `4c7aaf7ffc8471e6cda70891a65bbf2aa2e7b625`  
**Unmerged historical head:** `0f5c865a426a16f90cade86fb474cd79af99cf0c`  
**Accepted PR #258 head:** `5ad9ae8c151123760c49cc2e0a3ce696c4953615`  
**Forensic anchor:** `07a3258779eeabd8e44d95158954a95b90876c96`

## Rule

This disposition is based on actual files and source content. The unmerged branch is not classified from its name, lack of PR or age.

## Unmerged branch contents

`fix/gill-readerstate-submenu-release-2026-07-24` changes exactly four files:

- `.github/workflows/_temp-gill-release-materializer.yml` — 277-line temporary write-capable workflow;
- `scripts/_temp-gill-release-materialize.py` — 200-line exact replacement/materialization script;
- `scripts/_temp-gill-visibility-materialize.py` — 54-line post-collapse visibility patch;
- `src/components/article-pilots/gill-series/gillSeriesData.ts` — intermediate data blob `d84f5c3d33c9bc069556e732f1fb1f19f4aaa8fd`.

The temporary workflow has `contents: write`, checks out the named branch, applies exact source replacements, writes the reconciliation registry and permanent read-only Gill workflow, runs production-like checks and prepares a guarded product push. It is migration evidence, not a permanent workflow and must not be merged into current main.

## Valuable methodology retained

The materializer scripts preserve the exact migration method that produced the accepted ReaderState/submenu repair:

- require exactly one matching old source block before replacement;
- derive the Gill rail index from real represented targets and the shared ReaderState `scrollY` snapshot;
- preserve ReaderState as the only scroll/rAF/geometry owner;
- use the canonical 140px Gill anchor offset;
- keep active, passed, counter and part-TOC state on one canonical index;
- re-check active-row visibility after the 560ms group expansion/collapse cycle;
- construct the relabel map and permanent read-only submenu workflow deterministically.

Current product code contains these behaviors. In current `js/floating-cluster-controller.js`, lines around the Gill rail transaction include `railLine = scrollY + 140`, target-position-derived `activeIdx`, `activeGroupChanged`, `keepActiveRowVisible`, and the delayed 620ms visibility re-check. The old scripts therefore remain useful forensic methodology but do not contain an unshipped runtime fix.

## Intermediate data review

The old data blob is not identical to the accepted/current file. It preserves earlier editorial choices, including:

- Part III «Экзегет» rows for Wesley and justice that were later replaced by the current `#sec-duty-faith`, `#sec-conclusion` and `#sec-sources` structure;
- earlier справочник label/mobile text, cover path and broader summary wording.

Those values are not silently discarded. The complete old branch is retained as a forensic archive. They must not be restored wholesale because the accepted/current data follows the later native headings and current article structure.

## Accepted product proof

PR #258 was merged. Current main preserves its product:

- historical PR #258 and current `gillSeriesData.ts` share Git blob `5e5974ad2604717d82a84af80e00c82402755907`;
- current controller contains the exact ReaderState/submenu transaction and visibility correction;
- current `data/gill-submenu-anchor-reconciliation.json` retains the relabel map, current-document reorders and historical witness relationship, with later reconciliation date and additional accepted detail;
- permanent `.github/workflows/gill-pre-v16-submenu.yml` remains the read-only contract;
- temporary materializer/writer files are absent from current main.

## Preservation refs

- complete unmerged materializer branch:
  `archive/forensic-gill-readerstate-submenu-materializers-20260724` → `0f5c865a426a16f90cade86fb474cd79af99cf0c`;
- combined history anchor:
  `archive/forensic-gill-readerstate-submenu-histories-20260728` → `07a3258779eeabd8e44d95158954a95b90876c96`.

Neither archive is authorized for merge or normalization.

## Authorized working-ref normalization

After this record is merged, these two working refs may be force-normalized to the exact current site main, after confirming that they still equal the audited heads:

- `fix/gill-readerstate-submenu-release-2026-07-24`;
- `lane/system-gill-readerstate-deploy-unblock-2026-07-25`.

## Final disposition

- accepted runtime/data/workflow: `PRESERVED-IN-MAIN`;
- temporary write workflow: `TRANSIENT-MIGRATION-ONLY`;
- deterministic materializer scripts and earlier editorial data: `FORENSIC-ARCHIVE-RETAINED`;
- old working refs: eligible for normalization only after exact-head recheck.
