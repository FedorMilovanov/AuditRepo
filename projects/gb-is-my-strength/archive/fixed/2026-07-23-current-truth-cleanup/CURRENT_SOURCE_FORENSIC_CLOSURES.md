# Current-source forensic closures — 2026-07-23

Exact source audit: run `29971872480`, artifact `8550022319` on `a73f609f`.
Final workspace-path source closure: PR #162 / `0f5b3307`.

The rows below were removed from open sections and promoted to the canonical closed table. Original wording is preserved verbatim.

## ASTRO-P0-03

- Original line: 166
- Original section: 🔴 P0/P1 — ОТКРЫТО — release / deploy + karty runtime

| ASTRO-P0-03 | 🆕 **Karty P0:** `MapEngine.validateRoute()` выдаёт warning на рассинхрон stats, но CI-гейт проверяет только `ok: true`, пропуская битые данные | verified-source (32ae0d7d) |

## ASTRO-P0-04

- Original line: 167
- Original section: 🔴 P0/P1 — ОТКРЫТО — release / deploy + karty runtime

| ASTRO-P0-04 | 🆕 **Karty P0:** Три разных публичных счётчика мест Авраама (19 в SEO/meta, 20 в legacy интро, 22 в Astro MapEngine) | verified-source (32ae0d7d) |

## GATE-CSS-IMPORTANT-RATCHET

- Original line: 301
- Original section: 🟡 P2 — ОТКРЫТО (35)

| GATE-CSS-IMPORTANT-RATCHET | 🆕🔴 **DEPLOY-БЛОКЕР @ `2ca2af3b`** (2-й проход 07-14). `css/site.css` = **210 `!important` > ceiling 200** (`audit-pro.js` IMPORTANT_CEIL) И отдельный гейт `css:layer:validate --ceiling=202` тоже красный (`❌ !important count 210 exceeds ceiling 202`). Реальная регрессия от atlas/mobile-reader CSS (не tooling-дрейф). Fix: рефактор новых правил в `@layer`/выше специфичность, либо (owner-gated) поднять ceiling с замещающим контрактом. | verified-source + verified-build (Node v22.22.3); reverify 07-14 §2 |

## AUDIT-ATLAS-DOC-PATH-LEAK

- Original line: 335
- Original section: 🟢 P3 — ОТКРЫТО (58)

| AUDIT-ATLAS-DOC-PATH-LEAK | 🆕🔴 **DEPLOY-БЛОКЕР @ `2ca2af3b`** (2-й проход 07-14). `audit-pro.js` §14 (repository base-path leak) красный на 2 **новых** atlas-файлах: `docs/ATLAS-CONTRACT-2026-07-10.md` и `scripts/genealogy-build/README.md` (оба содержат `AuditRepo/projects/gb-is-my-strength/…`). Тот же класс, что D-7. Fix: заменить на repo-относительную/обобщённую ссылку. verified-source + verified-build |

## AUDIT-FORBIDDEN-JS-NAGORNAYA

- Original line: 336
- Original section: 🟢 P3 — ОТКРЫТО (58)

| AUDIT-FORBIDDEN-JS-NAGORNAYA | 🆕🔴 **DEPLOY-БЛОКЕР @ `2ca2af3b`** (2-й проход 07-14) — **allowlist-gap, НЕ мёртвый код.** `audit-pro.js` помечает `js/nagornaya-bar-extras.js` как forbidden, но файл **реально используется** всеми 5 `nagornaya/chast-*` (подтверждено в `dist/nagornaya/chast-*/index.html` + `NagornayaChast*PageFooter.astro`). Гейт срабатывает корректно — устарел **allowlist** `ALLOWED_JS` (`audit-pro.js:52`). Fix: зарегистрировать файл в allowlist (НЕ удалять). verified-source + verified-build |
