# Third pass — step-count correction, MASTER anchor sweep, dateline class disposition (2026-09-30)

## Identity
- Project: gb-is-my-strength
- Agent: arena-incompleteness-auditor
- Date: 2026-09-30
- Audited anchor: Product main `d586aa63f02b569cfe050a63cc9078c044375d8d` (`package.json` blob `812497795d8a3c5c7a2beb6224b2f9492354dfdf`, identical via contents API and local clone) and live release `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b` (run `35927303479`)
- Evidence tier: verified-source at both SHAs; verified-artifact for two local `strangler:build:production-like` builds (both exit 0); verified-lifecycle for GitHub refs, PR heads and CI rollups; live HTTP text retrieval for ordinary element text only. **No browser assertion** — no Chromium could be installed in this sandbox.
- AuditRepo base: `054c9c1b1a74f20ead716b835a2f618270dfb78b`, branch `arena/01a0f435-auditrepo`
- Supersedes: the step count in [`RELEASE_GATE_AND_BAPTIST_TRACE.md`](./RELEASE_GATE_AND_BAPTIST_TRACE.md) §2 and in [`../../../reverify/2026-09-30-release-block-and-baptist-provenance.md`](../../../reverify/2026-09-30-release-block-and-baptist-provenance.md) §2 (both corrected in place with a marker); the live byline-label column of the same trace, which this pass shows is not obtainable with the retrieval tool used.
- Authoritative analysis: [`../../../reverify/2026-09-30-step-count-correction-and-dateline-projection.md`](../../../reverify/2026-09-30-step-count-correction-and-dateline-projection.md)

## 1. Scope taken and scope deliberately not taken

Taken: the step-count factual slip; a full source-anchor currency sweep of the 25 current defects
and 2 system lanes; the Baptist direction (status of owner action only — no `????` text was
restored or guessed); adjudication of the open Product PR rollups at their exact heads; a fresh
branch census; one previously unrecorded dateline class, investigated to disposition.

**Not taken (owner instruction of 2026-09-30):** the Lawson release-block decision. Another
owner-directed effort is handling Lawson, so this pass measures that lane and preserves its
receipts but performs no Lawson work, files no Lawson row and proposes no Lawson disposition.
PR #2145 (apostasy) belongs to another agent and was not taken, edited, closed or merged.

## 2. Step count recomputed (the correction the owner asked for)

Counting rule: split the `validate:static-publication` script string on `&&` and count top-level
commands; nested `npm run` scripts are **not** expanded (that is what CI runs — `deploy.yml:148`
executes the same string as one chain).

| measurement | value |
| --- | --- |
| top-level commands | **41** |
| exit 0 when run one by one | **40** |
| failing | **1** — command **#24** `node scripts/audit-pro.js` |
| its only error | `sitemap contract: missing canonical indexable production route: /articles/steven-lawson-samoobman-i-publichnyy-golos/` |
| consequence in CI | the chain stops at #24, so #25–41 never run on a main push |

The step figure written earlier the same day does not match the script at this head; it is
withdrawn and is not repeated in any document touched by this pass. Enumerated receipt:
[`../../../reverify/evidence/2026-09-30-validate-static-publication-command-list.txt`](../../../reverify/evidence/2026-09-30-validate-static-publication-command-list.txt);
step-by-step exit codes:
[`../../../reverify/evidence/2026-09-30-release-block-repro-receipt.txt`](../../../reverify/evidence/2026-09-30-release-block-repro-receipt.txt).
Both replace receipts that previously existed only in `/tmp` and were lost with the session.

## 3. MASTER anchor currency sweep — 0 rows closed, 0 rows newly fixed

All 26 source anchors of the active MASTER were re-checked at `d586aa63`: **24 confirmed verbatim**;
two rows quote an expression that no longer matches the source, while the defect itself is
unchanged and stays current:

- `GBS-THEME-TOGGLE-FOCUS-INDICATOR-MISSING` — the focusable target is
  `body.home-page .mobile-controls > button:focus-visible`; `css/mobile-hotfix.css:12` carries
  `outline:0 !important`; the sheet is loaded from `src/components/landing/HomePageHead.astro:158`.
- `GBS-H-SCROLL-TOP-INVISIBLE-FOCUS` — the reveal test is
  `(window.scrollY || window.pageYOffset) > 500` in `js/site.js`.

