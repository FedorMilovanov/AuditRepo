# Proposal: Register Karty Deep Audit Findings (P0, P1, P2) into Master Bug Matrix

## Identity
- Project: gb-is-my-strength
- Proposed by: karty-deep-audit-2026-07-19
- Date: 2026-07-19
- Target finding ID(s): MAP-P0-01..08, MAP-P1-01..14, AVRAAM-P1-01..05, KARTY-DATA-P1-01, GATE-P1-01, AVRAAM-P2-01, HUB-P2-01
- Proposal type: status-change / register-new-findings / repair-lane-proposal

## Current state
Master Bug Matrix currently has `KARTY-Q-BUG-P0` closed, but MapEngine v0.53 has 8 P0 blockers and 20 P1 defects preventing site publication.

## Proposed change
1. Add 8 P0 blockers to Master Bug Matrix P0 section (`MAP-P0-01`..`MAP-P0-08`).
2. Add 20 P1 findings to Master Bug Matrix P1 section (`MAP-P1-01`..`MAP-P1-14`, `AVRAAM-P1-01`..`AVRAAM-P1-05`, `KARTY-DATA-P1-01`, `GATE-P1-01`).
3. Add 3 P2 findings to Master Bug Matrix P2 section (`AVRAAM-P2-01`, `HUB-P2-01`).
4. Update Master Bug Matrix statistics and session log.

## Evidence
- Browser execution trace, DOM layout calculations, and JSON schema audits on commit `c2c339708252`.
- Detailed in `incoming/karty-deep-audit-2026-07-19/2026-07-19/REPORT.md`.

## Proposal status: proposal-open
