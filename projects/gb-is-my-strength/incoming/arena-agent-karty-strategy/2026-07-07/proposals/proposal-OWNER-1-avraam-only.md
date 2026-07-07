# Proposal: OWNER-DECISION-1 — Авраам = единственная живая карта

**Source:** `incoming/arena-agent-karty-strategy/2026-07-07/STRATEGY.md` §1 Law 1
**Current source HEAD:** `75f807b73`
**Status:** `proposal-open` (awaiting owner decision)

## What we are asking the owner to confirm

> Авраам — единственная живая карта. 8 placeholder-маршрутов (early-church, maccabim, melachim, pavel, revelation, shoftim, shvatim, yeshua) остаются frozen. ishod = канонический шаблон, но **не активируется** для пользователя (только для engine testing).

## Why this decision is needed

Current state: 9 из 10 маршрутов — placeholder'ы. JSON-LD каждой говорит «Карта временно снята с витрины до ручной визуальной доводки». Это **намеренно** по владельцу.

Альтернатива: активировать 8 по образцу ishod (W9 plan в предыдущем intake). Это **противоречит** новой стратегии (1 atlas-grade map, не fleet).

Владелец должен явно подтвердить.

## Evidence

- `evidence/` в `incoming/arena-agent-karty-audit/2026-07-07/`: `karty-html-scripts.txt`, JSON-LD description всех 8 заглушек
- `STRATEGY.md` §1 (4 laws)
- `ANTI-PATTERNS.md` A1 (activation by default)

## Impact if YES

- 8 placeholder'ов остаются в `karty/`, но **без** `<script>` подключения
- В `karty/index.html` (хаб) — явный статус: `avraam = ready, 9 = in development`
- KARTY-01 SUPERSEDED
- KARTY-02 DEFERRED
- Все ресурсы (владелец + агенты) идут в Авраам

## Impact if NO

- Возврат к предыдущему плану (`incoming/arena-agent-karty-audit/2026-07-07/`)
- W9 lane: activate 8 placeholders
- KARTY-01, KARTY-02 — active again

## Decision format

Владелец отвечает одним из:
- **YES** (default per new strategy)
- **NO** (revert to fleet plan)
- **MODIFIED:** [конкретные маршруты, которые можно активировать]

## Do not mix with

- OWNER-DECISION-2 (engine redesign) — это про engine, не про маршруты
- OWNER-DECISION-3 (phased plan) — это про сроки, не про маршруты

---

**Owner decision required:** ДА (блокирующий для Phase 0)
**Deadline:** ASAP (Phase 0 = 1-2 дня после решения)
**Cross-agent:** supersedes `incoming/arena-agent-karty-audit/2026-07-07/proposals/proposal-KARTY-01.md`
