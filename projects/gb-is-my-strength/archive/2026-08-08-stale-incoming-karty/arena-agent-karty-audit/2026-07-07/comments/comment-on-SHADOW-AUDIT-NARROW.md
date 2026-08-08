# Comment on SHADOW-AUDIT-NARROW

**Target finding:** `SHADOW-AUDIT-NARROW — legacy-shadow-wrapper-audit.js проверяет только 7/52 (13%) production-dist маршрутов. Не охвачены: все страницы статей, baptisty-rossii, karty (8 из 10), biografii, about, pastor-series, konfessii, rodosloviye.`
**Source:** `auditrepo/projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md:138`
**Current source HEAD verified:** `75f807b73`

## Status proposal: `proposal-confirmed` + additional observation

## Additional evidence on current HEAD

Karty-маршруты — **8 из 10** — действительно не покрыты shadow-audit. В текущем HEAD:

| Route | Route.json | index.html script | Shadow wrapper? |
|-------|------------|-------------------|------------------|
| `/karty/avraam/` | 187 KB (19 places) | map-engine + avraam-app | **не покрыт** |
| `/karty/ishod/` | 50 KB (11 places) | map-engine | **не покрыт** |
| `/karty/early-church/` | 42 KB (11 places) | — | **не покрыт** |
| `/karty/maccabim/` | 50 KB (12 places) | — | **не покрыт** |
| `/karty/melachim/` | 71 KB (17 places) | — | **не покрыт** |
| `/karty/pavel/` | 39 KB (10 places) | — | **не покрыт** |
| `/karty/revelation/` | 30 KB (7 places) | — | **не покрыт** |
| `/karty/shoftim/` | 55 KB (13 places) | — | **не покрыт** |
| `/karty/shvatim/` | 62 KB (18 places) | — | **не покрыт** |
| `/karty/yeshua/` | 57 KB (15 places) | — | **не покрыт** |

**Итого: 0/10 karty-маршрутов** покрыты shadow-audit (vs заявленных «8 из 10» в матрице — это 2 работающих = avraam + ishod?).

Подтверждаю SHADOW-AUDIT-NARROW как `still-current`.

## Cross-link to new findings

- **KARTY-01, KARTY-02** — karty-маршруты не рендерят UI; shadow-audit не ловит, потому что они noindex
- **KARTY-09, KARTY-10, KARTY-16** — schema/validate не покрывает karty-route.json
- **KARTY-04, KARTY-05** — engine-level проблемы, не shadow-specific

## Recommendation for verifier

- **Подтвердить** SHADOW-AUDIT-NARROW
- **Добавить** в proposed next matrix update:
  - KARTY-09 (schema patch)
  - KARTY-10 (validator script)
  - KARTY-16 (uniqueItems)
- **W1 lane** (FAST) — нет owner-decision, можно в одной PR

## Note

Можно мержить как **дополнение** к SHADOW-AUDIT-NARROW, не как duplicate.

---

— arena-agent-karty-audit, 2026-07-07, source HEAD 75f807b73
