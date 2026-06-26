# Evidence — PremiumControls unmerged branch matrix

- Date: `2026-06-26`
- Agent: `arena-agent-premiumcontrols-rollout-verifier`
- main HEAD: `09c2d34aedf3d0a29e19298ffa886e60fea02b87`
- Method: full-history clone + explicit refspec fetch + `git diff --stat` + tree-hash comparison

All commands reproducible against `FedorMilovanov/gb-is-my-strength`.

## 1. Branch inventory (ls-remote)

```
099afce441eb293b4e1e9174521514cf1ec0f6db  lane/premiumcontrols-heart-series-wiring-2026-06-26
71ea9b10e9e0289540f4e53d7161f7b0b510de73  lane/premiumcontrols-playember-semantics-2026-06-26
39d1f10bdb1520821c106be009a94109bd443926  lane/premiumcontrols-rollout-audit-2026-06-26
e20410420a0cec24d82c3be3dfcf36fc9e50425a  lane/system-premiumcontrols-hardening-2026-06-26-arena
09c2d34aedf3d0a29e19298ffa886e60fea02b87  main
```

## 2. Per-branch matrix (all `diverged` from main; none is ancestor of another)

| Branch (short) | Tip | Fork-point vs main | Behind main? | diff vs main (lines) | Commit subject |
|---|---|---|---|---|---|
| heart-series-wiring | `099afce4` | `106f98d9` | **yes, 2 commits** | 228 | wire dead Play/Save on heart-series articles (PC-002) |
| playember-semantics | `71ea9b10` | `106f98d9` | **yes, 2 commits** | 1462 | normalize PlayEmber semantics + canonical audio rate key (PC-005) |
| rollout-audit | `39d1f10b` | `09c2d34a` | no | 272 | add PC-004 no-double-CSS-delivery invariant + document PC-001/PC-004 |
| system-hardening | `e2041042` | `09c2d34a` | no | 2708 | close BUG-A7/A9/B6/S6 + cleanup dead JS modules |

Repro:
```bash
git fetch origin "refs/heads/lane/<b>:refs/remotes/origin/lane/<b>"
git merge-base --is-ancestor refs/remotes/origin/lane/<b> main && echo IN-main || echo diverged
git diff main refs/remotes/origin/lane/<b> | wc -l
```

## 3. Stacking dependency (graph)

```
main 09c2d34
 ├── rollout-audit 39d1f10            (from main)
 ├── system-hardening e204104 → debf403 (from main; self-claims "Phase 1-2")
 │
 └── 106f98d (stale: 2 behind main)
      ├── heart-series 099afce        (from 106f98d)
      └── system-cache-bust e7724a7   (from 106f98d)
           └── playember 71ea9b10     (STACKED on cache-bust, which is itself unmerged)
```
Conclusion: `playember` is not independently mergeable until `system-cache-bust` merges.

## 4. Conflict map (files touched by ≥2 branches)

| File | heart-series | playember | rollout-audit | system-hardening |
|---|---|---|---|---|
| `js/floating-cluster-controller.js` | — | +56 | — | +202 |
| `src/components/article-pilots/krajne/KrajneBody.astro` | edit | — | edit (same line) | — |
| `src/components/article-pilots/rimlyanam7/Rimlyanam7Body.astro` | edit | — | edit (same line) | — |
| `articles/**/index.html` (~10) | — | each ±1 | — | each ±3-5 |
| `baptisty-rossii/**/index.html` (11) | — | each ±1 | — | each ±32 |
| `nagornaya/**/index.html` (5) | — | each ±1 | — | — |
| `scripts/cache-bust.js` | — | +67 | — | (touches deploy/gitignore) |
| `css/floating-cluster.css` | — | — | — | +49 |
| `docs/refactor-2026/lanes/system-release-gate-green-2026-06-26.md` | **DELETED** | **DELETED** | — | — |

→ Merging any two of {heart-series, rollout-audit} conflicts on the heart-series bodies. Merging {playember, system-hardening} conflicts on the controller + ~20 dist HTML files. Both heart-series & playember delete the same lane `.md`.

## 5. Architectural-core presence check (across all 4 branches)

```bash
for b in premiumcontrols-heart-series-wiring-2026-06-26 \
         premiumcontrols-playember-semantics-2026-06-26 \
         premiumcontrols-rollout-audit-2026-06-26 \
         system-premiumcontrols-hardening-2026-06-26-arena; do
  git grep -c "PremiumControlAnchor\|premium-control-anchor\|data-pc-anchor" \
    refs/remotes/origin/lane/$b -- 'src/'
done
# → 0 / 0 / 0 / 0
git show refs/remotes/origin/lane/<each>:src/styles/premium-controls.css
# → fatal: path ... does not exist   (all four)
```
Conclusion: the plan's anchor primitive and canonical CSS exist in **no** branch.

## 6. Mode-enum defect evidence (PC-ROLL-02)

Branch heart-series markup:
```
data-fc-mode="series-rich"  data-fc-variant="heart"
```
Controller on main (lines 434–437 of `js/floating-cluster-controller.js`):
```
var mode = root.getAttribute('data-fc-mode') || 'single';
if (mode === 'single') activateSinglePilot();
if (mode === 'series-lite') activateSeriesPilot();
if (mode === 'nagornaya') activateSinglePilot();
```
`series-rich` matches none → pilot activation skipped.

Plan enum (page 7): `single | series-lite | gill | disabled`.

## 7. Dist-vs-branch inconsistency on heart-series

- Committed `dist` HTML (`articles/krajne-…/index.html`, on main) wires the heart-series foot as:
  `data-fc-controls="gill-rail" data-fc-variant="heart"`
- Branch `heart-series` wires the SAME two routes (in source) as:
  `data-fc-root data-fc-mode="series-rich" data-fc-variant="heart"`
→ Two different, incompatible wiring strategies for the identical routes. Any merge must pick one and propagate to both source and dist.

## 8. False-positive guard for this evidence

- The empty `git diff` results seen on a `--depth 1` clone are a **shallow-clone artifact**, NOT evidence that branches equal main. Definitive comparison requires full history (`git fetch --unshallow`) + explicit refspec fetch. This is documented here so a future verifier does not re-derive the wrong conclusion.
