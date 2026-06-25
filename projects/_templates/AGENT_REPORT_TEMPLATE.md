# Agent Audit Report

## Meta
- Project:
- Source repo:
- Agent:
- Date:
- Audited branch:
- Audited SHA:
- Current HEAD at start:
- Current HEAD at end:
- Environment:
- Build mode: source / dist / production-like dist
- Browser / device if used:

---

## 1. New Findings

### Finding `<temp-id>`

- Title:
- Severity: P0 / P1 / P2 / P3
- Route(s):
- Source file(s):
- Observed on SHA:
- Repro steps:
- Expected:
- Actual:
- Evidence: (command + output, paste here)
- Confidence: high / medium / low
- Verification level: L0 (one agent) / L2 (two agents or direct evidence)
- Suggested repair lane:
- Do not mix with:
- Comments: (any internal notes)

---

## 2. Confirmations of Existing Findings

### Confirm `<target-id>`

- Target report: `incoming/<agent>/<date>/REPORT.md`
- Target finding:
- My evidence: (grep / screenshot / build output)
- Same bug / related / stronger root cause:
- Recommended status: confirmed-current / disputed / stale

---

## 3. Challenges / Disputes

### Challenge `<target-id>`

- Target report: `incoming/<agent>/<date>/REPORT.md`
- Target finding:
- Reason for challenge:
- Current HEAD evidence:
- Recommended status: disputed / stale-on-current-head / false-positive / downgrade

---

## 4. Duplicate / Merge Proposals

### Merge proposal

- Finding A:
- Finding B:
- Why same root cause:
- Canonical ID suggestion:

---

## 5. Severity Proposals

- Target bug:
- Current severity:
- Proposed severity:
- Evidence:

---

## 6. Repair Lane Suggestions

- Bug IDs:
- Lane:
- Why together:
- What must NOT be mixed:

---

## 7. Reverify Notes

- Bug:
- Current HEAD:
- Result: confirmed-current / stale / fixed / disputed
- Evidence:

---

## 8. Notes for Verifier

---

## Files in this intake folder

- `REPORT.md` — этот файл (свободный рабочий пакет)
- `comments/` — комментарии к чужим находкам (comment-on-*.md)
- `proposals/` — предложения по статусу / severity / repair (proposal-*.md)
- `evidence/` — доказательства (логи, grep output)
- `artifacts/` — патчи, сниппеты, trace output

## Status rules

**Allowed here:**
- raw, suspected, reproduced-by-agent (L0)
- peer-reviewed (L1, after confirm/challenge from another agent)

**NOT allowed here (need verifier):**
- repair-ready (L4)
- fixed-current
- confirmed-current (L2+) without 2+ agents or direct evidence

**Proposal statuses:**
- proposal-open → proposal-supported → proposal-accepted → (bug moves)
- proposal-open → proposal-conflicted → resolved in conflicts/
- proposal-open → proposal-rejected
- proposal-open → proposal-superseded