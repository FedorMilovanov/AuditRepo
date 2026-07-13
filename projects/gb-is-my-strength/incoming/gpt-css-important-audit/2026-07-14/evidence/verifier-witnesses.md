# Verifier witnesses — gpt-css-important-audit — 2026-07-14

Independent reproduction on `FedorMilovanov/gb-is-my-strength` @ `bd8cb9a0` (current `main`,
confirmed authoritative via `git ls-remote origin main`). Labels per `verification/VERIFICATION_LEVELS.md`.

## W1 — literal `!important` counts (`verified-source`)

```
$ node -e '…match(/!important\b/g)…'   # identical to audit-pro's /!important/g
css/site.css                   210      # == GPT
css/floating-cluster.css       503      # GPT: NOT confirmed → verifier confirms 503
css/mobile-hotfix.css          142      # == ceiling
css/nagornaya-mobile-toc.css   135      # == ceiling
css/home.css                    34
css/command-palette.css          7
css/enhancements-runtime.css     1
css/highlights-runtime.css       0
css/sw-toast.css                 0
TOTAL (9 files): 1032   (GPT subtotal-without-FC 529 + FC 503)
```

## W2 — active ceilings (`verified-source`)

- `package.json:123` → `node scripts/css-layer-validator.js css/site.css --ceiling=202`
- `scripts/audit-pro.js:85` → `IMPORTANT_CEIL = 200`
- `scripts/audit-pro.js:310-313` ratchet table:
  `site.css` 200/goal 200 · `floating-cluster.css` 524/goal 100 · `mobile-hotfix.css` 142/goal 0 · `nagornaya-mobile-toc.css` 135/goal 50

## W3 — gates fail locally (`verified-build`, plain node, no deps)

```
$ node scripts/css-layer-validator.js css/site.css --ceiling=202
❌ !important count 210 exceeds ceiling 202
⚠️  Only 21.2% of CSS is in @layer blocks (target: ≥80%)
ℹ️  Brace balance: OK
ℹ️  Duplicate selector heuristic skipped for large CSS file (non-blocking)
❌ VALIDATION FAILED — 1 error(s)   exit=1

$ node scripts/audit-pro.js   # exit=1
❌ css/site.css has 210 !important — exceeds ratchet ceiling 200. …
❌ Forbidden JS files in js/: js/nagornaya-bar-extras.js        # ← verifier-new, latent gate #3
✅ css/floating-cluster.css !important within ratchet ceiling: 503 ≤ 524 (goal 100)
✅ css/mobile-hotfix.css !important within ratchet ceiling: 142 ≤ 142 (goal 0)
✅ css/nagornaya-mobile-toc.css !important within ratchet ceiling: 135 ≤ 135 (goal 50)
✅ css/site.css: braces balanced      # grammar defects slip through
```

## W4 — real failing CI on `bd8cb9a0` (`verified-browser`/CI ground truth)

`git ls-remote origin main` = `bd8cb9a0`. Latest runs on that SHA:

| Workflow | Run | Conclusion | Cause (from failed job log) |
|---|---|---|---|
| Deploy to GitHub Pages #1568 | 29281815427 | **failure** | `css:layer:validate` → `!important count 210 exceeds ceiling 202` → exit 1 |
| Metadata & IndexNow Readiness #1330 | 29281815491 | **failure** | Registry: 25 eligible / 20 records → **5 missing** metadata records |
| Visual Parity Guard — pixel-diff #383 | 29281815419 | **failure** | (root cause not in captured tail) |
| Native Source Contract #151 | — | success | — |
| Shared Files Guard #950 | — | success | — |

Deploy log excerpt (run 29281815427, job `deploy`):
```
> node scripts/css-layer-validator.js css/site.css --ceiling=202
❌ !important count 210 exceeds ceiling 202
ℹ️  Brace balance: OK
❌ VALIDATION FAILED — 1 error(s)
##[error]Process completed with exit code 1.
```
Metadata log excerpt (run 29281815491, job `readiness`):
```
Eligible routes: 25
Registry records: 20
❌ Registry check failed (5 error(s)):
  - /articles/dzhon-gill-chast-4-ekzeget/: metadata record missing
  - /articles/chto-bibliya-nazyvaet-serdcem/: metadata record missing
  - /articles/novoe-serdce/: metadata record missing
  - /articles/serdce-i-duh/: metadata record missing
  - /articles/serdce-spravochnik/: metadata record missing
```

