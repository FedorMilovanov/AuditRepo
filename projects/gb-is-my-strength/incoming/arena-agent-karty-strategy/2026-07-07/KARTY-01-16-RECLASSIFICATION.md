# KARTY-01..16 Reclassification (after owner strategy redirection)

**Status:** `proposal-open` (таблица переклассификации)
**Date:** 2026-07-07
**Source intake:** `incoming/arena-agent-karty-audit/2026-07-07/` (commit c253596)
**Triggering decision:** owner 2026-07-07 «сначала Авраам идеально, остальное frozen»

---

## TL;DR

| | Original (FAST plan) | New (atlas-grade plan) |
|---|---|---|
| **KARTY-01 (8 placeholders)** | ACTIVATE all 8 | **KEEP FROZEN** (opposite) |
| **KARTY-02 (noscript for 8)** | FIX | **DEFERRED** (no UI = no need) |
| **KARTY-03 (avraam memory leak)** | FIX in W9 | **ELEVATED to P0** (actual work) |
| **KARTY-04 (CSS-in-JS)** | FIX in W7 | **KEPT in Phase 2** (engine redesign) |
| **KARTY-05 (hardcoded IDs)** | FIX in W4 | **KEPT in Phase 2** (engine redesign) |
| **KARTY-06 (engine refactor)** | MIGRATE avraam to engine | **REDEFINED** (engine first, then Авраам) |
| **KARTY-07 (window.MapEngine global)** | FIX | **KEPT in Phase 2** (ES module export) |
| **KARTY-08 (avraam legacy fields)** | CLEANUP | **KEPT in Phase 1.3** (function-taxonomy) |
| **KARTY-09 (schema gap)** | FIX in W1 | **KEPT in Phase 2** (schema v2.0) |
| **KARTY-10 (no validator script)** | CREATE in W1 | **KEPT in Phase 2** (after schema v2.0) |
| **KARTY-11 (GSAP)** | REPLACE | **KEPT in Phase 3** (rewrite Авраам) |
| **KARTY-12 (legacy keys cleanup)** | CLEANUP | **KEFERRED** (after KARTY-06 rewrite) |
| **KARTY-13 (no validateRoute call)** | FIX | **KEPT in Phase 2** (engine v2.0 has it) |
| **KARTY-14 (touch listeners)** | FIX in W9 | **KEPT in Phase 3** (engine v2.0) |
| **KARTY-15 (ishod noscript)** | FIX | **KEPT in Phase 4** (template) |
| **KARTY-16 (uniqueItems)** | FIX in W1 | **KEPT in Phase 2** (schema v2.0) |

---

## Why the reclassification

The original plan treated karty/ as **a fleet to maintain**. The new plan treats it as **a flagship to perfect**.

**Fleet model** (original):
- 10 routes = 10 projects
- Each route must validate, must be activated, must be in CI
- Schedule = W1, W4, W7, W9
- Success = "all 10 routes work"

**Flagship model** (new):
- 1 route (Авраам) = 1 atlas
- 9 routes = placeholder, intentional
- Schedule = Phase 0..4 (months)
- Success = "Авраам is atlas-grade"

The 16 findings are still valid — the bugs are still there. What changes is **priority and approach**.

---

## Detailed reclassification

### KARTY-01 (P3) — 8 karty-маршрутов = намеренные noindex-заглушки

**Original (FAST plan):** ACTIVATE all 8 routes in W9 by adding `<script src="../_engine/map-engine.js">` + init code per `karty/ishod/index.html` pattern.

**New (atlas plan):** **OPPOSITE** — keep all 8 frozen. They are placeholders by owner decision (per JSON-LD `description`). Do not activate. Do not even prepare to activate. If/when owner decides second map is needed, will be done **after** Авраам is atlas-grade.

**Status:** SUPERSEDED.

**Where in new plan:** Phase 0 (already done, no action needed).

---

### KARTY-02 (P3) — 8 заглушек не имеют `<noscript>` fallback

**Original (FAST plan):** ADD noscript fallback in W9 alongside activation.

**New (atlas plan):** **DEFERRED.** Without UI, noscript fallback has nothing to fall back to (no content to show). When Авраам is atlas-grade, **then** add noscript for all 10 (Авраам gets priority, 9 placeholders get generic list-of-places).

**Status:** DEFERRED to Phase 3 (for Авраам) + Phase 4 (for template applied to others).

---

### KARTY-03 (P2) — `avraam-app.js` 70 add / 0 remove (MAP-01 amplified)

