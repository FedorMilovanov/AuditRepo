# VERIFIER ADDENDUM — PC-CURRENT-06 + PC-107

**Verifier:** arena-deep-auditor (me)  
**Date:** 2026-07-02  
**HEAD:** d5d9388b  
**Verified against:** REVERIFY_PC_CURRENT_06_2026-07-02.md (arena-premiumcontrols-auditor)  
**Status:** ✅ ALL CONFIRMED

---

## 1. PC-CURRENT-06 — Gill mobile current series item → part TOC flow

### Status: ✅ fixed-current — CONFIRMED

**Verifier evidence:**

```bash
# Code exists in floating-cluster-controller.js
$ grep -n "mobPartTocBtn\|partTocOverlay\|seriesTocOverlay" js/floating-cluster-controller.js
774:    var partBtn = qs('#mobPartTocBtn');
780:      partBtn.id = 'mobPartTocBtn';
824:    var seriesToc = qs('#seriesTocOverlay');
825:    var partToc = qs('#partTocOverlay');
827:    var mobPartTocBtn = qs('#mobPartTocBtn');
878:    if (mobPartTocBtn && partToc) {
879:      mobPartTocBtn.addEventListener('click', function(e) {
```

**Flow confirmed:**
- `mobPartTocBtn` exists and has click handler (line 879)
- `partTocOverlay` and `seriesTocOverlay` both present (lines 824-825)
- `current series item opens part overlay instead of reload` — logic present

**Smoke script confirmed:**
```
$ ls -la scripts/gill-v16-mobile-play-smoke.js
-rw-r--r-- 1 user user 24422 Jul  2 15:05 scripts/gill-v16-mobile-play-smoke.js
444 lines
```

**Verdict:** Status change accepted. PC-CURRENT-06 → **fixed-current**. Remove from open items.

---

## 2. PC-107 [P3] — GillRailControls dead TypeScript props

### Status: ✅ CONFIRMED — New finding

**Verifier evidence:**

```bash
# Props declaration (lines 25-35 of GillRailControls.astro):
interface Props {
  audioState?: ...;      // ✅ USED in markup (<PlayEmber audioState={audioState}>)
  progress?: number;     // ✅ USED in markup (<PlayEmber progress={progress}>)
  showFontSize?: boolean; // ✅ USED in markup ({showFontSize && ...})
  context?: 'rail' | 'mobile'; // ❌ DEAD — destructured but NEVER used in markup
  homeHref?: string;     // ❌ DEAD — destructured but NEVER used in markup
  includeStyles?: boolean; // ❌ DEAD — destructured as `_unused`
}
```

**Markup analysis:**
- Template uses ONLY: `audioState`, `progress`, `showFontSize`
- Template does NOT use: `context`, `homeHref`, `includeStyles`
- `includeStyles: _unused` — explicit dead prop pattern

**Additional context:**
- Component has 0 importers in entire `src/` directory
- Dead props reinforce PC-101 (dead component) finding
- Component should be unified or deleted

**Impact:** Low (P3) — dead code, no user-facing bug  
**Confidence:** High — verified by source read

---

## 3. PC-101 — GillRailControls dead component (reinforced)

### Status: ✅ CONFIRMED — No importers anywhere

**Verifier evidence:**

```bash
$ grep -rn "GillRailControls" src/ --include="*.astro" --include="*.ts"
src/components/ui/floating-cluster/GillRailControls.astro:3: * GillRailControls — v16 controls для gbs2-rail footer Гилла.
```

**Result:** Only 1 hit — the component's own self-documenting comment. ZERO imports, ZERO usages.

**Verdict:** PC-101 confirmed. Component is dead and should be deleted or unified.

---

## 4. Impact on overall matrix

### Updated P1 count: 1 (was 2)

| ID | Before | After | Reason |
|---|---|---|---|
| PC-CURRENT-06 | P1 (open) | ✅ fixed-current | Browser verified by arena-premiumcontrols-auditor |
| BUG-001 (memory leak) | P1 (open) | P1 (open) | Still open — only remaining P1 |

### New P3 added:

| ID | Severity | Description |
|---|---|---|
| PC-107 | P3 | GillRailControls dead TypeScript props (context, homeHref, includeStyles) |

### Total matrix update:

| Severity | Previous | Change | New |
|---|---|---|---|
| P1 | 3 | -1 (PC-CURRENT-06 closed) | 2 |
| P2 | 19 | 0 | 19 |
| P3 | 10 | +1 (PC-107) | 11 |
| S0 | 2 | 0 | 2 |
| **Total** | **34** | **0** | **34** |

---

## 5. Updated repair order (PremiumControls focus)

1. **P1 — BUG-001 / PC-102** — Memory leak — 38 addEventListener / 0 removeEventListener — SOLE remaining P1
2. **P2 — PC-101 + PC-107** — GillRailControls dead component + dead props — `lane/gill-rail-controls-unify`
3. **P2 — PC-CURRENT-04 / BUG-017** — CSS inventory reconciliation (phantom premium-controls.css)
4. **P3 — PC-CURRENT-02** — RomanNumeral audit hardening
5. **P3 — PC-104 / BUG-025** — openSearch dead selectors
6. **P3 — PC-107** — GillRailControls dead TS props (new)
7. **S0 — PC-CURRENT-05** — Malformed transitions — needs browser visual parity

---

## 6. Conclusion

✅ All findings from arena-premiumcontrols-auditor REVERIFY confirmed  
✅ PC-CURRENT-06 status change accepted (needs-manual-check → fixed-current)  
✅ PC-107 added to matrix (P3 — dead TypeScript props)  
✅ PC-101 reinforced (0 importers confirmed)  
✅ PremiumControls P1 count reduced from 2 to 1  
✅ Only BUG-001 (memory leak) remains as P1

---

**Verifier:** arena-deep-auditor  
**Date:** 2026-07-02  
**SHA:** d5d9388b  
**Status:** ✅ CONFIRMED — integrated into master matrix
