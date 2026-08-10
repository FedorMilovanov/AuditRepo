# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT текущей верифицированной нужной работы `gospod-bog.ru`.** Это рабочая очередь, не архив. Решённое / stale / duplicate / absorbed / invalid / superseded не остаётся активным в MASTER; provenance хранится в `verification/`, GitHub issues/PR и Git history.

Latest current-lane revalidation:
- [`../verification/2026-08-10-wave-12-search-bootstrap-current/REPORT.md`](../verification/2026-08-10-wave-12-search-bootstrap-current/REPORT.md)
- [`../verification/2026-08-10-wave-09-krajne-schema-image-current/REPORT.md`](../verification/2026-08-10-wave-09-krajne-schema-image-current/REPORT.md)
- [`../verification/2026-08-10-wave-11-hardtexts-start-book-current/REPORT.md`](../verification/2026-08-10-wave-11-hardtexts-start-book-current/REPORT.md)
- [`../verification/2026-08-10-wave-11-pagefind-landing-current-index/REPORT.md`](../verification/2026-08-10-wave-11-pagefind-landing-current-index/REPORT.md)
- [`../verification/2026-08-10-wave-11-legacy-mobile-nav-current-runtime/REPORT.md`](../verification/2026-08-10-wave-11-legacy-mobile-nav-current-runtime/REPORT.md)
- [`../verification/2026-08-10-wave-10-reader-speedrail-ssr-focus/REPORT.md`](../verification/2026-08-10-wave-10-reader-speedrail-ssr-focus/REPORT.md)
- [`../verification/2026-08-10-wave-09-konfessii-reduced-motion/REPORT.md`](../verification/2026-08-10-wave-09-konfessii-reduced-motion/REPORT.md)
- [`../verification/2026-08-10-wave-08-mapengine-intro-focus/REPORT.md`](../verification/2026-08-10-wave-08-mapengine-intro-focus/REPORT.md)
- [`../verification/2026-08-10-wave-07-atlas-focus-state/REPORT.md`](../verification/2026-08-10-wave-07-atlas-focus-state/REPORT.md)
- [`../verification/2026-08-10-wave-05-rodosloviye-current-browser/REPORT.md`](../verification/2026-08-10-wave-05-rodosloviye-current-browser/REPORT.md)
- [`../verification/2026-08-10-auditrepo-compact-baseline-repair/REPORT.md`](../verification/2026-08-10-auditrepo-compact-baseline-repair/REPORT.md)

Prior Full-Zero control chain:
- [`../verification/2026-08-10-full-zero-wave-10-post-rewrite-system-abcd-audit/REPORT.md`](../verification/2026-08-10-full-zero-wave-10-post-rewrite-system-abcd-audit/REPORT.md)
- [`../verification/2026-08-10-full-zero-wave-11-dependabot-1538/REPORT.md`](../verification/2026-08-10-full-zero-wave-11-dependabot-1538/REPORT.md)
- [`../verification/2026-08-10-full-zero-wave-11I-non-ci-issue-zeroing/REPORT.md`](../verification/2026-08-10-full-zero-wave-11I-non-ci-issue-zeroing/REPORT.md)
- [`../verification/2026-08-10-full-zero-wave-12B-hermenevtika-final-residual/REPORT.md`](../verification/2026-08-10-full-zero-wave-12B-hermenevtika-final-residual/REPORT.md)
- [`../verification/2026-08-10-full-zero-wave-12C-source-authority-trigger-closure/REPORT.md`](../verification/2026-08-10-full-zero-wave-12C-source-authority-trigger-closure/REPORT.md)

## Current state

| Field | Count |
|---|---:|
| Active work units | 13 |
| Direct current defects | 11 |
| Verified necessary improvements | 0 |
| Narrowed residuals | 0 |
| System verification lanes | 2 |
| Owner decisions | 0 |
| Closed/stale/duplicate/absorbed rows in MASTER | 0 |

