# False Positives Registry — gb-is-my-strength — 2026-06-25

**Верификатор:** Arena Agent TOC  
**Метод верификации:** static source scan + git history (Python grep)

Этот документ фиксирует баги из `UNIFIED_BUG_LEDGER_2026-06-25.md` которые **не подтверждаются** при статическом анализе HEAD.

---

## FP-01 · P0-1 "Gill Rail SAVE NOP"

**Claimed:** `data-action="save"` not handled by fc-controller.  
**Reality:** Обрабатывается через `initCluster()`:
```js
if (action === 'save') { saveCurrent(btn); }
```
`GillRailControls` рендерит `data-fc-action="save"`. `initGillRail()` → `initCluster(railControls)`.  
**Verdict: CLOSE**

---

## FP-02 · P0-2 "floating-cluster.css EMPTY"

**Claimed:** "File contains only comment header; all CSS in site.css + inline"  
**Reality:** Размер = 68,596 bytes. Содержит 1663 строк CSS: `.gb-floater`, `.gb-icon`, `.gb-ember`, `.gb-save`, `.gb-theme-toggle`, `.gbs-rail-foot`, `.gb-series-chip` и ~200 других правил.  
**Verdict: CLOSE**

---

## FP-03 · P0-3 "robots.txt blocks AhrefsBot/SemrushBot/MJ12bot"

**Claimed:** Блокировка SEO-краулеров — баг.  
**Reality:** `robots.txt` содержит `# AUDIT V2 (2026-05): SEO-краулеры` — намеренное editorial решение. Яндекс и Google остаются разрешёнными. AhrefsBot/Semrush помечены как "bulk scrapers" — блокировка осознанная.  
**Verdict: POLICY DECISION, NOT A BUG. CLOSE**

---

## CONDITIONAL — PS-05 "stray 76e7365"

**Claimed:** Строка `76e7365` в body Hermeneutics.  
**Static HEAD check:** НЕ найдена ни в source, ни в root HTML.  
**BUT:** Playwright-проверка на production-like dist подтвердила. Likely downstream of P0-10.  
**Verdict: CONFIRMED in dist, ROOT CAUSE = P0-10. Fix P0-10 → closes PS-05.**

---

## NOTES для реализующего агента

1. Не тратить время на FP-01, FP-02, FP-03.
2. Сосредоточиться на P0-10 (hash bomb) как **корневой причине** PS-01, PS-02, PS-03, PS-05.
3. После исправления P0-10: re-run Playwright для верификации PS-01/05.
4. P0-6 (CI race): verify в git history перед реализацией.
