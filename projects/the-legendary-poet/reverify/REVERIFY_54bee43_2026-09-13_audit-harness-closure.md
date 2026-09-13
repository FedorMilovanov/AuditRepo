# Reverify — TLP-AUDIT-004 closure

**Date:** 2026-09-13  
**Root:** `TLP-AUDIT-004`  
**Product PR:** `FedorMilovanov/TheLegendaryPoet#506`

## Disposition

`TLP-AUDIT-004` is closed-by-outcome-proof. The remaining false-green surface was re-run against current Product main rather than accepted from stale PR #496.

Fresh current-main reproduction separated two mechanisms:

1. **real product defect:** both browser persistence and the Worker collapsed tabs/repeated spaces in comment text;
2. **test-topology defect:** the old theme click timed out because deep-reading focus intentionally hid header chrome, and programmatic `.focus()` did not prove keyboard `:focus-visible`.

Product #506 fixed the product defect and replaced the remaining proxies with real browser outcomes.

## Product evidence

- pre-merge base after community certifier: `e5d34db4106533cad17f80ce6c52782330803dff`
- exact certified head: `d8b00ec37dd770be4848dc06ce6774ac3bc50b21`
- CAS squash/resulting main: `54bee439734b8a97c08c0f176e9adc74930b1678`
- tested tree: `6114fd98313a0e9045dd9a4517f9105e91b19f7f`
- resulting tree: `6114fd98313a0e9045dd9a4517f9105e91b19f7f`
- tested/resulting tree identity: **PASS**

## Closed outcomes

- one shared `normalizeCommunityCommentText()` owns comment-text normalization for browser persistence and Worker mutation validation;
- CRLF is canonicalized while intentional repeated spaces, tabs, newlines, Unicode/grapheme content and literal plain-text markup are preserved;
- unsafe control characters remain removed;
- the hardening validator executes a Unicode/whitespace fidelity fixture and rejects renewed comment-text collapse;
- browser QA submits and reloads the fidelity fixture through the real UI;
- theme switching restores intentionally hidden reading chrome through a real upward wheel and a normal pointer click;
- focus contrast uses real keyboard traversal so `:focus-visible` is measured rather than synthesized;
- no `force` click, DOM theme mutation or timeout inflation was used.

## Browser proof

Local detached exact-head certification:
- targeted previously-red outcomes: **2/2 PASS**;
- full `manual-e2e + theme-contrast` Chromium contour: **44/44 PASS** on locked Playwright 1.61.1;
- community hardening/scaling, Worker types, repository typecheck and production build: **PASS**.

GitHub exact-head certification was terminal green, including full Manual Browser QA.  
Resulting-main Manual Browser QA run `34723604098` also completed success:
- Chromium/Android core: PASS;
- fresh-process iPhone Safari: PASS;
- premium iPhone: PASS;
- WebKit HOME reveal: PASS;
- analytics route QA: PASS.

## Scope boundary

This closure does **not** close:
- `TLP-COMM-ABUSE-001` — human-backed production Turnstile adversarial proof;
- `TLP-ANALYTICS-PROPERTY-001` — external GA4 property/web-stream authority.

Discovery was independently closed by Product #494 and has its own receipt.

## Matrix disposition

- P1: stays `1`
- P2: `3 → 2` at this transaction point
- P3: stays `0`
- active total: `4 → 3`

The subsequent Discovery closure removes the second P2 in the same AuditRepo reconciliation wave.
