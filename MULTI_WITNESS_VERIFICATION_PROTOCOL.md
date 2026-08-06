# Multi-Witness Verification Protocol

## Principle

AuditRepo values **independent evidence angles**, not a mechanical count of agents.

```text
one strong direct witness
may be enough for an ordinary finding

several independent angles
are required when risk or uncertainty is high
```

Three agents repeating the same grep are one angle. One production-like browser reproduction plus a clear source mechanism may be two strong angles.

---

## Witness types

### W1 — Surface witness

What the user or operator experiences:

- click does nothing;
- text is wrong;
- layout clips;
- data disappears;
- workflow deploys the wrong candidate.

### W2 — Source witness

What source owner or data path can cause the observation:

- selector mismatch;
- duplicate runtime owner;
- incorrect normalization;
- unsafe schema;
- wrong workflow topology.

### W3 — Artifact witness

What exists in the relevant built result:

- production-like `dist`;
- copied legacy artifact;
- generated index;
- package or release candidate.

### W4 — Browser/runtime witness

What happens in a real engine or runtime:

- interaction fails;
- console/page error;
- focus is lost;
- request topology is wrong;
- state is not retained.

### W5 — Lifecycle/root-cause witness

Why the finding persisted, repeated or spread:

- several routes own the same contract separately;
- release identity is not atomic;
- generated source is mutated after validation;
- audit harness measures a stale shell;
- a local patch cannot protect the class.

### W6 — History witness

When useful, history can show introduction, recurrence, prior attempted repair or supersession. It is normally supporting evidence, not a mandatory third vote.

---

## Proportional evidence bar

| Finding class | Typical sufficient evidence |
|---|---|
| Security, rights, data loss | at least two independent angles; exact anchor; adversarial/negative case where practical |
| Release identity or production incident | source/workflow mechanism + candidate/artifact/live evidence appropriate to the claim |
| User-visible P1 | browser/artifact reproduction + source or lifecycle mechanism |
| Ordinary P2 | one strong direct witness on the applicable surface; mechanism when repair is selected |
| P3 / visual polish | screenshot or measurement + owner value decision |
| Systemic root | multiple manifestations + shared mechanism + bounded class-level remedy |
| Audit/test defect | proof that the harness, selector, environment or build mode caused false/overstated output |

The table is guidance, not a blind gate. The verifier records why the selected evidence is proportionate.

---

## Status guidance

### `raw`

One agent observed something. It may be useful even if incomplete.

### `candidate`

The observation is specific enough to reproduce or classify.

### `verified-at-anchor`

Evidence proves the observation on a named SHA, artifact, route or live snapshot. This is a durable historical fact, not a claim about every future HEAD.

### `current-confirmed-for-work`

The selected evidence-critical surface was rechecked immediately before implementation. This is a temporary work verdict.

### `systemic-root`

Several findings share a mechanism and should be handled as a class.

### `stale` / `invalid`

- `stale`: the old formulation no longer applies;
- `invalid`: the original claim was false, used the wrong build, wrong route, wrong selector or otherwise unsound.

One strong contradictory witness can be enough to open a challenge. Final disposition should match the risk and ambiguity; two negative witnesses are not mechanically required for an obvious wrong-build false positive.

---

## Deep-root protocol

For important clusters, seek three conceptual layers:

### Surface

What is wrong or inefficient?

### Mechanism

Which owner/path creates it?

### Lifecycle

Why did the class survive, spread or return?

When all three are known, prefer a system measure if it is safer and cheaper than repeated local patches.

---

## System-fix absorption

A system fix may close multiple historical symptoms without re-running every old reproduction when all conditions hold:

1. the shared mechanism is demonstrated;
2. a common owner/process/contract replaces the fragmented mechanism;
3. representative routes/cases pass;
4. a class-level regression witness is permanent;
5. exceptions are listed explicitly.

Related rows receive `absorbed-by-system-fix`, not fictional claims that every old exact scenario was individually rerun.

---

## Required report labels

Use explicit labels where applicable:

- `verified-source`;
- `verified-build`;
- `verified-artifact`;
- `verified-browser`;
- `verified-production-like-dist`;
- `verified-live`;
- `verified-lifecycle`;
- `audit-drift`;
- `wrong-build`;
- `stale`;
- `invalid`;
- `systemic-root`.

Do not write only `verified` without saying what was actually witnessed.

---

## Anti-patterns

- requiring three agents for every P2;
- treating agent count as independence;
- requiring live deployment to close a source-only defect;
- reopening all historical rows because Product HEAD moved;
- preserving an overstated claim merely because it once had several witnesses;
- turning every regression check into a global blocking mega-suite.

---

## Final rule

```text
Use enough evidence to make the decision trustworthy.
Do not use evidence ritual to avoid making the decision.
```
