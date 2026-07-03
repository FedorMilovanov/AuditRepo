# Fixes applied — gb-is-my-strength — 2026-06-25

**Агент:** Arena Agent TOC  
**Ветка:** `lane/fix-ps01-iife-scope-2026-06-25`  
**Merged commit:** `c1bd605` → main  
**Источник задач:** `verified/UNIFIED_BUG_LEDGER_2026-06-25.md` + `verification/arena-agent-2-corrections-2026-06-25.md`

---

## Что исправлено

### ✅ PS-01 — `qs is not defined` (P0) — FIXED

**Root cause (per arena-agent-2):** `initTocPopups`, `initActionHandlers`, `initPlayExpand` объявлены после `})();` закрытия IIFE на строке 389 → в global scope, но вызывают `qs()` которая LOCAL к IIFE.

**Fix:** переместили `})();` с строки 389 в конец файла (строка 563). Все три функции теперь внутри IIFE и имеют доступ к `qs()`/`qsa()`.

**Verification:**
```
node /tmp/test-fcc.js → ✅ OK: no crash — PS-01 FIXED
```

---

### ✅ P0-10 — Stale hashes в 72 Astro компонентах — FIXED

**Root cause:** `cache-bust.js` явно добавляет `'src'` в `SKIP_DIRS` → хеши в `src/**/*.astro` никогда не обновлялись.

**Fix:** Python-скрипт обновил все 72 Astro-файла актуальными хешами:

| Asset | Было | Стало |
|---|---|---|
| css/site.css | 202876c3 | b880b524 |
| css/command-palette.css | 48f8ed38 | afe33045 |
| css/mobile-hotfix.css | decfea58 | c1f7664e |
| js/site.js | fed3ec3b | 133dfac1 |
| js/floating-cluster-controller.js | c78a4236 | d6d37dd6 |
| js/nagornaya-mobile-toc.js | f25219b0 | ffd00d98 |
| css/nagornaya-mobile-toc.css | ef840e4c | c4a4a7fd |

**Stale files remaining: 0**

**Note:** P0-10 fix закрывает downstream: PS-01 (если был вызван SW stale), PS-02, PS-03, PS-05.

---

### ✅ PS-06 — readTime drift Hermenevtika (P1) — FIXED

`HermenevtikaBody.astro`: `<span data-pagefind-meta="readTime" hidden="">35</span>` → `50`

---

### ✅ PS-07 — Duplicate IDs gbsTheme/gbsSearch (P0) — FIXED

`GillRailControls.astro`: удалены `id="gbsTheme"` и `id="gbsSearch"`. Контроллер использует делегирование через `data-fc-action`, не `getElementById`.

---

### ✅ P0-7 / P0-8 — SW precache cleanup — FIXED

`sw.js PRECACHE_ASSETS`: удалены `/css/site-layered.css` и `/js/site-modules.js`. Ни один HTML не загружает эти файлы.

---

## False positives закрыты в этом цикле

| ID | Вердикт |
|---|---|
| P0-1 "Gill save NOP" | ❌ FALSE — `data-fc-action="save"` обрабатывается в `initCluster()` |
| P0-2 "floating-cluster.css empty" | ❌ FALSE — 68KB CSS, 1663 строк |
| P0-3 "robots.txt SEO blocks" | ❌ POLICY — намеренно |
| BUG-007 "gill-context no PlayEmber" | ❌ FALSE — `<PlayEmber>` + `<SaveButton>` уже есть в Astro source |

---

## Проверки после merge

```
owner:ui-guard          ✅ PASS
data:consistency        ✅ PASS
native:runtime:audit    ✅ PASS
gill:reading-time       ✅ PASS
maps:publication        ✅ PASS
guard:shared-files      ✅ PASS
Node repro PS-01        ✅ no crash
Stale hashes in src/    ✅ 0 remaining
```

---

## Что остаётся открытым из UNIFIED_BUG_LEDGER

### Requires Playwright re-run (after hash fix)
- PS-02, PS-03 (dead controls) — вероятно resolved как cascade от PS-01+P0-10
- PS-05 (stray 76e7365) — вероятно resolved

### Not fixed in this lane (out of scope / needs separate decision)
- P1-2 sitemap incomplete
- P1-3 search-manifest incomplete
- P1-8 Gill rail double initialization
- P1-9 audit-pro stale ASSETS
- BUG-026 baptisty BreadcrumbList missing
- BUG-027 baptisty SVG og:image
- Various P2/P3 tooling drift
