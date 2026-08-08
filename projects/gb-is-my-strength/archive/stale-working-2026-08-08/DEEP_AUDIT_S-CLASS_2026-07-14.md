# DEEP AUDIT: S-CLASS ARCHITECTURAL ANALYSIS
**Date:** 2026-07-14
**Auditor:** Arena-Agent-Auditor
**Status:** Final Technical Synthesis
**Target:** `gb-is-my-strength` (S-Class components: Karty, Rodosloviye, Gill-Series)

---

## 1. The "Blind Spot" Revelation (Critical Tooling Gap)

During the deep-dive, I performed a cross-analysis between the codebase and the project's main guard, `scripts/audit-pro.js`.

### The Finding: `S-T-01` — Guard Failure
The `audit-pro.js` script uses a `walk(ROOT)` function that filters for `.html` files. In a modern Astro architecture, the actual content and logic reside in `.astro`, `.md`, and `.mdx` files.

**Evidence:**
- `Audit sees: 61` (Legacy HTML files)
- `Actual pages: 54` (Astro components)
- **Blind Spot**: Pages like `/izbrannoe/` (Astro-only) are **completely invisible** to the guard.

**Impact:** An agent can introduce a catastrophic SEO or a11y bug in an Astro component, and the "Green" status of `audit-pro.js` will remain a lie. This creates a false sense of security.

**Recommendation:** Update `walk()` to include `/\.(astro|md|mdx)$/` and implement a "Pre-Build Scan" that validates the source, not just the emitted HTML.

---

## 2. Security Analysis: The "Blacklist" Sanitization Risk

I analyzed the `innerHTML` usage in `js/enhancements.js`.

### The Finding: `S-SEC-01` — Brittle Sanitization
The code attempts to sanitize HTML by manually removing a list of tags (`script, style, iframe...`) and stripping attributes starting with `on`.

```javascript
s.querySelectorAll("*").forEach(function(e){
  Array.prototype.slice.call(e.attributes).forEach(function(t){
    var n=t.name.toLowerCase();
    if(0===n.indexOf("on") || ...) e.removeAttribute(t.name)
  })
})
```

**The Risk:** This is "blacklist" sanitization. It is notoriously easy to bypass using:
- SVG-based XSS (`<svg onload=...>`) — though some `svg` tags are removed, the logic is fragile.
- Obfuscated attributes or newer HTML features.
- DOM Clobbering.

**Recommendation:** Replace this custom logic with a battle-tested library like **DOMPurify**. Given the project's "Atlas-grade" ambition, "homemade" security is an unacceptable risk.

---

## 3. Data-Route Mismatch (P1)

I performed a consistency check between `data/series.json` and the actual filesystem in `src/pages`.

### The Finding: `S-DATA-01` — Series Desynchronization
There is a massive drift between the defined series slugs and the actual folder structure.

**Evidence:**
- `data/series.json` references slugs like `chast-1`, `chast-2`.
- The filesystem uses `dzhon-gill-chast-1-chelovek`, `dzhon-gill-chast-2-uchenyi`.

**Impact:** Any logic relying on `series.json` for navigation, progress tracking, or "next part" buttons is currently broken or operating on stale data.

---

## 4. Architectural Debt: "The Prototype Trap"

Analysis of the `Karty` and `Rodosloviye` components confirms that the project is suffering from **Prototype Debt**.

### 4.1. The CSS-in-JS Anti-pattern (`S-A5`)
The components (especially `GenealogyTree.tsx` and `avraam-app.js`) use extensive inline styles:
`style={{ opacity: match ? '1' : '.08', transform: 'scaleX(0.5)' }}`.

- **The Problem**: This bypasses the CSS cascade, makes theming (`html.dark`) nearly impossible without JS-heavy overrides, and bloats the DOM.
- **Atlas-Grade Fix**: Move all visual states to CSS classes (e.g., `.node--active`, `.node--dimmed`) and use CSS Variables for dynamic values.

### 4.2. The Z-Index Chaos (`D-4`)
I found "Magic Numbers" in the CSS:
- `floating-cluster.css`: `z-index: 2147483100 !important;`
This is a sign of "Z-index wars" where developers keep increasing values to force an element to the top.

---

## 5. The "Atlas" Roadmap: From Prototype to Reference Work

The current a-priori a-posteriori analysis suggests that "fixing" the current code is a waste of effort. The project needs a **Core Engine Replacement**.

### The "S-Class" Architecture Proposal:
1.  **LOD-Engine (Level of Detail)**:
    - **L0 (Global)**: Precomputed clusters (e.g., "The 12 Tribes") as single SVG groups.
    - **L1 (Regional)**: Morphing clusters into a regional graph on zoom.
    - **L2 (Atomic)**: High-fidelity cards with full metadata.
2.  **Build-Time Layout**: Move from `dagre` (runtime) to a precomputed layout stored in JSON. This eliminates the "jumping" effect on load and supports 3000+ nodes.
3.  **Vanilla SVG Scene-Graph**: Remove React Flow for the core rendering. Use a lightweight vanilla TS wrapper around a single `<svg>`, utilizing `d3-zoom` for the viewport. This reduces the JS bundle by ~100KB and increases FPS.

---

## 6. Final Auditor's Verdict

| Metric | Status | Note |
|---|---|---|
| **Governance** | ✅ Green | SWPF is strictly followed. |
| **Infrastructure** | 🟡 Yellow | Prod is stable, but CI guards are "blind" to Astro source. |
| **Security** | 🔴 Red | Incomplete sanitization in `enhancements.js`. |
| **Data Integrity** | 🔴 Red | Series-Route mismatch is critical. |
| **Architecture** | 🟡 Yellow | Transitioning from prototype to atlas; risk of "feature creep" before engine fix. |

**Priority 1**: Fix `S-T-01` (The Blind Spot) so that the guards actually guard.
**Priority 2**: Fix `S-SEC-01` (Sanitization) to prevent XSS.
**Priority 3**: Synchronize `data/series.json` with the filesystem.
**Priority 4**: Execute the "Atlas-Grade" Engine Replacement.

**Signature:** `Arena-Agent-Auditor`
**Audit-ID:** `S-CLASS-DEEP-2026-07-14`
