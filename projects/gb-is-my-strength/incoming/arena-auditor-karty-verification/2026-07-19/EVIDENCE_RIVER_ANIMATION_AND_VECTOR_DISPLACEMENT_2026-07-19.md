# EVIDENCE: RIVER COASTLINE DISCONNECTION & VECTOR ANIMATION DISPLACEMENT AUDIT

**Project:** `gb-is-my-strength`  
**Date:** 2026-07-19  
**Source HEAD:** `32ae0d7d62bee81737a9aae1f136946d047fe4fb`  
**Auditor:** `arena-auditor-karty-verification`  
**Subsystem:** SVG Vector Geometry, `#waterRipple` Filter Displacement, River/Sea Coastline Endpoints & Path Animations

---

## 1. Root Cause Analysis: River Disconnection & Animation Overshoot

The user specifically requested a forensic investigation into why river paths detach from coastlines or shoot past sea boundaries during animations ("почему реки не к краю морей прилегаемые, а за край выходят по анимации").

Deep line-by-line inspection of `base.svg`, `base-geo.svg`, and `map-engine.js` discovered **3 mathematical and architectural root causes**:

### 1.1 `feDisplacementMap` Coastal Undulation vs Static River Mouths (`RIVER-P1-01`)
- **Location:** `karty/avraam/base.svg:28-34` (`#waterRipple` filter)
```xml
<filter id="waterRipple" x="-10%" y="-10%" width="120%" height="120%">
  <feTurbulence id="waveTurb" type="fractalNoise" baseFrequency="0.018 0.025" numOctaves="3" seed="5" result="noise">
    <animate attributeName="baseFrequency" values="0.018 0.025;0.022 0.028;0.018 0.025" dur="14s" repeatCount="indefinite"/>
  </feTurbulence>
  <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G"/>
</filter>
```
- **Mechanism:** The `#waterRipple` filter is applied exclusively to sea and lake polygons (`<g filter="url(#waterRipple)">`). `feDisplacementMap` with `scale="7"` dynamically warps the sea boundary pixels by **±7 SVG units** in 2D space over a 14-second loop.
- **Flaw:** River paths (Kishon, Jordan, Nile Delta branches) are rendered outside the `#waterRipple` group as static vector paths (`<path d="..." stroke="#2d4a66">`). When the animated sea shoreline undulating inward retreats by 7 units, the static river endpoint is left exposed outside the water body (disconnected river mouth). When the shoreline undulates outward, the sea polygon covers the static river end.

### 1.2 Missing `#waterRipple` Defs in `base-geo.svg` (`RIVER-P1-02`)
- **Location:** `karty/_engine/base-geo.svg`
- **Flaw:** 4 groups in `base-geo.svg` declare `filter="url(#waterRipple)"`. However, the `<defs>` section of `base-geo.svg` contains **zero** definition for `id="waterRipple"`.
- **Impact:** According to the W3C SVG 1.1 Filter specification, referencing an unresolvable filter ID causes compliant user agents to fail filter composition or discard graphic subtrees, leading to missing water bodies or un-styled coastlines on non-Avraam engine maps.

### 1.3 `stroke-linecap="round"` Projection Past Terminal Coordinates (`RIVER-P1-03`)
- **Location:** `karty/_engine/base-geo.svg`, `karty/_engine/map-engine.js` CSS `.me-path-draw`
- **Mechanism:** River paths use `stroke-width="3..5"` with `stroke-linecap="round"`. In SVG rendering, `stroke-linecap="round"` projects a semicircular cap with radius equal to half stroke-width (`1.5px` to `2.5px`) *beyond* the path's terminal `(x, y)` coordinate.
- **Flaw:** When `meDrawPath` or `dashFlow` animates `stroke-dashoffset` from `var(--me-path-len)` to `0`, the rounded cap projects 2.5px past the coastline coordinate into open sea water before stroke calculations freeze.

### 1.4 Unsettled SVG Layout returning `getTotalLength() === 0` (`RIVER-P1-04`)
- **Location:** `karty/avraam/avraam-app.js:201`
```js
// getTotalLength() returns 0 if SVG is not yet layout-computed in DOM
```
- **Flaw:** When `getTotalLength()` executes prior to browser DOM layout settlement, it evaluates to `0`. Setting `stroke-dasharray="0"` causes path animations to bypass progressive stroke drawing, flashing path lines instantly across water bodies.

---

## 2. Summary of Vector & River Findings

| Bug ID | Title | File / Source | Severity | Root Cause |
|---|---|---|---|---|
| `RIVER-P1-01` | Coastline Displacement Warping | `karty/avraam/base.svg:33` | P1 | `#waterRipple` `feDisplacementMap scale="7"` distorts sea edges by ±7px while river mouths remain static |
| `RIVER-P1-02` | Missing Filter Definition | `karty/_engine/base-geo.svg` | P1 | Filter `#waterRipple` referenced 4 times but omitted from `<defs>` |
| `RIVER-P1-03` | Rounded Stroke Cap Overshoot | `karty/_engine/base-geo.svg` | P1 | `stroke-linecap="round"` on 5px stroke projects 2.5px past shoreline into open sea |
| `RIVER-P1-04` | Layout Unsettled Length Zero | `karty/avraam/avraam-app.js:201` | P1 | `getTotalLength()` evaluates to 0 prior to layout, flashing stroke transitions |
| `RIVER-P1-05` | Doubled River Channel Overlap | `karty/_engine/base-geo.svg` | P1 | Overlapping legacy river stroke and sea fill path produce doubled river lines |

---

## 3. Recommended Remediation Patch for Vector Geometry

1. **Synchronize Sea & River Grouping:** Include river mouths inside the `#waterRipple` group OR reduce `scale` on `feDisplacementMap` from `7` to `1.5` so coastal deformation stays within subpixel tolerances.
2. **Inject Missing `<defs>`:** Add the complete `#waterRipple` `feTurbulence` and `feDisplacementMap` definition to `<defs>` in `karty/_engine/base-geo.svg`.
3. **Clip River Mouth Caps:** Apply `stroke-linecap="butt"` on terminal river path segments meeting coastlines to eliminate the 2.5px cap projection into sea polygons.
4. **Layout Guard:** Wrap `getTotalLength()` calls inside `requestAnimationFrame()` to guarantee DOM CTM layout calculation completes before animating `stroke-dashoffset`.
