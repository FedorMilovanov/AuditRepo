# Verification: Gill PremiumControls clickability fix branch

## Meta
- Agent: `arena-agent-independent-2`
- Date: 2026-06-25
- Main source HEAD: `03e01a0008de34d654175ea600cdf9f22b2351b4`
- Fix branch: `origin/lane/fix-gill-rail-clickability-premiumcontrols-2026-06-25`
- Fix commit: `8571849`
- Target report: `incoming/arena-agent-2/2026-06-25/premiumcontrols-clickability-fix-2026-06-25.md`
- Evidence: `evidence/gill-premiumcontrols-main-vs-branch-03e01a0-8571849.txt`
- Method: production-like dist + Playwright real click, before/after branch comparison

## Result

Confirmed. The Gill PremiumControls clickability defect is real on current `main` and fixed on branch `8571849`.

## Main branch before fix

Production-like dist built from `03e01a0`:

```text
/articles/dzhon-gill-chast-1-chelovek/        dark false → false
/articles/dzhon-gill-chast-2-uchenyi/         dark false → false
/articles/dzhon-gill-chast-3-nasledie/        dark false → false
/articles/dzhon-gill-spravochnik/             dark false → false
```

The visible desktop theme button receives the click, but the theme state does not change. The DOM has two `[data-fc-controls="gill-rail"]` containers, and the visible one is not initialized.

## Branch after fix

Production-like dist built from `8571849`:

```text
/articles/dzhon-gill-chast-1-chelovek/        dark false → true
/articles/dzhon-gill-chast-2-uchenyi/         dark false → true
/articles/dzhon-gill-chast-3-nasledie/        dark false → true
/articles/dzhon-gill-spravochnik/             dark false → true
```

## Source diff root cause

The branch changes `initGillRail()` from first-match `qs()` to all-matches `qsa()`:

```diff
- var railControls = qs('[data-fc-controls="gill-rail"]');
- if (!railControls) return;
+ var railControlsAll = qsa('[data-fc-controls="gill-rail"]');
+ if (!railControlsAll.length) return;
+ railControlsAll.forEach(function (rail) { initCluster(rail); });
...
- initCluster(railControls);
```

This matches the observed behavior: main initializes only the first hidden rail; branch initializes both hidden and visible rails.

## Recommended status

- Accept branch `lane/fix-gill-rail-clickability-premiumcontrols-2026-06-25` as verified for the Gill desktop theme/search clickability defect.
- Mark the defect `fixed-on-branch`, not `fixed-current-main`, until `8571849` is merged into `main`.
- After merge, rerun the same four-route Playwright smoke on production-like dist.

## Notes

This does not contradict my earlier challenge to “Baptisty GBS2 controls all dead.” Baptisty uses a different GBS2 control path and was browser-verified working on current dist. This report is specifically about Gill rail PremiumControls using `[data-fc-controls="gill-rail"]` and `[data-fc-action="theme"]`.
