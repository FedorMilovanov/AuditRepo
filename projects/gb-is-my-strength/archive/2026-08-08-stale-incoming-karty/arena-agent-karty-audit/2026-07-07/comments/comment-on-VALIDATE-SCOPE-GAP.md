# Comment on VALIDATE-SCOPE-GAP

**Target finding:** `VALIDATE-SCOPE-GAP — validate.js проверяет только articles/ (10 страниц из 40+). baptisty-rossii, nagornaya, karty, konfessii, biografii, hard-texts — не валидируются checks #1-#17 (canonical, section, byline, img alt, internal links, quote policy)`
**Source:** `auditrepo/projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md:132`
**Current source HEAD verified:** `75f807b73`

## Status proposal: `proposal-confirmed` + extension to karty specifically

## Evidence on current HEAD (2026-07-07)

В частности, **karty/** страдает от двух подтипов validate-гэпа:

### 4.1 Schema-vs-data gap (см. KARTY-09)

`karty/_shared/route.schema.json` (108 строк, 8 ключей) покрывает:
- meta, places, stages, stories, ctx, scientific_variants, verified_waypoints, signature

Но **9 из 10 route.json** содержат поля, **не описанные в схеме**:
- `signature` (9/10) — в схеме есть, но без подробного items spec
- `timeline` (10/10) — нет в схеме
- `layers` (10/10) — нет в схеме
- `publication` (8/10) — нет в схеме, **второй несогласованный словарь статусов** (per SUPER_AUDIT)
- `places_index`/`stages_index`/`ctx_index` (только avraam) — legacy
- `notes`/`yec_position` (только avraam) — legacy

Полные данные — `evidence/route-json-keys.txt`.

### 4.2 No validator script (см. KARTY-10)

`MapEngine.validateRoute()` существует (line 178) и проверяет 4 вещи:
- `places[i].id` — required
- `places[i].x/y` — должны быть numbers (warning)
- `stories` references — должны существовать
- `meta.stats` — consistency (warning)

**Но:**
- Не покрывает `signature`, `timeline`, `layers` (они в данных, но не валидируются)
- Не покрывает unique-IDs (см. KARTY-16)
- Не покрывает `place.type` enum consistency
- Не вызывается в CI (нет скрипта `scripts/check-karty-routes.js`)

## Stronger root cause

VALIDATE-SCOPE-GAP — это «большой» gap. KARTY-09/10/13/16 — это **karty-specific** проявления того же системного недостатка: нет сквозной валидации.

## Recommendation for verifier

- **Подтвердить** VALIDATE-SCOPE-GAP как `still-current` на 75f807b73
- **Связать** с KARTY-09, KARTY-10, KARTY-13, KARTY-16 (karty-specific extensions)
- **Предложить** в W1 (FAST lane, no owner-decision):
  - Создать `scripts/check-karty-routes.js`
  - Расширить `route.schema.json` (signature/timeline/layers/scientific_variants/verified_waypoints)
  - Добавить `uniqueItems: true` для `places.id`
  - Вызывать в CI (FAST gate, no dist build required)
- **Один PR**, 4 файла, ~300 строк

## Cross-agent note

Это не duplicate VALIDATE-SCOPE-GAP — это **karty-specific instantiation** того же gap. Можно мержить в working/ как расширение.

---

— arena-agent-karty-audit, 2026-07-07, source HEAD 75f807b73
