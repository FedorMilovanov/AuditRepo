# Footnote rich-tooltip focus model — current receipt

Date: 2026-10-23  
Product anchor: `caeb92c839ff4b4f2838a0ad44a582034c41c8d4` (`main`)  
Disposition: **admit one direct current defect** — `GBS-FOOTNOTE-RICH-TOOLTIP-FOCUS-MODEL`.  
Product mutation: none.

## Question

After Product fixed the closed-state `nested-interactive` violation by making closed tooltip payloads inert and reparenting an opened payload to `document.body`, can a keyboard user operate links intentionally retained inside an open footnote popup?

This does not reopen the closed structural finding. It tests the previously unmeasured open state.

## Current inventory

The production-like build contains eight footnote markers whose `.tooltip` payload retains one ordinary external link:

- one on `/articles/dzhon-gill-chast-1-chelovek/`;
- seven on `/articles/krajne-li-isporcheno-serdce/`.

The same sources are also projected into generated endnotes. That provides an alternative reading location, but it does not make a link displayed and pointer-operable inside the popup keyboard-operable.

## Shared mechanism

`src/runtime/article-tooltips.js`:

1. opens a marker on focus;
2. inserts a placeholder and moves the `role="tooltip"` node to the end of `document.body`;
3. keeps desktop focus on the marker;
4. schedules close when the marker blurs;
5. uses `OverlayRuntime` with `trapFocus: false` on mobile.

After reparenting, the retained link is no longer the marker's next sequential focus target. On desktop, Tab reaches the next control in article order and the original popup closes. On mobile, OverlayRuntime initially focuses the link, but the next Tab moves focus to `body` while the scroll-locked popup remains open.

The core problem is therefore not an inert link or a failed click handler. It is the absence of one coherent popup type and focus transition for interactive content.

## Browser evidence

Chromium `153.0.8010.0`, production-like build, reduced motion, zero page errors.

### Desktop Light and Dark, 1280×800

All eight linked footnotes were exercised in both schemes: **16 states**.

For every state:

- focusing the marker opened its popup;
- focus remained on the marker;
- the retained link had `tabIndex=0`;
- the first Tab reached neither that link nor any descendant of the original tooltip;
- marker blur closed the original tooltip;
- on Krajne the next marker or glossary term often opened instead, proving normal sequential navigation rather than a stalled key event.

Positive control: after reopening, programmatically focusing the retained link and pressing Enter fired its click activation in **16/16** desktop states. The link itself works; the natural keyboard path cannot reach it.

### Mobile Light and Dark, 390×844

All eight links were exercised in both schemes: **16 states**.

- OverlayRuntime initially focused the retained link in 16/16;
- the first Tab focused `body` in 16/16;
- the popup remained open and scroll-locked in 16/16;
- programmatic focus + Enter activated the link in 16/16.

Mobile therefore has a different manifestation of the same missing focus model: entry reaches the link, but forward traversal escapes to an uninformative body focus while the sheet remains open.

## Guard gap

The permanent `scripts/note-registry-browser-contract.mjs` remains **13/13 PASS** in Chromium 153.

Its single Hermenevtika fixture uses footnotes 40/72/75/77/82/83/107, all with zero interactive descendants. The keyboard check explicitly requires `nestedFocusable === 0`. It verifies the repaired closed/static family, but cannot exercise any of the eight retained links and never asserts:

- Tab from opener to rich content;
- exact focus containment or deliberate close on mobile;
- reverse traversal;
- focus restoration after link-bearing popup dismissal.

This is a fixture coverage gap, not evidence that the existing 13 checks are wrong for plain-text tooltips.

## Bounded closure

Choose one semantic model for footnotes containing links:

1. **Plain tooltip model:** keep popup content non-interactive and expose the source link only through a clearly reachable endnote/reference control; or
2. **Rich popup model:** use appropriate popup/dialog semantics, move focus deliberately into its first interactive target, define forward/reverse traversal and restore focus to the exact marker on Escape/button/backdrop close.

Closure proof must cover all eight current linked markers plus a plain-text footnote control in desktop/mobile Light/Dark:

- keyboard open;
- Tab and Shift+Tab behavior;
- Enter activation of the retained source link if the rich model is selected;
- Escape and pointer dismissal with exact focus return;
- no closed-state `nested-interactive` regression;
- no body-focus state under an open locked mobile sheet;
- no forced click or programmatic focus as the success path.

## Boundaries

- Closed-state inert/nested-interactive closure remains valid and is not reopened.
- Ordinary plain-text tooltips are not declared defective by this receipt.
- External network delivery was not used to judge success; activation was intercepted before navigation.
- No claim is made that duplicated endnote links are broken.
- Current open Product PRs do not modify `article-tooltips.js` or the two affected article owners.

## Evidence

Compact receipt: `evidence/2026-10-23-footnote-rich-tooltip-focus.jsonl`.
