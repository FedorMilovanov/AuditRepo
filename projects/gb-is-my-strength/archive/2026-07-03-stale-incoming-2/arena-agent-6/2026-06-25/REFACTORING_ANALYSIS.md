# Deep Refactoring Analysis — gb-is-my-strength
**Agent:** arena-agent-6
**Date:** 2026-06-25
**Method:** Full documentation read + source code verification

---

## EXECUTIVE SUMMARY

**Рефакторинг продвинулся ДАЛЬШЕ, чем документы говорят.**

REFACTORING_BRAIN (23 июня) утверждает: «51 из 52 страниц используют loadLegacyFullDocument». Но HEAD (25 июня) показывает: **0 страниц** его используют. `_legacy/` директория **удалена**. Все 51 route теперь используют нативные Astro-компоненты.

---

## 1. ТЕКУЩЕЕ СОСТОЯНИЕ (факты из HEAD)

### 1.1 loadLegacyFullDocument — МЁРТВ
- Определение: `src/utils/legacyFullDocument.ts` — файл существует, но НЕ ИМПОРТИРУЕТСЯ ни одной страницей
- Использование в `.astro`: **0 импортов** (только упоминания в комментариях)
- `_legacy/` директория: **НЕ СУЩЕСТВУЕТ** (удалена)
- `?raw` импорты: **0** (только в комментариях о прошлом)

### 1.2 Статус страниц (51 route)

| Категория | Количество | Примеры |
|---|---|---|
| Нативные Astro (PageHead + PageChrome + MainShell) | 51 | Все статьи, лендинги, карты, nagornaya |
| Используют loadLegacyFullDocument | 0 | — |
| Используют _legacy/ фрагменты | 0 | — |

### 1.3 Корневые файлы (legacy layer)

| Тип | Количество | Статус |
|---|---|---|
| Root HTML (index.html) | 12 | Лендинги — больше НЕ КОПИРУЮТСЯ в dist (все routes = astro-owned) |
| Root CSS | 7 | Ещё нужны — Astro компоненты ссылаются ../../css/site.css |
| Root JS | 13 | Ещё нужны — Astro компоненты ссылаются ../../js/site.js |
| _legacy/ | 0 | УДАЛЕНА |

### 1.4 Strangler pipeline (production build)

```
npm run strangler:build:production-like
  = astro:build (51 Astro pages → dist/)
  + copy-legacy-to-dist.js (CSS/JS/images/fonts → dist/)
  + astro-cache-bust-postbuild.js (?v= hashes)
```

copy-legacy-to-dist.js копирует CSS/JS/fonts/images в dist/, но ПРОПУСКАЕТ HTML-страницы, которые owned Astro. Root HTML — dead code для production.

---

## 2. ЧТО ОСТАЛОСЬ ДОБИТЬ (по приоритету)

### 2.1 УДАЛИТЬ 12 ROOT HTML ФАЙЛОВ (P1 — dead code)
Файлы: `about/index.html`, `articles/index.html`, `biografii/index.html`, `baptisty-rossii/index.html`, `hard-texts/index.html`, `index.html`, `karty/index.html`, `konfessii/index.html`, `map/index.html`, `nagornaya/index.html`, `pastor-series/index.html`, `rodosloviye/index.html`

**Почему dead:** Все 51 route = astro-owned в page-ownership.json. copy-legacy-to-dist.js пропускает astro-owned routes. Эти файлы НЕ попадают в production dist.

**Риск:** Низкий. Но нужно проверить, что cache-bust.js и audit-pro.js не зависят от них.

### 2.2 CSS: ПЕРЕСТАТЬ ЗАВИСЕТЬ ОТ ROOT CSS (P2 — architectural)
Текущее состояние: Astro компоненты ссылаются на `../../css/site.css` (root). copy-legacy-to-dist.js копирует CSS в dist/.

**Что делать:**
- Вместо `<link href="../../css/site.css">` использовать Astro import: `import '../styles/site.css'`
- Astro bundler автоматически захеширует и за-bundle-ит CSS
- Убрать copy-legacy-to-dist.js шаг для CSS
- Удалить root `css/` директорию

