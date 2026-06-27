# PremiumControls — current contract (2026-06-27)

**Project:** `gb-is-my-strength` (`gospod-bog.ru`)
**Source HEAD checked:** `66640561919501e68dd9d3cd290ff9afe53d3068`
**AuditRepo HEAD before cleanup:** `c3a9ae27df749c09a88650ae0e16e348db61c1c7`
**Status:** partially green, not complete. Old “Phase 1..3 100% closed” wording is historical/superseded.

---

## 0. Current operational truth

PremiumControls has recovered from broad first-order breakage, but it is **not** final. Treat `audit:premium-controls 39/39` as a useful gate, not completion proof.

`audit:premium-controls 39/39` is **not completion proof** until these are fatal checks and verified in source+dist/browser:

1. `gb-roman` / `RomanNumeral` actual Gill output.
2. Unversioned `floating-cluster.css` / controller refs.
3. Malformed transition fragments and Gill v16 CSS scope leaks.
4. Gill mobile current series item → `#partTocOverlay` flow without navigation/reload.

Current open items unless a later fresh source+dist+browser reverify closes them:

| ID | Current status |
|---|---|
| PC-CURRENT-02 | RomanNumeral false-green risk. |
| PC-CURRENT-03 | Unversioned PremiumControls asset refs. |
| PC-CURRENT-04 | CSS inventory/runtime-canon decision. |
| PC-CURRENT-05 | Malformed transitions / scope leaks. |
| PC-CURRENT-06 | Gill mobile current item part-TOC flow. |

PC-CURRENT-01 / stale Gill marker dist-publication issue is fixed-current on later source and should not be listed as current-open.

---

## 1. Strategy doctrine

Do **not** rewrite everything from scratch. Do **not** return to old `gbs2` as target architecture.

Correct path:

1. Keep Gill v16 as the base.
2. Reconcile source/AuditRepo truth.
3. Close functional/fatal guards.
4. Sanitize CSS without visual tuning.
5. Only then do premium TOC/rail polish with owner screenshots.

---

## 2. Hermeneutics position — protected truth

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

It was the “впритык” POS-01 bug, not protected truth.

---

## 3. CSS inventory truth

Current source truth from `gb-is-my-strength`:

- Deployed/runtime PremiumControls CSS is `css/floating-cluster.css`.
- `css/premium-controls.css` is absent from runtime `/css`.
- Do not list absent `css/premium-controls.css` as deployed canonical runtime truth.

Valid future choices:

1. Keep `floating-cluster.css` as runtime canon and remove `premium-controls.css` from inventories/cache-bust; or
2. Recreate/sync/link `premium-controls.css` intentionally with a clear boundary.

Invalid state:

- “`css/premium-controls.css` is canonical” while the file is absent and pages load `floating-cluster.css`.

---

## 4. Current repair sequence

1. Truth reconciliation / AGENTS §3.10 formula drift.
2. PC-CURRENT-06 Gill mobile current item → part TOC flow + interactive guard.
3. PC-CURRENT-02 RomanNumeral actual integration + fatal rollout audit.
4. PC-CURRENT-03 unversioned asset refs + fatal audit.
5. PC-CURRENT-04 CSS inventory decision.
6. PC-CURRENT-05 malformed transition cleanup + CSS scope leak scan.
7. Controller decomposition / cosmetics later.

---

## 5. Historical / superseded evidence

The old `4f962f75` / “Phase 1..3 100% closed” material is retained as historical evidence only. It must not override the current PC-CURRENT list above.

Historical reports that may contain useful evidence but are not current truth by themselves:

- `reports/PREMIUMCONTROLS_CURRENT_MAIN_INDEPENDENT_VERIFIER_2026-06-27.md`
- `reports/PREMIUMCONTROLS_CURRENT_MAIN_0159DA05_DELTA_VERIFIER_2026-06-27.md`
- `reports/PREMIUMCONTROLS_CURRENT_MAIN_87505F1B_DELTA_TRIAGE_2026-06-27.md`
- `reports/PREMIUMCONTROLS_CURRENT_MAIN_16E1DCCD_DELTA_REVERIFY_2026-06-27.md`

Read them through the current source HEAD `6664056` lens.
