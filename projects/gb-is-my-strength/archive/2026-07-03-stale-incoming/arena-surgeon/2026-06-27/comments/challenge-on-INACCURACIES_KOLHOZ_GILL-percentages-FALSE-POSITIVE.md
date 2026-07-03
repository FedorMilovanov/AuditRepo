# Comment on Finding — CHALLENGE (false-positive)

- Target report: `working/RASSINKHRON_SURGICAL_2026-06-27/INACCURACIES_KOLHOZ_GILL_2026-06-27.md` (and sibling `MOBILE_PCT_COLHOZ_DEBT_2026-06-27.md`)
- Target finding ID: §1 "Series Progress Percentages — MAJOR KOLHOZ" (32/58/95 are WRONG, should be 21/26/5)
- Comment type: challenge / false-positive / severity-downgrade
- My audited SHA: `1a288da5` (current origin/main)
- Agent: arena-surgeon

## Summary

The fellow-agent report claims the Gill series-progress ring shows **wrong** percentages (hardcoded 32% / 58% / 95%) and that the "correct" values should be 21% / 26% / 5% (derived as each part's own share of total minutes). **This is a false-positive based on the wrong metric.** The hardcoded values are the **correct cumulative `done-min/total` floor** (progress completed before the current part), and they match the live JS animation contract exactly. "Fixing" 32→21 would **break** the progress ring (it would jump to a value the JS then animates away from).

## Evidence (current HEAD `1a288da5`)

### 1. The body carries the data hooks (JS source of truth)

`src/pages/articles/dzhon-gill-chast-2-uchenyi/index.astro:11`:
```html
<body class="gbs-world" data-gbs2-series="dzhon-gill"
      data-gbs2-done-min="48" data-gbs2-part-min="39" data-gbs2-total-min="149">
```

All 5 Gill pages carry consistent hooks (verified):
| Route (series ordinal) | done-min | part-min | total | floor = done/total |
|---|---|---|---|---|
| istoricheskiy-kontekst (I)  | 0   | 16 | 149 | **0%** |
| chast-1 (II)                | 16  | 32 | 149 | **11%** |
| chast-2 (III)               | 48  | 39 | 149 | **32%** |
| chast-3 (IV)                | 87  | 54 | 149 | **58%** |
| spravochnik (V)             | 141 | 8  | 149 | **95%** |

→ These floors (0/11/32/58/95) **exactly equal** the hardcoded `gbs2Pct`/`gbs2MobPct` text in every chrome.

### 2. The JS computes the SAME value from the hooks

`js/enhancements.js` (GBS pilot v2):
```js
var partMin = Number(document.body.getAttribute("data-gbs2-part-min")||16);
var totalMin = Number(document.body.getAttribute("data-gbs2-total-min")||89);
// ...
seriesPc = Math.round(((doneMin + (pc*partMin/100)) / Math.max(1,totalMin)) * 100);
ring.style.strokeDashoffset = String(113 - 113*seriesPc/100);
pctEl.textContent = seriesPc + "%";
```
At page-load (scroll `pc=0`): `seriesPc = doneMin/total` = the same floor. The hardcoded text is the **pre-hydration / no-JS fallback** that JS replaces with an identical-or-higher value as you read. This is intentional design (AGENTS §9.11 GBS invariants: `data-gbs2-done-min` = "сумма минут предыдущих частей"), not kolhoz.

### 3. The fellow-agent's "correct" 21/26/5 is the wrong metric

`32/149=21%` is **this part's own reading-time share** (part-min/total), not progress. A series-progress ring showing "21%" on the part you are currently *on* would mean "you have made no progress" even mid-read — semantically wrong and contradicting the "Прогресс серии" label. The correct metric for a journey ring is cumulative `done-min/total`.

### 4. dashoffset math also confirms the value is right

part2 ring: `stroke-dasharray="113" stroke-dashoffset="77"`. circumference `2π·18=113.1`. For 32%: `113·(1−0.32)=76.8≈77`. ✓ internally consistent.

### 5. The chapter-count "1/16 inflated" claim is also not a bug

`gbs2Count` is statically seeded but **rebuilt by JS** from actual rendered `h2[id]` (`build()` → `count.textContent=tp+"/"+tt` where `tt`=H2 count). The static `1 / N` is a pre-hydration flash only; JS corrects it on load. At worst a transient FOUC, never a wrong steady-state value.

## The ONE valid kernel in the report

The fellow-agent's *secondary* observation is legitimate and worth keeping as a **low-priority hygiene debt**, not a P1 data bug: the floor values are *also* statically duplicated in the chrome HTML even though they are derivable from the body hooks. This is harmless redundancy (JS owns the live value; static is no-JS fallback), but it means a reading-time change requires touching the body hooks AND the static text. A future `SeriesProgress.astro` that reads the hooks and emits the floor would remove the duplication — but the **values are already correct**, so this is cleanup, not a fix.

## Recommended action

- **Move §1 of INACCURACIES_KOLHOZ_GILL to false-positive** for the percentage values. Do NOT change 32/58/95 → 21/26/5 anywhere — that is a regression.
- Downgrade the chapter-count item to "pre-hydration flash, low priority".
- Keep only the "hardcoded floor duplicates body hooks → consolidate via SeriesProgress component" as a low-priority hygiene note.
- Add a guard so a future agent cannot "correct" cumulative→part-share: assert `rendered gbs2Pct == round(done-min/total*100)` in the Gill visual-parity or rollout audit.

## Why this matters

A weak implementation agent reading the original report would "fix" correct numbers to wrong ones and break the series-progress UX on all 5 Gill pages. This is exactly the multi-witness challenge the AuditRepo ladder is for (L1→ false-positive on current HEAD).
