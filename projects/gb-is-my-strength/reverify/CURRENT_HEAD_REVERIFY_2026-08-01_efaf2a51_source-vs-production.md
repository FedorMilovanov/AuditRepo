# CURRENT HEAD REVERIFY — source `efaf2a51` vs production `abf1edba`

**Date:** 2026-08-01
**Status:** `SOURCE_CURRENT / PRODUCTION_STALE_RELATIVE_TO_SOURCE`
**Production claim for `efaf2a51`:** `no`

## 1. Authority boundary

- Current source `main`: `efaf2a51b1fcc7b7d3f8c9558ecb5acf849df3b3`.
- Previous canonical source authority: `0ff04232ee08a8f81711db640395901124aca787`.
- Last exact production authority: `abf1edba190280e554dfda085bef9fb6594c896d`.
- Source and production do not match; neither PR #691 nor PR #669 inherits production evidence.
- Active source owner at capture: #680 NoteRegistry. This synchronization does not change its branch, files, checks or review state.

## 2. New source ancestry

### PR #691 — canonical article headline contract

- merge: `c5ae325e5e73f1997112c395fd28f3a52f02ee96`;
- exact head: `6736bf988e3c4e69ffe4ffe90c4f987b12523674`;
- final scope: four files;
- contract aligns document title, Open Graph, Twitter, Article JSON-LD and breadcrumb headline;
- explicit same-repository label-gated autofix permission is registered fail-closed;
- 14/14 triggered workflows passed: Node `30682319933`, Shared `30682319896`, Metadata `30682319931`, Overlay `30682319901`, Glossary `30682319899`, Editorial Metadata `30682319918`, Deploy Candidate `30682319897`, TTS `30682319893`, Native `30682319894`, Dateline `30682319922`, Print `30682319917`, Visual `30682319930`, Route Registry `30682319905`, Runtime `30682319903`;
- production was not claimed.

### PR #669 — governed Karty route inventory

- merge/current source: `efaf2a51b1fcc7b7d3f8c9558ecb5acf849df3b3`;
- exact head: `94748bb7e4ce7035a5687465200fb24676ac4249`;
- final scope: four files;
- replaces the hardcoded audit-pending count with one governed inventory over route records while preserving exact publication validation;
- current visible value remains one published and nine audit-pending maps;
- 8/8 triggered workflows passed: Shared `30682398717`, Metadata `30682398738`, Glossary `30682398711`, Deploy Candidate `30682398714`, Dateline `30682398734`, Native `30682398731`, Print `30682398719`, Visual `30682398716`;
- production was not claimed.

## 3. Workflow Policy closure already canonical

AuditRepo PR #117 verified source PR #688 and moved `WORKFLOW-POLICY-SHADOW-ERA` from P1-open to fixed. Canonical counters are now:

```text
closed: 165
P1 open: 96
total open: 191
```

This authority synchronization preserves those row dispositions and counts.

## 4. Last exact production witness

The admitted exact production remains:

- release/control SHA `abf1edba190280e554dfda085bef9fb6594c896d`;
- deploy `30669840189`, attempt `1`;
- candidate `abf1edba190280e554dfda085bef9fb6594c896d:30669840189-1`;
- release digest `sha256:9ae50fc99476af4822181889ac9d3a802138e06265d5ac09d80133f64563d50a`;
- candidate artifact `8808656612` / `sha256:c7ddd49753c2a6f7c93b4962cce372a1be99d6f7871e76db6d6b9de12f4c3159`;
- generic live artifact `8808666936` / `sha256:28333e7d19ebc51641f00ca086e8d77d2a92880ee546161f78a8e4d034957f10`;
- TTS artifact `8808667707` / `sha256:7b8354caca07d12e682243c22487afe189413dbd5a0fbe36235c55395089aa54`;
- ledger comment `5148074092`;
- physical Windows witness `5148209495`.

## 5. Decision

```text
current source = efaf2a51b1fcc7b7d3f8c9558ecb5acf849df3b3
last exact production = abf1edba190280e554dfda085bef9fb6594c896d
source != production
```

A new same-SHA readiness → candidate → Pages promotion → generic live → TTS → immutable ledger cycle is required before current source can become production authority.

## 6. Synchronization boundary

This lane updates only `NEXT_AGENT_PROMPT`, the matrix authority masthead/statistics label/session log and this paired reverify. It changes no bug rows, no counters, no source repository files, no Research/Drive data and no production evidence.
