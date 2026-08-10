# Total surgical audit — current Product state

Date: 2026-08-11
Mode: **fresh live-state / exact-current authority / no Product mutation**
Disposition: **FINAL-ZERO NOT AUTHORIZED**

This pass deliberately re-checks live Product truth instead of trusting historical audit rows, PR descriptions, commit messages or broad workflow conclusions. The Product was moving under an active terminal transaction while the pass ran, so findings are separated into exact-current Product defects, exact-head repair evidence, transactional/control-plane blockers, and measurement-only candidates.

## 1. Final authority observed in this pass

Latest Product `main` observed repeatedly at the end of the pass:

`be8d439aec1e18f268d247967c70a0c318b1dabd` — `chore(terminal): trigger existing direct final proof`.

The earlier intermediate authorities (`bc44fd6`, `fd3bc71`, `1cfe85ad`) are historical within this same audit. Any later Product commit must be re-opened before a MASTER row is closed.

Fresh Product control-plane census at the end of the pass:

- **4 open PRs**: #1598, #1594, #1585, #1584;
- **8 remote branches total**: `main` + 7 non-main;
- current `main@be8d439` still has ordinary release/control-plane failures caused by asset-revision drift;
- temporary terminal workflow helpers are still physically present on the audited main tree.

Therefore current main is not a terminal release authority.

## 2. SSOT reconciliation result

The AuditRepo MASTER started this pass with only V12, V07 and FINAL-ZERO. Fresh current-main inspection proved four additional direct residual roots that the compact MASTER had not yet represented.

The reconciled MASTER now contains:

1. `V12-READER-LINEAR-TEXT-POLLUTION` — P3;
2. `V07-ATLAS-FOCUS-STATE` — P2;
3. `V13-HERM-CHROME-OWNERSHIP` — P2;
4. `V13-SITE-MENU-NATIVE-FAILSAFE` — P3;
5. `V14-SEARCH-SCOPE-TAB-SEMANTICS` — P3;
6. `V14-SW-TOAST-A11Y` — P3;
7. `FINAL-ZERO-AUDIT` — blocked system lane.

Thus the current active count is **7 = 6 direct current defects + 1 system lane**.

No old terminal root was resurrected merely because an old issue, branch or log still exists.

## 3. V12 terminal false-green path — CONFIRMED / BLOCKING

### Exact current-main defect

At `main@be8d439`, `scripts/project-reader-linear-text-to-dist.mjs` still projects metadata by putting the value in a `<meta content="…">` attribute while leaving `data-pagefind-meta` as a plain key.

The already-developed correct repair uses Pagefind attribute capture (`KEY[content]`) and exists on preserved closed-unmerged PR #1568, branch `agent/reader-linear-meta-content-20260810`, head `a796f135a88a9c1a6cbddf03bc5a2c15007c0c6c`.

### Current witness is too weak

The current `reader-linear-text-projection-browser-test.mjs` checks that Pagefind exposes a non-empty image metadata field but does not prove that the original projected Krajne metadata values survived. PR #1568 contains the stronger witness that verifies raw projected specs and all five Krajne fields before and after browser parsing.

### Terminal false-green path

The temporary direct-final transaction says it will close V07 and V12, but the audited terminal payload only materializes the Atlas focus change plus generated revisions before running the weaker current reader witness. It does **not** port the #1568 V12 projector repair and stronger witness.

Therefore a terminal run can become green and write a commit whose message says V12 is closed while the known metadata-capture defect remains. Commit naming is not accepted as closure evidence.

### Required V12 closure

- correct Pagefind attribute-capture semantics in final main;
- original metadata values asserted, not fallback existence;
- Krajne image/author/readTime/category/scripture all preserved;
- Krajne + Hermenevtika + one independent reader owner retain clean semantic text boundaries;
- Chromium + WebKit permanent proof green on exact final main.

## 4. V07 Atlas focus state — CONFIRMED CURRENT / P2

At `main@be8d439`, the remaining focus handoff still selects the close-button object before its fallback in a single expression. If that object exists but cannot accept focus in the current transition state, the fallback is never attempted.

The permanent Atlas contract is now substantially stronger than the original Wave 07 witness: Chromium + WebKit; 390/680/681/980/981/1440; closed drawer/detail semantic hiding; activeElement safety; drawer close/group selection/Escape; detail close/related replacement; List→Graph; history and resize transitions.

