# Concurrent Edit Protocol — AuditRepo

AuditRepo receives parallel agent work. The goal is to preserve evidence and avoid logical overwrites **without** forcing every agent into a global exact-HEAD synchronization ritual.

## Core rule

```text
separate branches
+ clear file/fact ownership
+ narrow diffs
+ current-base check before merge
```

Do not push ordinary agent work directly to `main`.

---

## 1. Prefer separate layers over one shared file

Parallel work should normally land in different paths:

- raw agent work → `incoming/<agent>/<date>/`;
- package synthesis → a new file under `working/`;
- systemic themes → `verified/SYSTEM_THEMES.md`;
- selected priorities → `WORK_QUEUE.md`;
- compact completion → `verified/CLOSURE_LEDGER.md`.

Do not edit `MASTER_BUG_MATRIX.md` merely to record every intermediate observation or Product HEAD movement.

---

## 2. Branch and PR discipline

For a mutation:

1. start a branch from current AuditRepo `main`;
2. state the project and fact class owned by the branch;
3. avoid files already owned by an open competing PR;
4. update/rebase from current `main` before merge;
5. merge with a narrow reviewed diff.

An unrelated movement of Product `main` is not an AuditRepo branch conflict. Only AuditRepo content overlap and materially changed evidence matter here.

---

## 3. Fact ownership

Each volatile fact should have one owner file.

Examples for `gb-is-my-strength`:

| Fact | Owner |
|---|---|
| raw observation | original intake report |
| optional selected work | `WORK_QUEUE.md` |
| system root model | `verified/SYSTEM_THEMES.md` |
| active finding disposition | active matrix/backlog |
| compact wave result | `verified/CLOSURE_LEDGER.md` |
| current Product code/deploy | Product repository |

If another file needs the fact, link instead of restating it.

---

## 4. Matrix edits are exceptional and narrow

The historical matrix is a transitional monolith. When it must change:

- own explicit finding IDs or one bounded section;
- do not rewrite unrelated rows;
- do not replace the full file from a stale local snapshot;
- preserve all existing IDs and dispositions outside scope;
- recalculate legacy counts only when matrix rows actually move;
- prefer one package transaction for a verification wave over one PR per row.

A large system fix may update a cluster in one pass and record absorbed IDs compactly.

---

## 5. Append-only history

For closure or wave history:

- append a new dated entry;
- do not rewrite older entries to make them sound current;
- correct an old conclusion with a new explicit superseding entry;
- keep original evidence discoverable.

History witnesses an anchor; it does not need constant freshness edits.

---

## 6. Conflict handling

A real conflict exists when branches:

- change the same finding disposition differently;
- claim different canonical owners for one symptom;
- edit the same queue/system-theme decision incompatibly;
- replace or remove evidence another branch still needs.

Resolve by:

1. preserving both evidence packages;
2. identifying the exact disputed fact;
3. selecting one verifier disposition or recording an unresolved conflict;
4. avoiding broad “take ours/theirs” replacement of governance files.

---

## 7. No write-capable reconciliation control plane

Do not create temporary GitHub Actions writers, compute-only PRs, self-clean publishers or cleanup PR chains for ordinary Markdown reconciliation.

Use:

- a normal branch;
- current-base merge/rebase;
- narrow file updates;
- ordinary CI;
- squash merge when desired.

Deep branch forensic is periodic/manual and should not be used as a substitute for simple concurrent-edit discipline.

---

## 8. Before merge checklist

- current AuditRepo base checked;
- no overlapping open PR owner;
- diff contains only intended fact classes;
- raw evidence was not rewritten;
- old historical claims were not silently altered;
- Product HEAD/deploy facts were not copied unnecessarily;
- validators pass;
- the documentation transaction is not larger than the decision it records.

---

## Data-loss recovery

If an AuditRepo merge actually loses content:

1. identify the last commit containing the evidence;
2. restore only the missing files/rows;
3. record the incident and root cause;
4. improve file ownership or split the monolith;
5. do not add a permanent global exact-history gate unless the risk justifies its cost.