`GBS-HEADER-SEARCH-TRIGGER-NOT-WIRED` was re-derived rather than assumed: `src/components/ui/Header.astro:31`
renders `#hCpBtnNav` with no listener in any eagerly loaded path; the only binding lives in
`js/search.js` (`Se()` renames the node to `gbSearchBtn` and attaches the handlers, and the
`Ctrl/⌘+K` keydown exists only there), while `src/layouts/BaseLayout.astro` loads `search.js` on
demand through its inline `__gbSearchSrc` bootstrap. Built `/izbrannoe/`, `/hard-texts/genesis-6/`
and `/articles/` contain the inline bootstrap, no eager `<script src=…search.js>` and no inline
keydown — the row stays current.

Receipt: [`../../../reverify/evidence/2026-09-30-master-source-anchor-currency.txt`](../../../reverify/evidence/2026-09-30-master-source-anchor-currency.txt) (+`.json`).

## 4. Direction 1 (Baptist): status of owner action, no text invented

- `????` copy loss (`GBS-BAPTISTS-VISIBLE-COPY-QUESTION-MARK-LOSS`): **not repaired on either
  head**. Source counts at main are unchanged (Spravochnik 481 … DvaSezda 88) and, measured for the
  first time on built artifacts, the built pages of main `d586aa63` and of the live SHA `d0e04a9c`
  carry **identical** counts per route (506 / 471 / 314 / 239 / 183 / 135 / 124 / 105 / 91, hub and
  `sovetskaya-noch` 0). Live `/baptisty-rossii/spravochnik/` renders the damaged cards verbatim
  today, including inside link text (`03 ????? **????????? ???????? ? SHA-256**`) — a fresh live
  witness for ordinary text. No owner-approved original for these strings exists in the repository,
  so nothing was restored or guessed.
- Byline dates (`GBS-BAPTISTS-BYLINE-PUBLICATION-DATE-DIVERGENCE`): **narrowed, not extended**. At
  main the residual is five routes whose only dateline sits in the publication slot while its label
  names the editorial update day; four repaired routes plus `peterburgskaya-liniya` show the correct
  two-slot shape. At the live SHA all nine article routes still render the single pre-repair label,
  so the four repairs (`11a69e94`, `87f659d4`, `7665a64a`, `37171903`) exist on main only while the
  release is blocked. `projectVisibleDateline` rewrites the `datetime` **attribute only** and never
  the label text, so no projection can close this row — it is component authoring plus one owner
  choice (`spravochnik`: «14 июня» authored in `b051fd76` vs registry `publishedAt` 2026-06-10).
- Receipt: [`../../../reverify/evidence/2026-09-30-baptist-dates-main-vs-live-sha.txt`](../../../reverify/evidence/2026-09-30-baptist-dates-main-vs-live-sha.txt).

## 5. Dateline class investigated: one candidate rejected, one narrow row admitted

**Rejected (recorded as a negative boundary so it is never re-filed).** A scan of the built artifact
flagged 17 routes where the human label and the `datetime` name different days. That is the
owner-approved *exact-instant reconciliation* of 2026-09-08: seven
`data/editorial-metadata-review-decisions/*-reconciliation-20260908.json` files set
`reviewStatus: approved` with provenance ending `…exact-instant-owner-approved-2026-09-08`; only
approved records are projected; `scripts/lib/editorial-metadata-v3.js` rewrites the attribute and
never the label; and `scripts/editorial-metadata-v3-approval-gate-test.js:102` pins the shipped
shape `<time class="article-updated" datetime="2026-07-05T09:14:15.000Z">9 мая 2026</time>`.
Base-registry `inconsistent-needs-review` values are frozen `from` history, not effective state.
Filing the class would have converted an approved owner decision into 17 defects.

**Admitted (new MASTER row `GBS-NAGORNAYA-PUBLISHED-DATELINE-CARRIES-MODIFIED-INSTANT`).** Five
Nagornaya chapters author `<p class="article-updated …">Опубликовано: <time datetime="2026-05-01">1 мая 2026</time></p>`
(`NagornayaChast{1..5}MainShell.astro` + `…SectionSummary.astro`, 10 files). Because the projector
keys on that class, the built page carries the approved **modification** instant
(`2026-07-22T21:48:34.000Z` chast-1/2/4, `2026-07-05T18:09:08.000Z` chast-3,
`2026-07-22T11:13:44.000Z` chast-5) on a sentence that says "published", while the same page's
JSON-LD `datePublished` and `article:published_time` say `2026-04-30T21:00:00.000Z`. Reproduced on
builds of **both** main and the live SHA. Control: `/articles/kod-da-vinchi/`, whose
`article-updated` label *is* the modified date. No gate covers it
(`scripts/editorial-dateline-contract-test.js` governs `class="editorial-dateline"` only). If the
owner judges the wording intentional, the disposition is accepted-risk and the row leaves MASTER.