A bounded repair exists in the terminal transaction, but at the audited current main it had not yet materialized into `src/runtime/atlas-runtime.js`.

V07 remains open until the actual repair exists on final main and the permanent exact-SHA browser contract passes there.

## 5. V13 Hermenevtika chrome ownership — CONFIRMED CURRENT / P2

Current main simultaneously contains:

- dedicated `HermenevtikaMobileBar` as the mobile/tablet owner through 1199px;
- the generic `SingleArticleCluster` without a Hermenevtika-specific non-rendering rule in the same breakpoint range.

This creates competing control owners below 1200 and leaves the dynamically docked saved-quotes/highlights FAB susceptible to standalone dimensions/offset/animation behavior after docking.

Product PR #1585 contains a bounded repair. Its independent exact-head `Hermenevtika Chromium WebKit chrome contract` succeeded on head `57c4a83df2d70a0977a36633321dfd589cd5bafe`. Retained evidence records 84/84 PASS across Chromium + WebKit, Hermenevtika + `/articles/lot-i-sodom/`, widths 390/412/899/900/1199/1200/1440, ownership, overflow, seeded saved-quotes docking, focus and animation state.

Manual inspection of retained 390/900/1199/1200 screenshots found no obvious clipping or fixed-bar collision on the repaired head.

This proves the repair payload, not current Product closure: #1585 is still a stale-base draft and current main lacks the Product CSS repair.

Detailed report: `verification/2026-08-11-hermenevtika-mobile-chrome-current/REPORT.md`.

## 6. V13 Site Sections Menu native fail-safe — CONFIRMED CURRENT FAIL-SAFE / P3

This is not a reopening of the closed #1558 normal menu-ownership root.

On current main the rich shared menu is semantically marked closed, but the panel/backdrop do not have native `hidden`, and the rich chevron SVG markup lacks native fallback bounds/fill/stroke attributes. `inert` prevents interaction; it does not make a surface non-rendering. The closed rich owner therefore still depends on authored presentation to stay visually absent.

PR #1584 contains the bounded three-file repair: native hidden lifecycle, bounded SVG fallback, runtime fail-safe and registry-derived Chromium/WebKit no-CSS contract.

Its browser job did not run to completion because unrelated branch-level control-plane/generated checks stopped the pipeline first. Therefore the classification is precise:

- current native fail-safe source defect: confirmed;
- normal CSS-loaded production visually broken: not claimed;
- repaired browser lifecycle: must be re-proved on fresh final main.

Detailed report: `verification/2026-08-11-site-menu-native-failsafe-current/REPORT.md`.

## 7. V14 Search scope ARIA/keyboard semantics — CONFIRMED CURRENT A11Y / P3

Current Search exposes the four scope filters (`Все`, `Статьи`, `Ссылки`, `Авторы`) as `role="tablist"` + `role="tab"` controls with `aria-selected`.

But current `js/search.js` does not implement the widget model it advertises:

- no Left/Right scope-tab movement;
- no Home/End scope-tab movement;
- no roving tabindex where only the active tab is the Tab entry point;
- all four native buttons remain ordinary sequential Tab stops;
- no associated tabpanel relationship exists because the controls are actually filters over one result surface.

The existing Chromium/WebKit cold-bootstrap test proves Ctrl/Meta+K, opener/focus and Escape behavior, but does not cover scope-widget semantics.

The terminal repair must either implement a truthful actual Tabs pattern or remove the misleading tab roles and expose the filters as an appropriate single-select control group.

Detailed report: `verification/2026-08-11-search-scope-tab-semantics-current/REPORT.md`.

## 8. V14 Service Worker toast accessibility — CONFIRMED CURRENT A11Y / P3

Current `js/sw-register.js` creates the offline/update notification as a plain `div`.

For passive notices it has no explicit status/live-region semantics. For an update requiring reload it makes the same div visually clickable via class + click listener, but it does not make the action a native button, sequentially focusable command, or Enter/Space-operable widget. `sw-toast.css` only adds pointer styling.

This is an accessibility defect in the notification interaction layer, not a service-worker caching defect.

The correct terminal shape is a real live status owner plus a real reload button (or complete equivalent button semantics) with keyboard operation and cleanup proof in Chromium + WebKit.

