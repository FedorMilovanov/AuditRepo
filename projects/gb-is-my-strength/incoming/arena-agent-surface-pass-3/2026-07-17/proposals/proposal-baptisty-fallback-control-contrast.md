# Proposal — Baptist mobile fallback control contrast

- Status: `proposal-open`
- Finding: `BAPTISTY-MOBILE-FALLBACK-CONTROL-CONTRAST`
- Severity: P2 proposed
- Owner: floating-cluster fallback presentation + Samizdat theme tokens

## Repair boundary
Assign explicit effective light/dark foreground/background states to runtime-cloned controls. Do not remove the fallback or recolor the dark rail globally.

## Acceptance
At mobile default light theme, A−/A+ and all icon/glyph controls are visible and meet applicable WCAG text/non-text contrast in normal, focus, hover, pressed and disabled states. Dark theme remains compliant. Existing control behavior and visual parity pass in Chromium and WebKit.
