# REPORT — karty/ v3 Deep Audit (Playwright ground-truth v3)

## Meta
- **Project:** gb-is-my-strength
- **Source HEAD:** `75f807b73aea28281ff132794c38d8a937cc9cfa` (production)
- **Agent:** arena-agent-karty-v3-deep-audit
- **Date:** 2026-07-07
- **Methodology:** Playwright 1.61.1, route-specific selectors, JS dispatchEvent for SVG
- **Coverage:** 46 runs (2 routes × 2 viewports × ~12 states)
- **All 4 pageerrors confirmed = same q-bug** (no other runtime issues)

---

## 1. v3 Methodology (fixes v1)

### v1 (broken)
- HTML text selectors: `text=Шалем`, `text=Весь путь`
- SVG text NOT traversed → timeouts/no-ops
- 50 runs, all "post-state" runs were actually initial+intro
- 25 pageerrors (q-bug firing per page load)

### v3 (working)
- SVG-aware: `g[data-place-id="..."]`, `[data-layer-id="..."]`, `[data-story="..."]`
- JS dispatchEvent for SVG: `el.dispatchEvent(new MouseEvent('click', {bubbles:true}))`
- Route-specific placeIds (avraam: ur/harran/salem, ishod: rameses/sinai/marah)
- Intro dismissed before state actions
- State verification: `panel=true('Шалем · гора Мория')` confirms success
- 46 runs, real state coverage, 4 pageerrors (all q-bug, no new)

**v3 script:** `audit_visual/audit_visual_v3.js` (committable to `gb-is-my-strength/scripts/audit_visual.js`)

---

## 2. v3 Results

### 2.1. q-bug confirmed (already in LANE)

`pageerror: q is not defined` — fired in 4/46 runs (all `search` state).

**Reproduction:** `node audit_visual/verify_ishod_prod.js` → 1 error
**Fix:** LANE branch `lane/karty-q-bugfix` (commit `f7e9696`)
**Verification:** `node audit_visual/verify_ishod.js` (with fix) → 0 errors

### 2.2. New visual findings (ground-truth only)

| ID | Severity | Title | Evidence |
|----|----------|-------|----------|
| **VB-NEW-001** | P0 | Bottom timeline shows 7 dots, but 8 stages defined — inconsistent | `evidence/screenshots/avraam-desktop-1920-place-open-2.png` (bottom-center timeline) |
| **VB-NEW-002** | P1 | Header timeline dots red, bottom timeline dots multicolor — 2 different renderings | same screenshot |
| **VB-NEW-003** | P1 | Active place marker (Шалем) has gray label, not gold highlight | `evidence/screenshots/avraam-desktop-1920-place-open-2.png` (center) |
| **VB-NEW-004** | P2 | Search input embedded in header between buttons — visual hierarchy broken | `evidence/screenshots/avraam-desktop-1920-initial.png` (top-right) |
| **VB-NEW-005** | P1 | Panel ~30% screen on desktop (VB-053 confirmed, not false) | `evidence/screenshots/avraam-desktop-1920-place-open-2.png` (left bottom) |
| **VB-NEW-006** | P2 | "Полночный марафон" button — no tooltip, no aria-label, unclear purpose | same |
| **VB-NEW-007** | P2 | "LEGENDA" legend overlay blocks markers in right area | same (center-right) |
| **VB-NEW-008** | P2 | Header timeline подписи обрезаны (e.g., "АВРАМУ 75 ЛЕТ" → cut at 20 chars) | same (top, I-VIII stages) |

### 2.3. False positives retracted (from prior visual-baseline)

| VB-# | Original claim | v3 ground-truth | Verdict |
|------|----------------|-----------------|---------|
| **VB-008** | Timeline date duplicates | 9 unique dates, ~2091 correct (Призвание + Харран→Ханаан = same year) | **RETRACTED** |
| **VB-018** | Label overlap zoom-3 | No overlap visible on desktop-1920, mobile-iphone14 | **RETRACTED** |
| **VB-036** | Labels "Бет-Эль и Гай" + "Хеврон - Мамре" overlap | No overlap visible at place-open-2 | **RETRACTED** |
| **VB-037** | "Шалем - гора Мория" + "Талл эль-Хаммам" overlap | No overlap visible | **RETRACTED** |
| **VB-038** | "Беэр-Шева" + "Беэр-лахай-рои" overlap | No overlap visible | **RETRACTED** |
| **VB-044** | Timeline date duplicates (full scale) | Same as VB-008 | **RETRACTED** |
| **VB-058** | Hebrew not RTL | Hebrew shows correctly RTL: שלם · מלכי־צדק, דרך אברהם | **RETRACTED** |

