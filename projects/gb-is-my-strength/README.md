# gb-is-my-strength / gospod-bog.ru

**Status:** ⚠️ REGRESSION AUDIT #2 — P0-FC-REC fixed (ca6a25a), but REG-001 (P0: `_headers` useless on GitHub Pages) and REG-002 (P1: deploy SPOF) found. See `verified/MASTER_BUG_MATRIX.md`.
**Last source HEAD checked:** `e458581` (2026-07-03, Arena Deep Auditor Pass 23 — Regression Watch)
**Previous HEAD:** `66640561919501e68dd9d3cd290ff9afe53d3068` (2026-06-27)

## Quick facts

- Source: `FedorMilovanov/gb-is-my-strength`
- Production: `https://gospod-bog.ru`
- Tech: Astro + strangler pattern (root HTML + Astro dist)
- Premium controls: v16 SVG floating cluster (`gb-icon`, `gb-ember`, `gb-save`)

## Current operational truth

Use `verified/MASTER_BUG_MATRIX.md` first — updated 2026-07-03 Pass 23: REG-001 (P0: _headers useless on GitHub Pages), REG-002 (P1: deploy SPOF), 5 confirmed fixes.

Current source checks performed during cleanup:

```text
source HEAD: 66640561919501e68dd9d3cd290ff9afe53d3068
AuditRepo HEAD before cleanup: c3a9ae27df749c09a88650ae0e16e348db61c1c7
package.json scripts.dist:jsonld:audit = node scripts/dist-jsonld-audit.js --root dist
npm run workflows:check = PASS
```

### Current fixed/stale items

- Old workflow-policy red item for `dist:jsonld:audit --root dist` is **fixed-current / stale-on-current-head**.
- Old broad “CI collapse” framing is stale.
- Old “Gill parts 2/3/spravochnik are still the legacy base” framing is stale for current planning. The current base is v16; the remaining work is v16 consolidation.
- Old 2026-06-25 “60 confirmed bugs / 9 P0” is historical baseline, not active repair order.

### Current open PremiumControls/Gill items

- **PC-CURRENT-02:** RomanNumeral false-green unless fresh source+dist evidence proves `gb-roman` is present on all five Gill routes and raw `I/II/III` is gone.
- **PC-CURRENT-03:** unversioned PremiumControls asset refs unless fresh source+dist evidence proves versioned `floating-cluster.css` / controller refs.
- **PC-CURRENT-04:** CSS inventory decision: deployed runtime truth is `css/floating-cluster.css`; absent `css/premium-controls.css` must not be listed as deployed canon.
- **PC-CURRENT-05:** malformed transition fragments / Gill v16 CSS scope leaks unless fresh CSS sanitation proof closes them.
- **PC-CURRENT-06:** Gill mobile current series item must open `#partTocOverlay` without navigation and have an interactive guard.

## Hermeneutics position truth

Canonical source truth must match `css/floating-cluster.css`:

```css
.gb-floater--hermeneutics {
  top: calc(clamp(24px, 3.5vw, 44px) - 4px);
  right: max(8.5vw, env(safe-area-inset-right, 0px));
}

@media (max-width: 899px) {
  .gb-floater--hermeneutics {
    top: calc(clamp(24px, 3.5vw, 44px) - 4px);
    right: max(4.5vw, env(safe-area-inset-right, 0px));
  }
}
```

Old formula is **SUPERSEDED / WRONG / POS-01 / NEVER REINTRODUCE**:

```css
right: max(calc((100vw - min(820px, 92vw)) / 2 - 28px), 16px);
```

## Primary current documents

| File | Purpose |
|------|---------|
| `verified/CURRENT_HEAD_CANONICAL_LEDGER_2026-06-27.md` | Primary current-head operational truth |
| `verified/REPAIR_ORDER_DELTA_2026-06-27_current-head-priority-reset.md` | Current repair ordering |
| `verification/CANONICAL_VERIFIER_NOTE_2026-06-27_current-head-status-flips-and-second-order-defects.md` | Status flips and stale/current classes |
| `PremiumControls/README.md` | PremiumControls current contract |

## Historical baseline only

- `verified/UNIFIED_BUG_LEDGER_2026-06-25.md`
- `verified/repair-order-unified-2026-06-25.md`
- older `incoming/` reports and archived ledgers

Do not delete evidence. Do not use historical counts as current operational truth without fresh HEAD reverify.
