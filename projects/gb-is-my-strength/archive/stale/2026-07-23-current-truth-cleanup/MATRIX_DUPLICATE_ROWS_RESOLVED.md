# Duplicate matrix rows resolved — 2026-07-23

This file preserves every row removed or relocated during duplicate-ID cleanup.

- Literal P2 copies of `S-T-01` and `S-SEC-01` were removed; the higher-severity P1 rows remain canonical.
- Richer `NG-DARK-04/05` rows moved from P3 to P2 because their own wording classified them as P2.
- Shorter `NG-A11Y-01` and `NG-MOBILE-01` duplicates were removed; richer P3 rows remain canonical.

No distinct finding was deleted.

## S-T-01 — original line 284
- Section: 🟡 P2 — ОТКРЫТО
- Action: removed literal duplicate; canonical P1 row retained

| S-T-01 | 🟡 **ЧАСТИЧНО 2026-07-14**: чекер серий + orphan-scan + legacy-selector-ban теперь видят .astro/.mdx; полный route-level паритет гейтов для Astro-мира — остаётся. | Auditor 2026-07-14 |

## S-T-01 — original line 300
- Section: 🟡 P2 — ОТКРЫТО
- Action: removed literal duplicate; canonical P1 row retained

| S-T-01 | 🟡 **ЧАСТИЧНО 2026-07-14**: чекер серий + orphan-scan + legacy-selector-ban теперь видят .astro/.mdx; полный route-level паритет гейтов для Astro-мира — остаётся. | Auditor 2026-07-14 |

## S-SEC-01 — original line 285
- Section: 🟡 P2 — ОТКРЫТО
- Action: removed literal duplicate; canonical P1 row retained

| S-SEC-01 | Blacklist-based HTML Sanitization in enhancements.js (XSS risk) | Auditor 2026-07-14 |

## S-SEC-01 — original line 298
- Section: 🟡 P2 — ОТКРЫТО
- Action: removed literal duplicate; canonical P1 row retained

| S-SEC-01 | Blacklist-based HTML Sanitization in enhancements.js (XSS risk) | Auditor 2026-07-14 |

## NG-DARK-04 — original line 333
- Section: 🟢 P3 — ОТКРЫТО
- Action: P3 duplicate removed; richer row moved to P2

| NG-DARK-04 | 🆕 **Нагорная P2:** `bg-rose-50` без dark-ремапа — 26 контейнеров (13 MainShell + 13 Sections) в ch.5 остаются #fff1f2 в тёмной теме. **Подтверждено cycle 4:** `bg-rose-50` ОТСУТСТВУЕТ в blanket `.bg-*-50` группе `mobile-hotfix.css` (перечислены 14 цветов, НО НЕ rose). Решение: per-chapter `var(--ng-accent-soft)`. Evidence: `evidence/NAGORNAYA_DEEP_DARK_THEME_AUDIT_2026-07-14.md` + `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE4_2026-07-14.md` §5.2 |

## NG-DARK-04 — original line 335
- Section: 🟢 P3 — ОТКРЫТО
- Action: shorter duplicate removed

| NG-DARK-04 | 🆕 **Нагорная P2:** `bg-rose-50` без dark-ремапа — 13 контейнеров в ch.5 остаются #fff1f2 (светло-розовый) в тёмной теме. Решается через per-chapter `var(--ng-accent-soft)`. Evidence: `evidence/NAGORNAYA_DEEP_DARK_THEME_AUDIT_2026-07-14.md` |

## NG-DARK-05 — original line 334
- Section: 🟢 P3 — ОТКРЫТО
- Action: P3 duplicate removed; richer row moved to P2

| NG-DARK-05 | 🆕 **Нагорная P2:** `bg-stone-100/200` без dark-ремапа — 18 контейнеров остаются светлыми. Решение: ремап → `var(--color-surface-alt)`/`var(--color-surface-2)`. Evidence: `evidence/NAGORNAYA_DEEP_DARK_THEME_AUDIT_2026-07-14.md` + `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE4_2026-07-14.md` §5.2 |

## NG-DARK-05 — original line 336
- Section: 🟢 P3 — ОТКРЫТО
- Action: shorter duplicate removed

| NG-DARK-05 | 🆕 **Нагорная P2:** `bg-stone-100/200` без dark-ремапа — 5 контейнеров (библиографии/итоги) остаются светлыми. Решение: ремап → `var(--color-surface-alt)`/`var(--color-surface-2)`. Evidence: `evidence/NAGORNAYA_DEEP_DARK_THEME_AUDIT_2026-07-14.md` |

## NG-A11Y-01 — original line 360
- Section: 🟢 P3 — ОТКРЫТО
- Action: shorter duplicate removed; richer P3 row retained

| NG-A11Y-01 | 🆕 **Нагорная P3:** Emoji вместо SVG иконок (19 секций ch.2/ch.5) — рендеринг зависит от ОС, не масштабируется; inline hero height `style="height:320px"` не адаптивен. Evidence: `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE3_2026-07-14.md` |

## NG-MOBILE-01 — original line 361
- Section: 🟢 P3 — ОТКРЫТО
- Action: shorter duplicate removed; richer P3 row retained

| NG-MOBILE-01 | 🆕 **Нагорная P3:** Мобильные dark-проблемы: body bg-stone-100 не ремапится (→ NG-BODY-01), TOC accent-number без chapter-specific цвета, hero image inline height. Evidence: `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE3_2026-07-14.md` |