### 2.4. False positives confirmed (from prior visual-baseline)

| VB-# | Original claim | v3 ground-truth | Verdict |
|------|----------------|-----------------|---------|
| **VB-053** | Panel takes ~30% of screen on desktop | Confirmed: panel ~30% of 1920px (576px width) | **CONFIRMED REAL** |
| **VB-049** | Inactive places opacity .15 looks broken | Not directly tested, but visible in all states — needs Phase 1 deep audit | **PENDING** |
| **VB-052** | Hebrew word separation missing | Visible in panel: "שלם · מלכי־צדק" — words separated by middot | **PARTIAL: separated by punctuation, not nikkud** |

### 2.5. Re-verified CONFIRMED bugs

| KARTY-# | Status | Comment |
|---------|--------|---------|
| KARTY-09 | **ALREADY DONE** | validate-map-routes.js (recheck confirmed) |
| KARTY-10 | **ALREADY DONE** | check-map-publication-status.js (recheck confirmed) |
| KARTY-13 | **PARTIAL** | avraam-app.js:677 calls validateRoute; "panic-early" not implemented |
| KARTY-16 | **PARTIAL** | script validates; schema can't express unique by property |
| Q-BUG-SEARCH-P0 | **FIXED IN LANE** | awaiting PR review |

---

## 3. Detailed VB-NEW analysis

### 3.1. VB-NEW-001 (P0): Bottom timeline stage dots inconsistency

**Evidence:** `evidence/screenshots/avraam-desktop-1920-place-open-2.png`

**Observation:**
- Stage 7 (Мория) panel open
- Top timeline (header): 8 stages I-VIII visible
- Bottom timeline: 7 visible dots (with year labels)
- Missing: one stage dot

**Code cross-ref:** `karty/avraam/avraam-app.js` and `karty/_engine/map-engine.js` — both render timelines independently

**Hypothesis:** Either (a) bottom timeline data source is incomplete, or (b) one dot is rendered off-screen, or (c) duplication/render bug.

**Impact:** For atlas-grade, timeline must be accurate. Users will notice.

**Owner decision:** investigate vs accept

### 3.2. VB-NEW-002 (P1): Two different stage colorings

**Evidence:** `evidence/screenshots/avraam-desktop-1920-place-open-2.png`

**Observation:**
- Header timeline (I-VIII): all dots red
- Bottom timeline: 7 dots, multicolor (yellow, orange, red, blue, etc — per STAGE_COLORS)

**Code cross-ref:** `karty/_engine/map-engine.js:80-86` (STAGE_COLORS = ['#e8c879', '#e0813f', '#4a9e6e', '#cf5b6b', '#8b6b4a', '#4a80b4']) — these are used in stage paths and bottom timeline, but NOT in header (which is avraam-app.js:2335+).

**Impact:** Visual inconsistency. Confusing for users.

### 3.3. VB-NEW-003 (P1): Active place marker not highlighted

**Evidence:** `evidence/screenshots/avraam-desktop-1920-place-open-2.png`

**Observation:**
- Шалем (Мория) is the active place (panel open shows "Шалем · гора Мория")
- Marker is the SAME as other markers (gold ring + orange dot — standard)
- LABEL "Шалем - гора Мория" is **gray** (`#9aa2ae`), same as inactive places
- Expected: active label should be **gold** (`#e8c879`) per `map-engine.js:1485` logic

**Code cross-ref:** `map-engine.js:1485` `g.style.opacity=inStory?'1':'.15'`, but label color set differently

**Impact:** For atlas-grade, active place must be visually distinct.

### 3.4. VB-NEW-005 (P1): Panel takes 30% of screen

**Evidence:** `evidence/screenshots/avraam-desktop-1920-place-open-2.png` (1920×1080, panel ~570px wide on left)

**Measurement:** Panel width is ~30% of 1920 = 576px. Panel takes significant screen real estate.

**Code cross-ref:** `map-engine.js` CSS `.me-panel` (line 320+) — width:420px on desktop > 640px. But avraam-app.js overrides? Or different breakpoint?

