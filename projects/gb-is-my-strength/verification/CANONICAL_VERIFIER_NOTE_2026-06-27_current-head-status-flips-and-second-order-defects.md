# Canonical Verifier Note — current-head status flips and second-order defects

**Project:** gb-is-my-strength
**Evidence date:** 2026-06-27
**Source HEAD checked:** `66640561919501e68dd9d3cd290ff9afe53d3068`
**AuditRepo HEAD before cleanup:** `c3a9ae27df749c09a88650ae0e16e348db61c1c7`
**Verifier mode:** current-head correction / stale-current split / dispatcher cleanup.

---

## 0. Fresh checks from source HEAD

```bash
node -e "console.log(require('./package.json').scripts['dist:jsonld:audit'])"
# node scripts/dist-jsonld-audit.js --root dist

npm run workflows:check
# ✅ Workflow policy passed
```

Implication: the old workflow-policy red finding about `dist:jsonld:audit` not auditing `dist` is **fixed-current / stale-on-current-head**.

---

## 1. Status flips to make now

### SF-1 — Generic “repo/CI/publication is broadly broken” → STALE

The current source has moved beyond the 2026-06-25 instability picture. Keep precise route/control issues; do not use broad-collapse framing.

### SF-2 — `workflows:check` red due `dist:jsonld:audit` → FIXED-CURRENT

Old evidence said:

```text
package.json scripts.dist:jsonld:audit: must audit JSON-LD in dist artifact
```

Fresh source check says `dist:jsonld:audit = node scripts/dist-jsonld-audit.js --root dist` and `workflows:check` passes. Therefore this is not a current repair item.

### SF-3 — Old 2026-06-25 aggregate counts → HISTORICAL / SUPERSEDED

Do not promote “60 confirmed bugs / 9 P0” or old repair-ready status as active truth. Use them only as historical evidence baseline.

### SF-4 — “Gill split-family: part2/part3/spravochnik legacy base” → STALE AS CURRENT PLANNING

Current planning target is v16. Gill still has live debt, but the debt is v16 consolidation, not restoring or repairing legacy `gbs2` as the base.

### SF-5 — “PremiumControls 100% complete” → FALSE-GREEN / SUPERSEDED

Green audits are not completion proof until RomanNumeral, asset refs, CSS sanitation, and Gill mobile current-item behavior are fatal-guarded and verified across source+dist+browser.

---

## 2. Confirmed-current issues after cleanup

| ID | Status | Meaning |
|---|---|---|
| PC-CURRENT-02 | confirmed-current unless fresh reverify closes | RomanNumeral false-green risk; prove `.gb-roman` in built Gill output. |
| PC-CURRENT-03 | confirmed-current unless fresh reverify closes | Unversioned PremiumControls asset refs; add fatal guard. |
| PC-CURRENT-04 | confirmed-current decision item | CSS inventory: `floating-cluster.css` is runtime truth; absent `premium-controls.css` must not be listed as deployed canon. |
| PC-CURRENT-05 | confirmed-current unless fresh reverify closes | Malformed transition fragments / Gill v16 scope leaks. |
| PC-CURRENT-06 | confirmed-current unless fresh reverify closes | Mobile current series item must open part TOC overlay without reload. |
| truth-fragmentation | confirmed-current | AuditRepo/source docs must not teach stale protected truths. |
| source-vs-built discipline | confirmed-current class | Every UI fix needs source, root/static, dist/prod, and browser evidence labels. |

---

## 3. Hermeneutics formula doctrine

Canonical:

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

Forbidden old formula:

```css
right: max(calc((100vw - min(820px, 92vw)) / 2 - 28px), 16px);
```

Classification: **SUPERSEDED / WRONG / POS-01 / NEVER REINTRODUCE**. It may remain only in forensic text with explicit warning labels.

---

## 4. Proposed exact status classes

Use `fixed-current` for:

- `dist:jsonld:audit --root dist` workflow issue on source HEAD checked here.
- broad workflow-policy mismatch tied to that specific script.

Use `stale-on-current-head` for:

- old aggregate bug totals as current truth;
- generic CI collapse framing;
- old Gill legacy-base statements;
- “100% complete” PremiumControls claims.

Use `confirmed-current` for:

- PC-CURRENT-02/03/04/05/06 until fresh reverify closes them;
- dispatcher truth fragmentation;
- source-vs-built evidence discipline.

---

## 5. Current repair order

1. Truth reconciliation / AGENTS §3.10 formula drift.
2. PC-CURRENT-06 Gill mobile current item → part TOC flow + interactive guard.
3. PC-CURRENT-02 RomanNumeral actual integration + fatal rollout audit.
4. PC-CURRENT-03 unversioned asset refs + fatal audit.
5. PC-CURRENT-04 CSS inventory decision.
6. PC-CURRENT-05 malformed transition cleanup + CSS scope leak scan.
7. Controller decomposition / cosmetics only later.

---

## 6. Canonical framing

The current story is not “everything broken” and not “100% complete.” The repository is healthier and v16-based, but PremiumControls/Gill still has specific green-but-incomplete gaps. The next source repair lane should close functional/guard truth in v16, not return to legacy `gbs2` and not start premium visual polish before owner screenshots.