**Original (FAST plan):** FIX in W9 alongside KARTY-06 (migration).

**New (atlas plan):** **ELEVATED to P0.** This is the **central problem** of avraam. Phase 1.3 (structural audit) will:
- Enumerate all 70 addEventListener
- Mark which are needed, which are bloat
- Result: `function-taxonomy.md`

Phase 3 (rewrite Авраам on engine v2.0) will fix this **structurally** (engine v2.0 has cleanup contract; Авраам v2.0 cannot leak by construction).

**Status:** ELEVATED to P0 (was P2). Owner-facing in Phase 1 + Phase 3.

---

### KARTY-04 (P2) — CSS движка инжектируется динамически, не кэшируется SW

**Original (FAST plan):** EXTRACT in W7 (sync with enhancements/highlights pattern).

**New (atlas plan):** **KEPT in Phase 2** (engine redesign). Engine v2.0 = CSS file, properly versioned, cached. No inline.

**Status:** KEPT in Phase 2. Severity unchanged (P2).

---

### KARTY-05 (P2) — `_renderArchaeologyFooter` hardcoded ID-маппинг (12 таблиц)

**Original (FAST plan):** FIX in W4 with owner decision on schema (Option A/B/C).

**New (atlas plan):** **KEPT in Phase 2** (engine v2.0). Schema v2.0 includes `place.arch_category` and `route.arch_references`. Engine v2.0 looks up via route.json, no hardcoded arrays.

**Status:** KEPT in Phase 2. Severity unchanged (P2).

---

### KARTY-06 (P3) — «Вынести движок»: avraam-app.js → `_engine/`

**Original (FAST plan):** MIGRATE avraam-app.js functions to engine, reduce avraam-app.js to minimal.

**New (atlas plan):** **REDEFINED.** The plan is no longer "move avraam code to engine". The plan is:
- Phase 2: design engine v2.0 from scratch (see `ENGINE-CONTRACT-RETHINK.md`)
- Phase 3: rewrite Авраам on engine v2.0

This is a different kind of work. The 4 phase plan in `ENGINE-CONTRACT-RETHINK.md` §8 estimates −3500 LOC deleted, +800 LOC added, net **−2700 LOC**, ~−200KB JS.

**Status:** REDEFINED. Severity stays P3 (refactor) but **scope explodes** (1-2 months of design work before any code).

---

### KARTY-07 (P3) — `window.MapEngine` global pollution

**Original (FAST plan):** Cleanup helper + later ES modules.

**New (atlas plan):** **KEPT in Phase 2** (engine v2.0). ES module export, no global. By design, this also closes P2-17 (which is RESOLVED-AS-CONFIRMED in archive).

**Status:** KEPT in Phase 2. Severity unchanged (P3).

---

### KARTY-08 (P3) — `avraam/route.json` 7 legacy-полей

**Original (FAST plan):** CLEANUP in W2 with owner decision on YEC.

**New (atlas plan):** **KEPT in Phase 1.3** (function-taxonomy). When we audit avraam's 68 functions, we also audit its 7 legacy route.json fields. Some may be **kept** (YEC-историография — решает владелец), some may be **removed** (e.g., `places_index` — дубль `places`, всегда удалить).

**Status:** KEPT in Phase 1.3. Severity unchanged (P3).

---

### KARTY-09 (P2) — `route.schema.json` не покрывает 5 полей

**Original (FAST plan):** FIX in W1 (extend schema, validate all 10).

**New (atlas plan):** **KEPT in Phase 2** (schema v2.0 — see `ENGINE-CONTRACT-RETHINK.md` §6). All 13 fields подробно. Validation gate.

**Status:** KEPT in Phase 2. Severity unchanged (P2).

---

### KARTY-10 (P2) — нет `scripts/check-karty-routes.js`

**Original (FAST plan):** CREATE in W1.

**New (atlas plan):** **KEPT in Phase 2** (after schema v2.0). Validator validates against schema v2.0. Wired in CI.

**Status:** KEPT in Phase 2. Severity unchanged (P2).

---

### KARTY-11 (P3) — GSAP + DrawSVG + MotionPath

**Original (FAST plan):** REPLACE with native in W9.

**New (atlas plan):** **KEPT in Phase 3** (rewrite Авраам). Animation каравана — native CSS/SVG (или Web Animations API). Удалить GSAP полностью.

**Status:** KEPT in Phase 3. Severity unchanged (P3).

---

### KARTY-12 (P3) — удалить 4 legacy-ключа из avraam/route.json

**Original (FAST plan):** CLEANUP after KARTY-06 migration.

