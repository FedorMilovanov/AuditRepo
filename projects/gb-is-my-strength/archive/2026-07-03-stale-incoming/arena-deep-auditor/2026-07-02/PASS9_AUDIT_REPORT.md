# Pass 9: Build/Deploy + Runtime Errors + Cross-Browser Compatibility

**Дата:** 2026-07-02  
**HEAD:** d5d9388b (без изменений)  
**Аудитор:** Arena Deep Auditor

---

## 🆕 Новые находки (Pass 9)

### NEW-33 [P2]: Нет глобального обработчика ошибок JavaScript
**Файлы:** `js/site.js`, `js/enhancements.js`, `js/floating-cluster-controller.js`  
**Проблема:**
- `window.onerror`: 0 определений
- `unhandledrejection` handler: 0 определений
- `site.js` и `enhancements.js` содержат **0 try/catch блоков**
- Только `floating-cluster-controller.js` имеет 17 try/catch

**Impact:** Необработанные ошибки просто пропадают. Невозможно отследить runtime failures в production. Пользователи видят сломанный UI без возможности сообщить.

**Evidence:**
```bash
grep -r "window.onerror" js/ articles/  # 0
grep -r "unhandledrejection" js/ articles/  # 0
grep -c 'try {' js/site.js  # 0
grep -c 'try {' js/enhancements.js  # 0
```

**Fix:** Добавить глобальный error handler:
```javascript
window.addEventListener('error', function(e) {
  if (window.ym) ym(108353327, 'params', {error: e.message, url: e.filename, line: e.lineno});
});
window.addEventListener('unhandledrejection', function(e) {
  if (window.ym) ym(108353327, 'params', {promise_error: e.reason});
});
```

---

### NEW-34 [P2]: grid-template-rows: 0fr без fallback в gtips
**Файл:** `css/site.css` (строка ~494+)  
**Проблема:** `.gtip-detail-wrap` использует `grid-template-rows: 0fr` для анимации раскрытия tooltip без @supports fallback. Safari 15 не поддерживает эту фичу (появилась в Safari 16).

**Impact:** Tooltip раскрытие не анимируется на Safari 15, мгновенно появляется.

**Evidence:**
```css
.gtip-detail-wrap{display:grid;grid-template-rows:0fr;transition:grid-template-rows .42s...}
/* НЕТ @supports not (grid-template-rows:0fr) fallback! */
```

**Note:** FAQ accordion имеет fallback (`@supports not (grid-template-rows:0fr)`), но gtips — нет.

**Fix:** Добавить @supports fallback:
```css
@supports not (grid-template-rows: 0fr) {
  .gtip-detail-wrap { display: block; max-height: 0; overflow: hidden; }
  .gtip--expanded .gtip-detail-wrap { max-height: 600px; }
}
```

---

### NEW-35 [P3]: FAQ accordion — третий grid-template-rows:0fr без fallback
**Файл:** `css/site.css`  
**Проблема:** `.faq-accordion__item:not(.open):not(.is-open) .faq-accordion__body` использует `grid-template-rows: 0fr` но находится вне `@supports not` блока. Хотя основной accordion body имеет fallback, это отдельное правило — нет.

**Impact:** Низкий — основное правило имеет fallback, этот только усиливает pointer-events:none.

---

### NEW-36 [P3]: scrollbar-gutter: stable без fallback (Safari 15-16.3)
**Файл:** `css/site.css`  
**Проблема:** `scrollbar-gutter: stable` в `@media (hover:hover) and (pointer:fine)` — поддерживается Safari 16.4+, но AGENTS.md §1.1 требует Safari 15+.

**Impact:** На Safari 15-16.3 layout может отличаться (появляется/исчезает скроллбар при переходе между страницами). Не критично — это decoration, не функциональность.

---

## 🟢 Positive Checks (Pass 9)

| Check | Result |
|-------|--------|
| 404.html exists | ✅ 7.8KB |
| CNAME file | ✅ gospod-bog.ru |
| 8 GitHub workflows | ✅ All present |
| 3 workflows with schedule | ✅ Mon 03:00, 03:30, 06:00 UTC |
| 6 workflows with manual trigger | ✅ |
| notify-on-failure watches 7 workflows | ✅ Complete coverage |
| SW precache: 26 assets | ✅ |
| SW cache strategies: 3 (cacheFirst, networkFirst, staleWhileRevalidate) | ✅ |
| SW offline fallback: 404.html | ✅ |
| SW QuotaExceededError handling | ✅ |
| Yandex Metrika integration | ✅ |
| container queries: 1 use with @supports | ✅ |
| CSS nesting: 0 uses | ✅ No compatibility risk |

---

## 📈 Updated Matrix: 35 bugs

| Severity | Count | Change |
|----------|-------|--------|
| 🔴 P1 | 3 | — |
| 🟡 P2 | 21 | +2 (NEW-33, NEW-34) |
| 🔵 P3 | 9 | +2 (NEW-35, NEW-36) |
| ⚪ S0 | 2 | — |
| **Total** | **35** | +4 |

---

## 🔍 Критичность новых находок

| ID | Severity | Actionability | Risk |
|----|----------|---------------|------|
| NEW-33 | P2 | Medium (add handlers) | High (silent failures) |
| NEW-34 | P2 | Low (add @supports) | Medium (Safari 15 UX) |
| NEW-35 | P3 | Low (add @supports) | Low (enhancement) |
| NEW-36 | P3 | Low (media query guard) | Low (cosmetic) |

---

**Commit:** pending  
**Location:** `AuditRepo/projects/gb-is-my-strength/incoming/arena-deep-auditor/2026-07-02/`
