# 🚨 R5 — COMPLETE BLAST RADIUS MAP + ROOT CAUSE CHAIN

## Meta
- SHA: `53f68d38`
- Agent: arena-agent-deep-verifier-editor
- Date: 2026-06-26

---

## ROOT CAUSE CHAIN (exactly what happened, commit by commit)

### Step 1: Commit `02bb0a6f` — "PC-004: canonical CSS only, remove 3× `<style is:global>` duplicates"
- **Deleted** all `<style is:global>` from `SingleArticleCluster.astro` (was ~500 lines of `.gb-floater`, `.gb-icon`, `.gb-theme-toggle`, mobile pill, etc.)
- **Deleted** all `<style is:global>` from `GillRailControls.astro`
- **Kept** `<style is:global>` in `SeriesLiteCluster.astro` (199 lines)
- **Added** `<link href="/css/premium-controls.css">` to all 3 components
- **But** `premium-controls.css` is only 165 lines and does NOT contain `.gb-floater`, `.gb-icon`, `.gb-theme-toggle`, or ANY layout selectors

### Step 2: Same or nearby commit — replaced `<link href="floating-cluster.css">` with a COMMENT
In 3 PageHead files:
```html
<!-- floating-cluster.css bundled via SingleArticleCluster <style is:global> — no external link needed -->
```
This was done to avoid "double CSS delivery" — but the `<style is:global>` it references WAS ALREADY DELETED.

### Step 3: Astro mode values overwritten with `series-rich`
The `integration-monolith-preflight` merge inherited `data-fc-mode="series-rich"` from `premiumcontrols-heart-series-wiring` branch and spread it to:
- Krajne, Rimlyanam7 Astro bodies
- All 5 Nagornaya PageChrome components
- All 10 Baptisty root HTML

But the controller enum handles only `single`, `series-lite`, `nagornaya`.