Dependabot #1538 is terminal merged-green with residual NONE. The assigned normal non-CI issue family is terminal: #54 and #1244 are closed/completed; #1242, #1243, #298 and #1360 are closed/not-planned after future work preservation. Those completed umbrellas are intentionally absent from active rows below.

## DIRECT CURRENT DEFECTS — 11

| ID | Status | Current evidence | Required terminal outcome |
|---|---|---|---|
| `V12-SEARCH-COLD-BOOTSTRAP` | `CONFIRMED-CURRENT / P2` | `verification/2026-08-10-wave-12-search-bootstrap-current/REPORT.md` | Establish one deterministic search-entry owner so cold `/articles/`, `/biografii/` and `/pastor-series/` expose the appropriate visible/focusable search affordance and `Ctrl/⌘+K` opens the command palette before any prior search click; give Pastor Series a truthful mobile search entry; preserve full-runtime search/focus behavior and add permanent Chromium + WebKit cold-bootstrap guards without stacking competing owners. |
| `V09-KRAJNE-SCHEMA-IMAGE-DIMENSIONS` | `CONFIRMED-CURRENT / P3` | `verification/2026-08-10-wave-09-krajne-schema-image-current/REPORT.md` | Correct Krajne Article JSON-LD so the declared dimensions for `og-krajne-isporcheno.webp` match the current 1200×630 published binary/OG projection, and add a schema/media contract that validates local ImageObject dimensions against actual image headers or one canonical media authority rather than another hardcoded size table. |
| `V11-HARDTEXTS-START-BOOK` | `CONFIRMED-CURRENT / P2` | `verification/2026-08-10-wave-11-hardtexts-start-book-current/REPORT.md` | Align the HardTexts book-start affordance with the canonical first published series item: if it remains labelled `Начать книгу` / `Начать чтение книги`, start at the current `n=0` Prologue; if editorial intent is deliberately Chapter I, label the action truthfully. Derive/compare CTA target and label from current series authority so book-entry semantics cannot silently drift. |
| `V11-PAGEFIND-LANDING-BODY` | `CONFIRMED-CURRENT / P2` | `verification/2026-08-10-wave-11-pagefind-landing-current-index/REPORT.md` | Expand the landing Pagefind-body contract so substantive visible main/card content on Hard Texts, Pastor Series and Biografii is searchable as part of the organizing landing without pulling in unrelated global chrome. Preserve exact hero/title positives and add built-index guards where representative current card terms return both the child article and the organizing landing. |
| `V11-LEGACY-MOBILE-NAV-STATE` | `CONFIRMED-CURRENT / P2` | `verification/2026-08-10-wave-11-legacy-mobile-nav-current-runtime/REPORT.md` | Converge the shared legacy `.h-mobile-nav` owner so its open state remains recognized by the global overlay/scroll-lock authority for its full lifetime, close/Escape restores opener focus when the menu owned focus, and mobile primary navigation has a truthful no-JS fallback. Preserve current-release browser guards on Hard Texts, Pastor Series and Biografii for >3.2s lock retention, focus restoration where applicable and JavaScript-disabled navigation availability. |
| `V10-READER-SPEEDRAIL-SSR-FOCUS` | `CONFIRMED-CURRENT / P2` | `verification/2026-08-10-wave-10-reader-speedrail-ssr-focus/REPORT.md` | Repair the shared ReaderChrome server/pre-hydration speed-rail state so an `aria-hidden` rail never exposes its six speed buttons to sequential focus before runtime activation. Preserve the current hydrated roving-radio behavior, add no-JS/pre-hydration 390px browser witnesses across representative Articles/Hard Texts/Baptists routes, and add a full-family built-output contract preventing hidden speed controls from regressing. |
| `V09-KONFESSII-AUTOMOTION` | `CONFIRMED-CURRENT / P2` | `verification/2026-08-10-wave-09-konfessii-reduced-motion/REPORT.md` | Establish one Konfessii motion policy so non-essential automatic live-card shimmer/pulse and the JS shimmer timer are suppressed under `prefers-reduced-motion: reduce` or otherwise satisfy an equivalent user-control contract. Preserve browser coverage that compares computed/timed behavior under reduced and normal motion preferences. |
| `V08-MAPENGINE-INTRO-FOCUS` | `CONFIRMED-CURRENT / P2` | `verification/2026-08-10-wave-08-mapengine-intro-focus/REPORT.md` | Repair shared MapEngine Intro focus ownership so controls covered by the Intro are not sequentially focusable, focus enters the visible Intro/primary action deterministically, and dismissal lands on a meaningful surviving map owner instead of `BODY`. Preserve narrow-mobile + desktop Chromium/WebKit regression coverage for initial Tab order and dismissal focus. |
| `V07-ATLAS-FOCUS-STATE` | `CONFIRMED-CURRENT / P2` | `verification/2026-08-10-wave-07-atlas-focus-state/REPORT.md` | Repair Atlas focus-state ownership so closed off-canvas drawer/detail controls are not sequentially focusable and every transition that hides/replaces the active element has a deterministic surviving focus destination. Cover drawer close/group selection, detail close/related-node replacement, List→Graph, Escape/history/resize at 390/680/681/1440 with activeElement + hidden/offscreen-region assertions; include WebKit in permanent CI. |
| `V05-ROD-VIEWPORT` | `CONFIRMED-CURRENT / P2` | `verification/2026-08-10-wave-05-rodosloviye-current-browser/REPORT.md` | Repair the genealogy world-coordinate/fit contract so initial load and canonical Fit View expose a meaningful canonical person set on narrow mobile and desktop. Preserve a permanent Chromium + WebKit browser guard that fails when 143 mounted nodes produce an empty useful viewport. |
| `V05-ROD-SPLIT-A11Y` | `CONFIRMED-CURRENT / P2` | `verification/2026-08-10-wave-05-rodosloviye-current-browser/REPORT.md` | Give the full-canvas Matthew/Luke comparison truthful focus/dismissal lifecycle: focus enters the active surface, covered controls are not the next Tab targets, Escape dismisses, and close returns focus to the opener; preserve mobile + desktop Chromium/WebKit keyboard guard. |

