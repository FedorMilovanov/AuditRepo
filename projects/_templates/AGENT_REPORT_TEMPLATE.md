# Agent Audit Report

## Meta

- Project:
- Source repo:
- Agent:
- Date:
- Audited branch/ref:
- Audited anchor (SHA / artifact / live snapshot):
- Environment:
- Build mode: source / build / production-like dist / live
- Browser / device if used:
- Scope:
- Explicit exclusions:
- Signal class: Product / harness / control-plane / environment / historical
- Proof state: PASS / FAIL / UNPROVEN / N/A
- Claim boundary:
- Preservation boundary:
- Semantic owner:
- Overlapping active owner/PR/branch check:

> The anchor records what this pass actually inspected. Do not update this report merely because the source repository later moved.

---

## 1. New observations

### Observation `<temp-id>`

- Title:
- Kind: defect / risk / improvement / system-theme / audit-harness / owner-decision
- Suggested impact: critical / high / medium / low / unknown
- Route(s) / owner(s):
- Observed on anchor:
- Expected:
- Actual:
- Reproduction or inspection steps:
- Evidence type: verified-source / verified-build / verified-artifact / verified-browser / verified-live / verified-lifecycle
- Evidence:
- Confidence: high / medium / low
- Limitations of this method:
- Possible mechanism:
- Related existing findings:
- Applicability: why this witness applies to the named anchor/event/surface
- What this evidence does **not** prove:

---

## 2. Confirmations and extensions

### Confirm or extend `<target-id>`

- Target report/finding:
- Evidence angle added:
- My evidence anchor:
- Result: same symptom / stronger mechanism / broader scope / narrower scope
- What this changes:

---

## 3. Challenges and negative findings

### Challenge `<target-id>`

- Target report/finding:
- Reason:
- Contradictory evidence angle:
- Evidence anchor:
- Recommended result: stale / invalid / audit-drift / wrong-build / narrower-scope / disputed

A negative result is useful. Do not preserve a persuasive old claim when the method or build was wrong.

---

## 4. Root-cause clusters

### Cluster `<working-name>`

- Findings/symptoms included:
- Shared mechanism:
- Surface evidence:
- Mechanism evidence:
- Lifecycle evidence:
- Why local patches may be insufficient:
- Suggested status: systemic-root / duplicate-symptom / keep-independent
- Representative cases that should be tested:
- Known exceptions:

---

## 5. Value and cost assessment

For findings that may enter a work queue:

- User/operator impact:
- Frequency or blast radius:
- Recurrence risk:
- Estimated repair size:
- Regression risk:
- How many other findings this could absorb:
- Recommendation: fix-now / verify-first / system-lane / park / accepted-risk / not-worth-fixing / owner-decision

---

## 6. Suggested verification wave

- Package of findings:
- Questions the wave should answer:
- Evidence-critical owners:
- Recommended witness angles:
- What does **not** need global revalidation:
- Possible outputs:

---

## 7. Suggested repair boundaries

- Local lane:
- System lane:
- Do not mix with:
- Minimum regression witness:
- Is live evidence actually required? yes / no / unknown
- Required exact-head checks:
- Is merge admission machine-enforced? yes / no / unknown

---

## 8. Owner decisions

- Decision needed:
- Available options:
- Trade-offs:
- Default recommendation:

---

## 9. Summary for verifier

- Strongest new evidence:
- Findings likely current when selected:
- Systemic clusters:
- Likely stale/invalid items:
- Highest-value next work:

---

## Files in this intake folder

- `REPORT.md` — this report;
- `comments/` — comments on other findings;
- `proposals/` — optional status/priority proposals;
- `evidence/` — logs, screenshots and command output;
- `artifacts/` — traces, patches or machine-readable output.

## Status boundary

An intake report may use:

- `raw`;
- `candidate`;
- `reproduced-by-agent`;
- explicit evidence labels.

Durable classifications such as `verified-at-anchor`, `systemic-root`, `invalid`, `not-worth-fixing` or `absorbed-by-system-fix` belong to a verifier synthesis or an accepted project ledger decision.

A report does not become stale merely because Product HEAD moved. It remains evidence about its recorded anchor.
