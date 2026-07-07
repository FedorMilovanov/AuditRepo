# Proposal: OWNER-DECISION-2 — Engine redesign allowed

**Source:** `incoming/arena-agent-karty-strategy/2026-07-07/STRATEGY.md` §1 Law 2, `ENGINE-CONTRACT-RETHINK.md`
**Current source HEAD:** `75f807b73`
**Status:** `proposal-open` (awaiting owner decision)

## What we are asking the owner to confirm

> Engine v2.0 проектируется с нуля. v0.52.0 (`karty/_engine/map-engine.js`, 2634 строки) рассматривается как **legacy**, не как основа. Где API v0.52.0 не подходит для atlas-grade — пересматривается. Где подходит — сохраняется. Документ `ENGINE-CONTRACT-RETHINK.md` — финальная spec.

## Why this decision is needed

Альтернатива: «сохранить v0.52.0 как есть, мигрировать avraam-app.js на engine». Это лечит симптомы, не причину. Результат: те же баги, переехавшие в engine.

Владелец должен подтвердить, что мы **имеем право** менять engine contract, не только код внутри.

## What is NOT changing (preserved)

- `createMap(container, route, opts) → MapInstance` signature (как сейчас)
- `loadRoute`, `validateRoute`, `compareRouteData` (data layer)
- Все визуальные фичи engine: layers, panel, tabs, tour, search, share, theme, deep-link
- SVG-only rendering
- Vanilla JS, no framework
- ~30KB gzipped budget

## What IS changing (allowed)

- `window.MapEngine` global → ES module export
- Optional-chain `window.MapEngine?.X` pattern → явные `hooks` и `components` extension points
- Internal helpers (`getPlaceIndex`, `getPlaceById`, etc.) → private namespace
- Design system tokens (`MapEngine.tokens`) → new public API
- A11Y contract → новые hooks (`onPanelTabChange`, etc.)
- Performance budget → enforced via `bundlewatch` or similar

## Impact if YES

- Phase 2 = 2-4 месяца design work **до** кода
- `ENGINE-CONTRACT-RETHINK.md` — final spec
- v0.52.0 остаётся до конца Phase 3 (как fallback для 9 frozen маршрутов)
- Авраам v2.0 пишется с нуля на engine v2.0
- Возможна **полная** потеря совместимости API (если нужно)

## Impact if NO (preserve API)

- Phase 2 = 1-2 месяца миграции (механический перенос)
- API v0.52.0 — зафиксирован
- Внутренние баги (CSS-in-JS, hardcoded IDs, touch leak) фиксятся внутри contract
- Быстрее, но **сохраняет design flaws**

## Decision format

Владелец отвечает одним из:
- **YES** (default per new strategy) — full redesign allowed
- **PARTIAL** — сохранить v0.52.0 API surface, рефакторить internals
- **NO** — preserve API, fix internals only

## Do not mix with

- OWNER-DECISION-1 (which routes are live) — engine redesign applies to engine, not routes
- OWNER-DECISION-3 (timeline) — even with redesign, timeline is months
- OWNER-DECISION-4 (atlas quality bar) — that's about visual/content quality

---

**Owner decision required:** ДА (блокирующий для Phase 2)
**Deadline:** before Phase 2 start (1-2 месяца после OWNER-DECISION-1)
**Cross-agent:** replaces `incoming/arena-agent-karty-audit/2026-07-07/proposals/proposal-KARTY-06.md` strategy
