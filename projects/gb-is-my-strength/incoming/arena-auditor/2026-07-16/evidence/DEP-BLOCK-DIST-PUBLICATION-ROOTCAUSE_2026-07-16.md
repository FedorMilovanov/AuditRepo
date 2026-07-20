# Root cause — DEP-BLOCK-DIST-PUBLICATION-AUDIT

**Date:** 2026-07-16  
**Source HEAD:** `f5e2b4ff5092aecd457cb96e0f30866f1617369d`  
**CI:** deploy run [29452653011](https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/29452653011)  
**Stop step:** «Production-like dist publication audit»  
**Command:** `node scripts/dist-publication-audit.js --require-pagefind --forbid-dev`  
**Witnesses:** verified-source + verified-ci (log body unavailable: Actions blob EOF; mechanism reconstructed from script + source)

---

## 1. Pipeline facts (CI)

| Step | Result |
|---|---|
| Static publication gates | ✅ success |
| Build Astro + copy legacy | ✅ success |
| Pagefind | ✅ (step verifies `dist/pagefind/pagefind.js`) |
| Route-specific visual parity contract (`visual:parity:production`) | ✅ success |
| **Production-like dist publication audit** | ❌ exit 1 |
| Deploy to GitHub Pages | skipped |

Also on same SHA: **Visual Parity Guard — pixel-diff** ❌ (separate workflow `visual-parity.yml`; does **not** block deploy.yml by design — comment in workflow). Deploy is blocked **only** by dist-publication-audit here.

Metadata & IndexNow Readiness on HEAD: ✅ success (registry unblocked by `6e8562d`).

---

## 2. Mechanism (source)

### 2.1 What dist-publication-audit checks for Heart flagship routes

`scripts/dist-publication-audit.js` → `checkAstroArticleOwnership()` → `visualShadowArticleMarkers`:

```js
// Gill (correct for v16):
'dzhon-gill-chast-1-chelovek': [..., 'gbs-rail'],

// Heart (STALE):
'rimlyanam-7-veruyushchiy-ili-neveruyushchiy':
  ['gbs-world', 'data-gbs2-series="hard-texts"', 'gbs2-rail'],
'krajne-li-isporcheno-serdce':
  ['gbs-world', 'data-gbs2-series="hard-texts"', 'gbs2-rail'],
```

Missing any marker →:

```text
❌ /articles/krajne-li-isporcheno-serdce/ in dist is missing visual-shadow markers: gbs2-rail
❌ /articles/rimlyanam-7-.../ in dist is missing visual-shadow markers: gbs2-rail
```

(Exact wording from `bad()` template at ~L248.)

### 2.2 What source actually emits after series-engine migration

| Layer | Fact |
|---|---|
| `GillSeriesRail.astro:93` | `<aside class="gbs-rail" …>` — **no** `gbs2-rail` class |
| `GillSeriesChrome.astro` | wraps rail in `.gbs2-world[data-gill-v16]` |
| Heart pages e.g. `src/pages/articles/krajne-li-isporcheno-serdce/index.astro` | `body.gbs-world` + `data-gbs2-series="hard-texts"` + progress mins |
| `KrajneBody.astro` | `<GillSeriesChrome pageId="krajne" config={HARD_TEXTS_SERIES}>` |
| CSS canon | `[data-gill-v16] .gbs-rail { … }` in `floating-cluster.css` |

**Gill markers in the same audit file already use `gbs-rail`.** Heart still demands the **pre-v16 / series-lite** class `gbs2-rail`.

### 2.3 Why Static publication gates still green

`scripts/audit-pro.js` (~4314) dual-accepts rails:

```js
const v16HasRail =
  html.includes('class="gbs-rail"') ||
  /class="[^"]*\bgbs2-rail\b/.test(html);
```

`scripts/visual-parity-contract.js` does **not** list krajne/rimlyanam in CONTRACTS (only Gill + landings + nagornaya). So it cannot catch this.

**Class of bug:** gate marker data-drift (matrix already has pattern `GATE-MARKER-DATA-DRIFT`) — hard-coded string in one gate lagged engine rename accepted by another gate.

---

## 3. Lifecycle (why it stayed red)

1. Heart migrated to unified series engine (`GillSeriesChrome` / `gbs-rail`) — waves 07-13…07-15, book frame `e9faea5`.  
2. `dist-publication-audit.js` Heart markers never updated from `gbs2-rail` → `gbs-rail` (or dual).  
3. Earlier deploy failures were dominated by static gates (editorial/maps/CSS). After `6e8562d` + deploy-blocker fixes, static gates cleared → **latent Heart marker mismatch became the visible stop**.  
4. Full job logs not downloadable from this sandbox (Actions results blob EOF) — mechanism does not require log text once marker vs DOM class is proven.

---

## 4. Severity & repair shape

| Field | Value |
|---|---|
| Proposed ID | **DEP-BLOCK-DIST-PUBLICATION-AUDIT** (alias: **GATE-HEART-RAIL-MARKER-DRIFT**) |
| Severity | **P0** (blocks production deploy) |
| Subsystem | release-unblock / tooling gate (not content rewrite) |
| Minimal fix | In `visualShadowArticleMarkers` for `krajne` + `rimlyanam`: replace `'gbs2-rail'` with `'gbs-rail'` **or** accept both like audit-pro |
| Regression guard | Prefer dual-accept OR shared marker helper used by audit-pro + dist-publication-audit |
| Out of scope for same PR | Book nested rail TOC, prototype polish, pixel-diff baseline refresh |

### Suggested verification after fix

```bash
npm run strangler:build:production-like
# + pagefind as deploy does
node scripts/dist-publication-audit.js --require-pagefind --forbid-dev
# expect 0 problems
```

Then confirm deploy run GREEN and Pages serves functional SHA.

---

## 5. Negative tests (what is NOT the cause)

| Hypothesis | Status |
|---|---|
| Editorial registry still missing Heart routes | ❌ IndexNow readiness ✅ on HEAD; static gates ✅ |
| maps:validate / avraam / CSS !important still blocking | ❌ static gates step green |
| Pagefind missing | ❌ prior step verifies pagefind.js |
| Book shape / arabic SeriesMark type | ❌ would fail static/type earlier; SeriesMark arabic fixed `6e8562d` |
| pixel-diff failure blocks deploy | ❌ separate workflow; deploy.yml comment: pixel-diff does not block |

---

## 6. Residual risks after marker fix

1. **18 satellite Heart routes** not in SHADOW_ARTICLES — not gated by this marker set (latent coverage hole).  
2. **Legacy root HTML** for krajne/rimlyanam still contains `gbs2-rail` (series-lite fossil) — dist uses Astro ownership (`migration/page-ownership.json`); do not “fix” by reintroducing gbs2-rail into GillSeriesRail.  
3. **pixel-diff RED** remains advisory noise until baseline refresh post-book chrome.  
4. **PROD-STALE** clears only after full deploy success, not after local green alone.

---

*Auditor: arena-auditor · AUDIT PRO · no source patch applied.*