## W5 — regression root cause (`verified-source`, git history)

```
$ git log --first-parent -20 bd8cb9a0 -- css/site.css   # !important count per rev
e904670  count=210  2026-07-13  fix: Нагорная проповедь — расширил аудит на istochniki/nakhodki/index
26266ee  count=208  2026-07-13  fix: Нагорная проповедь — аудит статей на всех 5 частях…
b2b42ce  count=200  2026-07-12  refactor(hard-texts): извлечь движок серии
a426e1a  count=200  2026-07-11  exegesis(heart): «Сердце Христа» …
```
`git diff b2b42ce..bd8cb9a0 -- css/site.css`: added `!important`=126, removed=116 → **net +10**.
Added declarations dominated by `transform:none!important` / `transition:none!important` /
`animation:none!important` (reduced-motion) and `color:#000!important` / `background:#fff!important`
(dark/light contrast) → **legitimate WCAG overrides**, category A per report §6. Cannot be blind-deleted.

## W6 — 5 CSS grammar defects, direct pattern-search (`verified-source`)

```
prefers-reduced-motion:reduce){.bottom-bar,.btoc-link,.flip-card-inner,.h-article-card,.quiz-option}   → SYNTAX-001 (no decl block)
.ehrman-block,.info-box,.quote-box}                                                                     → SYNTAX-002 (dangling)
…,.quiz-launch-label,.resume-reading-title,@supports (animation-timeline:scroll())                      → SYNTAX-003 (@rule in selector list)
@media (hover:hover) and (pointer:fine){html.dark }                                                     → DEAD-004 (empty rule)
.gbx-backlinks__maplink:rgba(122,46,46,0.08);gbx-backlinks__maplink:hover{…}                            → SYNTAX-005 (`:rgba(…)` pseudo, `;` in prelude, missing `.`)
```

## W7 — second-order registration drift (`verified-source`, verifier-new)

`js/nagornaya-bar-extras.js` (added `1c41b15`, wired into all 5 `NagornayaChastN PageFooter.astro`
via `<script src="…?v=1" …>`):
- **absent** from `ALLOWED_JS` (`audit-pro.js:52-67`, 14 entries) → «Forbidden JS» hard-fail.
- **absent** from `cache-bust-assets.js ASSETS` → no cache-bust hash, stuck at `?v=1`.
Triple-registration miss = concrete instance of tracked `GATE-MARKER-DATA-DRIFT`.

## W8 — safe-cleanup duplicates (`verified-source`, == GPT)

- `html{scroll-behavior:smooth}` ×2 in `site.css` (Δ!important 0).
- `html.dark body.nagornaya-page .summary-card{border-top-color:rgba(245,213,166,.16)!important}` ×2
  in `nagornaya-mobile-toc.css` → removing one: **135→134** (only mechanically-safe `!important` reduction).
- `var(--color-text,var(--color-text,#1a1a1a))` ×3; `var(--color-text-muted,var(--color-text-muted,#78716c))` ×2.
- empty `@media (hover:hover) and (pointer:fine){html.dark }` (check blame before delete).

## W9 — SSOT drift (`verified-source`, worse than report)

```
$ git cat-file -t b8459bdf
fatal: Not a valid object name b8459bdf          # matrix source HEAD does NOT exist
```
Matrix masthead «Deploy ✅ GREEN — deploy.yml run 29065454930 @ b8459bdf» references a non-existent
SHA; current `main` = `bd8cb9a0` is **RED** (3 failing workflows above). Production is stale.

## W10 — historical rechecks (carry-over refresh)

- **BUG-011:** 57 unique `px` breakpoints across `css/*.css` (matrix: 23); 760/761/768 near-collision cluster present.
- **D-2:** layered = **21.2%** (matrix records 21.9%); only `site.css` validated; dup-selector skipped ≥250k; layer-order not sequence-checked.
- **D-3:** JS total (14 allowed + sw.js) = **469101** > 365000 (matrix: 375041) — `R.warn`, non-blocking.
- **D-4:** audit-pro flags **8** magic z-index (mobile-hotfix ×1 `2102`; floating-cluster ×7: `2102/9999/3000/2147483000×3/2147483100`); matrix line numbers drifted.
