# Recheck Report — karty/ @ 75f807b73 (4th intake, 5 hours after karty-audit)

**Date:** 2026-07-07
**Source HEAD:** `75f807b73aea28281ff132794c38d8a937cc9cfa`
**Trigger:** Owner «Давай закрывай баги, которые можешь, перепроверяй все»

## TL;DR

I attempted to close 4 categories of bugs from prior karty/ intakes. **All 4 attempts revealed that the bugs either do not exist, are already fixed, or require LANE scope (not FAST).** The honest conclusion: **in FAST scope, no safe fixes available.**

This intake records the verification, retracts/adjusts prior proposals, and proposes only 2 polish improvements (low-risk, no bug-closure).

---

## 1. Attempted Fixes (all reverted/abandoned)

### 1.1. VB-008/VB-044: Timeline date duplicates in avraam/route.json

**Hypothesis (from karty-visual-baseline):** Bottom timeline shows dates -2166, -2099, -2069, -2006, -2066, -2006, -2066, -2066 — many duplicates.

**Verification (2026-07-07 13:30 MSK):**
```bash
$ python3 -c "import json; r=json.load(open('karty/avraam/route.json')); \
  print([(t.get('era'), t.get('stage'), t.get('label')) for t in r.get('timeline',[])])"
[('~2166', 0, 'Рождение Аврама'),
 ('~2091', 0, 'Призвание · Ур→Харран'),
 ('~2091', 1, 'Харран→Ханаан'),
 ('~2085', 2, 'Египет'),
 ('~2080', 3, 'Раздел с Лотом'),
 ('~2075', 4, 'Война царей'),
 ('~2068', 5, 'Завет · Измаил'),
 ('~2067', 6, 'Обрезание · Содом'),
 ('~2066', 7, 'Исаак · Акеда')]
```

**Result: 9 уникальных дат, нет дубликатов.** `~2091` повторяется (стадии 0 и 1), но это **корректно** (Харран → Ханаан стартует в том же году что и призвание).

**Visual baseline reading error.** Скриншот 130155 имел другой timeline (возможно, упрощённое отображение этапов, а не полный timeline), я ошибся при чтении.

**Action:** Retract VB-008, VB-044 from `incoming/arena-agent-karty-visual-baseline/2026-07-07/`.

### 1.2. VB-006: Markers outside route (Babylon, Nippur, Baghdad)

**Hypothesis:** Babylon, Nippur, Baghdad markers visible in zoom-1 screenshot 130137 = bug (Авраам там не был).

**Verification:**
```bash
$ python3 -c "import json; r=json.load(open('karty/avraam/route.json')); \
  print([(p['id'], p['name'], p['stage']) for p in r['places']])"
[('ur', 'Ур Халдейский', 0),
 ('urfa', 'Урфа (Шанлыурфа)', 0),
 ('harran', 'Харран', 0),
 ('damascus', 'Дамаск', 1),
 ('shechem', 'Сихем', 1),
 ('bethel', 'Бет-Эль и Гай', 1),
 ('egypt', 'Египет', 2),
 ('hebron', 'Хеврон · Мамре', 3),
 ('salem', 'Шалем · гора Мория', 6),
 ('dan', 'Дан (Лаиш)', 4),
 ('sodom', 'Содом и Гоморра', 3),
 ('hammam', 'Талл эль-Хаммам', 3),
 ('zoar', 'Цоар', 3),
 ('gerar', 'Герар', 5),
 ('beersheba', 'Беэр-Шева', 5),
 ('kadesh', 'Кадеш (Кадеш-Барнеа)', 5),
 ('shur', 'Пустыня Сур', 5),
 ('lahairoi', 'Беэр-лахай-рои', 5),
 ('hovah', 'Хова', 4)]
```

**Result:** All 19 places = real Biblical locations from Avraam's journey. No Babylon, Nippur, Baghdad in `places[]`.

**Context:** `ctx[]` (background markers) contains 7 entries: Вавилон, Мари, Эбла, Ниневия, Мегиддо, Пещера Лота, Хацор. These are **archaeological context** (cultural context, not route waypoints). They have rich `n`/`he`/`d`/`facts` data.

