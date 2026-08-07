# Multi-Witness Verification Protocol

## Principle

AuditRepo values **independent evidence angles**, not a mechanical count of agents.

Verification is used both for defects and for proposed improvements. The question is not only “is something broken?” but also “is this implementation/improvement genuinely necessary current work?”.

```text
one strong direct witness
may be enough for ordinary local work

several independent angles
are required when risk, uncertainty or system impact is high
```

Three agents repeating the same grep are one angle.

## Witness types

### W1 — Surface witness

What the user/operator experiences or what capability is materially missing: broken interaction, clipping, wrong data, confusing behavior, an important missing affordance, or an operational limitation.

### W2 — Source witness

What owner/path causes the issue or prevents the needed capability: selector mismatch, duplicate owner, unsafe schema, wrong workflow topology, missing architectural boundary.

### W3 — Artifact witness

What exists in the relevant built result: production-like dist, generated index, copied artifact or release candidate.

### W4 — Browser/runtime witness

What happens in a real engine/runtime: interaction, focus, request topology, state, layout, performance or accessibility behavior.

### W5 — Lifecycle/root-cause witness

Why the class persists or why the improvement is necessary: fragmented ownership, repeated regressions, duplicated source of truth, non-atomic release, legacy coupling, or a local patch that cannot protect the class.

### W6 — History witness

Useful when it proves introduction, recurrence, prior repair, supersession or why a previous approach failed. Supporting evidence, not an automatic vote.

## Proportional evidence bar

| Work class | Typical sufficient evidence |
|---|---|
| Security, rights, data loss | ≥2 independent angles; exact anchor; adversarial/negative case where practical |
| Release identity / production incident | source/workflow mechanism + candidate/artifact/live evidence appropriate to the claim |
| User-visible P1 | browser/artifact reproduction + source/lifecycle mechanism |
| Ordinary local P2 | one strong current direct witness; mechanism before repair |
| P3 / visual polish | screenshot/measurement + owner value decision |
| Necessary implementation/improvement | current gap or measurable limitation + evidence that the proposed class of change is materially useful/required; system-impacting work should include lifecycle/root-cause evidence |
| Systemic root | multiple manifestations + shared mechanism + bounded class-level remedy |
| Audit/test defect | proof that harness/environment/build mode produces false or overstated output |

A proposal does **not** become active work just because it is technically attractive. Verification must connect it to a real Product requirement, risk, missing capability, measurable cost or repeated failure mode.

## Status guidance

- `raw` — observation/proposal only.
- `candidate` — concrete enough to verify.
- `verified-at-anchor` — evidence proved the historical observation/gap on a named surface.
- `current-confirmed-for-work` — current applicability and necessity were checked before work.
- `systemic-root` — several manifestations share a mechanism.
- `owner-decision` — evidence is sufficient, but the remaining choice is product/editorial/rights/hosting authority.
- `stale` / `invalid` — remove from active work after the disposition is established.

A current improvement may be `current-confirmed-for-work` even when no defect exists, provided its necessity has been verified.

## Deep-root protocol

For important work, seek three conceptual layers:

1. **Surface/gap** — what is wrong, missing or materially costly?
2. **Mechanism** — which owner/path creates or preserves it?
3. **Lifecycle/value** — why does this merit implementation rather than park/no-op?

If one mechanism explains many symptoms or gaps, prefer one system work unit over many local rows.

## System-fix absorption

A system fix may retire many historical symptoms when:

1. the shared mechanism is demonstrated;
2. a common owner/process/contract replaces the fragmented mechanism;
3. representative cases pass;
4. a class-level regression witness exists;
5. exceptions are explicit.

After that, absorbed symptom rows leave MASTER; they do not remain forever as closed rows.

## Required report labels

Use specific labels as applicable: `verified-source`, `verified-build`, `verified-artifact`, `verified-browser`, `verified-production-like-dist`, `verified-live`, `verified-lifecycle`, `current-confirmed-for-work`, `necessary-improvement`, `systemic-root`, `audit-drift`, `wrong-build`, `stale`, `invalid`.

Do not write only `verified` without saying what was witnessed and what decision it supports.

## Anti-patterns

- requiring three agents for every normal task;
- treating agent count as independence;
- promoting a nice-to-have refactor to MASTER without proving necessity;
- requiring live deployment for a source-only claim;
- reopening legacy because Product HEAD moved;
- preserving every old symptom row after a system root is known;
- turning every regression check into a global blocking mega-suite.

## Final rule

```text
Use enough independent evidence to trust the decision.
Verify not only existence, but necessity when the work is an improvement.
Keep the active matrix small after the decision is made.
```