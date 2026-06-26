# R14 — VR-07/VR-01/VR-02 fixes from AuditRepo reverify report

## Source commit: `66650847`
## Gates: ✅ audit-pro PASSED

## Fixes (based on reverify report)

### VR-07 (P0 — Gill "huge icons")
**Root cause:** `.gbs-rail-foot` ember/save sizing was scoped under `[data-gill-v16]`, which only exists on gill-context. Parts 1/2/3/spravochnik had **0** `data-gill-v16` → 32px rules never matched → ember=36px, save=40px → huge protruding icons.
**Fix:** Added global `.gbs-rail-foot` rules (not scoped to data-gill-v16):
- `justify-content: space-between; gap: 0; padding-top: 12px`
- `.gb-ember { --ember-size: 32px }`
- `.gb-save { width: 32px; height: 32px }`

### VR-01 (P1 — hermeneutics position drift)
**Root cause:** Late global override blocks (`.page-wrap ~ .gb-floater`) forced `right:8.5vw` + `top:clamp(48px,7vw,100px)` on ALL standalone floaters, overriding hermeneutics variant.
**Fix:** Removed 26 lines of competing sibling-based overrides. `.gb-floater--hermeneutics` content-column positioning now wins uncontested.

### VR-02 (P1 — Gill footer layout)
**Root cause:** `[data-gill-v16] .gbs-rail-foot` had `justify-content:center` + boxed bg instead of reference `space-between`.
**Fix:** Global rules use `space-between` matching reference HTML.

## HTML probe status
I have now read the full probe (1880 lines) AND the reverify report (including VR-01 through VR-08). The VR-07 typo root cause was the most surgically precise finding — a `.gb-rail-foot` vs `.gbs-rail-foot` class mismatch that was later elevated when the `<style>` block was removed and the rules went to `[data-gill-v16]`-scoped CSS.
