# gb-is-my-strength / gospod-bog.ru

Активный AuditRepo-проект для `FedorMilovanov/gb-is-my-strength`.

## Start

1. [`DOC_MAP.md`](./DOC_MAP.md) — где какой тип информации.
2. [`WORK_QUEUE.md`](./WORK_QUEUE.md) — необязательные выбранные направления.
3. [`verified/SYSTEM_THEMES.md`](./verified/SYSTEM_THEMES.md) — повторяющиеся классы причин.
4. [`verified/MASTER_BUG_MATRIX.md`](./verified/MASTER_BUG_MATRIX.md) — существующий finding registry и исторические closures.
5. [`verified/CLOSURE_LEDGER.md`](./verified/CLOSURE_LEDGER.md) — компактные результаты новых волн.
6. `incoming/` — исходные audit reports и evidence.

Общая модель: [`../../AUDITREPO_OPERATING_MODEL.md`](../../AUDITREPO_OPERATING_MODEL.md).

---

## Stable project facts

- Source repository: `FedorMilovanov/gb-is-my-strength`.
- Public site: `gospod-bog.ru`.
- Architecture: Astro + strangler pattern with native routes and preserved legacy/static surfaces.
- Production-like verification must use the project’s actual strangler build path; plain `astro build` can create false findings.
- The project includes route-level applications, article/reader surfaces, search, maps, PWA/offline behavior and shared runtimes.

Current Product HEAD, open PRs, branch ownership, workflow status and deploy identity are read from the Product repository when work begins. They are intentionally not duplicated here.

---

## What AuditRepo is for in this project

- accumulate many independent audit passes;
- preserve source/build/browser/live evidence on explicit anchors;
- compare and challenge findings;
- find duplicates and systemic roots;
- choose any convenient repair scope;
- record owner decisions, parked items and accepted risks;
- retain a useful history without maintaining a second Product control plane.

---

## Work styles

### Broad audit intake

Agents may perform many passes over different surfaces and add raw reports without waiting for a global synthesis.

### Verification wave

A verifier can take any package, check the relevant current Product surfaces and classify it into local findings, systemic roots, duplicates, stale/invalid items, parked work and owner decisions.

### Local closure

One small item may be repaired and closed with a compact ledger entry.

### System closure

One common owner/process/contract may absorb many historical symptoms. Representative evidence and a class-level guard are preferred over individually replaying every old scenario.

### No-fix disposition

A real issue may be parked, accepted or marked not worth fixing when the cost/risk is disproportionate.

---

## Important boundaries

- Raw reports are evidence, not automatic Product authority.
- Old SHA-specific findings are not automatically stale and are not automatically current.
- Before implementation, verify the selected evidence-critical surface only.
- Do not open AuditRepo sync work solely because Product `main` moved.
- Do not claim production/live behavior without production/live evidence.
- Do not convert content/rights decisions into purely technical fixes.
- Do not create a documentation transaction larger than the actual repair.

---

## Current transition

The project has a large historical `MASTER_BUG_MATRIX.md` with closed and open rows, manual counts and former `current/fixed-current` terminology.

The reform does not mass-rewrite that corpus. Instead:

- new governance is defined by the operating model;
- new work is selected through `WORK_QUEUE.md`;
- systemic understanding grows in `SYSTEM_THEMES.md`;
- new wave results are summarized in `CLOSURE_LEDGER.md`;
- old matrix material is consolidated gradually when useful.

This gives AuditRepo room to keep learning without forcing constant Product-state synchronization.
