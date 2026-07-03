# NEW bug — .gbx-tts TTS widget overlaps gbs2-theme buttons on baptisty pages

**Agent:** `arena-agent-2`
**Date:** 2026-06-25
**SHA:** `03e01a0` (production-like dist)
**Method:** Playwright real-mouse-click + elementFromPoint geometry

---

## Finding

On **all 10 `baptisty-rossii/*` pages**, the `[data-gbs2-theme]` day/night button is
**not clickable by mouse** — `elementFromPoint` over it returns the `.gbx-tts` TTS
widget, not the button.

### Evidence (Playwright, /baptisty-rossii/noch-na-kure/)

```
gbx-tts state:  { exists:true, visible:true, rect:{x:24,y:822,w:334,h:54} }
over gbs2-theme: { overClassName: "gbx-tts gbx-tts--visible", overGbs2: false }
click dark false -> false  ❌   (no toggle)
```

The `.gbx-tts` element is `position:fixed; left:24px; bottom:…; pointer-events:auto`
(`.gbx-tts--visible`), 334×54 px, visible from page load — sitting squarely over the
gbs2 theme/search/font/share buttons in the mobile bottom bar (gbs2-theme at x:12,y:855).

### Why it works on krajne/rimlyanam7 but not baptisty

krajne/rimlyanam7 **do** load `floating-cluster-controller.js` (which wires gbs2-theme)
AND their `.gbx-tts` is NOT visible (TTS inactive) → buttons reachable.
baptisty pages load only `enhancements.js` (gbs2-theme handler present there too via the
`[data-gbs2-theme]…` delegation), but the **`.gbx-tts--visible` overlay physically blocks
the click** regardless of JS wiring — `elementFromPoint` hits `.gbx-tts` first.

So this is a **CSS/geometry overlap**, not a JS-wiring bug.

## Root cause (two compounding issues)

1. `.gbx-tts` is `.gbx-tts--visible` from page load on baptisty even though no audio is
   playing — the visible state should not persist without active TTS.
2. Both `.gbx-tts` and the gbs2 bottom-bar controls occupy the bottom-left; with TTS
   visible (334×54) they collide. There is no z-index/flex coordination between them.

## Severity: P2
The day/night toggle is a key accessibility control; on 10 baptisty pages it is
mouse-unreachable when the TTS widget shows. Keyboard and `?`/`T` hotkeys may still work.

## Recommended fix direction
- `.gbx-tts` should start hidden and only become `--visible` when TTS actually starts
  (gate the class on real audio state), OR
- add z-index / layout coordination so gbs2 controls render above/aside `.gbx-tts`, OR
- `.gbx-tts` should collapse to `.gbx-tts--mini` (44×44) on these pages by default.

(needs owner decision on TTS rollout state — out of scope for the clickability lane.)

## Verification
Mouse click on gbs2-theme toggles dark on hermenevtika/kod-da-vinchi/antisovetov/
gill-*/krajne/rimlyanam7 (✅) but NOT on baptisty-rossii/* (❌, blocked by .gbx-tts).