Detailed report: `verification/2026-08-11-sw-toast-accessibility-current/REPORT.md`.

## 9. Public route/SEO audit — the suspicious #1584 red was NOT a route defect

The broad #1584 Route Registry Validators issue looked suspicious because its failed step is named `Public surface, sitemap, RSS, SEO and policy mutations`. Exact job-log inspection disproved a route/SEO root.

On exact head `9a8d71a5cbd546b8880072132f1d869d0ae2cf55`, the route/SEO layer passed:

- 84 production Astro routes covered by the effective migration registry;
- 84 route-profile contracts;
- 85 public surfaces represented in the registry;
- 75 indexable sitemap routes;
- 58 canonical RSS items;
- sitemap/feed/search policy consistency;
- 2631 local/internal references valid;
- one H1 per content page;
- no duplicate IDs;
- all images have alt;
- canonical and JSON-LD checks;
- no mixed-content URLs;
- every `_blank` link carries `noopener`;
- user zoom remains allowed;
- reduced-motion coverage exists for timed-motion files;
- SW manifest/precache/source basics passed.

The single failing error was an **audit size ratchet**: `js/glossary.js` measured 12,457 bytes against a 12,000-byte hard cap on that branch.

That hard-cap breach is not promoted to MASTER from this evidence alone because:

- it is a quality/performance ratchet rather than a demonstrated reader-visible failure;
- `js/glossary.js` changed again between #1584 and current main;
- no exact-current `be8d439` audit-pro execution was obtained in this pass.

It remains reverify-before-promotion / budget work.

The previous historical 75-route full-release census remains a useful regression baseline but is **not** falsely presented as exact-current certification: 35 Product commits elapsed between that earlier release authority and this pass, including multiple runtime/chrome/route-owner repairs. Final zero still requires a fresh complete route/build census from the final settled main SHA.

## 10. PWA/cache — no new cache architecture defect proved

Current `sw.js` continues to use the intended network-first behavior for HTML/data and explicit bypasses for Range/audio/video/TTS/model/Vosk-style paths. No current evidence in this pass proved audio/TTS poisoning, broken range behavior or an offline cache root.

Only the SW notification accessibility layer was promoted.

## 11. Search modal closed-state — no new hidden-overlay root proved

Current command-palette CSS keeps the base backdrop non-rendering until open, includes safe-area padding and suppresses the entrance animation under reduced motion. No separate closed-overlay visibility/focus root was proved here.

## 12. Tooltip AT relation — standards-backed risk, held outside MASTER pending AX witness

The canonical article tooltip owner makes glossary/footnote/scripture triggers focusable, tracks `aria-expanded`, and reparents the active popup into a floating body-level owner.

The canonical owner itself does not establish `aria-describedby`/`aria-controls`. Legacy glossary hydration establishes a tooltip relationship for glossary terms, leaving footnote/scripture relation parity uncertain after reparenting.

This is a real programmatic-relationship gap candidate, but this audit does **not** invent an NVDA/VoiceOver failure without an actual AX/AT witness. Obtain Chromium accessibility-tree and practical AT evidence before promotion.

## 13. Narrow-tablet coverage — measurement gap, not defect

Current durable evidence covers:

- Hermenevtika: 390/412/899/900/1199/1200/1440 in Chromium + WebKit on the repair head;
- shared standalone reader layout: 390/768/1199/1200/1280/1366/1440/1920 in Chromium.

The specific 761/800/820/860 cluster lacks equivalent fresh cross-browser geometry/focus/overlap evidence. Missing coverage is not itself a Product bug; keep it measurement-first until a real failure is observed.

## 14. Search/TTS perceived performance — measurement first

No material current latency regression was proved for Search query→first-visible-result or TTS click→first-audible. Existing state-machine contracts are strong but do not measure the missing timing milestones. Do not invent latency budgets.

## 15. Dependency/security signal — not promoted without reachability proof

A stale-base CI install emitted dependency advisories, but this pass did not establish exact current advisory IDs, dependency paths or production reachability. It is not legitimate to convert an npm summary count into a claim of exploitable site vulnerabilities.

The route audit did independently pass its current source security hygiene checks for repository-path leakage/eval, mixed content, `_blank`/noopener and untrusted-source `innerHTML` assignment patterns on the audited branch. This is useful evidence but not a substitute for a current dependency advisory graph.

