# Proposal: OWNER-DECISION-4 — Atlas-grade quality bar

**Source:** `incoming/arena-agent-karty-strategy/2026-07-07/STRATEGY.md` §6 (success criteria), §2 (vision)
**Current source HEAD:** `75f807b73`
**Status:** `proposal-open` (awaiting owner decision)

## What we are asking the owner to confirm

> Atlas-grade = 8 критериев одновременно (см. STRATEGY.md §6):
> 1. Visual (Macmillan-уровень)
> 2. Narrative (Play = 5-мин тур)
> 3. Reference (полный scholar's apparatus для каждого места)
> 4. Cross-ref (Авраам → Иаков / Исход / Ханаан)
> 5. Performant (4G mobile < 2 сек)
> 6. A11Y (screen reader 100%, keyboard 100%)
> 7. Editorial (библеист находит новое, мирянин находит новое)
> 8. Honest (источники, даты, споры)

**Авраам v2.0 готов, когда все 8 критериев одновременно. Не раньше.**

## Why this decision is needed

«Atlas-grade» — это **высокая** планка. Не «good enough», не «работает», не «выглядит прилично». **Macmillan Bible Atlas уровень**, в digital-форме.

Владелец должен подтвердить, что готов отложить «активировать 8 placeholders» пока Авраам не достигнет всех 8 критериев.

## References для калибровки (что НЕ догоняем, но к чему стремимся)

- **The Macmillan Bible Atlas** (Yohanan Aharoni, 1968, ISBN 002503605X) — академический стандарт, 70+ карт
- **ESV Bible Atlas** (Crossway, 2010) — современный reference
- **Logos Bible Software** — золотой стандарт цифровой библейской работы
- **Step Bible** (Biblical Hebrew + Greek + geography)

**Наш дифференциатор** (зачем наш атлас):
- Русскоязычный
- Православно-баптистский фокус
- Современная археология (2024-2026)
- Открытый код

## 8 критериев подробно

### 1. Visual (Macmillan-уровень)
Заходишь на https://gospod-bog.ru/karty/avraam/, видишь карту — и сразу ясно: это Macmillan, не "ещё одна leaflet-карта".
- Золотой/тёмный/светлый theme
- Иврит с правильным RTL
- Типографика серифная
- Анимации — только на вход/выход, не на каждом движении мыши

### 2. Narrative (5-мин тур)
Press Play → получаешь 5-минутный тур по 8 этапам, как документалка.
- Audio (опционально)
- Captions (всегда)
- Скорость настраивается

### 3. Reference (scholar's apparatus)
Любое место = полный apparatus:
- Text (ru)
- Bible (Синодальный, дословно)
- Archaeology (2024-2026, с источниками)
- Hebrew (иврит + транслитерация + этимология)
- Photos (3-5 шт, проверенные)
- Variants (где есть споры)

### 4. Cross-ref
Из Авраама → в Иакова / Исход / Ханаан — одним кликом, с сохранением контекста.
- Где «Иаков уходит в Харран» — клик → переход на /karty/ishod/ (когда ishod активирован) с контекстом «Иаков, продолжающий путь Авраама»

### 5. Performant
- 4G mobile < 2 сек загрузка
- Интерактив < 100ms
- Lighthouse 95+ mobile + desktop

### 6. A11Y
- Screen reader получает полную карту (включая spatial)
- Keyboard-only user навигирует 100% функций
- NVDA / VoiceOver проходит

### 7. Editorial
- Библеист находит минимум 1 место, где узнал что-то новое (2024-2026 archaeology)
- Мирянин находит минимум 1 место, где узнал что-то новое о Библии

### 8. Honest
- Каждый источник цитируется
- Каждая дата проверяема
- Каждый спор — спором, не "истиной в последней инстанции"

## Impact if YES

- Phase 3 не закрывается, пока все 8 критериев не достигнуты
- Можно потерять 1-2 месяца на отдельном критерии (например, A11Y требует полного re-architecture)
- Но quality = high

## Impact if CONDENSED

- Phase 3 закрывается, когда **4-5 из 8** критериев достигнуты
- «very good, not atlas»
- 8 placeholder'ов могут быть активированы раньше (если OWNER-DECISION-1 = NO)

## Impact if NO (downgrade)

- Quality bar = "good enough"
- W-волны, weeks, не months
- Возврат к предыдущему intake

## Decision format

Владелец отвечает:
- **YES** (default per new strategy) — все 8 критериев
- **CONDENSED** — 4-5 из 8 (владелец указывает, какие)
- **NO** — downgrade

## Do not mix with

- OWNER-DECISION-3 (timeline) — quality is about WHAT, not HOW LONG
- OWNER-DECISION-5 (visual QA baseline) — that's about CURRENT state

---

**Owner decision required:** ДА (определяет success criteria для Phase 3)
**Deadline:** before Phase 3 start (3-6 мес после OWNER-DECISION-1)
