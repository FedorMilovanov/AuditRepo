# Rating source authority and portrait provenance — current audit

Date: 2026-08-12  
Product: `FedorMilovanov/TheLegendaryPoet`  
Audited source: `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`  
Scope: legacy/editorial rating semantics versus reader-community rating, ranking tie-break ownership, catalog/detail source labels, and bounded recheck of canonical poet portrait provenance.

## Current-source / collision check

The Product source anchor remains `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`. Targeted open Product issue/PR search found no matching owner for the editorial-vs-reader rating source defect.

Product #270 remains the current owner for longform visual provenance and explicitly requires `archive | document | restoration | reconstruction` classification for production longform visuals. That issue does not establish provenance for the separate canonical `/images/<poet>.jpg` portrait family and is not treated as an implementation owner for the rating finding below.

## Result

One new independent current P2 root is confirmed:

- `TLP-RATING-SOURCE-001` — editorial and reader ratings have separate intended meanings/scales, but several surfaces lose that provenance and the default reader-ranking order can silently use editorial score as a fallback authority.

The canonical poet portrait model is also rechecked. It has a real provenance-schema gap, but the currently available source/issue evidence does not prove that the deployed `/images/<poet>.jpg` assets are editorial/AI reconstructions. No portrait mislabeling bug is promoted from this wave without that provenance witness.

---

## Finding A — `TLP-RATING-SOURCE-001`

Severity: **P2**  
Status: **CONFIRMED-CURRENT / DATA-PRESENTATION / SOURCE-AUTHORITY**

### Two distinct rating systems are current Product concepts

The canonical `Poet` model contains a static `rating` number. Current values are on the legacy/editorial ten-point scale; for example the current Sergei Yesenin record stores `rating: 9.5`.

`RatingsPage` explicitly establishes the meaning of that field:

- sort option: `Оценка редакции`;
- table column: `Редакция`;
- rendered value: `row.poet.rating.toFixed(1) / 10`.

The same page independently defines the reader/community system:

- page title/copy: `Живой читательский рейтинг`, `Поэты в оценке читателей`;
- reader aggregate is on `/5`;
- table columns separate `Индекс читателей`, `Средний балл`, votes/comments and `Редакция`;
- method copy says: `Редакционная оценка отображается отдельно и не подменяет мнение читателей.`

The Product therefore has two valid sources with different owners and scales: static editorial `/10` and community reader `/5`.

### Manifestation 1 — catalog/detail badges erase the source and scale

`PoetCard` renders `poet.rating` as a gold Star plus the bare number, with no `Редакция` label and no `/10` scale. The same card also renders `FeedbackMiniSummary`, which uses another Star plus the reader `overall` score and vote count.

A reader can therefore see two star scores on one card with no explicit source distinction. Their scales are different, but only the dedicated `/ratings` page explains that.

`InfoCard` repeats the static editorial score in the poet dossier as another unlabeled gold Star + number.

`PoemCard` likewise renders the canonical static `poem.rating` as a bare gold Star and later mounts a reader `CommunityPanel` for the same poem. The exact ownership of the legacy poem score is not separately documented in the reviewed type, so this wave does not overstate it as `editorial`; the verified problem is still the same: one static score and one reader score coexist without explicit source/scale labels on the reader surface.

### Manifestation 2 — editorial rating silently breaks ties in the default reader ranking

The default `reader` sort is not purely reader-owned. Its comparator is effectively:

1. descending `readerScore`;
2. descending reader vote count;
3. descending `poet.rating` (editorial score);
4. name/id fallback.

Because unrated poets remain in the default table, every row with `readerScore === null` and `votes === 0` is ordered by the static editorial rating. The UI still assigns those rows numbered `Место` positions on a page titled as a reader ranking.

The same editorial fallback also decides any exact reader-score/vote tie among rated poets.

This contradicts the page's source-separation model at the ranking-authority level: editorial score is described as displayed separately, yet it can determine visible reader-ranking position without being named as a tie-break rule.

### Why this is one root

The unlabeled card badges and hidden ranking tie-break share one mechanism: the static score's **source authority is not carried with the value**. Some consumers know `poet.rating` means editorial `/10`; others treat it as a generic Star score, and the reader-sort comparator can consume it without reader-facing disclosure.

Creating one row for labels and another for sorting would duplicate the same missing source contract.

### User impact

- a 9.x editorial score and a ~4.x reader score can look like competing values of the same metric;
- a reader may interpret a static badge as community sentiment;
- a poet with no reader votes can still receive a higher displayed `Место` because editors assigned a higher legacy score;
- `/ratings` methodology and catalog/detail presentation do not tell the same story about who owns the score.

### Required terminal outcome

1. Make rating source and scale explicit in the model/presentation contract rather than passing a bare `number` through generic Star UI.
2. On poet catalog/detail, label static values as `Редакция` / `/10`, or retire the legacy badge where it adds no reader value.
3. Label any static poem score with its actual owner/scale or remove it if no defensible current source contract exists.
4. Make default reader-ranking position depend only on reader-owned inputs. Use deterministic neutral fields such as name/id for exact reader ties unless an explicitly disclosed tie-break policy is selected.
5. Decide how unrated poets are presented: unranked (`—`) or in a separate `Нет голосов` tail, rather than editorially ordered numbered reader positions.
6. Add permanent tests proving:
   - card/detail static and reader scores expose distinct accessible labels/scales;
   - two zero-vote poets cannot change reader `Место` when only editorial rating changes;
   - exact reader ties remain reader-neutral unless a documented rule says otherwise.

---

## Portrait provenance recheck — schema gap, no current defect row yet

### What current source proves

`Poet` has:

- `photo: string`;
- optional `coverImage`;
- no portrait `kind`, `source`, `credit`, rights or reconstruction metadata.

Canonical records use paths such as `/images/yesenin.jpg`.

`PoetCard`, poet `HeroSection`, `PoetDetailPage` SEO and Person JSON-LD present that asset generically as the poet's portrait/image. There is no reader-visible provenance label at those consumers.

### What current evidence does **not** yet prove

The available current source and issue searches do not establish that the exact deployed canonical `/images/<poet>.jpg` files are AI-generated/editorial reconstructions rather than sourced/restored historical portrait assets.

Product #270 gives a strong policy for longform visuals — including the rule that a neural reconstruction must be marked `reconstruction` — but it does not retroactively classify the canonical poet portrait family.

Therefore this wave does **not** assert `AI portrait masquerading as archive` and does not add a MASTER row from absence of metadata alone.

### Future trigger

Promote a portrait provenance root only if one of these becomes available:

- exact asset-generation history proving a current canonical portrait is generated/reconstructed;
- source/object evidence proving the UI's generic portrait presentation materially misstates provenance;
- an owner-selected requirement that every canonical portrait must have source/rights/kind metadata independent of current origin.

Until then, adding canonical portrait provenance fields is a useful hardening opportunity, not a verified current engineering defect.

## Checked media-runtime boundary — no defect

`ResilientImage` rebuilds its source/fallback candidate chain when `src` changes and resets failure state. `useNativeImageState` also scopes readiness/error state to the active `src`. A failed poet image on dynamic route A does not remain terminally failed merely because the same component instance later receives poet B's source.

No media-state leak row is added.

## Audit disposition

After this wave the active matrix should contain **15 rows total: 1 P1 + 14 P2**.

- add `TLP-RATING-SOURCE-001` as one independent P2 source-authority root;
- do not add a canonical portrait provenance defect without exact origin evidence;
- keep Product #270 as longform visual/editorial ownership rather than reclassifying it into this engineering row;
- Product source remains unchanged by this AuditRepo evidence push.
