# Comment/refinement on `.gbx-tts` overlay blocking Baptisty GBS2 controls

- Target report: `incoming/arena-agent-2/2026-06-25/gbx-tts-overlay-blocks-gbs2-theme-2026-06-25.md`
- Comment type: partial confirm + correction
- My audited SHA: `03e01a0008de34d654175ea600cdf9f22b2351b4`
- Evidence: `../evidence/baptisty-tts-overlay-controls-03e01a0.txt`
- Method: production-like dist + Playwright elementFromPoint + real click timeouts

## Result

The geometry bug is real, but the exact target should be refined.

On `/baptisty-rossii/noch-na-kure/`, after `.gbx-tts` becomes visible, it overlays **desktop bottom-rail font/share/search controls**, but not the desktop theme button center and not the mobile top theme button.

### Confirmed blocked on desktop bottom rail

`elementFromPoint()` over the centers of these buttons returns `.gbx-tts.gbx-tts--visible`:

```text
A−    point x=73,y=873  → over .gbx-tts.gbx-tts--visible
A+    point x=116,y=873 → over .gbx-tts.gbx-tts--visible
share point x=159,y=873 → over .gbx-tts.gbx-tts--visible
search point x=202,y=873 → over .gbx-tts.gbx-tts--visible
```

Real mouse click tests without `force:true` time out for those controls:

```text
fontUp ERR locator.click: Timeout 1800ms exceeded
share  ERR locator.click: Timeout 1800ms exceeded
search ERR locator.click: Timeout 1800ms exceeded
```

### Theme button correction

The desktop bottom-rail theme button center is at x≈30,y≈873, outside the TTS overlay’s effective x-range for the tested route, and it toggles successfully:

```text
theme point x=30,y=873 → over BUTTON.gbs2-ctl
theme click: dark false → true
```

The mobile top theme button also remains reachable:

```text
viewport 390×844, top theme point x=298,y=28 → over BUTTON.gbs2-mctl
```

## Recommended canonical wording

Replace “`data-gbs2-theme` day/night button is not clickable” with:

> On Baptisty article pages, `.gbx-tts--visible` overlaps the desktop GBS2 bottom-rail controls and blocks mouse clicks on A−/A+/share/search; theme may remain reachable depending on its x-position, but the rail control cluster is partially unusable.

Suggested severity remains P2 UX/accessibility because font and search are key controls.

## Suggested fix direction

I agree with the target report’s fix direction: `.gbx-tts` should not become a wide, pointer-active bottom-left pill by default on pages that also have bottom-left GBS2 rails. Good options:

- start hidden until audio actually plays;
- default to `.gbx-tts--mini` on GBS2 pages;
- offset the TTS widget away from `.gbs2-rfoot`/bottom rails;
- or make the bottom rail z-index/layout coordinate explicitly with TTS.
