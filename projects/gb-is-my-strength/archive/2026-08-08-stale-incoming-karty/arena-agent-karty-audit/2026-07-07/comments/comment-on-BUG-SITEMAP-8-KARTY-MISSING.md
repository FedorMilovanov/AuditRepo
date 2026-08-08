# Comment on BUG-SITEMAP-8-KARTY-MISSING

**Target finding:** `BUG-SITEMAP-8-KARTY-MISSING — 8 karty/ routes are temporary placeholders with data-pagefind-ignore, intentionally excluded from sitemap by check-map-publication-status.js.`
**Source:** `auditrepo/projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md:190`
**Current source HEAD verified:** `75f807b73`

## Status proposal: `proposal-confirmed` + add clarification note

## Evidence on current HEAD (2026-07-07)

Все 8 заглушек (`karty/early-church/`, `karty/maccabim/`, `karty/melachim/`, `karty/pavel/`, `karty/revelation/`, `karty/shoftim/`, `karty/shvatim/`, `karty/yeshua/`) содержат **одинаковую JSON-LD `description`**:

```
"Карта временно снята с витрины до ручной визуальной доводки: масштаб, подписи, мобильный вид и общее качество."
```

Это **прямое подтверждение намеренности** — владелец **сам** документировал статус в HTML-разметке.

## Stronger root cause (и одновременно clarification)

1. Заглушки — не «забытые», а **публично объявленные как намеренные**. Это видно в description.
2. Они исключены из sitemap через `data-pagefind-ignore` (per MASTER_BUG_MATRIX) — корректно.
3. `check-map-publication-status.js` (per `fable-super-audit/2026-07-06/REPORT.md:49`) энфорсит noindex-набор — корректно.
4. **НО**: у каждой заглушки есть **полный валидный route.json** (30–72 KB, 7–18 мест, 4–7 сюжетов, 1–6 этапов). Это означает, что:
   - Данные готовы
   - UI не подключён
   - Roadmap существует (W9: MapEngine activation, per SUPER_AUDIT_2026-07-06_14a49be8.md:259-260)

## Related new findings (in this intake)

- **KARTY-01** — те же 8 маршрутов как наблюдение (reclassified P1→P3, см. proposal-KARTY-01.md)
- **KARTY-02** — отсутствие `<noscript>` fallback (для тех же 8)
- **KARTY-15** — отсутствие `<noscript>` в эталонной `karty/ishod/index.html`
- **KARTY-04, KARTY-05, KARTY-09, KARTY-10, KARTY-14** — универсальный движок, который должен обслуживать все 10 маршрутов

## Recommendation for verifier

- **Сохранить** `BUG-SITEMAP-8-KARTY-MISSING` как `intentional / not-a-bug` (статус: RESOLVED → confirmed-as-intentional)
- **Добавить** clarification note: «8 placeholder'ов имеют полный route.json и JSON-LD описание = намеренные, см. W9 plan»
- **Связать** с KARTY-01, KARTY-02, KARTY-15 как «связанные, но не блокирующие»
- **В рабочем W9 плане** указать, что эти 8 — следующие кандидаты на активацию

## Cross-agent note

`fable-super-audit/2026-07-06/REPORT.md:49` уже подтвердил: «page-ownership без indexability; 8 карт production-dist при noindex — **CONFIRMED**». Подтверждаю.

---

— arena-agent-karyaudit, 2026-07-07, source HEAD 75f807b73