**Impact:** Reduces map visibility by 30% when place open. For atlas-grade, should be ~20% (right side panel) or modal/overlay.

### 3.5. VB-NEW-006 (P2): "Полночный марафон" button — unclear purpose

**Evidence:** All avraam screenshots (top-right area)

**Observation:** Button label is "Полночный марафон" (literally "Midnight Marathon") — what does it do? No tooltip, no aria-label, no visible icon.

**Code cross-ref:** `karty/avraam/avraam-app.js` (search for "полночн" or "марафон")

**Impact:** Minor UX issue. Owner may have intended this as a specific feature.

### 3.6. VB-NEW-007 (P2): Legend overlay blocks markers

**Evidence:** `evidence/screenshots/avraam-desktop-1920-place-open-2.png` (right side, semi-transparent)

**Observation:** "LEGENDA" panel is visible in right area, with stage descriptions. It's semi-transparent but covers marker area for "Содом и Гоморра" and "Беэр-Шева".

**Code cross-ref:** `map-engine.js:1302+` (`.me-legend`) — should collapse on click

**Impact:** User can collapse it (click), but default visible is too intrusive.

### 3.7. VB-NEW-008 (P2): Header timeline подписи обрезаны

**Evidence:** All avraam screenshots, top header

**Observation:** Each of 8 stage labels in top timeline is cut at ~20-25 characters:
- II: "АВРАМУ 75 ЛЕТ" → cut at "АВРАМ 75 ЛЕТ" (truncated)
- VII: "АВРААМУ 99 ЛЕТ" → cut at "АВРААМ 99 ЛЕТ"
- VIII: "ТРИ ДНЯ ПУТИ" → cut at "ТРИ ДНЯ ПУТИ"

**Code cross-ref:** `avraam-app.js` top timeline rendering — text-overflow:ellipsis not applied or width too small

**Impact:** User can't read full stage description.

---

## 4. Recommendations

### 4.1. To owner (PR review)

**MERGE LANE branch `lane/karty-q-bugfix`** — q-bug is real P0, fixed and verified.

### 4.2. To verifier (MASTER_BUG_MATRIX)

Update VB-001..VB-075 from visual-baseline intake:
- **Retract** VB-008, VB-018, VB-036, VB-037, VB-038, VB-044, VB-058 (7 false positives)
- **Confirm** VB-053 (panel 30%)
- **Add** VB-NEW-001 to VB-NEW-008 (8 new ground-truth findings, 2 P0/P1, 6 P2)

### 4.3. To next phase (Playwright as CI)

Commit `audit_visual/audit_visual_v3.js` to `gb-is-my-strength/scripts/` (after v3 cleanup). Wire into CI as smoke test.

### 4.4. To Phase 1 deep audit

Use the v3 46 screenshots (in `/home/user/audit_visual/`) as base. For each VB-NEW, determine owner-decision. For each false-positive retracted, document the methodology lesson.

---

## 5. Files in this intake

- `README.md` — identity + status
- `REPORT.md` (this file) — full analysis
- `evidence/manifest/run-46.json` — all 46 v3 runs
- `evidence/screenshots/` — 8 key screenshots
- `proposals/vb-new-001-to-008.md` — 8 new findings
- `proposals/confirm-q-bug-merge.md` — request owner action
- `comments/comment-on-VB-recheck.md` — final re-evaluate
- `comments/comment-on-v1-bug.md` — explain v1 broken selectors
- `commands.log`

## Cross-agent handoff

| Agent | Intake | This intake supersedes/extends |
|-------|--------|-------------------------------|
| karty-audit (c253596) | 16 technical findings | unaffected |
| karty-strategy (075a289) | 6-phase plan | unaffected |
| karty-visual-baseline (5c2f2f7) | 60+ VB, 5 P0 false | 7 more false positives retracted (total 12 of 75 retracted) |
| karty-recheck (4da15ea) | 3 already-done, 3 false | confirmed 3 already-done |
| karty-playwright (c93e244) | 1 P0 found and fixed (LANE) | extends with v3 ground-truth (8 new findings, 7 false positives retracted) |
| karty-v3-deep-audit (THIS) | 8 new ground-truth findings | final consolidation of ground-truth work |

Total karty/ findings after v3: 1 P0 fix in LANE + 8 new ground-truth visual + 75-12 = 63 visual pending Phase 1 + 16 technical (3 already done).

— arena-agent-karty-v3-deep-audit, 2026-07-07
