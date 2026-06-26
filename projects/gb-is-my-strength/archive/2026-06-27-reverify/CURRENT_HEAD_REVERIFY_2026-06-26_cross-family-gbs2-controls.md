# Current HEAD Reverify — Cross-Family GBS2 Controls Matrix — 2026-06-26

## Meta
- Project: gb-is-my-strength
- Date: 2026-06-26
- Verifier: `arena-agent`
- Method:
  - production-like dist already built on current head
  - local static server on `127.0.0.1:4174`
  - Playwright browser witness
  - cross-family route comparison: Gill vs baptisty vs hard-texts

Routes tested:
- Gill family:
  - `/articles/dzhon-gill-chast-1-chelovek/index.html`
  - `/articles/dzhon-gill-chast-2-uchenyi/index.html`
  - `/articles/dzhon-gill-chast-3-nasledie/index.html`
  - `/articles/dzhon-gill-spravochnik/index.html`
- baptisty family:
  - `/baptisty-rossii/index.html`
  - `/baptisty-rossii/dva-sezda-1884/index.html`
- contrast route:
  - `/hard-texts/index.html`

Evidence labels:
- `verified-browser`
- `verified-production-like-dist`
- `verified-source`

---

## Executive summary

This pass materially strengthens the earlier GBS2 runtime diagnosis.

### Core finding
The current-head control defect is **not limited to baptisty routes**.
A broader family pattern now appears:

- Gill GBS routes and baptisty GBS2 routes both show **rendered but inert/hidden control behavior**.
- A non-GBS contrast route (`/hard-texts/`) toggles theme successfully.

That means the current problem is best described as a **GBS-family runtime/control wiring defect**, not a single-route anomaly.

---

## Matrix

| Route | Family | Body class | Theme count | Theme visible | Dark before | Dark after | Sheet count | Sheet opened | Search count | Search dialog | Share count | Share dialog |
|---|---|---|---:|---|---|---|---:|---|---:|---|---:|---|
| `/articles/dzhon-gill-chast-1-chelovek/index.html` | Gill | `gbs-world gb-fc-active` | 1 | false | false | false | 1 | false | 1 | false | 0 | false |
| `/articles/dzhon-gill-chast-2-uchenyi/index.html` | Gill | `gbs-world gb-fc-active` | 1 | false | false | false | 1 | false | 1 | false | 0 | false |
| `/articles/dzhon-gill-chast-3-nasledie/index.html` | Gill | `gbs-world gb-fc-active` | 1 | false | false | false | 1 | false | 1 | false | 0 | false |
| `/articles/dzhon-gill-spravochnik/index.html` | Gill | `gbs-world gb-fc-active` | 1 | false | false | false | 1 | false | 1 | false | 0 | false |
| `/baptisty-rossii/index.html` | baptisty | `gbs-world` | 2 | false | false | false | 1 | false | 2 | false | 1 | false |
| `/baptisty-rossii/dva-sezda-1884/index.html` | baptisty | `gbs-world` | 2 | false | false | false | 1 | false | 2 | false | 1 | false |
| `/hard-texts/index.html` | contrast | `` | 1 | true | false | true | 0 | false | 0 | false | 0 | false |

---

## Key interpretations

### 1) Theme failure is cross-family inside the GBS world
Gill routes:
- 1 theme control detected
- not visible
- forced click does not toggle dark mode

baptisty routes:
- 2 theme controls detected
- not visible
- forced click does not toggle dark mode

contrast route `/hard-texts/`:
- theme control visible
- dark mode toggles successfully

### Verdict
This is strong current evidence for a **GBS/GBS2-specific runtime defect** rather than a site-wide theme failure.

---

### 2) Mobile/bottom-sheet shell exists but remains inert
Gill:
- `sheetCount = 1`
- `bbarCount = 1`
- `sheetParts = 5`
- `sheetTabs = 2`
- `sheetOpened = false`

baptisty:
- `sheetCount = 1`
- `bbarCount = 1`
- `sheetParts = 10`
- `sheetTabs = 2`
- `sheetOpened = false`

### Verdict
The sheet shell and content markers exist in DOM across both families, but current browser witness shows no opening behavior after forced bottom-bar interaction. That strongly suggests **runtime wiring / visibility / event-path failure**, not missing markup.

---

### 3) Search/share controls are also present-but-not-proven-functional inside GBS families
Gill:
- search markers exist (`searchCount = 1`)
- search UI not visible
- no search dialog after forced click

baptisty:
- search markers exist (`searchCount = 2`)
- search UI not visible
- no search dialog after forced click
- share marker exists (`shareCount = 1`)
- share visible on tested baptisty routes, but no share dialog observed

### Caveat
On baptisty routes a `Clipboard.writeText` permission error appeared during share-path interaction:
- `NotAllowedError: Failed to execute 'writeText' on 'Clipboard': Write permission denied.`

This may indicate current share behavior attempts direct clipboard copy rather than dialog opening, or that dialog logic is bypassed by clipboard-first flow. Either way, the current browser witness does **not** support claiming a healthy interactive share UX.

---

## Architectural reading of the split

Observed family split now looks like this:

### GBS-family routes
- Gill routes: `body.gbs-world gb-fc-active`
- baptisty routes: `body.gbs-world`
- both exhibit inert/hidden control behavior

### Non-GBS contrast route
- `/hard-texts/` has no `gbs-world`
- theme control behaves normally

### Implication
The live defect likely sits in the **GBS-world control runtime path** rather than in the generic global theme system alone.

This aligns well with the project history around:
- `PremiumControls`
- `phase3`
- GBS-specific clickability and runtime claims
- route-family divergence between Gill, baptisty, and non-GBS pages

---

## Canonical bug implications

### A) GBS-family theme control inert/hidden — `confirmed-current`
- Severity: **P1**
- Witnesses:
  - `verified-browser`: Gill + baptisty fail; hard-texts contrast succeeds
  - `verified-production-like-dist`: shells and markers exist
- Recommended framing:
  - current issue is a **cross-family GBS runtime defect**, not merely baptisty-specific

### B) GBS-family bottom-sheet open path inert — `confirmed-current`
- Severity: **P1/P2** depending intended UX criticality
- Witnesses:
  - shell exists, tabs/parts exist, but sheet does not open on tested routes
- Recommended framing:
  - open as separate but related interaction-path defect if not already captured

### C) GBS-family search/share path health remains degraded — `likely-current`
- Severity: **P2**
- Witnesses:
  - markers exist but dialogs not observed
  - baptisty share path hits clipboard permission error under browser witness
- Recommended framing:
  - requires one deeper pass with route-specific event tracing before final wording, but current evidence is already negative enough to keep the family open

---

## Most important verifier conclusion

Previous history contained route-specific fix language, especially around Gill clickability. Current browser truth does **not** justify a blanket “Gill fixed / baptisty broken” conclusion.

Current evidence instead suggests:
- both Gill and baptisty still carry a broader GBS-world interaction defect,
- while non-GBS theme behavior can remain healthy.

That is exactly why route-family verification was necessary.

---

## Recommended next step

A follow-up pass should instrument the exact GBS runtime/event path:
- identify which script/module is expected to bind GBS controls,
- inspect whether selectors mismatch current markup,
- determine whether `gb-fc-active` / late theme bridge / bottom-bar wiring drifted after phase3 or PremiumControls changes.

That would convert the current cross-family symptom proof into a likely root-cause proof.
