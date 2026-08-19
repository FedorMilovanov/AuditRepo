# Service Worker + PWA/Offline Deep Audit — bugverifikator — 2026-07-17

**Project:** gb-is-my-strength  
**Source HEAD:** a2ef67da5  
**Focus:** sw.js, manifest.json, PWA/offline surface  
**Agent:** bugverifikator  
**Report type:** source-audit

---

## 1. Service Worker Overview

**File:** `sw.js` (345 lines)  
**Current version:** `gb-v197-bible-legacy-authority-20260804`

### Cache Architecture (6 named caches)
- `CACHE_STATIC`
- `CACHE_CONTENT`
- `CACHE_DATA`
- `CACHE_IMAGES`
- `CACHE_PAGEFIND`
- `CACHE_META`

**Strengths:**
- Чёткое разделение по типам контента
- Есть лимиты (`IMAGE_CACHE_LIMIT=60`, `CONTENT_CACHE_LIMIT=30`, `DATA_CACHE_LIMIT=60`, `PAGEFIND_CACHE_LIMIT=50`)
- Есть `activate` handler, который чистит старые `gb-*` кэши

### Key Functions Identified
- `cacheFirst()`
- `networkFirstWithCache()`
- `revisionedStaticNetworkFirst()`
- `networkFirstPagefindData()`
- `networkFirstHtml()`

---

## 2. Potential Issues Found

### Issue SW-01: Very Long Cache Version String

**Location:** Line 3
```js
const CACHE_VERSION = 'gb-v197-bible-legacy-authority-20260804';
```

**Problem:**
- Версия содержит исторический baggage (`bible-legacy-authority`).
- Это усложняет читаемость и поддержку.
- При каждом релизе версия растёт и становится всё более "грязной".

**Recommendation:** Рассмотреть более чистую схему версионирования (например `gb-v197-20260804`).

**Severity:** Low (cosmetic)

---

### Issue SW-02: No Explicit Revision Tracking for Runtime Scripts

**Evidence:**
- В `PRECACHE_ASSETS` присутствуют runtime скрипты:
  - `/js/enhancements.js`
  - `/js/reader-preferences.js`
  - `/js/highlights.js`
  - и др.

- Функция `isRevisioned(url)` существует, но **многие runtime скрипты** попадают под `cacheFirst` или `networkFirstWithCache` без явного revision-based инвалидации.

**Risk:**
- Изменения в runtime (особенно `enhancements.js` и `reader-preferences.js`) могут не сразу отражаться у пользователей из-за агрессивного кэширования.

**Severity:** Medium

---

### Issue SW-03: Large Precache List (Potential Install Failure Risk)

**Evidence:**
- `PRECACHE_ASSETS` содержит **~35 файлов** (CSS + JS + иконки + 404.html).
- В `install` event используется `cache.addAll(PRECACHE_ASSETS)`.

**Risk:**
- При проблемах с сетью во время установки Service Worker может упасть весь `install`.
- Нет granular retry или partial precache стратегии.

**Severity:** Low-Medium

---

### Issue SW-04: Missing Offline Fallback Strategy for HTML Navigation

**Evidence:**
- Для HTML используется `networkFirstHtml()`.
- При полной недоступности сети пользователь получит браузерный offline error вместо кастомного offline experience (кроме `/404.html` как fallback).

**Recommendation:** Рассмотреть dedicated offline HTML fallback для navigation requests.

**Severity:** Medium (user experience)

---

## 3. Manifest.json Analysis

**File:** `manifest.json`

**Current state:** Хорошо структурирован:
- Есть `shortcuts` (Нагорная проповедь, Статьи, Биографии, Карты)
- Есть `icons` (включая maskable)
- `display: standalone`
- `scope: "/"`

**No obvious defects found** на текущий момент.

---

## 4. Summary Table

| ID | Issue | Severity | Evidence Strength | Notes |
|----|-------|----------|-------------------|-------|
| SW-01 | Long version string with legacy baggage | Low | Strong | Cosmetic |
| SW-02 | Runtime scripts lack explicit revision tracking | Medium | Strong | Affects updates |
| SW-03 | Large precache list | Low-Medium | Strong | Install reliability |
| SW-04 | Weak offline HTML fallback | Medium | Medium | UX impact |

---

## Next Steps (по AuditRepo)

1. Создать witnesses (W3-artifact + W4-browser-runtime)
2. Переместить в `working/` 
3. Решить: 
   - Упростить `CACHE_VERSION`
   - Добавить revision-based стратегию для runtime скриптов
   - Улучшить offline HTML experience

**Raw evidence ready for verification wave.**