# Evidence — `data-fc-mode="series-rich"` Analysis

**Agent:** arena-agent-deep-verifier-editor  
**Date:** 2026-06-26  
**Source SHA:** `6c5b83a3`

---

## Routes using `series-rich`

### In root HTML (legacy):
```
baptisty-rossii/dva-sezda-1884/index.html → data-fc-mode="series-rich"
baptisty-rossii/goneniya-i-sovest/index.html → data-fc-mode="series-rich"
baptisty-rossii/iniciativnaya-gruppa/index.html → data-fc-mode="series-rich"
baptisty-rossii/noch-na-kure/index.html → data-fc-mode="series-rich"
baptisty-rossii/peterburgskaya-liniya/index.html → data-fc-mode="series-rich"
baptisty-rossii/podpolnaya-pechat/index.html → data-fc-mode="series-rich"
baptisty-rossii/sovetskaya-noch/index.html → data-fc-mode="series-rich"
baptisty-rossii/spravochnik/index.html → data-fc-mode="series-rich"
baptisty-rossii/vsehib-1944/index.html → data-fc-mode="series-rich"
baptisty-rossii/yuzhnaya-shtunda/index.html → data-fc-mode="series-rich"
```

### In Astro source:
```
src/components/article-pilots/krajne/KrajneBody.astro → data-fc-mode="series-rich"
src/components/article-pilots/rimlyanam7/Rimlyanam7Body.astro → data-fc-mode="series-rich"
```

Total: **12 routes** with a mode the controller doesn't branch on.

## Heart-series root HTML vs Astro source SCHISM

| Attribute | Root HTML | Astro source |
|-----------|-----------|-------------|
| `data-fc-root` | ❌ absent | ✅ present |
| `data-fc-controls` | `"gill-rail"` | ❌ absent |
| `data-fc-mode` | ❌ absent | `"series-rich"` |
| `data-fc-variant` | `"heart"` | `"heart"` |

**Root HTML** → controller finds `data-fc-controls="gill-rail"` → runs `initCluster(rail)` via gill-rail path (line 519-521) → click delegation works.

**Astro source (dist)** → controller finds `data-fc-root` with `data-fc-mode="series-rich"` → enters root loop (line 584-589) → **no matching if-branch** → `initCluster(root)` runs but no pilot activation.

## Controller code (lines 584-589):
```javascript
roots.forEach(function(root) {
  var mode = root.getAttribute('data-fc-mode') || 'single';
  if (mode === 'single') activateSinglePilot();
  if (mode === 'series-lite') activateSeriesPilot();
  if (mode === 'nagornaya') activateSinglePilot();
  initCluster(root);
});
```

## Impact

For the 10 baptisty root HTML pages: **controls work** because `data-fc-controls="gill-rail"` is a working path.

For heart-series in dist (Astro-built): **controls partially work** — click delegation active but no pilot body class or series-specific affordances.

## Origin

The `series-rich` mode was introduced by `lane/premiumcontrols-heart-series-wiring-2026-06-26` (tip `099afce4`) and merged via `integration-monolith-preflight`. The competing `premiumcontrols-phase3` used `series-lite` (correct), but system-hardening's version (which used `series-rich`) won in the final merge.