### Result
**Production (dist)** has:
1. HTML with `.gb-floater`, `.gb-icon`, `.gb-theme-toggle` class names
2. **ZERO CSS** for those class names (only `premium-controls.css` loads, which doesn't have them)
3. Wrong `data-fc-mode` on 17 routes that the controller doesn't branch on

---

## COMPLETE BLAST RADIUS

| Route | CSS in dist | Mode in dist | Controller handles? | Layout |
|-------|------------|-------------|-------------------|--------|
| **hermeneutics** | ❌ NONE | `single` | ✅ | 🔴 **DESTROYED** |
| **antisovetov** | ❌ NONE | `single` | ✅ | 🔴 **DESTROYED** |
| **kod-da-vinchi** | ❌ NONE | `single` | ✅ | 🔴 **DESTROYED** |
| **krajne** | ❌ NONE | `series-rich` | ❌ | 🔴 **DESTROYED** |
| **rimlyanam7** | ❌ NONE | `series-rich` | ❌ | 🔴 **DESTROYED** |
| **nagornaya ×5** | ⚠️ no fc link | `series-rich` | ❌ (was `nagornaya`) | 🟡 PARTIAL |
| **gill ×5** | ✅ PageHead link | correct | ✅ | 🟡 Mobile overflow |
| **baptisty ×10** | ✅ PageHead link | `series-rich` | ❌ | 🟡 Mode skip |
| **/izbrannoe/** | ❌ ZERO CSS | N/A | N/A | 🔴 **NO STYLING AT ALL** |

### Summary
- **🔴 6 routes completely broken** (3 standalone + 2 heart + izbrannoe)
- **🟡 20 routes with mode/CSS issues** (5 nagornaya + 5 gill + 10 baptisty)
- **✅ 0 routes fully correct in dist**

---

## MISSING SELECTORS IN premium-controls.css

| Selector | In floating-cluster.css | In premium-controls.css | Impact |
|----------|------------------------|------------------------|--------|
| `.gb-floater` | 23× | 0× | ❌ **No container layout** |
| `.gb-icon` | 18× | 0× | ❌ **No button styling** |
| `.gb-theme-toggle` | 13× | 0× | ❌ **No theme icon** |
| `.theme-icon-sun` | 4× | 0× | ❌ **No sun/moon swap** |
| `.theme-icon-moon` | 4× | 0× | ❌ **No sun/moon swap** |
| `.gb-floater--series-lite` | 6× | 0× | ❌ **No series layout** |
| `.gb-series-chip` | 8× | 0× | ❌ **No series chip** |
| `.gb-series-controls` | 6× | 0× | ❌ **No series controls** |
| Total missing rules | ~100+ | 0 | **Catastrophic** |

---

## MODE SCHISM: Root HTML vs Astro source

| Route | Root HTML mode | Astro source mode | Controller handles |
|-------|---------------|-------------------|-------------------|
| krajne | `<none>` (gill-rail path) | `series-rich` | ❌ |
| rimlyanam7 | `<none>` (gill-rail path) | `series-rich` | ❌ |
| nagornaya ×5 | `nagornaya` ✅ | `series-rich` ❌ | ❌ in dist |
| baptisty ×10 | `series-rich` | `series-rich` | ❌ (consistent but wrong) |

---

## /izbrannoe/ — COMPLETE CSS ABSENCE

The page was created in commit `a38d7e03` with:
- ✅ Full HTML template with class names (`izbrannoe-card`, `izbrannoe-grid`, `izbrannoe-wrap`, etc.)
- ✅ JS rendering logic (builds cards from localStorage)
- ❌ **ZERO CSS** — no `<style>`, no external CSS file, no entries in global.css/site.css

Result: raw unstyled text blob on production.

---

## GILL MOBILE OVERFLOW

Gill rail-foot controls (theme, search, A-, A+, Play, Save) overflow the mobile viewport:
- Controls have natural/oversized dimensions without the responsive CSS
- `GillRailControls.astro` links `premium-controls.css` (has `.gb-ember`, `.gb-save` sizing)
- But Gill PageHead still links `floating-cluster.css` (has rail-foot layout)
- The conflict may produce inconsistent sizing → overflow on narrow viewports

---

## IMMEDIATE FIX PLAN

### Fix 1: Restore CSS links (3 files, 3 lines) — MOST URGENT
```
src/components/article-pilots/hermenevtika/HermenevtikaPageHead.astro:
  REPLACE comment → <link href="../../css/floating-cluster.css?v=0142f39e" rel="stylesheet"/>

src/components/article-pilots/antisovetov/AntisovetovPageHead.astro:
  REPLACE comment → <link href="../../css/floating-cluster.css?v=0142f39e" rel="stylesheet"/>

src/components/article-pilots/kod-da-vinchi/KodDaVinchiPageHead.astro:
  REPLACE comment → <link href="../../css/floating-cluster.css?v=0142f39e" rel="stylesheet"/>
```

### Fix 2: Nagornaya Astro mode (5 files, 5 line changes)
```
Each NagornayaChast*PageChrome.astro:
  data-fc-mode="series-rich" → data-fc-mode="nagornaya"
```

### Fix 3: Heart-series Astro mode (2 files)
```
KrajneBody.astro, Rimlyanam7Body.astro:
  data-fc-mode="series-rich" → data-fc-mode="series-lite"
  OR add series-rich to controller enum
```

### Fix 4: Controller enum (1 line)
```javascript
if (mode === 'series-rich') activateSeriesPilot();
```

### Fix 5: /izbrannoe/ CSS (new file or inline)
Create `<style>` block in `/izbrannoe/` with grid, card, heading styles.

### Fix 6: TTS click path (3 lines)
After speed selection when idle, call `handlePlayClick()`.

### Fix 7: Toast text (1 line)
"Озвучка ещё не подключена" → "Браузер не поддерживает озвучку"

**Total: ~20 lines to fix all P0 production regressions.**
