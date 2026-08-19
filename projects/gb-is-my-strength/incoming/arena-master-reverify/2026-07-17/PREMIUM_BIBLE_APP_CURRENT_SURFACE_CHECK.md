# Premium Bible App — current-surface check (no new defect admitted)

## Record

| Field | Value |
|---|---|
| Project | `gb-is-my-strength` / gospod-bog.ru |
| Input type | Raw, bounded current-surface verification input — **not** a MASTER update |
| Auditor | `arena-master-reverify` |
| Auditor local date | 2026-07-17 UTC |
| Product ref inspected | `main` at `cb3681e1a85b5f8919c9dc537f812a842bbe9235` |
| Product commit title | `feat(app): premium Bible App integration across site (#1725)` |
| Parent compared | `dfbb89eca6b2a31462731488aa8ee18400c5ef04` |
| Remote timestamp note | The Product API labels this anchor 2026-08-19T00:30:04Z, which is later than the auditor platform date. The SHA, source, live responses, and API results—not a date-based claim—are the evidence anchors here. |
| Scope | The three files changed by `#1725`: `src/pages/app/index.astro`, `src/pages/index.astro`, and `src/components/article-pilots/genesis6/Genesis6BibleAppChapterCta.astro`; their four live route carriers. |
| Out of scope | Telegram Mini App internals, logged-in Telegram behaviour, browser visual/a11y execution, and unrelated active MASTER rows. |

## Pre-flight / collision check

- Product owner remains `FedorMilovanov/gb-is-my-strength`; no Product mutation was made.
- At inspection, the open Product PRs were `#1721` (Astro CSS in dist-parity guard) and `#1722` (aggregate engine contracts). Neither owns the three selected App files.
- The already-open MASTER has 12 active verified work units at `cb3681e`. This report neither adds to nor rewords that matrix.

## What was checked

### W2 — source / parent-diff witness

The Product API reports that `#1725` changed exactly:

1. `src/pages/app/index.astro`;
2. `src/pages/index.astro`;
3. `src/components/article-pilots/genesis6/Genesis6BibleAppChapterCta.astro`.

Current source uses these exact canonical destinations:

| Surface | Expected start parameter | Source result |
|---|---|---|
| App landing primary CTA | `v1_site_app__home` | Present in `launchUrl` |
| 1 Peter 3 contextual CTA | `v1_site_ch3__chapter3` | Present in the chapter-3 map and landing study card |
| 1 Peter 4 contextual CTA | `v1_site_ch4__chapter4` | Present in the chapter-4 map and landing study card |

The typed CTA map binds chapter `3` to `v1_site_ch3__chapter3` and chapter `4` to `v1_site_ch4__chapter4`; the contextual component is only called with 3/4 by `Genesis6ArticlePage.astro`. New-tab Telegram links in the landing and contextual CTA carriers use `target="_blank" rel="noopener noreferrer"`.

The Home-page change is a route-local visual accent for the already owned `/app/` navigation link. `HomePageChrome.astro` is the carrier for that link in desktop, mobile, and no-JS navigation, so a missing literal CTA in `src/pages/index.astro` alone is **not** treated as an entry-point defect.

### W4 — live HTTP / emitted-page witness

Live requests returned HTTP 200 and the emitted anchors had the expected destinations:

| Live route | Observed carrier | Result |
|---|---|---|
| `https://gospod-bog.ru/app/` | landing launch plus Chapter III and IV study links | all three expected start parameters present; Telegram links retain `noopener noreferrer` |
| `https://gospod-bog.ru/hard-texts/duhi-v-temnice-noi-kreshchenie-pobeda/` | `data-bible-app-chapter="3"` CTA | exact `v1_site_ch3__chapter3`, new-tab protection present |
| `https://gospod-bog.ru/hard-texts/blagovestie-mertvym-1-petra-4-5-6/` | `data-bible-app-chapter="4"` CTA | exact `v1_site_ch4__chapter4`, new-tab protection present |
| `https://gospod-bog.ru/` | Home chrome navigation | `/app/` entry present |

A repeatable semantic probe evaluated 20 assertions across source and these responses: **20/20 passed**. It checks exact start parameters, route availability, emitted anchors, chapter association, home entry, and `target`/`rel` on the selected external links.

### CI / release signal (supporting, not an independent functional witness)

GitHub’s check-runs endpoint for `cb3681e` returned 30 completed check runs, all `success`, `skipped`, or `neutral`; none had a failing conclusion. Relevant successful checks include `Build and validate immutable release candidate`, `Resolve exact successful Pages deployment`, `Home Chromium WebKit contract`, `Runtime Interactive Audit`, `Deterministic source index and dist witness`, and `native-source-contract`.

## Disposition

**No new current bug candidate was found in this bounded Premium Bible App lane.** Source and current emitted/live carriers agree on the three start parameters, the two chapter-specific targets, protected new-tab links, and a Home entry.

Accordingly:

- do **not** add a speculative row to `verified/MASTER_BUG_MATRIX.md`;
- do **not** infer Telegram Mini App runtime correctness from an HTTP link check;
- retain this input as a narrow W2+W4 verification record only.

## Limitations / suitable next witness

This sandbox has no `node`/`npm`, so it did not run a local Astro build, and it has no authenticated Telegram/browser session to verify whether the Mini App consumes each `startapp` payload after launch. If a user reports a wrong in-app chapter or a broken visual/mobile interaction, select that exact carrier and add a browser/runtime or Telegram-side witness before promotion.
