# Regression / Preservation Wave 5 — guard retirement census

Date: 2026-08-07
Status: `CENSUS_COMPLETE / FINAL_CLOSE_AFTER_WAVE4_MERGE`

## Purpose

Close the regression-forensic campaign without replacing one pile of brittle guards with another. This wave reviews the known current guard-quality findings from the 2026-08-07 115-check forensic ledger and decides which contracts were repaired, which should remain, which should be downgraded, and whether any additional Product guard deletion is justified.

This is a **retirement census**, not a mandate to reduce test count.

## Result so far

The important false-green/proxy defects were already eliminated by Product Waves 1A and 1B. No additional blocking Product guard has been proven low-value enough to justify a separate deletion PR at this point.

Therefore the default Wave 5 outcome is:

> **no mass guard deletion; keep meaningful domain contracts, retire only already-proven proxies, and avoid expanding generic fallback checks into semantic oracles.**

---

## Closed by Wave 1A — authority / generic coverage

### P06 — zero/empty comparison could look green

**Closed.**

Current content coverage exposes `expected / exercised / explicit-skips / undeclared` and fails if:

- authority is undeclared;
- an authoritative comparison is expected but nothing is exercised.

An intentionally empty authoritative set is valid only when current authority is explicit and no comparison is expected.

### P07 — false “multiset” semantics

**Closed.**

Legacy count `3` → dist count `1` now records a deficit of `2`, not zero.

### P09 — warning followed by ordinary OK

**Closed.**

Warnings are no longer simultaneously represented as normal PASS lines.

### P10 / P11 — route-specific legacy threshold / dead Avraam 40% threshold

**Retired.**

The generic coverage owner no longer contains route-specific ALLOW/THRESHOLD policy. Strict-native Avraam is not forced back under old-HTML authority.

### Current authority duplication

**Retired.**

Route profiles own current legacy/reference disposition. Immutable ledger status/classification fields remain historical snapshot metadata at `auditedAtCommit`, while identity/hash evidence stays blocking.

This removes the maintenance pattern where a legitimate current authority decision required manually rewriting a second current table.

---

## Closed by Wave 1B — Avraam false-green/proxy guards

### P13 — always-true Shechem assertion

**Closed and replaced.**

The `condition ? true : true` assertion was removed. Current contract checks the actual Shechem route dispute title and kills an in-memory corruption mutation.

### P14 — no mutation proof for the important native apparatus

**Closed.**

The 14-item `Источники и метод` apparatus now has stable semantic IDs and deletion/duplication mutation evidence.

### P16 — research document line-count proxy

**Retired.**

`research document <= 320 lines` was removed because line count is not preservation quality and would false-red legitimate research expansion.

---

## P15 — hard-coded exact counts: split, do not blanket-delete

The forensic concern was correct in principle: exact counts can be either true invariants or harness drift.

Current decision:

### KEEP — domain counts whose number is itself the contract

Examples:

- Avraam 19 canonical places;
- 47 current scientific variants;
- exact verified waypoint set/order where authored stage identity is part of route semantics.

These values describe frozen route/data truth and have direct runtime/domain meaning. They are not analogous to “document must be <= N lines”.

### RETIRE / DO NOT REINTRODUCE — proxy counts

Examples:

- source file line-count ceilings;
- arbitrary byte/word floors used as completeness proof;
- exact static annotation counts when runtime hydration/current prose owns the capability;
- fixed test-count assertions whose only meaning is “the test currently has N cases”.

No new current blocking instance of this second class was proven during this census beyond those already removed in Waves 1A/1B.

---

## P08 — Russian words >= 3 characters in generic legacy coverage

**Downgrade, do not expand into a universal semantic tokenizer.**

The generic legacy occurrence comparison is a fallback for explicitly authoritative legacy surfaces. Its Russian-word tokenization does not protect:

- dates/numbers;
- English names/terms;
- Greek/Hebrew;
- source IDs;
- structured annotations.

Trying to fix this by endlessly expanding the regex would recreate a brittle pseudo-semantic oracle.

Wave 4 instead puts high-value strict-native meaning into typed Accepted Semantic Manifests. Therefore:

- keep the generic word comparison as a bounded fallback where legacy authority is explicit;
- do not advertise it as semantic completeness;
- protect dates/names/source IDs/claims on high-value routes through typed current-owner contracts.