Guard gap retained for the class: no check asserts that the projected field matches the dateline's
own wording, and none asserts published-slot label ↔ `publishedAt` agreement.

## 6. Direction 3 — open Product PRs at their exact heads

Receipt: [`../../../reverify/evidence/2026-09-30-pr-gates-by-head.txt`](../../../reverify/evidence/2026-09-30-pr-gates-by-head.txt).

| PR | head | behind main | red checks | this pass |
| --- | --- | --- | --- | --- |
| #2153 docs-only | `c671491f` | 20 | none at this head | not gate evidence; contains no repair |
| #2150 Lawson catalog | `89e76794` | 37 | 11 | **stand-down**; keep open, not a release fix |
| #2145 apostasy | `994b8735` | 24 | 4 | other agent's lane — untouched |
| #2144 Dependabot | `892977fd` | 4 | 20 | needs rebase/refresh; not mergeable while the gate is red |
| #2143 genealogy (draft) | `acd4ace4` | 6 | none at this head | needs current-base resulting diff before promotion |
| #2142 Baptist Ch.1 salvage | `71a4f529` | 6 | none at this head | research-only |

No Product PR was merged, closed, edited or rebased. A green AuditRepo PR is not a reason to merge
any Product PR. Branch census: **37 total / 36 non-main**
([receipt](../../../reverify/evidence/2026-09-30-branch-census.txt)), superseding 36/35, 44/43 and
205/204 recorded earlier the same day.

## 7. Honest boundary of this pass

1. **No browser ran.** `npx playwright install chromium` fails with `ECONNRESET` and no system
   Chrome exists here. Rows needing rendering (contrast, focus visibility, forced colors, touch)
   keep their earlier browser receipts; none was promoted to browser-verified in this pass.
2. **Live `<time>` labels are not witnessable with the retrieval tool used earlier.** Control-proven:
   live `/articles/kod-da-vinchi/` yields only the two hidden `data-pagefind-meta` instants and
   neither human label, although the built artifact of the live SHA contains
   `<time datetime="2026-03-31T21:00:00.000Z">1 апреля 2026</time>` and
   `<time class="article-updated" datetime="2026-07-05T09:14:15.000Z">9 мая 2026</time>`. Any
   earlier "live shows «13/14 июня»" statement is therefore method-unsupported and is replaced here
   by exact-SHA artifact witnesses. Receipt:
   [`../../../reverify/evidence/2026-09-30-live-fetch-time-element-boundary.txt`](../../../reverify/evidence/2026-09-30-live-fetch-time-element-boundary.txt).
3. **Deployed bytes were not re-downloaded** (Pages artifact egress unavailable here), so live-SHA
   statements mean "what the live release SHA builds to with the sanctioned production pipeline",
   corroborated by the hidden spans retrieved from the live site matching that build byte for byte
   on three routes. Positive fact obtained live: the release already carries the 2026-09-08 approved
   exact instants (e.g. spravochnik `modifiedTime 2026-08-20T11:04:03.000Z`).
4. Local node is v22.22.3 while CI pins 22.23.1; the two builds and the 41-command run are local
   receipts, not CI runs.

## 8. What changed in AuditRepo because of this pass

- `verified/MASTER_BUG_MATRIX.md`: step count corrected; 25 → **26** current defects (29 work units);
  one new row; the Baptist byline row narrowed with both-SHA artifact evidence; two anchor
  expressions made precise; the owner-decision row refreshed with six PR heads; the SYS-STRICT lane
  given its step count and lane-collision/stand-down note; one negative boundary added.
- `PROGRAM_CLOSURE_MATRIX.md`: step count corrected; Wave 5B artifact measurement; Wave 8 census
  37/36 and PR rollups; dated third-pass note.
- `reverify/2026-09-30-step-count-correction-and-dateline-projection.md` + ten receipts in
  `reverify/evidence/`.
- `reverify/2026-09-30-release-block-and-baptist-provenance.md` and
  `incoming/…/2026-09-30/RELEASE_GATE_AND_BAPTIST_TRACE.md`: step count corrected in place with a
  marker; the `/tmp` receipt references replaced by preserved in-repo receipts.
- `verified/CLOSURE_LEDGER.md`: two entries (correction + rejected candidate; admitted row).
- No Product code was changed. No closure was claimed for the release block.
