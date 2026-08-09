# Lot Scripture-tooltip contract audit — 2026-08-09

## Finding

`LOT-BIBLE-TOOLTIP-01` — **P1 content pre-publication blocker / P2 reader interaction** — `CONFIRMED-CURRENT`.

The accepted Lot article contains many short Scripture references in prose, but the route-local source layer contains no canonical `.bref[data-ref]` markup. The native tooltip runtime does not discover Bible citations from plain text; it only hydrates already-declared `.bref` anchors. This violates the project's explicit new-article content standard rather than merely omitting optional decoration.

## Exact Product anchors

- accepted Lot authoring source: current Product `main@1ef18c6584b00e536674be08a904036cbf9fbc1f` (Lot source blobs unchanged from #1300/#1332 where inspected);
- active publication owner: `#1339@189dfddbeed537c849dd35b1a92578ead894079d`;
- exact publication native tooltip runtime: `src/runtime/article-tooltips.js` on `#1339@189dfdd...`;
- canonical quality policy: `docs/CONTENT-QUALITY-STANDARD.md` §6.5 and §7.

## Normative requirement

`CONTENT-QUALITY-STANDARD.md` §6.5 states a universal Bible-reference rule:

- every Scripture reference in article prose should use the canonical `.bref > .btip` interaction for normal verse/range references;
- 1–18 verses should expose the full text in the tooltip;
- whole-chapter-or-larger references may remain ordinary text;
- New Testament tooltip text uses the Kassian authority and Old Testament tooltip text uses the Synodal authority;
- a **new article is required** to wrap Scripture references in `.bref`, add verified verses to `data/bible/kassian/` or `data/bible/synodal/`, and provide its `bibleRefs` projection;
- the pre-publication checklist repeats the same requirement.

This is stronger than the generic final browser instruction in #1339; the browser witness must verify a required content contract, not merely iterate whatever anchors happen to exist.

## Current Lot source state

The full authoring diff for merged PR #1300 contains **zero `.bref` matches**. Current Lot prose visibly contains many short eligible citations, for example:

- `Быт 11:27–32`;
- `Быт 12:4–5`;
- `Быт 13:1–13` and shorter Genesis 13 references;
- `2 Пет 2:6–9` / `2 Пет 2:7–8`;
- `Иез 16:49–50`;
- `Лк 17:28–32`;
- `Иуд 7`;
- `Матф 1:5`.

The Sources block also explicitly pins short Russian quotations in the article to the Synodal translation. That is not itself a defect, but once the required tooltips are added, New Testament tooltip text still follows the project Kassian authority; where prose quotation wording differs, the tooltip policy requires the translation distinction to be explicit rather than silently mixing texts.

## Runtime trace

`src/runtime/article-tooltips.js` on exact #1339 does **not** parse prose strings such as `Быт 13:10` or `2 Пет 2:7–8`.

Its Scripture path:

1. loads a configured `scripture` object when present;
2. queries `document.querySelectorAll('.bref[data-ref]')`;
3. for each existing anchor, creates a `.btip` child if needed;
4. installs the tooltip controller only when a `.bref[data-ref] .btip` exists.

Therefore plain Lot citations remain plain Lot citations. No later native runtime stage turns them into Bible-reference controls.

`LotPageHead.astro` on #1339 also contains no Lot Scripture tooltip registry/projection in `SITE_CONFIG`; its config covers site/page/features/selectors and quiz only.

## Why the current browser plan is vulnerable to a false green

#1339's remaining browser gate says to exercise “every glossary/footnote/Bible tooltip.” A loop over `document.querySelectorAll('.bref[data-ref]')` can report success with a count of zero unless the Lot-specific witness asserts the expected nonzero Bible-reference contract first.

The route therefore needs a **positive inventory**, not merely interaction checks over existing nodes.

## Correct repair boundary

This belongs to the Lot content/publication integration, using existing shared authority only:

1. identify each prose Scripture reference eligible under §6.5; whole-chapter/very-long citations may remain plain per policy;
2. wrap eligible visible references with canonical `<button class="bref" data-ref="…" type="button">…</button>` markup;
3. source Old Testament tooltip text from verified Synodal data and New Testament tooltip text from verified Kassian data through the existing repository Bible-data authority;
4. expose the route's canonical `bibleRefs`/scripture projection expected by native `article-tooltips.js`; do not hard-code a second verse database in Lot components or runtime;
5. preserve explicit translation labelling when the visible prose quote uses a different translation than the tooltip authority;
6. add a Lot browser contract with a **positive expected reference count** and exercise representative OT + NT references on desktop/mobile, including keyboard/focus, close behavior and viewport containment;
7. test at least one multi-verse range and one single verse;
8. do not add a regex/global text parser or route-specific tooltip JS.

## Ownership / disposition

No new shared tooltip engine is needed. The runtime is behaving according to its declared anchor-based contract; the missing layer is Lot authoring/publication markup + Bible-data projection.

Keep this residual with the active Lot publication/content owner rather than opening a competing shared-runtime lane.

Final disposition: `CONFIRMED-CURRENT`, and because §7 is explicitly a pre-publication checklist, the route should not be called content-complete until this is closed.