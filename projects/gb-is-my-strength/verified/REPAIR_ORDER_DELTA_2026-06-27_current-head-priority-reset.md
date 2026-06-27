# Repair Order Delta — current-head priority reset

**Date:** 2026-06-27
**Source HEAD checked:** `66640561919501e68dd9d3cd290ff9afe53d3068`
**AuditRepo HEAD before cleanup:** `c3a9ae27df749c09a88650ae0e16e348db61c1c7`
**Purpose:** replace stale 2026-06-25 repair instincts with current-head order.

---

## Current gating note

Fresh source check during cleanup:

```text
package.json scripts.dist:jsonld:audit = node scripts/dist-jsonld-audit.js --root dist
npm run workflows:check = PASS
```

So the old `dist:jsonld:audit --root dist` workflow mismatch is **not** a current repair item. Keep it only as historical/fixed-current context.

---

# Current priority order

## P0 — Truth reconciliation / AGENTS §3.10 formula drift

**Priority:** Highest
**Status:** current repair lane / must happen before UI work

Scope:

1. Source `AGENTS.md §3.10` must match live `css/floating-cluster.css` Hermeneutics canon.
2. AuditRepo active docs must identify old `-28px` calc as SUPERSEDED / WRONG / POS-01 / NEVER REINTRODUCE.
3. Guard/check must fail if the old formula appears in active docs/code without superseded/forbidden wording.
4. Historical ledgers stay as evidence but cannot act as current truth.

Success:

- No active source/AuditRepo doc teaches the `-28px` formula as protected truth.

## P1 — PC-CURRENT-06: Gill mobile current item → part TOC flow

**Priority:** Very high
**Status:** current-open unless source+browser reverify proves fixed

Scope:

1. `js/floating-cluster-controller.js`: current item branch must `preventDefault`, `stopPropagation`, open `#partTocOverlay`, and `return`.
2. `interactive-audit.js`: mobile 390 check for all five Gill routes must assert no navigation/reload and `#partTocOverlay.is-open` after clicking current series item.

Success:

- Browser witness: current series item opens part TOC overlay, not current-page reload.

## P2 — PC-CURRENT-02: RomanNumeral actual integration

**Priority:** High

Scope:

1. All five Gill PageChrome files import and use `RomanNumeral` for rail, series TOC, and part TOC numerals.
2. Built/dist Gill output has `.gb-roman` on all five routes.
3. Rollout audit treats `gb-roman=0` on Gill v16 as fatal.

Success:

- No raw `I/II/III` divs in Gill rail/TOCs; dist proves `.gb-roman`.

## P3 — PC-CURRENT-03: unversioned PremiumControls asset refs

**Priority:** High

Scope:

1. Version `floating-cluster.css` / `floating-cluster-controller.js` refs in Astro-owned Gill output.
2. Add fatal guard for unversioned PremiumControls refs.
3. Keep `asset-version.js` / cache-bust truth consistent.

Success:

- No unversioned PremiumControls CSS/controller refs in Gill v16 source/dist.

## P4 — PC-CURRENT-04: CSS inventory decision

**Priority:** Medium-high

Current truth:

- Deployed runtime CSS is `css/floating-cluster.css`.
- `css/premium-controls.css` is absent from `/css` in source HEAD.

Scope:

Choose and enforce one:

1. Retire `css/premium-controls.css` as deployed canon and remove it from inventories/cache-bust; or
2. Create/sync/link it intentionally with clear boundary.

Success:

- No doc/script says absent `css/premium-controls.css` is deployed canonical runtime truth.

## P5 — PC-CURRENT-05: CSS malformed transition cleanup + scope leak scan

**Priority:** Medium-high

Scope:

1. Fix malformed transition fragments such as `[data-gill-v16] background ...` inside declaration values.
2. Fix unscoped comma selectors such as `[data-gill-v16] .x, .y`.
3. Add CSS sanitation guard.
4. Do not change visual geometry/top/right/spacing/z-index in this lane.

Success:

- CSS guard catches both malformed fragments and Gill v16 scope leaks.

## P6 — Controller decomposition / cosmetics / premium polish

**Priority:** Later

Only after P0–P5 and owner screenshots:

- controller domain decomposition;
- premium TOC/rail visual polish;
- fullscreen/spacious owner-approved overlays;
- no mass Gill rollout without owner review.

---

# Demoted / historical priorities

- Old 2026-06-25 total bug counts: historical baseline only.
- Workflow `dist:jsonld:audit --root dist` mismatch: fixed-current on source HEAD checked here.
- Generic “CI collapse”: stale framing.
- Restoring legacy `gbs2` as Gill base: forbidden target direction.

---

# One-paragraph doctrine

Current repair work must start by making the dispatcher truth safe: fix AGENTS/AuditRepo formula drift and stale ledgers, then close Gill v16 functional/guard gaps. Do not polish UI while active docs can still reintroduce the Hermeneutics POS-01 `-28px` bug or describe green-but-incomplete PremiumControls as “100% complete.”
