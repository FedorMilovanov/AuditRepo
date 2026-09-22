# Editorial proof counterexample — Product #2137

Observed 2026-09-22. This narrows the existing
`GB-GENEALOGY-EDITORIAL-CLOSURE` work unit; it is not another active matrix.

## Reproduction boundary

- Product main: `6bf5fd7212eaf88ac21d719947f98a1d6f21eb37`.
- [Product #2137](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2137)
  head: `e4cd38a1501f1879221af1e4549ba2cf922230d3`.
- Actual helper: `scripts/genealogy-build/lib/ru-review-proof.mjs` at that head,
  invoked with the main corpus person and a freshly downloaded pinned Synodal
  JSON. Download SHA-256 matches the repository configuration:
  `ac900cd6675e524f728edcf965646bbd9cf791506a67e24e78bb8c7ff4d7c923`.
- Source URL: [configured Synodal JSON](https://raw.githubusercontent.com/thiagobodruk/bible/master/json/ru_synodal.json).
  The URL is mutable; the recorded digest, not the branch name, fixes the witness.

## Actual false certification

| Field | Value |
|---|---|
| Person ID | `hepher--1ch-4-6` |
| English identity | `Hepher` |
| Identity first reference | `1Ch.4.6` |
| Russian token in identity verse | `Хефера` |
| Main's draft candidate | `Езер`, source `candidate`, confidence `0.69`, review `true` |
| Extractor-selected reference | `1Ch.4.4` |
| Token in selected verse | `Езер` |
| Helper's returned proof | `synodal-local-exact`, authority `pinned-synodal-local-token` |
| Helper's score / margin | `0.75` / `0.4167` |
| PR's generated person | `review: false` |

The source text and helper execution independently show that the proposed
certification validates a token belonging to a different person. The builder
then converts this helper result into editorial approval. Finding the extractor's
own candidate in its own selected verse is circular evidence of identity.

The 1,608 reported promotions include 137 cases whose selected reference differs
from the identity first reference. **137 is a review scope, not a count of proven
errors.** Versification differences may be legitimate; conversely, equal verse
references alone cannot disambiguate several persons within one verse. Neither
a blanket reference-equality check nor a higher transliteration threshold is an
adequate identity proof.

## Required correction before admission

1. Keep heuristic matches as candidates requiring review. Certify a name only
   from an independently checked person-to-source association, with an explicit
   versification mapping where needed, or a reviewed identity-specific override.
2. Add this real counterexample as a negative regression fixture. The gate must
   reject the wrong identity, not merely an absent token.
3. Rebuild the corpus and report the resulting pending count honestly. Do not
   preserve the advertised 2,825→1,217 reduction as a target for its own sake.
4. Keep `phase1-draft` raw data separate from the publishable projection.
5. Preserve a genuine pending-relation browser witness when integrating the
   proposed reviewed Matthew relations. Existing candidate
   [job 105179172127](https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/35214358814/job/105179172127)
   fails because the Abraham–Isaac assertion still expects a pending status.
   Add a reviewed witness and move the pending witness to an actually pending
   relation; do not drop either status contract.

No Product data or runtime is changed by this receipt. #2137 remains blocked;
the earlier proposed count reduction is superseded by this reproduced finding.
