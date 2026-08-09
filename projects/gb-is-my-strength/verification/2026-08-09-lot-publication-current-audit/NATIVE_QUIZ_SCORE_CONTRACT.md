# Native article quiz score-contract audit — 2026-08-09

## Finding

`ARTICLE-QUIZ-SCORE-RANGE-01` — **P2 shared runtime regression discovered through Lot** — `CONFIRMED-CURRENT`.

The native article quiz renderer and the existing `SITE_CONFIG.quiz.scores` authority disagree about score-tier shape. Lot therefore renders the quiz itself, but its configured named result tiers can never be selected.

This is the corrected follow-up to the closed false positive `LOT-QUIZ-RENDER-01`: the renderer exists; the bug is inside the result-contract migration.

## Exact anchors

- Lot publication owner: Product PR `#1339@189dfddbeed537c849dd35b1a92578ead894079d`.
- Native runtime file on that exact head: `src/runtime/article-quiz.js`, blob `37e5ea1ff09d46c491ea58d13be98af6daade616`.
- Lot config file on that exact head: `src/components/article-pilots/lot/LotPageHead.astro`, blob `225171d50485af58544160582c47b5ce90dc994e`.
- Current Product main observed during confirmation: `1ef18c6584b00e536674be08a904036cbf9fbc1f`; native `article-quiz.js` remains byte-identical there.

## Contract mismatch

### Current native renderer

`src/runtime/article-quiz.js` chooses a result tier with:

```js
const entries = Array.isArray(config?.scores) ? config.scores : [];
return entries.find((entry) => score >= Number(entry.min) && score <= Number(entry.max)) || fallback;
```

Therefore every custom tier requires a numeric `max`.

### Lot publication config

`LotPageHead.astro` serializes four tiers as **minimum-threshold rows only**:

```js
{ min: 7, title: 'Внимательный экзегет', badge: '📖', desc: '...' },
{ min: 5, title: 'Хороший читатель', badge: '🔎', desc: '...' },
{ min: 3, title: 'Нужно перечитать', badge: '🧭', desc: '...' },
{ min: 0, title: 'Начало пути', badge: '📜', desc: '...' },
```

No row has `max`.

For every row:

```js
Number(entry.max) === Number(undefined) === NaN
```

and JavaScript comparisons against `NaN` are false. Consequently `entries.find(...)` returns no tier for **every possible Lot score 0–8**.

The native renderer therefore always falls back to its generic result:

```text
<title> = "N из 8"
<desc> = "Все ответы верны." only at 8/8, otherwise generic reread copy
```

instead of the four intentional Lot result tiers.

## Legacy authority proves the schema is threshold-based

The historical generic quiz renderer in `js/site.js` consumes the same score registry as an ordered list of minimum thresholds. Its selector walks the rows and returns the first tier whose `score >= row.min`; there is no `max` requirement.

That is also consistent with existing article configs: the current Hermenevtika `SITE_CONFIG.quiz.scores` begins with `min`-only rows and includes rich `title`, `badge` and `desc` metadata.

This makes the clean root cause a **native renderer schema incompatibility**, not merely four missing `max` fields in Lot.

Adding `max` only to Lot would mask the shared migration regression and leave other threshold-based article configs on the fallback path.

## Secondary semantic loss: badge is ignored

Even after range selection is repaired, current native `renderResult()` reads only:

- `result.title`;
- `result.desc`.

It never renders `result.badge`, although both Lot and established article configs carry badge metadata and the legacy renderer displayed it with the grade title.

Treat badge loss as a lower-severity parity residual under the same shared quiz migration root, not as a reason to fork a Lot-specific result renderer.

## User-visible proof target

A positive browser contract should distinguish renderer existence from renderer correctness.

For Lot, deterministic result tests can answer known options and assert at least:

| Score | Expected configured tier |
|---|---|
| `8/8` | `Внимательный экзегет` |
| `6/8` | `Хороший читатель` |
| `4/8` | `Нужно перечитать` |
| `0–2/8` | `Начало пути` |

Current native code will instead display the generic `N из 8` title for every row.

The permanent contract should also verify the result description and, if badge parity is retained by owner decision, the configured badge.

## Correct repair boundary

Preferred SYSTEM root repair:

1. preserve the established ordered minimum-threshold score schema;
2. make `article-quiz.js` select the first threshold with `score >= min`, matching the accepted config authority, or introduce a centrally validated normalization layer that derives ranges without changing every route by hand;
3. do not add route-local score-selection code;
4. add adversarial tests for min-only tier arrays and boundary scores;
5. verify at least one pre-existing article plus Lot through the native runtime;
6. decide badge parity explicitly and test it if retained;
7. run exact-head shared article-interaction/browser contracts.

If the owner instead chooses an explicit `{min,max}` schema, that must be a deliberate shared-schema migration with validation and migration of **all** current quiz configs; patching Lot alone is not sufficient.

## Ownership / collision disposition

No open Product issue/PR matching this specific `article-quiz` score-range regression was found during the audit. Existing quiz-related Product #1267 is a different Series/Gill ARIA lane and does not own `src/runtime/article-quiz.js`.

Because the user requested AuditRepo work and Lot publication #1339 remains active, this audit does **not** open or mutate a competing Product shared-runtime lane. It records the SYSTEM root for routing after current owner/collision recheck.

Final disposition: `CONFIRMED-CURRENT / SYSTEMIC-ROOT`, discovered through Lot.