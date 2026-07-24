# CURRENT HEAD REVERIFY — 2026-07-24 — cache-bust fail-closed policy

## Authority boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Source merge: `20ded750327f79e46efa4e50d4d7cd7171e7d9a1` — PR #187
- Exact verified PR head: `c8cd3a03c00bdb68606c88b42e25f7f435c0d5e8`
- Last exact production authority remains `8a5352671375fdb01b6c30273c25ec4283a13f69`
- This document advances source/CI truth only; it does not claim a new exact Pages deployment.

## Closed canonical row

`CACHE-BUST-NO-WRITER`

The historical row assumed that every stale `?v=` state required a general workflow writer that would mutate source after merge. That prescription is unsafe under concurrent-agent development and is now superseded by a fail-closed policy:

1. Shared Files Guard runs the default read-only `scripts/cache-bust.js` on every pull request and every push to `main`.
2. Metadata & IndexNow Readiness owns every `main` push through its `**` catch-all and checks source revisions before the production-like build.
3. Automatic Pages deploy follows only a successful readiness run and checks out the exact `workflow_run.head_sha`; manual recovery runs the same read-only check.
4. `scripts/cache-bust.js` writes only after explicit operator `--write`; detected drift exits nonzero instead of silently rewriting.
5. Arbitrary workflow writers are forbidden by `workflows:check`.

## Constrained glossary exception

The glossary workflow already contained a deliberate placement/asset autofix job. PR #187 does not widen it. The policy permits that single exception only when all of these remain true:

- pull-request event;
- explicit `autofix` label;
- same-repository head;
- write permission scoped to the autofix job while top-level permissions remain read-only;
- checkout and push-back to the requesting PR head;
- normalizers execute before `cache-bust.js --write`;
- the default read-only cache-bust check executes afterward;
- `git add -u` stages only tracked normalized files; `git add -A` is forbidden.

Any second writer or weakened exception guard is blocking.

## Permanent source scope

1. `scripts/check-workflows.js`
2. `scripts/lib/cache-bust-workflow-policy.js`

No page, content, CSS, runtime asset, route or workflow YAML was changed by PR #187.

## Exact-head evidence

| Contract | Run | Result |
|---|---:|---|
| Cache-bust policy materialization | `30086392750` | baseline topology, 17 adversarial mutations, current read-only state and live stale-asset mutation success |
| Shared Files Guard | `30086484719` | asset revisions, workflow policy, readiness/deploy linkage, shared/runtime regressions, strict guard and actionlint success |

The live adversarial test appended a tracked mutation to `js/search.js`, ran the default cache-bust command, required a nonzero exit, confirmed a stale-file diagnostic and verified that the mutated file hash did not change during the check. The original file was then restored. This demonstrates fail-closed detection without source rewriting.

## Why no general writer was added

A general post-merge writer would race other agents, create moving-main commits after review and make deployment authority harder to prove. The accepted architecture rejects invalid revisions before merge and before deployment. Explicit normalization remains reviewable in the requesting PR, with one narrowly constrained glossary exception.

## Counter transition

- Closed: `142 → 143`
- P1 open: `95 → 94`
- Total matrix open: `193 → 192`
- P0/P2/P3/refactoring/AuditRepo counters unchanged.
