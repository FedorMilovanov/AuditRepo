# Reverify: publication authority and exact blobs for pastor-series Parts II–IX

**Checked:** 2026-10-27
**Product repository:** `FedorMilovanov/gb-is-my-strength`
**Exact Product main reviewed:** `21dcfdd9f9018607a708c5118383e287ec1a3fed`
**AuditRepo base:** `d79f2449f82cfaf9995f4c04cb16649e57ea1cee`
**Disposition of the historical publication-conflict finding:** `SUPERSEDED_BY_OWNER_DECISION_AND_EXACT_BLOB_RE-CLEARANCE`; do not reactivate it as a current product defect on the basis of the September audit alone.

## Question being reverified

The historical `audit/PASTOR-SERIES-PRODUCT-AUDIT-2026-09-15.md` reported that Parts II–IX were public while earlier receipts still contained a publication prohibition, and that published manuscripts had changed after their initial clearance. This reverify checks those two claims against current Product source and the later, controlling owner/re-clearance receipts. It is **not** a full re-audit of theological content, safeguarding, live HTTP headers, or the entire build/release pipeline.

## Findings

1. **The owner explicitly approved promotion on 2026-09-15.** `research/pastor-series/PROMOTION-RECEIPT-II-IX.md` records `PUBLICATION_PROMOTION = APPROVED (owner decision)`, `DECISION_OWNER = ФЁДОР МИЛОВАНОВ`, and `SERIES_STATUS = PUBLISHED, LEGALIZED`. It explains that the earlier prohibition text is superseded by this decision. This is an explicit decision, not an inference from the public route alone.

2. **The later integration receipt records closure of the outstanding manuscript and safeguarding follow-ups.** `research/pastor-series/INTEGRATION-RECEIPT-2026-09-15.md` records `PUBLICATION_PROMOTION = APPROVED`, `EXACT_BLOB_RE_CLEARANCE = PASS (bounded review, exact blobs)`, and `FORMAL_JURISDICTION_RECHECK = PASS WITH NON-LEGAL BOUNDARY`. The source `research/pastor-series/RE-CLEARANCE-II-IX-2026-09-15.md` records `EXACT_BLOB_RE_CLEARANCE = PASS`, `JURISDICTION_SAFEGUARDING = PASS WITH NON-LEGAL BOUNDARY`, and `CHRISTOLOGICAL_THEOLOGICAL_PASS = PASS`.

3. **All eight current MDX blobs exactly match the later re-clearance receipt.** Each certified SHA-1 below was parsed from `RE-CLEARANCE-II-IX-2026-09-15.md` and independently compared with `git rev-parse <Product-main>:src/content/articles/<filename>`. All 8/8 are exact matches:

| Part | Manuscript | Certified and current blob SHA-1 | Match |
|---|---|---|---|
| II | `anatomiya-padeniya-pyat-stadiy.mdx` | `49ecc5d34b92eb11600dc22c230212f189b3382b` | PASS |
| III | `teksty-pisaniya-kotorymi-manipuliruyut.mdx` | `8bb2d84ebd7c1c46f856e36c8deb5a2ea9be299d` | PASS |
| IV | `sem-tipov-razlichenie-uchiteley.mdx` | `f9dc36e2cc057fcd9bb0319aa2b78a98f1de31f9` | PASS |
| V | `cerkovnaya-disciplina-vlast-granicy-zashchita.mdx` | `f04daa0ff05b235ae4c55df3a360748ae3317c90` | PASS |
| VI | `kogda-uhodit-kogda-ostavatsya.mdx` | `73893c5505802ed79917efc39e54c156353d1469` | PASS |
| VII | `vernye-i-neizvestnye-zdorovoe-pastyrstvo.mdx` | `764c0e975e229a008b9dee6ad946c3b1ef4fefa5` | PASS |
| VIII | `priznaki-zdorovoy-cerkvi.mdx` | `037695be17e315427bdd730377c9c7dcea395e60` | PASS |
| IX | `nesovershennyy-chelovek-v-nesovershennoy-cerkvi.mdx` | `eb428aae84c5f6a7ed5ff12ae964ea17f70c6084` | PASS |

4. **Publication flags and registry are consistent with the approved state.** The eight current manuscript frontmatters all set `draft: false` and `noindex: false`. `data/series.json` lists Parts I–IX with `status: published`. `data/editorial-metadata-supplements/pastor-series-ii-ix-20260908.json` contains eight records for Parts II–IX and each has `reviewStatus: approved`.

## Correct disposition

The historic report's observation—that an earlier set of receipts said “no publication promotion” while routes were already public—was a valid description of the intermediate inconsistent state. It is **not** a current publication-authority defect: the owner decision dated 2026-09-15 explicitly authorized promotion, and the subsequent integration/re-clearance receipts close the later bounded review and jurisdiction-specific safeguarding follow-up. Do not revert `draft`/`noindex`, withdraw Parts II–IX, or reopen an active MASTER row solely because the older receipt still contains historical prohibition text; that document itself points readers to the later promotion receipt, and the old text is retained as provenance.

This result only closes the *publication-authority contradiction* and confirms the eight manuscript identities against the controlling receipt. Separate historical observations about UX, imagery, cross-links, typography or generated assets are not declared fixed by this check; they require their own fresh, current-main repro before any implementation.

## Method and limits

- Inspected Product `main` at the exact SHA above; no Product file, branch, tag or PR was changed.
- Compared the eight current Git blob SHA-1s to the eight SHA-1s in the exact-blob re-clearance table.
- Parsed the current series registry and editorial metadata supplement; inspected all eight manuscript frontmatters.
- Did not use the old audit's static-build/deploy observations as current runtime proof, and did not rerun the full Product production-like/browser suite for this authority-only question.