## SYSTEM VERIFICATION LANES — 2

| ID | Status | Current evidence | Required terminal outcome |
|---|---|---|---|
| `BRANCH-CI-CEMETERY` | `ACTIVE / PHYSICAL EXECUTION` | `verification/2026-08-10-auditrepo-compact-baseline-repair/REPORT.md` | Physically retire only the reviewed SAFE DELETE refs; re-list absence; terminally disposition associated CI-lifecycle identities; preserve and name any intentional KEEP refs. Classification alone is not closure. |
| `FINAL-ZERO-AUDIT` | `BLOCKED ON BRANCH-CI-CEMETERY` | `verification/2026-08-10-auditrepo-compact-baseline-repair/REPORT.md` | After cemetery execution terminates, run one fresh-main census/audit. PASS only with open PR=0, no unexplained live red, no orphan required work, terminal branch/issue dispositions, current main green and MASTER=0. Then STOP. |

## Execution boundaries

- Do not reopen completed roots without fresh current-main evidence.
- Do not delete branches by name or age alone; require the reviewed successor/tree/unique-tail disposition.
- Do not rerun ancient CI merely to color historical refs green.
- Future/optional work belongs in `WORK_QUEUE.md` or roadmap, not this active defect matrix.
- Current Product HEAD, open PRs, branch census and CI identity are re-read from Product at execution time rather than copied here as durable truth.
- When a lane reaches terminal disposition it leaves this matrix in the same consolidation wave; durable provenance remains in verification/Git history.

## Full-zero Definition of Done

```text
current main green
AND open PR = 0
AND no unexplained intended-to-merge CI red
AND every open issue has terminal disposition
AND every surviving non-main branch is intentionally KEEP
AND every intended-delete branch is actually deleted
AND no orphan release-required unique work
AND future work lives in queue/roadmap instead of bug inventory
AND AuditRepo MASTER active units = 0
→ FULL ZERO
→ STOP
```
