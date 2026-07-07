# Proposal: KARTY-11 — GSAP + DrawSVG + MotionPath (~200KB) на CDN только для avraam

**Source:** `incoming/arena-agent-karty-audit/2026-07-07/REPORT.md` §1 Finding KARTY-11
**Current source HEAD:** `75f807b73`

## Status: `proposal-open`

## Proposed severity: **P3** (perf optimization)

## Evidence

- `karty/avraam/index.html:1170-1172` — 3 × `<script src="https://cdn.jsdelivr.net/...">` (gsap, DrawSVGPlugin, MotionPathPlugin)
- CSP `karty/avraam/index.html:5` — `script-src ... https://cdn.jsdelivr.net`
- 8 других karty-маршрутов — НЕ имеют GSAP, и их CSP НЕ разрешает cdn.jsdelivr.net (не готовы)

## Repair lane

W9 (sub-task к KARTY-06).

## Suggested action

1. В рамках KARTY-06: заменить GSAP-анимации на нативные CSS/SVG
2. Удалить 3 GSAP-скрипта из `karty/avraam/index.html`
3. Убрать `cdn.jsdelivr.net` из CSP

Если GSAP нужен (владелец решает):
- Вынести в `karty/_engine/gsap-loader.js` (lazy)
- Подключать через `opts.enableAnimations: true`

---

**Owner decision:** да (если GSAP реально нужен)
**LANE:** да (W9)
**Estimated LOC:** -3 в HTML, +опционально +50 в engine
