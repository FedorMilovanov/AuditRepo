# WORKFLOW-POLICY-SHADOW-ERA — closure reverify

**Date:** 2026-08-01
**Finding:** `WORKFLOW-POLICY-SHADOW-ERA`
**Disposition:** `FIXED / SOURCE+CI VERIFIED`
**Source merge:** `0ff04232ee08a8f81711db640395901124aca787` (PR #688)
**Exact PR head:** `fff6155b651620b5e497585948d3b2a9fae5cd67`
**Production claim:** `no`

## 1. Original claim

The matrix row stated that workflow policy still protected historical shadow/route names and hardcoded `dist` paths instead of effective route-registry coverage, capability gates, read-only validation and permission contracts.

## 2. Source evidence

PR #688 closes that exact claim without route, UI, content, NoteRegistry, Karty or metadata-registry changes:

- `dist-dry-run.yml` no longer hardcodes article/series/map route files; it invokes `check-page-ownership.js --dist --production-like`, whose authority is `migration/page-ownership.json`;
- `git diff --exit-code` proves full validation leaves tracked source unchanged;
- ordinary workflows reject undeclared writers, job-local write permission and publication commands;
- write-capability jobs are structurally constrained to same-repository, label-gated PR branches with explicit write → validate → commit ordering and branch-bound push;
- transactional Editorial Metadata observation remains credential-free, trap-restored and exact-file clean;
- candidate build, immutable promotion, generic live and TTS witnesses remain separated;
- Shared Files Guard keeps actionlint blocking;
- stateful failure notification covers the current SYSTEM gates.

Source issue #64 was closed by the squash merge.

## 3. Exact-head CI evidence

Exact head `fff6155b651620b5e497585948d3b2a9fae5cd67` passed every triggered workflow:

- Metadata & IndexNow Readiness — run `30681815950`;
- Shared Files Guard — run `30681815958`, including Workflow Policy v2 and actionlint;
- Node Toolchain Contract — run `30681815957`, including the source-read-only proof;
- TTS Download Consent — run `30681815981`, including source/mutation contract and real-route Chromium matrix.

Review threads: `0`.

## 4. Decision

The implementation now satisfies every operative clause of the finding. The row is moved from P1-open to fixed.

Counter transition:

```text
closed:     164 -> 165
P1 open:     97 -> 96
total open: 192 -> 191
```

Other severity counts and all unrelated rows remain unchanged.

## 5. Production boundary

Current source remains `0ff04232ee08a8f81711db640395901124aca787` while the last exact production authority remains `abf1edba190280e554dfda085bef9fb6594c896d`.

```text
source != production
```

This closure is source+CI evidence only and does not promote `0ff04232` to production authority.