**Проблема:** `site.css` = 1869 строк, 68KB. Astro bundler может сломать specificity из-за порядка импорта. Нужен `@layer` подход (Phase 2 из REFACTORING_6_0).

### 2.3 JS: ПЕРЕСТАТЬ ЗАВИСЕТЬ ОТ ROOT JS (P2 — architectural)
Текущее состояние: Astro компоненты загружают `<script src="../../js/site.js">` с ?v= хешем.

**Что делать:**
- Разбить site.js на модули (theme.js уже извлечён)
- Использовать Astro `<script>` bundling
- Удалить root `js/` директорию

**Проблема:** site.js = минифицированный бандл без source map. Reverse-engineering needed.

### 2.4 MAPS: NATIVE MIGRATION (P2 — в процессе)
Текущее состояние:
- `/karty/ishod/` — **STRICT NATIVE** (AvraamPageHead + AvraamMap)
- `/karty/avraam/` — **STRICT NATIVE** (AvraamPageHead + AvraamMap)
- Все 10 карт — нативные Astro компоненты
- `/map/` — нативный
- `/rodosloviye/` — нативный (React island)
- `/konfessii/russkij-baptizm/` — нативный (iframe/3D)

**Статус:** Карты УЖЕ переведены на native Astro! PROTECTED_APP_ROUTES_NATIVE_ASTRO_PHASE.md описывает архитектуру: изолированный PageHead (SEO) + изолированный Map/App компонент (runtime). НЕ используют site.css/site.js.

### 2.5 NAGORNAYA: COMPONENTIZATION (P2 — частично)
Текущее состояние:
- `chast-1` — разбит на компоненты (NagornayaChast1PageHead, PageChrome, PageFooter)
- `chast-2..5`, `index`, `istochniki`, `nakhodki`, `seriya` — тоже нативные компоненты
- `tw.min.css` (34KB Tailwind) — отдельный файл, не интегрирован в @layer
- `nagornaya-mobile-toc.js/css` — отдельные файлы

**Что осталось:**
- Интегрировать tw.min.css в site-layered.css @layer
- Убрать отдельный Tailwind build
- V2-2: font selectors mismatch (source-only, production OK)

### 2.6 CSS @layer АРХИТЕКТУРА (P3 — Phase 2)
Текущее состояние:
- `site.css` — 1869 строк, 202 `!important` (цель: ≤150)
- `site-layered.css` — существует, но не используется
- `nagornaya/tw.min.css` — 34KB отдельный Tailwind

**Что делать:**
- Создать `@layer reset, base, gbs2, nagornaya, components, utilities, overrides`
- Мигрировать site.css → site-layered.css по частям
- Интегрировать tw.min.css

### 2.7 JS DECOMPOSITION (P3 — Phase 3)
Текущее состояние:
- `site.js` — минифицированный бандл, 165KB
- `theme.js` — уже извлечён в js/modules/
- `enhancements.js` — обрабатывает GBS2 controls
- `floating-cluster-controller.js` — standalone IIFE

**Что осталось:**
- Извлечь tooltip/popover модуль
- Извечь footnote/reader модуль
- Извечь navigation модуль
- Source map для всех модулей
- TypeScript для map-engine.js

### 2.8 CI VISUAL PARITY GUARD (P4)
Текущее состояние: `visual:parity:guard` работает локально, но НЕ в production CI.

**Что делать:** Добавить в deploy.yml как blocking gate.

---

## 3. КОСТЫЛИ РЕФАКТОРИНГА (anti-patterns в коде)

### 3.1 copy-legacy-to-dist.js — ГЛАВНЫЙ КОСТЫЛЬ
**Суть:** Скрипт копирует root CSS/JS/fonts/images в dist/ после astro:build.
**Почему костыль:** Astro уже умеет bundling CSS/JS. Root файлы — дублирование.
**Когда убрать:** После миграции CSS/JS на Astro import.

### 3.2 cache-bust.js — РУЧНОЕ УПРАВЛЕНИЕ КЕШЕМ
**Суть:** Скрипт вычисляет MD5 хеши и проставляет ?v= во все HTML файлы.
**Почему костыль:** Astro bundler делает это автоматически (content hash в имени файла).
**Когда убрать:** После миграции CSS/JS на Astro import.