**New (atlas plan):** **DEFERRED** to Phase 3 (rewrite Авраам). At that point, route.json is being rewritten anyway, so this becomes "don't include these fields in v2.0".

**Status:** DEFERRED. Phase 3.

---

### KARTY-13 (P3) — `avraam-app.js` не вызывает `MapEngine.validateRoute()` на init

**Original (FAST plan):** FIX in W1 (call validateRoute, panic on error).

**New (atlas plan):** **KEPT in Phase 2** (engine v2.0). Engine v2.0's `createMap()` calls `validateRoute()` internally and refuses to render broken route.json.

**Status:** KEPT in Phase 2. Severity unchanged (P3).

---

### KARTY-14 (P3) — touchstart/touchmove/touchend в `map-engine.js` не cleanup'ятся

**Original (FAST plan):** FIX in W9 with KARTY-06.

**New (atlas plan):** **KEPT in Phase 3** (engine v2.0). Engine v2.0 has cleanup contract; touch listeners are wrapped in `_on()` automatically. No leak by construction.

**Status:** KEPT in Phase 3. Severity unchanged (P3).

---

### KARTY-15 (P3) — `karty/ishod/index.html` (эталон) не имеет `<noscript>` fallback

**Original (FAST plan):** FIX (add noscript with sr-only content).

**New (atlas plan):** **KEPT in Phase 4** (template phase). ishod becomes the **first test of the template**. When we write template docs, ishod is the "before" example.

**Status:** KEPT in Phase 4. Severity unchanged (P3).

---

### KARTY-16 (P3) — `route.schema.json` не валидирует `uniqueItems`

**Original (FAST plan):** FIX in W1.

**New (atlas plan):** **KEPT in Phase 2** (schema v2.0). ajv-компилируемая schema, ID uniqueness как кастомный keyword (см. `ENGINE-CONTRACT-RETHINK.md` §6).

**Status:** KEPT in Phase 2. Severity unchanged (P3).

---

## Severity distribution: before vs after

| Severity | Original | New (atlas plan) |
|----------|----------|------------------|
| P0 | 0 | **1** (KARTY-03 elevated) |
| P1 | 0 (was 1, reclassed) | 0 |
| P2 | 9 | 4 (KARTY-04, KARTY-05, KARTY-09, KARTY-10) |
| P3 | 7 | 7 (unchanged) |
| DEFERRED | 0 | 4 (KARTY-01 superseded, KARTY-02, KARTY-12, KARTY-15) |
| **Total** | **16** | **16** |

**Distribution by phase:**

| Phase | Findings |
|-------|----------|
| Phase 0 (FREEZE) | 0 (decisions only) |
| Phase 1 (AUDIT) | KARTY-03 (P0), KARTY-08 (P3) |
| Phase 2 (ENGINE DESIGN) | KARTY-04 (P2), KARTY-05 (P2), KARTY-07 (P3), KARTY-09 (P2), KARTY-10 (P2), KARTY-13 (P3), KARTY-16 (P3) |
| Phase 3 (REWRITE) | KARTY-11 (P3), KARTY-12 (P3), KARTY-14 (P3) |
| Phase 4 (TEMPLATE) | KARTY-15 (P3) |
| DEFERRED (post-Phase 4) | KARTY-01 (superseded), KARTY-02 (deferred) |

---

## What this means for `MASTER_BUG_MATRIX.md`

`MASTER_BUG_MATRIX.md` is the canonical ledger. When verifier merges findings from this intake, the matrix should:

1. **Keep** 16 KARTY-findings as evidence (technical findings still valid).
2. **Update** their `repair_lane` from W1/W4/W7/W9 → Phase 0..4.
3. **Add** a new "Strategy phase" column: Phase 0 / 1 / 2 / 3 / 4 / DEFERRED.
4. **Mark** KARTY-01 as `superseded` (not `closed` — the technical finding is true, but actionable plan is "do not activate").
5. **Add** a top-level "karty/ Atlas Project" entry in `verified/`, with link to `incoming/arena-agent-karty-strategy/2026-07-07/STRATEGY.md`.

This is **verifier's job**, not auditor's. We just propose.

---

## Open question for owner

**Q:** Подтверждаете ли вы, что 16 KARTY-находок остаются в MASTER_BUG_MATRIX, но с обновлёнными `repair_lane` (= Phase 0..4)?

Если "да" → verifier обновит матрицу.
Если "нет" → обсудим, какие findings убрать/добавить.

— arena-agent-karty-strategy, 2026-07-07
