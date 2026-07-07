# Proposal: OWNER-DECISION-3 — Phased plan (months, not weeks)

**Source:** `incoming/arena-agent-karty-strategy/2026-07-07/STRATEGY.md` §4 (6-phase plan)
**Current source HEAD:** `75f807b73`
**Status:** `proposal-open` (awaiting owner decision)

## What we are asking the owner to confirm

> Plan = 6-8 месяцев реальной работы. Phase 0 (1-2 дня) → Phase 1 (1-2 мес) → Phase 2 (2-4 мес) → Phase 3 (2-3 мес) → Phase 4 (1 мес). Не W1, W4, W7, W9 (это weeks). Не «до конца года». «Месяцы» с честной оценкой.

## Why this decision is needed

Предыдущий intake использовал W-волны (1-2 недели каждая). Новый план использует **фазы** (месяцы). Разница — в **глубине** работы:
- W-волна = "починить X, закрыть Y, перейти к Z"
- Фаза = "понять X полностью, спроектировать Y, реализовать Z до atlas-grade"

Владелец должен подтвердить, что готов к **долгой** работе, а не «сделаем за 2 недели».

## Phase breakdown (детально в STRATEGY.md)

| Phase | Duration | Output | Owner involvement |
|-------|----------|--------|-------------------|
| 0 FREEZE | 1-2 дня | 5 owner decisions | approve |
| 1 AUDIT | 1-2 мес | 30+ visual bugs, perf baseline, design system v0.1 | approve baselines |
| 2 ENGINE DESIGN | 2-4 мес | ENGINE-CONTRACT-RETHINK.md final, anti-engine manifesto | approve contract |
| 3 REWRITE | 2-3 мес | engine v2.0 + Авраам v2.0 | visual sign-off |
| 4 TEMPLATE | 1 мес | docs, template, 2nd map (proof) | approve 1.0 |
| **Total** | **6-8 мес** | | |

## Risks per phase (детально в STRATEGY.md §7)

- Phase 1 может найти > 30 visual bugs (overrun)
- Phase 2 может занять > 4 мес (engine contract hard to design)
- Phase 3 — highest risk, может потребовать возврата в Phase 2

## Impact if YES

- Plan идёт в 6-8 месяцев
- Владелец может периодически терять фокус (другие проекты) — plan учитывает
- Quality bar = atlas-grade, не "good enough"

## Impact if NO (force W-волны)

- Возврат к FAST plan
- Quality bar = "W9 = done"
- 8 placeholder'ов активируются по образцу ishod (см. OWNER-DECISION-1)

## Decision format

Владелец отвечает:
- **YES** (default per new strategy) — phased plan, months
- **CONDENSED** — phase 1+2+3+4 = 3-4 месяца, **но** quality bar понижается до "very good, not atlas"
- **NO** — revert to W-waves (revisit OWNER-DECISION-1)

## Do not mix with

- OWNER-DECISION-1 (which routes) — timeline is about HOW LONG, not WHAT
- OWNER-DECISION-4 (atlas quality bar) — that's about WHAT QUALITY

---

**Owner decision required:** ДА (блокирующий для Phase 1)
**Deadline:** before Phase 1 start (1-2 дня после OWNER-DECISION-1)