## 16. Open PR disposition

### #1598 — terminal frozen-scope proof

Still open. It cannot authorize V12 closure because the audited terminal payload omits the known #1568 metadata-capture repair/stronger witness. It also remains affected by generated revision/control-plane turbulence.

### #1594 — Search scripture witness settlement

This is a test/witness correction only; it changes `home-design-audit-pro.mjs` and does not change Product Search/Pagefind runtime behavior. Treat it as CI witness cleanup requiring fresh-main reconciliation, not a direct Product defect.

### #1585 — Hermenevtika chrome ownership

Real Product repair with strong exact-head cross-browser evidence, but stale base. Replay/rebase from settled final main, rerun, merge, then exact-main reverify.

### #1584 — Site menu native fail-safe

Real Product fail-safe repair, but stale base and its browser contract has not yet completed due independent CI blockers. Replay from settled final main and obtain the planned no-CSS Chromium/WebKit witness before merge.

## 17. Branch cemetery — NOT terminal

Fresh remote branch census contains exactly 8 branches:

- `main`;
- `terminal/frozen-final-20260810`;
- `fix/home-search-scripture-settlement-20260811`;
- `lane/system-herm-mobile-chrome-integrity-2026-08-10`;
- `lane/system-site-menu-failsafe-2026-08-10`;
- `agent/reader-linear-meta-content-20260810`;
- `agent/krajne-schema-image-dimensions-20260810`;
- `agent/krajne-schema-image-dimensions-v2-20260810`.

`agent/reader-linear-meta-content-20260810` is **KEEP** until its unique V12 repair and stronger witness are safely ported.

The two older Krajne branches are delete candidates only after explicit unique-tail/diff confirmation because the successful Krajne schema repair later landed through PR #1564/v3. Do not delete from name/age alone.

## 18. CI issue cemetery — NOT terminal

The fresh issue census contains a mixture of:

- current main revision failures (#739/#474/#499);
- #1598 revision failures (#1600/#1599);
- active stale-base #1584/#1585/#1594 identities;
- older main Runtime/Native Source identities;
- issues belonging to merged #1569;
- issues belonging to closed-unmerged #1568;
- issues for an Atlas branch no longer present in the fresh remote branch census.

Open lifecycle issues are evidence; they are not allowed to resurrect solved Product defects. Final zero requires current identities to recover or be explained and retired identities to close as retired/not-planned without falsely claiming recovery.

## 19. AuditRepo SSOT cleanup performed

This pass corrected `WORK_QUEUE.md` so historical Strangler/Lot/Search-owner rows are no longer described as active MASTER work. Optional queue items are explicitly measurement/reverify-only.

Because the surgical pass subsequently discovered four more direct current roots, the active-authority snapshot in `WORK_QUEUE.md` must be kept synchronized with the final reconciled MASTER; the MASTER itself remains authoritative if a snapshot ever drifts.

## 20. Current surgical disposition

### Confirmed direct current Product roots — 6

- `V12-READER-LINEAR-TEXT-POLLUTION` — P3;
- `V07-ATLAS-FOCUS-STATE` — P2;
- `V13-HERM-CHROME-OWNERSHIP` — P2;
- `V13-SITE-MENU-NATIVE-FAILSAFE` — P3;
- `V14-SEARCH-SCOPE-TAB-SEMANTICS` — P3;
- `V14-SW-TOAST-A11Y` — P3.

### System blocker — 1

- `FINAL-ZERO-AUDIT` — blocked until direct repairs, normal CI, PRs, branch cemetery and issue cemetery are terminal.

### Held outside MASTER pending evidence

- 761/800/820/860 cross-browser reader geometry;
- tooltip trigger↔popup AX/AT relation;
- Search first-result latency;
- TTS first-audible latency;
- current glossary bundle budget after exact-current measurement;
- exact current dependency advisory/reachability graph.

## FINAL-ZERO gate

**FAIL / NOT AUTHORIZED.**

Do not reduce MASTER to zero merely because a temporary workflow, broad green label or commit message says the final roots are closed. Re-open the exact final main and prove Product code, permanent tests, full route/build surface, normal CI, open PR count, issue cemetery and branch cemetery from the same final SHA.
