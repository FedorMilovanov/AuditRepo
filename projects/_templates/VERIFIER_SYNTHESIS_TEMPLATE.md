# Verifier Synthesis

## Meta
- Date:
- Verifier:
- Project:
- Source repo:
- Current HEAD:

## Inputs reviewed

| Agent | Path | Audited SHA | Scope | Findings | Confirmations | Challenges | Proposals |
|-------|------|-------------|-------|----------|---------------|------------|-----------|
| ... | incoming/... | ... | ... | N | N | N | N |

---

## Bug Canonicalization

### New findings → canonical IDs
| Temp ID | Canonical ID | Title | Severity | Verification level |
|---------|--------------|-------|----------|-------------------|

### Confirmations incorporated
| Finding | Confirmed by | Evidence | Status |
|---------|-------------|---------|--------|

---

## Evidence Merge

- Weak + strong evidence combined:
- Cross-agent corroboration:

---

## Challenge Resolution

### Resolved (confirmed / false-positive / stale)
| Challenge | Resolution | Evidence |
|-----------|-----------|---------|

### Unresolved → Conflict registry entry
| Challenge | Agent A | Agent B | Conflict ID |
|-----------|---------|---------|-------------|

---

## Duplicate / Merge Decisions

| Finding A | Finding B | Decision | Canonical |
|-----------|-----------|---------|-----------|

---

## Severity Changes

| Bug | Old | New | Evidence |
|-----|-----|-----|----------|

---

## Verification Ladder Status

### L0 — Raw / Suspected (needs more work)
- ...

### L1 — Peer-reviewed (one agent confirmed/challenged)
- ...

### L2 — Confirmed on SHA (2 agents or direct evidence)
- ...

### L3 — Confirmed Current (reverified on HEAD)
- ...

### L4 — Repair Ready (confirmed + evidence + lane)
- ...

### Stale / Fixed on current HEAD
- ...

### False Positives
- ...

---

## Repair Lane Grouping

| Lane | Bug IDs | Count | Why together |
|------|---------|-------|-------------|
| lane/system-p0-fix | PS-01, P0-6 | 2 | Shared fc-controller IIFE + CI cascade |
| lane/cache-busting | P0-10, P0-7, P0-8, P1-12 | 4 | Cache-busting asymmetry |
| ... | ... | ... | ... |

---

## Repair Order

1. ...
2. ...
3. ...

---

## Notes for Implementation Agent