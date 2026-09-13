# Reverify — TLP-A11Y-FOCUS-CONTRAST-001 — 2026-09-13

## Scope

Fresh accessibility residual discovered while certifying the unrelated terminal Discovery repair. This is a current Product defect, not a test-only proxy and not part of the Discovery root.

- Product current/base: `cff9b0f6cbe986a4d8dc79e22661b331a1207592`.
- Detection run: Product #507 Manual Browser QA initial attempt.
- Repair lane: Product #508 `fix/a11y: restore light-theme focus contrast`.

## Reproduction

The unchanged real keyboard-traversal test focused the community comment textarea in light theme and measured its visible non-text focus indicator.

Observed:

- required contrast: `>= 3:1`;
- measured: `1.626282818611112:1`;
- test: `qa/theme-contrast.spec.mjs`, community control boundaries/focus indicators.

The control was genuinely focused; the failure was not a hidden-element, programmatic-focus or screenshot proxy.

## Root cause

Current global CSS uses a translucent bright-cyan outline for every `:focus-visible` state:

`rgba(0, 212, 255, 0.68)`.

That color works against the dark theme but composites to insufficient contrast against the light theme's `#fffaf0` surface. Product #506's earlier exact-head pass therefore did not eliminate the underlying color-token defect; the later exact browser outcome exposed it.

## Bounded repair

Product #508 introduces one theme token:

- dark `--tlp-focus-ring`: preserves the existing cyan behavior;
- light `--tlp-focus-ring: #075f75`: approximately 6.95:1 against `#fffaf0`.

The global `:focus-visible` rule consumes the token. The existing browser threshold and keyboard path are not weakened or bypassed.

The same two-file content was also applied to open Product #507 so that its Discovery certification can exercise the corrected current UI. Once #508 lands in `main`, those identical contents become base-equivalent rather than Discovery-owned behavior.

## Disposition

`TLP-A11Y-FOCUS-CONTRAST-001` remains active until #508 exact-head browser QA and resulting-main browser proof are green.

Matrix movement for this correction package:

- P1 stays 1;
- P2 `2 -> 3`;
- P3 stays 0;
- total active `3 -> 4`.
