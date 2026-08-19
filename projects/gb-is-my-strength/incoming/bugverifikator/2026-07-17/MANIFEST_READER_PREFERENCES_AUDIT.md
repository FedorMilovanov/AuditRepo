# Manifest.json + Reader Preferences Surface Audit — bugverifikator — 2026-07-17

**Project:** gb-is-my-strength  
**Source HEAD:** a2ef67da5  
**Focus:** manifest.json (maskable icons, shortcuts) + reader-preferences surface  
**Agent:** bugverifikator  
**Report type:** source-audit

---

## 1. manifest.json Analysis

### Current State
- Хорошо структурирован
- Есть `shortcuts` (4 пункта)
- Есть `icons` с `purpose: maskable`
- `prefer_related_applications: false`

### Findings

#### MAN-01: Maskable Icon Quality Concern (Low)

**File:** `/icons/icon-512-maskable.png`

**Observation:**
- Maskable иконка присутствует.
- Однако **размер файла** значительно больше обычной иконки (7.7KB vs 3KB).

**Potential Issue:**
- Maskable иконки должны иметь безопасную зону (safe zone) и правильный padding.
- Большой размер файла может указывать на отсутствие оптимизации или неправильную подготовку.

**Severity:** Low (нужна визуальная проверка)

#### MAN-02: Shortcuts — Missing Icons

**Current shortcuts:**
1. Нагорная проповедь → `/nagornaya/seriya/`
2. Статьи → `/articles/`
3. Биографии → `/biografii/`
4. Карты → `/karty/`

**Issue:**
- Ни один shortcut **не имеет** поля `icons`.
- Согласно PWA best practices, shortcuts рекомендуется снабжать иконками.

**Impact:** Ухудшенный UX в контекстном меню PWA.

**Severity:** Low

#### MAN-03: No `screenshots` field

**Observation:**
- В manifest отсутствует секция `screenshots`.

**Impact:** Меньше шансов на хорошее отображение в Play Store / App Store / PWA discovery.

**Severity:** Very Low

---

## 2. Reader Preferences Surface

### Core Files
- `js/reader-preferences.js` — основной runtime (v1)
- `js/reader-preferences-head.js` — synchronous first-paint bootstrap

### Architecture Strengths
- Чёткое разделение: head bootstrap (синхронный) + runtime (асинхронный)
- Использует единый storage key: `gb:reader-preferences:v1`
- Есть legacy migration логика (`legacy()` функция)

### Findings

#### RP-01: Legacy Migration Surface Still Active

**Evidence (reader-preferences-head.js):**
```js
var legacyTheme = legacy(
  ['gb:gill-reader-theme:v1', 'gb:hm-reader-theme:v1', 'theme'],
  themes,
  systemTheme()
);
```

Аналогично для `lineHeight` и `measure`.

**Problem:**
- Legacy ключи (`theme`, `gb:gill-*`, `gb:hm-*`) до сих пор читаются.
- Это поддерживает **multi-writer** поверхность (см. AR-IDX-JS-02).

**Impact:** Усложняет полный переход на новую модель.

**Severity:** Medium (связано с AR-IDX-JS-02)

#### RP-02: No Validation on Stored State

**Observation:**
- При парсинге `localStorage` нет строгой валидации полей.
- Если сохранённое состояние повреждено или содержит неожиданные значения, fallback происходит, но без логирования/сигнализации.

**Severity:** Low

#### RP-03: fontScale Parsing in Head Bootstrap

**Code:**
```js
fontScale: get('gb:font-scale') || 1,
```

**Issue:**
- В head bootstrap читается старый ключ `gb:font-scale`.
- В runtime (`reader-preferences.js`) канонический ключ — `gb:reader-preferences:v1`.

**Inconsistency:** Два разных ключа для одной и той же настройки в разных частях системы.

**Severity:** Low-Medium

---

## Summary Table

| ID | Area | Issue | Severity | Evidence |
|----|------|-------|----------|----------|
| MAN-01 | manifest | Maskable icon size suspicious | Low | File size |
| MAN-02 | manifest | Shortcuts without icons | Low | Missing field |
| MAN-03 | manifest | No screenshots | Very Low | Missing field |
| RP-01 | reader | Legacy migration keys still active | Medium | Direct code |
| RP-02 | reader | No strict validation of stored state | Low | Code review |
| RP-03 | reader | fontScale uses legacy key in head | Low-Medium | Key mismatch |

---

## Next Steps

1. Witness collection (W2-source + W4-browser-runtime)
2. Move to `working/`
3. Consider:
   - Добавить иконки к shortcuts
   - Упростить legacy migration (после фикса AR-IDX-JS-02)
   - Унифицировать `fontScale` ключ

**Raw evidence ready for verification wave.**