No Product rewrite is required solely for P08.

---

## P12 — authority flip without a one-time migration receipt

The original risk was real: if a route could change from authoritative legacy to `reference-only` and the validator immediately skipped it, content could disappear while the new state looked legitimate.

### Current 2026-08-07 corpus disposition

For the **existing current routes**, the forensic campaign itself now acts as the one-time acceptance receipt:

- explicit route-profile authority;
- immutable retained-reference identity/hashes;
- exact Wave 1A full publication/control-plane matrix (10/10 workflow groups);
- high-signal semantic recovery review;
- retained branch archaeology (`UNIQUE_REVIEW=0`);
- positive semantic pilot on Avraam and Wave 4 pilots for Hermenevtika/Gill I.

Therefore the current already-migrated corpus does not need another duplicated per-route authority ledger merely to manufacture paperwork after the fact.

### Future transition policy

A future `canonical/runtime-required → reference-only/absent` transition should be treated as a **migration transaction**, not an ordinary metadata edit. The evidence should prove current owner/source, production projection and important capabilities/semantic units before the old oracle is retired.

Do not implement this by reintroducing a second manually synchronized current-status table. If future migration work resumes, prefer a transition-aware receipt/change-intent mechanism in the existing authority owner/control plane.

Classification for this campaign: `CURRENT_CORPUS_RECEIPT_SATISFIED / FUTURE_PROCESS_RULE`.

This is not a reason to keep the forensic campaign open.

---

## Static `.gterm` / `.bref` count preservation

**Do not use as blocking completeness proxies.**

Wave 2A proved why:

- Gill Part I static `.gterm` count fell while three concepts moved to runtime glossary hydration and three old popovers became redundant after prose integration;
- Hermenevtika `.bref` count fell because nested interactive Scripture controls inside footnotes were intentionally flattened and guarded.

Future annotation preservation should follow the actual capability owner (dictionary/runtime/static authored annotation), not a historical raw class count.

---

## Visual / geometry guards

**Keep when they protect a real user-facing invariant.**

Do not remove geometry/browser contracts simply because they have numeric thresholds. The project has real historical failures involving:

- KDV +334/+550px shifts;
- Home marginalia edge/content intrusion;
- tooltip viewport/scroll ownership;
- dense footnote hit-target overlap;
- map label/waypoint geometry.

These are meaningful measurable boundaries.

Pixel snapshots remain supporting evidence, not the only truth. Semantic/geometry/interaction contracts should remain the stronger blocking layer where available.

---

## Guard-retirement decision table

| Guard class | Decision |
|---|---|
| Always-true assertion | removed/replaced |
| Dead route-specific threshold | removed |
| Research line-count ceiling | removed |
| Duplicate current authority table | removed as current owner |
| False set-membership “multiset” | repaired |
| Zero/undeclared execution false-green | repaired |
| Static annotation count as semantic truth | reject as oracle |
| Generic Russian-word fallback | keep bounded; do not broaden into pseudo-semantics |
| Exact route/data count with domain meaning | keep |
| Real browser geometry/interaction invariant | keep |
| Whole-file/byte/word floor as content canon | do not add; retire if future current instance is proven |
| Typed accepted semantic units + mutation | preferred positive owner |

---

## Product action from Wave 5

**No separate Product deletion/refactor PR is justified by the current evidence.**

The already-proven low-value guards were removed in Waves 1A/1B. The remaining important numeric/browser contracts have domain/user-facing meaning. Removing more merely to reduce test count would lower protection rather than quality.

Wave 5 therefore closes as evidence-only once Wave 4 positive-manifest integration is merged/current.

---

## Campaign closure boundary

Completed before final Wave 5 close:

1. validator trust — merged Product #1176 + #1178;
2. semantic recovery — Wave 2A + 2B, zero Product restorations;
3. retained lane archaeology — `UNIQUE_REVIEW=0`;
4. Avraam positive manifest — merged #1178.

Pending only:

5. Hermenevtika + Gill Part I positive manifest Product wave reaches current `main` with exact-head source→dist evidence.

After that, this report changes only from `FINAL_CLOSE_AFTER_WAVE4_MERGE` to `CLOSED`; no additional Product guard-retirement lane is expected from the evidence currently available.
