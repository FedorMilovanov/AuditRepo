# Proposal: OWNER-DECISION-5 — Visual QA baseline

**Source:** `incoming/arena-agent-karty-strategy/2026-07-07/STRATEGY.md` §4.1 (Phase 1.1 visual audit)
**Current source HEAD:** `75f807b73`
**Status:** `proposal-open` (awaiting owner decision)

## What we are asking the owner to confirm

> Владелец просматривает https://gospod-bog.ru/karty/avraam/ на desktop + mobile, делает скриншоты, описывает **что не так** (визуально, не функционально). Результат = `audit/avraam/visual-baseline.md` (Phase 1.1 deliverable). Этот baseline = отправная точка для atlas-grade.

## Why this decision is needed

Аудитор в audit-only режиме **не может** запустить Playwright / браузер. Только владелец (или живой reviewer) может сказать, выглядит ли Авраам приемлемо. Без baseline мы не знаем, от чего отталкиваться.

## What we need from the owner

Минимум (можно аутсорсить):
1. **Desktop screenshot** (1920×1080) — главный экран, открытое место
2. **Mobile screenshot** (iPhone 14, 390×844) — то же
3. **5 пунктов «что не так»** (визуально):
   - пример: «панель перекрывает маркер»
   - пример: «текст иврита не выровнен по правому краю»
   - пример: «кнопка play слишком близко к таймлайну»
4. **1 пункт «что хорошо»** (чтобы не потерять)

Опционально (если владелец хочет deeper):
- Tablet (iPad, 1024×768)
- Каждый из 8 этапов
- Каждый из 5 сюжетов
- Каждый таб (story, bible, arch, he, dispute)
- Long-press, swipe, deep-link, photo modal

## When

- **ASAP**, before Phase 1 start
- Длительность: 30 минут (desktop + mobile + 5 пунктов)
- Output: `audit/avraam/visual-baseline.md` в gb-is-my-strength
- Потом — Phase 1.1 Playwright screenshots как supplement

## Output schema

```markdown
# Visual Baseline — Авраам @ 75f807b73

**Date:** 2026-07-XX
**Reviewer:** [owner / external]
**Source URL:** https://gospod-bog.ru/karty/avraam/

## Desktop (1920×1080)

![desktop-main](screenshots/desktop-main.png)
![desktop-panel](screenshots/desktop-panel.png)
![desktop-tour](screenshots/desktop-tour.png)

### Bugs (5)
1. [визуальный баг 1, file:line если есть, severity]
2. ...

### Strengths (1)
1. [что хорошо]

## Mobile (iPhone 14, 390×844)

![mobile-main](screenshots/mobile-main.png)
![mobile-panel](screenshots/mobile-panel.png)

### Bugs (5)
1. [визуальный баг 1]
2. ...

### Strengths (1)
1. [что хорошо]

## Cross-platform

[Что не работает на обоих, что только на mobile, что только на desktop]

## Severity

- P0 (блокер): N
- P1 (заметный): M
- P2 (мелкий): K
- P3 (косметика): L
```

## Impact if YES

- Phase 1.1 = 1-2 недели (Playwright + анализ)
- Visual baseline — official start
- Можем объективно мерить «стало лучше / хуже»

## Impact if NO (skip baseline)

- Phase 1.1 откладывается
- Phase 3 (rewrite) идёт «вслепую» — не знаем, от чего отталкиваться
- Риск: atlas-grade v2.0 хуже v1.0 (визуально)

## Decision format

Владелец отвечает:
- **YES, я сделаю baseline** (owner-driven, 30 мин)
- **YES, я найду reviewer** (outsource, 1-2 дня)
- **NO, давайте без baseline** (высокий риск)

## Do not mix with

- OWNER-DECISION-4 (atlas quality bar) — это про success criteria, не baseline
- OWNER-DECISION-3 (timeline) — visual baseline = quick win, не блокирует план

---

**Owner decision required:** ДА (опционально, но рекомендуется)
**Deadline:** before Phase 1 start
**Estimated effort:** 30 мин (owner) или 1-2 дня (outsource)
