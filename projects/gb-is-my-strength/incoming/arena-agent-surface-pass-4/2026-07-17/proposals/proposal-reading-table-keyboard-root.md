# Proposal — shared reading-table keyboard root

- Status: `proposal-open`
- Candidate: `READING-TABLE-KEYBOARD-SCROLL`
- Inputs: accepted Gill evidence + `NAGORNAYA-MOBILE-TABLE-KEYBOARD-SCROLL`
- Severity: P2

## Proposal
Use one class-level verification/root row for horizontally scrollable reading tables, with owner-specific Gill and Nagornaya repair lanes. Do not create per-route/per-table rows.

## Acceptance
Every actual horizontal region is reachable through ordinary keyboard navigation, meaningfully labelled, and pans by keyboard in Chromium/WebKit mobile. Preserve touch, print, table semantics and non-overflowing tab-order quality.