### 3.3 sw.js PRECACHE_ASSETS — РУЧНОЙ СПИСОК
**Суть:** Service Worker precache массив захардкожен в sw.js.
**Почему костыль:** При каждом изменении CSS/JS нужно обновлять список.
**Когда убрать:** После автоматизации SW генерации.

### 3.4 enhancements.js — GBS2 КОНТРОЛЛЕР ВНЕ fc-controller
**Суть:** GBS2 controls (theme/search/share/font) обрабатываются в enhancements.js, а не в fc-controller.
**Почему костыль:** Два разных JS-файла делают похожие вещи (theme toggle, search open).
**Когда убрать:** После объединения в единый контроллер.

### 3.5 nagornaya-mobile-toc.js — ОТДЕЛЬНЫЙ БАНДЛ ДЛЯ ОДНОЙ СЕРИИ
**Суть:** 34KB Tailwind + отдельный JS только для Нагорной.
**Почему костыль:** Дублирует site.css/site.js функциональность.
**Когда убрать:** После интеграции в @layer и модульную систему.

---

## 4. КАРТЫ — NATIVE СТАТУС

### 4.1 Все карты УЖЕ native Astro
| Route | PageHead | Map Component | Legacy? |
|---|---|---|---|
| /karty/ | KartyPageHead ✅ | KartyLanding ✅ | ❌ |
| /karty/avraam/ | AvraamPageHead ✅ | AvraamMap ✅ | ❌ |
| /karty/ishod/ | IshodPageHead ✅ | IshodMap ✅ | ❌ |
| /karty/early-church/ | Native ✅ | Native ✅ | ❌ |
| /karty/maccabim/ | Native ✅ | Native ✅ | ❌ |
| /karty/melachim/ | Native ✅ | Native ✅ | ❌ |
| /karty/pavel/ | Native ✅ | Native ✅ | ❌ |
| /karty/revelation/ | Native ✅ | Native ✅ | ❌ |
| /karty/shoftim/ | Native ✅ | Native ✅ | ❌ |
| /karty/shvatim/ | Native ✅ | Native ✅ | ❌ |
| /karty/yeshua/ | Native ✅ | Native ✅ | ❌ |
| /map/ | Native ✅ | Graph component ✅ | ❌ |
| /rodosloviye/ | Native ✅ | React island ✅ | ❌ |
| /konfessii/russkij-baptizm/ | Native ✅ | 3D/iframe ✅ | ❌ |

**ВЫВОД: Карты ПОЛНОСТЬЮ переведены на native Astro.** Никакой legacy-зависимости.

### 4.2 Архитектура карт (PROTECTED_APP_ROUTES_NATIVE_ASTRO_PHASE.md)
- Изолированный PageHead (SEO/JSON-LD/meta) — НЕ использует site.css
- Изолированный Map/App компонент — НЕ использует site.js
- map-engine.js загружается напрямую
- Данные из route.json
- Полная автономность от основного CSS/JS стека

---

## 5. ОСТАВШАЯСЯ LEGACY-ЗАВИСИМОСТЬ

### 5.1 Единственная реальная зависимость: ROOT CSS/JS
Astro компоненты ссылаются на `../../css/site.css` и `../../js/site.js` (root). copy-legacy-to-dist.js копирует их в dist/. Это ГЛАВНЫЙ костыль.

### 5.2 sw.js — SOURCE-PRODUCTION DRIFT
Source sw.js сломан (syntax error). Production sw.js правильный. Нужно синхронизировать.

### 5.3 cache-bust.js — ASSETS DIVERGENCE
audit-pro.js и cache-bust.js имеют разные списки ASSETS (6 расхождений).

---

## 6. РЕКОМЕНДУЕМЫЙ ПОРЯДОК РАБОТ

1. **Удалить 12 root HTML** (dead code, low risk)
2. **Починить sw.js source-production drift** (NEW-01, P0)
3. **Синхронизировать audit-pro.js / cache-bust.js** (P1-9)
4. **CSS @layer migration** (Phase 2 из 6.0)
5. **JS decomposition** (Phase 3 из 6.0)
6. **Удалить copy-legacy-to-dist.js** (после 4+5)
7. **CI visual parity guard** (Phase 6)
8. **Legacy cleanup** (после всех gates green)
