# Audio interaction accessibility — current audit

Date: 2026-08-12  
Product: `FedorMilovanov/TheLegendaryPoet`  
Audited source: `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`  
Scope: keyboard focus visibility for audio seek controls, fixed-chrome collision ownership and current browser-test coverage.

## Current-source check

Immediately before this write, `d59cceccb0c49af59b1be38d4c547a6240b3005a...main` again compared `identical`, with zero commits ahead/behind. This wave therefore extends the already-active current root rather than auditing a moved head.

## Result

No new MASTER row is required. The current evidence materially strengthens:

- `TLP-A11Y-RUNTIME-001` — shared shell/audio focus and fixed-control semantics;
- `TLP-AUDIT-004` — current browser coverage does not certify these audio keyboard/collision outcomes.

---

## Strengthening A — `TLP-A11Y-RUNTIME-001`

### Shared audio seek control is keyboard-focusable but visually invisible

The three current playback surfaces expose a real native `input[type="range"]` for seeking:

1. `FeaturedTrackPlayer` — `aria-label="Позиция воспроизведения"`;
2. `ImmersivePlayer` — `aria-label="Позиция воспроизведения"`;
3. `GlobalMiniPlayer` — `aria-label="Позиция текущего релиза"`.

The semantic part is good: the controls remain native ranges and expose `aria-valuetext` with current and total time.

The visual focus contract is not. Each range is positioned over a custom waveform/progress surface with `opacity-0`; there is no focus-visible style on the range and no sibling/parent state driven by `:focus-visible` / `:focus-within` that reveals a visible outline, ring, thumb or other focus proxy.

A keyboard user can therefore Tab onto an operational seek control, move it with Arrow keys, and have no visible indication of which control owns focus.

This is not three separate component defects. It is one shared custom-audio-control pattern: native semantic range hidden under a visual waveform without a visible focus owner.

### Required terminal outcome for seek surfaces

Create one reusable accessible seek presentation contract:

- keep a native range or equivalent correct slider semantics;
- when keyboard focus enters, render an unmistakable visible focus indicator on the waveform/track/thumb;
- preserve sufficient contrast in dark and light themes;
- do not rely on browser focus painting of a fully transparent element;
- certify Featured, Immersive and GlobalMiniPlayer from the same shared regression pattern.

---

## Strengthening B — mobile mini-player / ScrollToTop collision

`GlobalMiniPlayer` toggles `html.global-audio-active` whenever persistent audio chrome is visible.

`commandPaletteChrome.css` explicitly documents the collision owner:

> `The scroll-to-top control shares the bottom-right corner with the global audio player. Lift it above active playback chrome instead of allowing the two controls to overlap.`

However, the actual `html.global-audio-active .scroll-top-btn { bottom: 8.75rem; }` fix exists only inside `@media (min-width: 768px)`.

The base/mobile ScrollToTop position remains owned by the reading-mode rules in `index.css`; there is no corresponding mobile `global-audio-active` offset.

The implementation therefore knows the fixed-control collision exists but only resolves it on desktop. On mobile, where the fixed MobileDock already occupies the lower viewport and the global audio mini-player is also active, ScrollToTop is not repositioned by audio visibility.

This is another manifestation of the existing shell runtime root: each fixed surface owns its own bottom offset and breakpoint logic rather than one collision/layout contract for dock + player + scroll action + safe-area.

### Required terminal outcome for fixed mobile chrome

- one layout owner computes or expresses mutually exclusive/stacked fixed-bottom regions for MobileDock, mini-player and ScrollToTop;
- safe-area inset is part of the same contract;
- `chrome-hidden` and `global-audio-active` combinations are tested, not independent one-feature states;
- mobile keyboard/touch targets remain visually separate and reachable.

---

## Existing related manifestation retained

The prior cross-surface wave already established that `ImmersivePlayer` keys its dialog root by `currentTrack.id`; Next/Previous can replace the focused DOM node while the modal remains logically open, and `useDialogSurface` updates the root without rerunning initial focus ownership.

The current audio accessibility root therefore now has three independent witnesses sharing one runtime owner family:

1. transparent seek controls with invisible keyboard focus across three player surfaces;
2. focus loss when immersive keyed content replaces the focused control;
3. fixed-control collision handling that is desktop-only even though mobile owns more bottom chrome.

---

## Audit-harness boundary — `TLP-AUDIT-004`

Current source search found no permanent browser test explicitly combining `global-audio-active`, ScrollToTop and mobile geometry.

The current audio validators also focus on playback/session correctness rather than focus-visible rendering of the seek sliders. A regression can therefore preserve correct `aria-label`, playback and positions while still making the active keyboard control visually undiscoverable.

Add permanent browser outcomes:

- Tab through Featured player and assert the active seek control has a visible focus proxy;
- repeat inside Immersive and GlobalMiniPlayer;
- mobile viewport with active mini-player + visible ScrollToTop + MobileDock: bounding boxes must not overlap and all controls remain within safe-area;
- repeat after reading chrome auto-hide/show transitions.

## Checked and removed candidates

- Current music square covers are `.webp`, so the current MediaSession artwork MIME declaration `image/webp` matches the published catalog. No current MIME defect is added.
- The actual binary dimensions of the square cover were not established from the current source read, so no claim is made about the hardcoded MediaSession `1400x1400` size metadata.
- The core audio keyboard handlers already avoid stealing Space/Arrow shortcuts from `input`, `button`, `a`, `select`, `textarea` and other interactive controls. The defect is focus visibility/continuity, not a generic keyboard-shortcut hijack.

## Audit disposition

- active row count remains **15 total: 1 P1 + 14 P2**;
- expand `TLP-A11Y-RUNTIME-001` and `TLP-AUDIT-004` with the evidence above;
- no Product implementation lane is created;
- Product source is unchanged by this AuditRepo push.
