# Bugverifikator Synthesis — 2026-07-17

**Source:** Multiple raw audits in `incoming/bugverifikator/2026-07-17/`  
**Status:** Working synthesis — deduplicated + root-cause mapped  
**Agent:** bugverifikator

---

## Executive Summary

Проведено 4 targeted audit passes по текущему HEAD (`a2ef67da5`).

**Total unique findings:** 13  
**После дедупликации и root-cause mapping:** 9 consolidated issues

**Главные root causes:**
1. **Legacy runtime surface** (`enhancements.js` + старые ключи localStorage) — multi-writer проблема
2. **Incomplete tooling scope** (CSS validator, title patterns)
3. **Brand/title consistency drift**
4. **Service Worker update reliability gaps**

---

## Consolidated Findings (Deduplicated)

### 1. Legacy Runtime Multi-Writer Surface (High Priority)

**Root Cause:** `js/enhancements.js` продолжает писать в legacy `theme` localStorage key, несмотря на существование canonical `reader-preferences.js`.

**Related Findings:**
- AR-IDX-JS-02 (original residual)
- RP-01 (legacy migration keys still active)
- RP-03 (fontScale legacy key in head bootstrap)

**Affected Surfaces:**
- Theme switching
- Reader preferences bootstrap
- Cross-tab sync

**Impact:** Race conditions, difficult migration, violation of single-owner principle.

**Recommendation:** Удалить legacy writers из `enhancements.js` после миграции.

---

### 2. Incomplete CSS Layer Validation Scope

**Root Cause:** `scripts/css-layer-validator.js` жёстко ограничен только `css/site.css`.

**Related Findings:**
- D-2 (original residual)

**Affected Files:**
- `css/home.css`
- `css/floating-cluster.css`

**Impact:** Layer contract не проверяется на важных стилях.

**Recommendation:** Расширить validator на все layer-based CSS файлы.

---

### 3. Title Suffix Inconsistency (Brand Drift)

**Root Cause:** Несколько `PageHead.astro` компонентов используют неполный или отсутствующий суффикс `| Господь Бог — Сила Моя`.

**Findings:**
- D-19 [VERIFIED] — `AntisovetovPageHead.astro` → `| Господь Бог`
- D-20 [Candidate] — `GillContextPageHead.astro` → без суффикса
- D-21 [Candidate] — `KodDaVinchiPageHead.astro` → `| Господь Бог`

**Impact:** SEO + brand consistency.

**Recommendation:** Стандартизировать title pattern во всех article pilots.

---

### 4. Service Worker Runtime Update Reliability

**Root Cause:** Runtime скрипты (`enhancements.js`, `reader-preferences.js` и др.) не имеют явного revision-based cache invalidation.

**Related Findings:**
- SW-02

**Impact:** Изменения в runtime могут не доходить до пользователей своевременно.

**Recommendation:** Применить `revisionedStaticNetworkFirst` стратегию к runtime скриптам.

---

### 5. Service Worker Version String Quality

**Finding:** SW-01  
**Root Cause:** `CACHE_VERSION` содержит исторический baggage (`bible-legacy-authority`).

**Severity:** Low

---

### 6. Service Worker Offline HTML Fallback

**Finding:** SW-04  
**Root Cause:** Только `networkFirstHtml` + `/404.html` fallback. Нет dedicated offline navigation experience.

**Severity:** Medium

---

### 7. PWA Manifest Polish Items

**Findings:**
- MAN-01: Maskable icon size suspicious
- MAN-02: Shortcuts without icons
- MAN-03: No `screenshots` field

**Severity:** Low

---

### 8. Reader Preferences Validation Gaps

**Finding:** RP-02  
**Root Cause:** Отсутствует строгая валидация сохранённого состояния в `reader-preferences.js`.

**Severity:** Low

---

## Root Cause Mapping

| Root Cause | Affected Findings | Priority | Recommended Action |
|------------|-------------------|----------|--------------------|
| Legacy runtime writers (`enhancements.js`) | AR-IDX-JS-02, RP-01, RP-03 | High | Remove legacy localStorage writes |
| Tooling scope limitation | D-2 | Medium | Extend css-layer-validator |
| Inconsistent title patterns | D-19, D-20, D-21 | Medium | Standardize PageHead titles |
| Missing revision strategy in SW | SW-02 | Medium | Apply revisioned cache to runtime JS |
| Historical version string | SW-01 | Low | Clean up CACHE_VERSION |
| Weak offline navigation | SW-04 | Medium | Add proper offline HTML fallback |
| Manifest completeness | MAN-01..03 | Low | Add shortcut icons + screenshots |
| State validation | RP-02 | Low | Add validation layer |

---

## Recommended Next Actions (по AuditRepo)

1. **Verification wave** — собрать witnesses для High/Medium приоритетов
2. **Move to MASTER** — после достаточного количества независимых witnesses
3. **Repair lanes:**
   - Legacy runtime cleanup (AR-IDX-JS-02 cluster)
   - CSS validator expansion
   - Title standardization
   - Service Worker revision strategy

**Synthesis complete.** Ready for verification or owner decision.