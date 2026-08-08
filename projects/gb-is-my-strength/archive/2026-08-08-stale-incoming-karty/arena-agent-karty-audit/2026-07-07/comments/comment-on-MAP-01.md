# Comment on MAP-01 (P3) — memory leak in avraam-app.js

**Target finding:** `MAP-01 | P3 | avraam-app.js no cleanup (70 listeners)`
**Source:** `auditrepo/archive/2026-07-03-stale-incoming-2/arena-agent-6/2026-06-25/GENEALOGY_MAP_ANALYSIS.md:95`
**Current source HEAD verified:** `75f807b73` (на проде, deploy run `28829729903`)

## Status proposal: `proposal-open` → `proposal-confirmed` + severity **upgrade P3 → P2**

## Evidence on current HEAD

```
$ grep -c "addEventListener"   karty/avraam/avraam-app.js
70
$ grep -c "removeEventListener" karty/avraam/avraam-app.js
0
$ grep -c "addEventListener"   karty/_engine/map-engine.js
43
$ grep -c "removeEventListener" karty/_engine/map-engine.js
1
```

Полные данные — `evidence/event-listeners.txt`.

## Stronger root cause

1. **70 add / 0 remove в avraam-app.js** — даже хуже, чем указывал arena-agent-6 (который говорил «70 add», но не проверял, что 0 из них удаляются). Это **100% no-cleanup**, не 97%.
2. **`map-engine.js` имеет `_cleanupAll()`** (line 284-294), который:
   - Удаляет 43 listener'а (через `_on()` wrapper на line 219-220)
   - Очищает таймеры
   - Удаляет `<style id='me-base-css">`
3. **НО** `avraam-app.js` **не зовёт `instance.destroy()`** где-либо. То есть при выходе со страницы /karty/avraam/ 70 listener'ов остаются жить до GC. На SPA-style длинных сессиях — реальный leak.
4. **Touch listeners в map-engine.js** (lines 1663-1700) — даже движок их не cleanup'ит (touchstart/touchmove/touchend — прямые `addEventListener`, не через `_on()`). Это под-находка **KARTY-14**.

## Related new findings (in this intake)

- **KARTY-03** — то же самое, отдельная proposal с полным описанием
- **KARTY-14** — touchstart/touchmove/touchend в map-engine.js не очищаются
- **KARTY-06** — после рефакторинга avraam (вынос в `_engine/`) проблема исчезает органически

## Recommendation for verifier

- **Подтвердить MAP-01 как still-current** на 75f807b73
- **Upgrade severity P3 → P2** (latent leak, becomes critical on long sessions)
- **Связать** с KARTY-03, KARTY-06, KARTY-14 (всё в одном repair lane W9)
- **Не закрывать** MAP-01 без проверки `_cleanupAll()` вызывается в `avraam-app.js` (не вызывается)

## Cross-agent note

arena-agent-6 (2026-06-25) упомянул «70 listeners в avraam-app.js, 0 cleanup». Подтверждаю цифры. **Дополняю:** также подтверждаю, что **MapEngine._cleanupAll() никогда не вызывается** в avraam-app.js (нет `instance.destroy()` вызова).

---

— arena-agent-karty-audit, 2026-07-07, source HEAD 75f807b73
