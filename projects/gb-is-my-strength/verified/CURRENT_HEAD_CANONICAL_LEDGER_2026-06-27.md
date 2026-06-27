# Current Head Canonical Ledger — gb-is-my-strength

**Evidence date:** 2026-06-27
**Source HEAD checked:** `66640561919501e68dd9d3cd290ff9afe53d3068`
**AuditRepo HEAD before cleanup:** `c3a9ae27df749c09a88650ae0e16e348db61c1c7`
**Purpose:** current-only operational truth. Historical evidence remains in older ledgers/incoming folders, but this file decides current repair selection.

---

## 0. Current gate facts checked in this cleanup

Source checks:

```text
package.json scripts.dist:jsonld:audit = node scripts/dist-jsonld-audit.js --root dist
npm run workflows:check = PASS
```

Therefore the older workflow-policy red item for `dist:jsonld:audit --root dist` is **fixed-current / stale-on-current-head**. It must not remain a current repair item unless a future fresh check fails again.

---

## 1. Current PremiumControls / Gill truth

### Fixed-current / stale-on-current-head

- Broad “CI is collapsed” framing is stale.
- `workflows:check` red due `dist:jsonld:audit` missing `--root dist` is fixed-current.
- Old “Gill parts 2/3/spravochnik are still the legacy base” planning statement is stale. Current planning base is Gill v16.
- Old 2026-06-25 aggregate bug counts are historical baseline only.

### Current-open unless a later source+dist+browser reverify closes them

| ID | Status | Current truth |
|---|---|---|
| PC-CURRENT-02 | open | RomanNumeral false-green risk: component exists, but need proof all five Gill routes render `.gb-roman` and no raw `I/II/III` numerals in rail/TOCs. |
| PC-CURRENT-03 | open | PremiumControls asset refs must be versioned/fatal-guarded (`floating-cluster.css` / controller). |
| PC-CURRENT-04 | open/decision | CSS inventory decision: deployed runtime truth is `css/floating-cluster.css`; absent `css/premium-controls.css` must not be listed as deployed canon. |
| PC-CURRENT-05 | open | `css/floating-cluster.css` malformed transition fragments and Gill v16 comma-scope leaks need sanitation and guard. |
| PC-CURRENT-06 | open | Gill mobile current series item must open `#partTocOverlay` without navigation/reload and be covered by interactive audit. |

---

## 2. Hermeneutics protected truth

Current source truth must match `css/floating-cluster.css`:

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

The old formula is **SUPERSEDED / WRONG / POS-01 / NEVER REINTRODUCE**:

```css
right: max(calc((100vw - min(820px, 92vw)) / 2 - 28px), 16px);
```

It may appear only in forensic/history text with explicit superseded/forbidden/POS-01 wording.

---

## 3. Historical / superseded statements

These statements are not current operational truth:

- “60 confirmed bugs / 9 P0 / repair-ready” as current planning state.
- “All 63 bugs confirmed on HEAD” as current source truth after later same-day pushes.
- “workflows:check fails because `dist:jsonld:audit` lacks `--root dist`.” Fresh source check passes.
- “Gill is split with part2/part3/spravochnik still legacy `gbs2-rail` as target/base.” Current base is v16; consolidation remains.
- “PremiumControls 100% complete / atomically closed.” Current status is partially green, not complete.

Historical files are retained as evidence and must not be deleted:

- `verified/UNIFIED_BUG_LEDGER_2026-06-25.md`
- `verified/repair-order-unified-2026-06-25.md`
- `incoming/**`
- `archive/**`

---

## 4. Current repair order pointer

Use `verified/REPAIR_ORDER_DELTA_2026-06-27_current-head-priority-reset.md` for execution order. In short:

1. Truth reconciliation / AGENTS §3.10 formula drift.
2. PC-CURRENT-06 Gill mobile current item → part TOC flow + interactive guard.
3. PC-CURRENT-02 RomanNumeral actual integration + fatal rollout audit.
4. PC-CURRENT-03 unversioned asset refs + fatal audit.
5. PC-CURRENT-04 CSS inventory decision.
6. PC-CURRENT-05 malformed transition cleanup + CSS scope leak scan.
7. Controller decomposition / cosmetics later.

---

## 5. One-paragraph current doctrine

Current HEAD `6664056` is not a “PremiumControls 100% complete” state. It is a healthier v16-based state with green-but-incomplete gates. The safe path is: reconcile truth first, consolidate Gill v16 behavior and RomanNumeral with fatal guards, settle asset/CSS inventory truth, sanitize CSS, and only then do owner-reviewed premium TOC/rail polish. Do not revert to old `gbs2` as the target and do not reintroduce the Hermeneutics `-28px` POS-01 formula.
