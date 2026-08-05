# МАСТЕР-ОТЧЁТ v4 — BUNDLE-ПЛАН + 7 КОНТРАКТОВ + НОВОЕ ЗОЛОТО

**Дата:** 2026-08-05 · **Source:** `007c2d3c` · **Ветка:** `arena/019fd2bb-auditrepo` (открыта)

---

## 1. Bundle-анализ site.js (172 КБ = 91 IIFE-блок) — план сплита

`js/site.js` — монолит: **91 IIFE-блок**. Кандидаты на lazy-чанки по capability:

| Блок | Размер | Роут-специфичность | Действие |
|---|---|---|---|
| quiz-memory (блок 28) | 3.7 КБ | 0 вхождений в Astro (рантайм-only) | вынести в quiz-чанк, грузить только при `.interactive-quiz` |
| heart-flip-card (блок 27) | 9.9 КБ | 1 вхождение | вынести в heart-чанк |
| fn-dove (блок 52) | 6 КБ | 0 в Astro | проверить мёртвый/рантайм; если рантайм — в print-чанк |
| tooltip-trigger (блок 50) | 3.6 КБ | 19 вхождений | оставить в ядре (нужен везде) |
| backlinks (блок 82) | 3.1 КБ | 0 в Astro | проверить мёртвый |
| gbx-tts (блок 61) | 2 КБ | 2 вхождения | в TTS-чанк |
| TTS-ядро | ~10 КБ | только long-form | в TTS-чанк (lazy) |

**Оценка экономии:** ~25-30 КБ (15-18%) с главной/каталогов при lazy-загрузке TTS/quiz/heart/print-чанков. Не революция, но **убирает класс «TTS грузится на каталоге»** (уже есть guards, но bundle грузится).

## 2. Контрактная система — 7 контрактов, полный прогон

| Контракт | Результат |
|---|---|
| gill-mobile-bar | PASS 3/3 |
| home-mobile-hero-hub | PASS 3/3 |
| home-sacred-scripture-bg | **FAIL 0/3** (#hScriptureBg нет) |
| karty-minimap | PASS 2/2 |
| nagornaya-mobile-bar | **FAIL 1/4** (btoc не перенесён) |
| search-command-palette-a11y | PASS 4/4 |
| **baptist-3d-app** | **FAIL 1/3** (new Function есть, app.js/app.css НЕ внешние) |

**5 PASS / 3 FAIL** — три FAIL = три реальные проблемы, доказанные машиной.

## 3. Новое золото (проверено)

1. **baptist-3d-app контракт**: 2.25 MiB в одном index.html → цель < 50 KiB + внешние hashed assets. FAIL сейчас — план ясен.
2. **bundle-сплит site.js**: 91 IIFE → capability-чанки (см. §1).
3. **HTML-размеры legacy статей**: Герменевтика 381КБ raw, Antisovetov 370КБ — но Brotli ~80КБ; content-visibility (мастер-план §19) — MEASURE для длинных статей.

## 4. Итог ветки (4 коммита)

1. `b02d741` — 50+ проверок + контракты
2. `e0b9aa7` — откаты + золото + junk-guard
3. `b9b90c1` — контракты v2.1, 6 фич
4. **этот** — bundle-план + baptist-3d контракт

**Следующие шаги:**
1. Починить home-sacred (добавить `#hScriptureBg`) → PASS.
2. Решить Nagornaya btoc (1:1 или ADAPTIVE).
3. bundle-сплит site.js по §1 (3-4 PR по одному чанку).
4. baptist-3d: распаковать index.html → внешние assets.

---

*Документ — untracked; будет добавлен в ветку коммитом.*