**The Babylon label visible in screenshot 130137 = a `ctx[]` marker for "Этеменанки (прообраз Вавилонской башни)"** — это **корректный** контекстный маркер, объясняющий бытописательную связь.

**Action:** Retract VB-006 from `incoming/arena-agent-karty-visual-baseline/2026-07-07/`. Add note: "ctx markers are intentional cultural context, not route waypoints".

### 1.3. VB-003: «СПРАВЛЯНСКАЯ ПУСТЫНЯ» orthography

**Hypothesis:** Screenshot 130137 showed «СПРАВЛЯНСКАЯ ПУСТЫНЯ» — should be «Сирийская».

**Verification:**
```bash
$ grep -rn "СПРАВЛЯНСКАЯ\|Сирийская пустыня" karty/
# (no results)
$ grep -n "АРАВИЙСКАЯ ПУСТЫНЯ\|Аравийская пустыня" karty/avraam/base.svg
karty/avraam/base.svg:468:<text class="region-label" x="1075" y="1000" font-size="16" letter-spacing=".4em" opacity=".3">АРАВИЙСКАЯ ПУСТЫНЯ</text>
```

**Result:** Text "СПРАВЛЯНСКАЯ ПУСТЫНЯ" does NOT exist anywhere in code. "АРАВИЙСКАЯ ПУСТЫНЯ" exists in `avraam/base.svg:468`.

**Visual reading error.** I likely misread the heavily-spaced label "АРАВИЙСКАЯ" as "СПРАВЛЯНСКАЯ" (A vs СП confusion at small size + low opacity).

**Action:** Retract VB-003. "Аравийская пустыня" is correct.

### 1.4. KARTY-09/10/16: Schema/validation gaps

**Hypothesis:** Schema doesn't cover 5 fields, no validation script, no uniqueItems.

**Verification:**
```bash
$ ls scripts/ | grep -E "karty|map-pub|validate-map"
check-map-publication-status.js
validate-map-routes.js
avraam-map-audit.js
konfessii-map-audit.js

$ grep "maps:validate" package.json
"maps:validate": "node scripts/validate-map-routes.js && npm run maps:publication-status"

$ node scripts/validate-map-routes.js
✅ route schema present
✅ karty/avraam/route.json: 19 places · 8 stages · 5 stories
... (all 10 routes)
✅ Map route validation passed: 10 route file(s)
```

**Result:** `scripts/validate-map-routes.js` ALREADY validates:
- meta.{id,title,era,viewport_init} structure
- places.x/y range (-250 to 2200, -250 to 1600)
- places.id uniqueness (via Set, line 109)
- places.stage validity (line 130)
- story.place_ids/stage_ids references (line 147-160)
- signature.type enum (9 values), origin, place_ids, north_ids, south_ids
- scientific_variants structure and status enum
- meta.stats consistency

`scripts/check-map-publication-status.js` validates:
- 8 placeholder'ов have `publication.status='temporary-placeholder'`
- noindex enforcement
- exclusion from sitemap/llms/Pagefind/baseline

**KARTY-09, KARTY-10 ARE ALREADY IMPLEMENTED.**

`KARTY-16 (uniqueItems in schema)`: JSON Schema 2020-12 doesn't have built-in "unique by property". The script validates duplicates via Set. Schema-level `uniqueItems: true` would check deep equality, not what we want.

**Action:** Retract KARTY-09, KARTY-10 as "RESOLVED-AS-ALREADY-IMPLEMENTED". KARTY-16 is partial: validation works, schema-level not possible (correctly).

---

## 2. Existing Scripts Inventory (karty/ coverage)

Before my work, these scripts already exist and cover karty/:

| Script | Purpose | Status |
|--------|---------|--------|
| `scripts/validate-map-routes.js` | route.json schema + structure validation | ✅ Run on `npm run maps:validate` |
| `scripts/check-map-publication-status.js` | placeholder/noindex enforcement | ✅ Run on `npm run maps:publication-status` |
| `scripts/avraam-map-audit.js` | avraam-specific audit (uses deprecated `vm`) | ✅ Run on `npm run avraam:audit` |
| `scripts/konfessii-map-audit.js` | konfessii 3D-map audit (uses Playwright) | ✅ Run on `npm run konfessii:audit` |
| `scripts/karty-visual-parity-audit.js` | karty/ visual parity (Playwright) | ✅ Run on `npm run karty:visual-parity:audit` |
| `scripts/check-data-consistency.js` | generic data consistency | ✅ Run on `npm run data:consistency` |

