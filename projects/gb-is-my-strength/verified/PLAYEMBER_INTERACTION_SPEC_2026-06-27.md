# PlayEmber — canonical interaction spec (owner requirements, 2026-06-27)

Source of truth for the Play/speed-pill behavior. Saved per owner request.

## Owner requirements (verbatim intent)
1. Speed pill opens on **HOVER** (mouse over), not on click. Open смoothly, "резиново",
   premium, deep — as if it **blooms out of the circle around Play**.
2. On **single-article pages** the Play circle drifts slightly **sideways** as the pill
   blooms (reference screenshot: pill to the left, Play shifted right).
3. **Click on Play** = play/pause (NOT open pill).
4. **Click on a speed** (0.75×…2×) = select that rate **instantly** and start playback.
5. On **GBS / Gill rail** pages the pill is positioned differently — it blooms **UPWARD**
   (no horizontal space), but with the same smooth premium feel. Play must NOT drift sideways there.
6. Everything animates **out of the circle around Play** (clip-path morph from the circle).

## Implementation (current HEAD)

### CSS — `css/floating-cluster.css`
- `.gb-ember-expand` closed = `clip-path: circle(20px ...)` collapsed into the Play circle;
  open = `clip-path: inset(0 round 999px)` (full pill). Deep rubbery timing:
  `clip-path .42s cubic-bezier(.16,1.08,.3,1)`.
- HOVER reveal (desktop only, `@media (hover:hover) and (pointer:fine)`):
  `.gb-ember-wrap:hover > .gb-ember-expand` (and `:focus-within`) → opacity 1 + open clip-path +
  cascade speed buttons. Works even pre-JS.
- Single pages: `.gb-ember-wrap:hover > .gb-ember { transform: translateX(4px) scale(1.04); }`
  (Play drifts right out of the circle).
- GBS/Gill: `[data-gill-v16] / .gbs-rail-foot` variants → Play `scale(1.06)` only (no drift);
  pill direction UP via the existing `[data-gill-v16] .gb-ember-expand { bottom: calc(100%+8px) }`.

### JS — `js/floating-cluster-controller.js`
- `HOVER_CAPABLE = matchMedia('(hover:hover) and (pointer:fine)')`.
- Desktop: `mouseenter` → `openPanel()`, `mouseleave` → close after 260ms; `focus`/`focusout` a11y.
- Click on ember → `handlePlayClick()` (play/pause) ONLY. (Touch: also reveals pill.)
- Click on speed btn → set rate + live `gb:tts-rate-change` + start from idle instantly.
- Touch (no hover): play tap reveals pill; speed tap selects + collapses.

## Verification (Playwright, production-like dist)
- single-herm hover: opacity 1, 6 speed btns, ember `translateX(4px) scale(1.04)`, pill blooms LEFT — screenshot matches owner reference.
- gill-context hover: opacity 1, ember `scale(1.06)` (no drift), pill direction UP.
- Click play = play/pause; English-voice + stuck-pause bugs fixed in same release.

## Status: implemented + merged to main (lane/playember-hover-premium-2026-06-27).
