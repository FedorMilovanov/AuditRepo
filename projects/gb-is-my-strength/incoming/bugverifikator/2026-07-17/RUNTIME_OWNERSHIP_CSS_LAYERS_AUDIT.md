# Runtime Ownership + CSS Layers Deep Audit — bugverifikator — 2026-07-17

**Project:** gb-is-my-strength  
**Source HEAD:** a2ef67da5  
**Focus areas:** AR-IDX-JS-02 (runtime ownership), D-2 (css:layer:validate)  
**Agent:** bugverifikator  
**Report type:** source-audit

---

## 1. AR-IDX-JS-02 — Runtime Ownership Violation (Legacy theme writer)

### Canonical Owner
- **File:** `js/reader-preferences.js`
- **Version:** GB Reader Preferences v1
- **Storage key:** `gb:reader-preferences:v1`
- **Responsibility:** Single source of truth for `theme`, `fontScale`, `lineHeight`, `measure`, `textMode`, `motion`

### Violating Script
- **File:** `js/enhancements.js` (minified legacy runtime)
- **Line (de-minified logic):** `setTheme()` function

**Evidence (direct code):**
```js
function setTheme(dark) {
    document.documentElement.classList.toggle("dark", !!dark);
    try {
        localStorage.setItem(
            window.SiteUtils && SiteUtils.themeKey ? SiteUtils.themeKey : "theme",
            dark ? "dark" : "light"
        );
    } catch (_) {}
}
```

**Problem:**
- `enhancements.js` продолжает писать в **legacy ключ** `theme` (или `SiteUtils.themeKey`).
- Это создаёт **multi-writer surface** для темы.
- `reader-preferences.js` является declared canonical owner, но legacy скрипт игнорирует этот контракт.

**Impact:**
- Возможные race conditions при переключении темы
- Нарушение принципа единственного владельца runtime preferences
- Усложнение отладки и миграции

**Status:** Подтверждено на текущем HEAD.

---

## 2. D-2 — css:layer:validate Scope Violation

### Validator Script
- **File:** `scripts/css-layer-validator.js`
- **Purpose:** Проверяет @layer архитектуру (order declaration, named layers, !important ceiling и т.д.)

### Current Behavior
Скрипт **жёстко ограничен** только `css/site.css`:

```js
// Usage examples in the file:
node scripts/css-layer-validator.js css/site.css
node scripts/css-layer-validator.js css/site.css --ceiling=202
```

**Отсутствуют проверки для:**
- `css/home.css`
- `css/floating-cluster.css`

**Evidence:**
- Весь скрипт построен вокруг single-file валидации `site.css`.
- Нет параметров или конфигурации для валидации других CSS-файлов.
- Нет упоминаний `home.css` или `floating-cluster.css` в коде валидатора.

### Problem
`css:layer:validate` (как инструмент/чек) **обходит** layer validation для двух важных CSS-файлов, которые тоже используют @layer архитектуру.

**Impact:**
- Неполное покрытие layer contract
- Риск нарушения layer order в `home.css` и `floating-cluster.css` остаётся неконтролируемым
- Снижает ценность инструмента как системного guard

**Status:** Подтверждено.

---

## Summary

| Residual | Status | Evidence Strength | Root Cause |
|----------|--------|-------------------|------------|
| AR-IDX-JS-02 | Confirmed | Strong (direct code) | Legacy `enhancements.js` writes to `theme` key |
| D-2 | Confirmed | Strong (script scope) | Validator only targets `site.css` |

## Next Steps (по AuditRepo правилам)

1. Создать witnesses (W2-source + W3-artifact)
2. Переместить в `working/` для synthesis
3. Принять решение: 
   - Починить `enhancements.js` (убрать legacy writer)
   - Расширить `css-layer-validator.js` на `home.css` + `floating-cluster.css`

**Raw evidence ready for verification wave.**