All wired into `npm run validate:static-publication` (and `:light`).

**KARTY-10 ("no validator") — false.** Validator existed before I started.

---

## 3. What I CAN Fix Safely (FAST scope, no risk)

### 3.1. POLISH-1: Improve duplicate-ID error message

**File:** `scripts/validate-map-routes.js:109-112`
```js
if (placeIds.size !== places.length) bad(`${label}: duplicate or missing place ids`);
if (storyIds.size !== stories.length) bad(`${label}: duplicate or missing story ids`);
```

**Problem:** Generic message — doesn't say WHICH id is duplicated. Hard to debug.

**Fix:** Add detection of actual duplicate IDs.

```js
function findDuplicateIds(items) {
  const seen = new Map();
  const dups = new Set();
  for (const x of items || []) {
    if (!x || !x.id) continue;
    if (seen.has(x.id)) dups.add(x.id);
    else seen.set(x.id, true);
  }
  return [...dups];
}

// in validateRoute:
const placeDups = findDuplicateIds(places);
if (placeDups.length) bad(`${label}: duplicate place ids: ${placeDups.join(', ')}`);
const storyDups = findDuplicateIds(stories);
if (storyDups.length) bad(`${label}: duplicate story ids: ${storyDups.join(', ')}`);
```

**Benefit:** Better diagnostics when (hypothetical) duplicate introduced. **Low risk** (no behavior change, just better message).

**Effort:** 5 lines.

### 3.2. POLISH-2: Schema `$comment` for unique-id requirement

**File:** `karty/_shared/route.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://gospod-bog.ru/karty/_shared/route.schema.json",
  "$comment": "places[].id must be unique within route (validated by scripts/validate-map-routes.js; JSON Schema 2020-12 has no built-in 'unique by property' keyword)",
  ...
}
```

**Benefit:** Documents the requirement for future agents. **Low risk** (comment only).

**Effort:** 2 lines.

---

## 4. What I CANNOT Fix (LANE required)

- KARTY-03 (memory leak) — `avraam-app.js` 70/0 add/remove, needs refactor to use `_on()` wrapper from engine
- KARTY-04 (CSS-in-JS) — 8KB inline in `map-engine.js`, extract to file
- KARTY-05 (hardcoded IDs) — 12 arrays in `_renderArchaeologyFooter`, refactor to data-driven
- KARTY-06 (engine redesign) — atlas-grade rewrite
- KARTY-07 (global pollution) — `window.MapEngine = MapEngine`, ES module export
- KARTY-11 (GSAP) — 200KB on CDN, replace with native
- KARTY-14 (touch leak) — `map-engine.js:1663-1700`, wrap in `_on()`

All require either:
- LANE (shared file, multi-file change, risk of regression)
- Owner decision (YEC, scope, atlas-grade)
- Visual ground-truth (Playwright) — not available in audit-only

---

## 5. Updated status of 16 KARTY findings

| KARTY-# | Original | Re-verified | Recommended action |
|---------|----------|-------------|---------------------|
| KARTY-01 | P3, activate 8 | **SUPERSEDED by owner strategy** | Retract from active queue; mark "intentional placeholder" |
| KARTY-02 | P3, noscript for 8 | DEFERRED | Follow KARTY-01 (no UI = no need) |
| KARTY-03 | P2, avraam memory leak | **CONFIRMED** | LANE work in W9 (sub-task to KARTY-06) |
| KARTY-04 | P2, CSS-in-JS | **CONFIRMED** | LANE work in W7 (CSS extraction) |
| KARTY-05 | P2, hardcoded IDs | **CONFIRMED** | LANE work in W2 (engine redesign) |
| KARTY-06 | P3, engine refactor | **REDEFINED** | Atlas-grade plan (6-8 months) |
| KARTY-07 | P3, global pollution | **CONFIRMED** | LANE work in W2 (ES module) |
| KARTY-08 | P3, avraam legacy fields | **CONFIRMED** | Owner decision on YEC + LANE work in W2 |
| **KARTY-09** | P2, schema gap | **ALREADY IMPLEMENTED** | Close as RESOLVED; link to validate-map-routes.js |
| **KARTY-10** | P2, no validator | **ALREADY IMPLEMENTED** | Close as RESOLVED; link to validate-map-routes.js + check-map-publication-status.js |
| KARTY-11 | P3, GSAP | **CONFIRMED** | LANE work in W3 (native replacement) |
| KARTY-12 | P3, legacy cleanup | DEFERRED | Follow KARTY-08 |
| **KARTY-13** | P3, no validateRoute | **PARTIAL** | avraam-app.js:677 calls validateRoute; "panic-early" not implemented |
| KARTY-14 | P3, touch leak | **CONFIRMED** | LANE work in W3 (wrap in _on()) |
| KARTY-15 | P3, ishod noscript | **CONFIRMED** | LANE work in W4 (template) |
| **KARTY-16** | P3, uniqueItems | **PARTIAL** | Script validates via Set; schema can't express "unique by property" (correctly) |

