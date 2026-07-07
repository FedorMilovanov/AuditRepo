# Proposal: VISUAL-SIGN-OFF — 60+ bugs cataloged, atlas-grade bar needs review

**Source:** `incoming/arena-agent-karty-visual-baseline/2026-07-07/REPORT.md`
**Current source HEAD:** `75f807b73`
**Status:** `proposal-open` (awaiting owner visual sign-off on bug list + bar decision)

## What we are asking the owner to confirm

3 вещи:

1. **Bug list** (60+ visual bugs в `REPORT.md`) — вы с ними согласны? Упустили ли что-то? Преувеличили?
2. **Severity ranking** (5 P0, 7 P1, 33+ P2, 15+ P3) — реалистично? Особенно P0 (орфография, дубликаты дат, наложение лейблов, opacity 0.15, панель 30%)?
3. **Atlas-grade bar** — 8/8 критериев (per `STRATEGY.md` §6) или CONDENSED 4-5/8?

## Why this decision is needed

**Phase 1 budget в STRATEGY.md = 30+ bugs. Actual = 60+. Это 2× расхождение.** Владелец должен либо:
- Подтвердить, что 60+ реалистично (тогда Phase 1 = 2-3 мес вместо 1-2)
- Сократить scope (тогда atlas-grade будет CONDENSED)
- Удалить какие-то из 60 (тогда какие?)

Без решения — Phase 1 невозможно начать.

## Evidence (provided in this intake)

- `evidence/screenshots/zoom-1-full-region.png` (1673×887)
- `evidence/screenshots/zoom-2-mid.png` (1679×889)
- `evidence/screenshots/zoom-3-detail-panel-open.png` (1679×892)

All 3 от владельца (screenshot timestamp 2026-07-07 13:01 MSK = production deploy run `28829729903`).

## Bug distribution

| Severity | Count | Phase |
|----------|-------|-------|
| P0 (atlas-blocker) | 5 | Phase 1 |
| P1 (critical) | 7 | Phase 1 + 2 |
| P2 (high) | 33+ | Phase 1, 2, 3 |
| P3 (polish) | 15+ | Phase 3 |
| **Total** | **60+** | |

## By source file

| File | P0+P1 | P2+P3 | Total |
|------|-------|-------|-------|
| `route.json` (data) | 3 (VB-008, VB-044, VB-006) | 0 | 3 |
| `base-geo.svg` (labels) | 1 (VB-003) | 12 | 13 |
| `map-engine.js` (logic+CSS) | 8 | 21+ | 29+ |
| `avraam-app.js` (avraam-specific) | 0 (not visible) | 0 (not visible) | 0 |

**Key insight:** Большинство визуальных багов — в **engine**, не в avraam-specific коде. Это **подтверждает** стратегию (engine v2.0 first).

## Atlas-grade gap (8 критериев из STRATEGY.md §6)

| # | Criterion | Status | Gap |
|---|-----------|--------|-----|
| 1 | Visual (Macmillan) | ⚠️ Partial | наезжание лейблов, обрезание, opacity bug |
| 2 | Narrative (5-мин тур) | ⚠️ Not verified | tour mode не тестировался |
| 3 | Reference (scholar's apparatus) | ✅ Good | 5 табов, scholar-grade |
| 4 | Cross-ref | ❌ Not visible | нет ссылок (другие карты frozen) |
| 5 | Performant | ❌ Not measured | no Lighthouse |
| 6 | A11Y | ❌ Not tested | no NVDA |
| 7 | Editorial | ✅ Likely | 2024-2026 archaeology |
| 8 | Honest | ⚠️ Partial | дубликаты дат, опечатки |

**Verdict:** 2 ✅, 3 ⚠️, 3 ❌. До atlas-grade — **2-3 месяца** Phase 3 work.

## Decision format

Owner отвечает на 3 вопроса:

### Q1: Bug list согласен?
- **YES** (default per analysis) — 60+ багов реалистичны
- **PARTIAL** — убрать/добавить какие-то (конкретно какие)
- **NO** — пересмотр (например, "opacity 0.15 — это фича, не баг, не трогать")

### Q2: Severity ranking согласен?
- **YES** (default)
- **RECLASSIFY** — какие-то P0→P1, какие-то P1→P2

### Q3: Atlas-grade bar?
- **8/8** (default per STRATEGY.md) — нужно 9-10 мес всего
- **CONDENSED 4-5/8** — 6-7 мес, но честно
- **LOWER 3/4** — 4-5 мес, "very good, not atlas"

## Impact if все YES

- Phase 1: 2-3 мес (не 1-2)
- Phase 1 budget: 60+ bugs (не 30+)
- Phase 3: 8/8 criteria (9-10 мес total)
- Atlas-grade = 8/8 simultaneous

## Impact if CONDENSED

- Phase 1: 1-2 мес (как в плане)
- Phase 3: 4-5/8 criteria (6-7 мес total)
- Atlas-grade = 4-5/8 (что достаточно для "premium, не perfect")

## Do not mix with

- OWNER-DECISION-1 (which routes are live) — это про маршруты, не про качество
- OWNER-DECISION-2 (engine redesign) — это про engine, не про visual
- OWNER-DECISION-3 (timeline) — это про months vs weeks
- OWNER-DECISION-4 (atlas quality bar) — это **same** as Q3, но в стратегии. **Merger:** Q3 here should = OWNER-4

---

**Owner decision required:** ДА (блокирующий для Phase 1)
**Deadline:** before Phase 1 start
**Estimated effort:** 1-2 часа review + 30 мин answers
**Cross-ref:** supersedes OWNER-DECISION-5 (no need for separate owner baseline — this IS the baseline)
