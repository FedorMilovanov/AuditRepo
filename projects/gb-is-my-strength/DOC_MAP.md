# DOC MAP — gb-is-my-strength

Эта карта объясняет, где искать evidence и кто каким типом факта владеет.

Главная модель AuditRepo: [`../../AUDITREPO_OPERATING_MODEL.md`](../../AUDITREPO_OPERATING_MODEL.md).

## Owner directive

AuditRepo для `gb-is-my-strength` — не зеркало каждого Product HEAD. Он хранит накопленные аудиты, проверенные на своих anchors, системные темы и выбранные направления.

```text
collect many passes
→ verify a selected package
→ deduplicate symptoms
→ identify local vs systemic work
→ close any owner-selected scope
```

Новый Product commit не требует отдельной authority-sync транзакции.

---

## Fact ownership

| Fact | Owner | Notes |
|---|---|---|
| Current Product code, HEAD, open PRs, branches, CI and deploy | `FedorMilovanov/gb-is-my-strength` | проверять непосредственно перед Product work; не копировать постоянно сюда |
| Raw observations and evidence | `incoming/<agent>/<date>/` | immutable anchor-specific reports |
| Temporary verification-wave synthesis | `working/` | не current truth навсегда |
| Active local findings and legacy historical rows | `verified/MASTER_BUG_MATRIX.md` | transitional monolith; do not grow verbose closure ritual |
| Systemic root themes | `verified/SYSTEM_THEMES.md` | classes of causes; revalidate when selected |
| Owner-selected optional priorities | `WORK_QUEUE.md` | may contain 0, 1 or many lanes; not an obligation |
| Compact wave/closure history | `verified/CLOSURE_LEDGER.md` | new proportional summaries; legacy closures remain discoverable in matrix/archive |
| Meaningful conflicts | `verification/` | only when a real decision is disputed |
| Significant current checks | `reverify/` | only when needed for work/disposition |
| Historical/superseded material | `archive/` | evidence, not active guidance |
| Stable project orientation | `README.md` | no volatile HEAD/counts |

---

## Start here by goal

| Goal | Read |
|---|---|
| Understand how AuditRepo now works | `../../AUDITREPO_OPERATING_MODEL.md` |
| Add a new audit pass | `incoming/` + `../../projects/_templates/AGENT_REPORT_TEMPLATE.md` |
| See possible next work | `WORK_QUEUE.md` |
| Understand recurring root causes | `verified/SYSTEM_THEMES.md` |
| Inspect current/legacy finding registry | `verified/MASTER_BUG_MATRIX.md` |
| Review recent wave outcomes | `verified/CLOSURE_LEDGER.md` |
| Investigate old evidence | `incoming/`, `reverify/`, `archive/` |

`NEXT_AGENT_PROMPT.md` remains only as a compatibility pointer for older agents. It is no longer a global exact-authority mirror.

---

## Finding lifecycle

```text
incoming observation
→ candidate
→ verified-at-anchor when evidence supports it
→ selected-for-current-check only when owner chooses work
→ current-local / systemic-root / duplicate / stale / invalid / parked / decision
→ proportional repair or disposition
```

Movement of global Product `main` does not silently reopen, close or stale rows.

---

## Verification-wave rule

A wave may process any number of findings. It should prefer one package-level synthesis over dozens of one-row PRs.

Expected outputs:

- current local defects;
- systemic root causes;
- duplicates;
- stale/invalid/audit-drift;
- parked or accepted risk;
- owner decisions;
- a short optional work queue.

The owner may close a single item, a cluster, a systemic root or the entire wave.

---

## Proportional closure

Update only what materially changed:

1. active finding classification, if needed;
2. `SYSTEM_THEMES.md`, if causal understanding changed;
3. `WORK_QUEUE.md`, if selected priorities changed;
4. one compact `CLOSURE_LEDGER.md` entry for a completed wave or meaningful local closure;
5. a separate `reverify/` document only for disputed, systemic, security/live/rights or historically valuable evidence.

Do not update README, registry, matrix masthead and handoff merely to copy a new Product SHA.

---

## Matrix transition

`MASTER_BUG_MATRIX.md` currently includes hundreds of historical closed rows and manually repeated counts. It remains intact during this reform to avoid risky mass rewriting.

From this point:

- do not add global HEAD synchronization solely for freshness;
- prefer compact closure summaries;
- consolidate old closed rows in future dedicated waves;
- separate defects, improvements, refactoring and AuditRepo maintenance conceptually;
- treat the matrix’s old `current/fixed-current` language as historical terminology tied to its evidence.

---

## Minimal session ritual

At the start of Product work:

1. choose a finding or system theme;
2. read its evidence;
3. inspect current Product owner and overlapping PRs;
4. verify the selected surface only;
5. choose local/system/park/decision.

At the end:

1. preserve Product evidence in Product;
2. record only the material AuditRepo disposition;
3. do not create a documentation control plane larger than the repair.