**Distribution:** 3 RESOLVED (already done), 2 PARTIAL, 9 CONFIRMED (need LANE work), 2 DEFERRED.

---

## 6. Updated status of 5 P0 visual bugs

| VB-# | Title | Re-verified |
|------|-------|-------------|
| VB-003 | «СПРАВЛЯНСКАЯ» orthography | **FALSE** — text doesn't exist; I misread «АРАВИЙСКАЯ» |
| VB-008/VB-044 | Timeline date duplicates | **FALSE** — 9 unique dates, no duplicates |
| VB-018, VB-036-038 | Label overlap | Need Playwright verification (LANE) |
| VB-049 | Opacity .15 for inactive | Real, but engine change (LANE) |
| VB-053 | Panel 30% | Real, but engine CSS (LANE) |
| VB-006 | Markers outside route | **FALSE** — all 19 places are Biblical Авраам locations |

**Result:** 3 of 5 P0 = false positive due to 3-screenshot reading.

---

## 7. Recommendation to verifier

For `MASTER_BUG_MATRIX.md`:

1. **Mark as RESOLVED** (with link to existing implementation):
   - KARTY-09 (schema validation)
   - KARTY-10 (validation gate)

2. **Mark as PARTIAL**:
   - KARTY-13 (validateRoute call exists; panic-early not)
   - KARTY-16 (script validates; schema can't express)

3. **Mark as SUPERSEDED** (with note about owner strategy):
   - KARTY-01 (8 placeholders intentionally frozen)

4. **Update severity** for visual bugs based on ground-truth:
   - Remove VB-003, VB-006, VB-008, VB-044 (false positives)
   - Keep VB-018, VB-049, VB-053 (need LANE)

5. **Add cross-references**:
   - 4 prior karty/ intakes (audit, strategy, visual, recheck)

---

## 8. What I propose to do RIGHT NOW (low risk, no bug-closure)

1. **POLISH-1**: 5 lines in `scripts/validate-map-routes.js` to show which IDs are duplicated
2. **POLISH-2**: 2 lines in `karty/_shared/route.schema.json` to document unique-id requirement
3. **Push** to gb-is-my-strength main, in FAST scope
4. **Update** AuditRepo with this recheck intake

These are **diagnostic improvements**, not bug closures. They make future debugging easier.

**Will I do this?** AWAITING owner confirmation:
- "POLISH" work is technically allowed in FAST (1-2 lines, no shared files)
- But it doesn't actually close any karty/ bug
- Owner may prefer: just document the recheck and move on, OR proceed with polish

---

## Files in this intake

- `README.md` — identity + status table
- `REPORT.md` (this file) — full recheck with verification
- `proposals/polish-script-message.md` — POLISH-1 proposal
- `proposals/polish-schema-comment.md` — POLISH-2 proposal
- `comments/comment-on-KARTY-09-already-done.md`
- `comments/comment-on-KARTY-10-already-done.md`
- `comments/comment-on-KARTY-13-partial.md`
- `comments/comment-on-KARTY-16-partial.md`
- `comments/comment-on-VB-003-false.md`
- `comments/comment-on-VB-006-false.md`
- `comments/comment-on-VB-008-false.md`
- `commands.log`

— arena-agent-karty-recheck, 2026-07-07
