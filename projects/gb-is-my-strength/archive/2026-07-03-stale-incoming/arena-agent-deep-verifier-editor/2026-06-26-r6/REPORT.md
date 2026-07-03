# R6 — Deep commit-by-commit regression chain + refined blast radius

## Meta
- SHA: `53f68d38` (main)
- Agent: arena-agent-deep-verifier-editor
- Date: 2026-06-26

---

## 1. ROOT CAUSE CHAIN (refined, 3 destructive commits)

### Commit 1: `eb1504ea` — "N-REV1-7 double CSS + P2-14 dead series-cards.js"
- **What it did:** Replaced `<link href="floating-cluster.css">` with a comment in 3 PageHead files (Hermeneutics, Antisovetov, Kod da Vinchi)
- **Why:** Said CSS is bundled via `<style is:global>` in SingleArticleCluster — no external link needed
- **Was this true at the time?** YES — `<style is:global>` existed then

### Commit 2: `02bb0a6f` — "PC-004: canonical CSS only, remove 3× `<style is:global>` duplicates"
- **What it did:** Deleted `<style is:global>` from SingleArticleCluster (473 lines), GillRailControls (140 lines), SeriesLiteCluster (188 lines) — **total 792 lines of CSS deleted**
- **Added:** `<link href="/css/premium-controls.css">` (165 lines, missing 100+ critical selectors)
- **Critical failure:** The comment from Commit 1 now points to a deleted `<style>` block. 3 routes lost ALL floating-cluster styles.

### Commit 3: `debf4030` — "system-premiumcontrols-hardening Phase 1-2"
- **What it did:** Changed `data-fc-mode` on heart-series (Krajne, Rimlyanam7) and Nagornaya to `series-rich`
- **Problem:** Controller only handles `single`, `series-lite`, `nagornaya` — NOT `series-rich`
- **Root HTML Nagornaya** was `nagornaya` (correct), Astro source became `series-rich` (wrong)

### Commit 4: `f159cc10` — "repair 6 broken workflow YAMLs"
- **Revealed:** deploy.yml was BROKEN (tripled `uses: actions/checkout@v4`) since Phase 3 merge
- **Meaning:** Production deploy NEVER ran for any post-Phase3 commit → production frozen on old code
- Now fixed — next push should deploy current (broken) state

---

## 2. UPDATED SCHISM MAP (10 of 12 routes have root/Astro mismatch)

| Route | Root HTML mode | Astro mode | Controller handles Astro? |
|-------|---------------|------------|--------------------------|
| hermeneutics | `<none>` (=single) | `<none>` (=single) | ✅ |
| antisovetov | `series-lite` | `<none>` (=single) | ⚠️ different |
| kod-da-vinchi | `<none>` (=single) | `<none>` (=single) | ✅ |
| krajne | `<none>` (gill-rail path) | `series-rich` | ❌ |
| rimlyanam7 | `<none>` (gill-rail path) | `series-rich` | ❌ |
| nagornaya ×5 | `nagornaya` | `series-rich` | ❌ |
| baptisty ×10 | `series-rich` | `series-lite` | ✅ Astro correct |

### Good news: Baptisty Astro source was fixed to `series-lite` in latest commit `53f68d38`. Root HTML still says `series-rich` but dist comes from Astro.

---

## 3. CSS LOSS — precise 3-page impact

Only 3 pages are **completely** without floating-cluster CSS in dist:
- **Hermeneutics** — PageHead has comment, SingleArticleCluster loads only premium-controls.css
- **Antisovetov** — same
- **Kod da Vinchi** — same

All other pages (Gill, Baptisty, Nagornaya) have `floating-cluster.css` via their PageHead → layout works in dist (though mode may be wrong).

---

## 4. /izbrannoe/ — NOT a CSS-loss bug, it's a rendering/data display issue

**Correction from R4:** izbrannoe HAS `<style is:global>` with 28 lines of card styles. The CSS is present.

The screenshot showing raw text is likely caused by:
1. **Missing `.izbrannoe-card__link` CSS** — class used in HTML but NOT styled → image link renders inline
2. **Data format issue** — `getPageMeta()` saves `section` from breadcrumb `.breadcrumb__link:last-of-type`. The text "Главная" in the screenshot IS the breadcrumb section. But `section` + `title` + `description` concatenated suggests the card grid layout isn't applying on that particular browser/viewport, OR the favorites were saved from a page that had different meta structure.

**Remaining izbrannoe issue (P2):** `.izbrannoe-card__link` class is used but NOT defined in CSS.

---

## 5. DEPLOY PIPELINE VULNERABILITY

The deploy was broken for **multiple commits** because a YAML corruption (tripled checkout) silently produced 0 jobs. GitHub Actions shows "success" for workflows with no jobs (empty workflow = green). This means:
- No deploy → production frozen
- Owner sees "green CI" → thinks everything deployed
- Actual production shows the OLD state (pre-Phase3)

**Current status:** deploy.yml is now fixed. Next push to main should trigger real deploy. But deploying current HEAD will push the CSS-broken state to production (if it isn't already).

---

## 6. TOTAL BUG COUNT (cumulative R1-R6)

| Sev | Count | Key bugs |
|-----|-------|----------|
| **P0** | **2** | TTS no click-start, 3 routes CSS destroyed |
| **P1** | **3** | series-rich mode (7 routes), early-return init skip, deploy was frozen |
| **P2** | **6** | Toast text, rate key, keyboard nav, tab trap, rollout audit, izbrannoe link class |
| **P3** | **6** | Dead files, animation timing, CSS duplication |
| **Total** | **17** |

---

## 7. PRIORITY FIX (unchanged — still ~20 lines)

```
FIX 1 (P0 CSS): Restore <link floating-cluster.css> in 3 PageHeads  [3 lines]
FIX 2 (P0 TTS): After speed-select when idle, call handlePlayClick  [3 lines]
FIX 3 (P1 mode): Nagornaya Astro: series-rich → nagornaya          [5 lines]
FIX 4 (P1 mode): Krajne/Rimlyanam7 Astro: series-rich → series-lite [2 lines]
FIX 5 (P1 mode): Add series-rich to controller OR fix all sources   [1 line]
FIX 6 (P2 toast): "не подключена" → "не поддерживает"              [1 line]
FIX 7 (P2 rate): getStoredRate() → read gb:audio:rate first         [1 line]
FIX 8 (P2 izbrannoe): Add .izbrannoe-card__link styling             [3 lines]
```
