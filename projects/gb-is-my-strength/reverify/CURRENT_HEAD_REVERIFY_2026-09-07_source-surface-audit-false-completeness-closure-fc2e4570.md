# Current-head reverify — source-surface audit false-completeness closure

**Project:** `gb-is-my-strength`  
**Date:** 2026-09-07  
**Audit finding:** `SOURCE-SURFACE-AUDIT-FALSE-COMPLETENESS`  
**Current Product main:** `fc2e4570edd9bcc9ffb0588b0bb4f31299ecfb6b`  
**AuditRepo rollback point:** `010ae76ee343a133af311b601d05efabda709565`

---

## 1. Scope and disposition

This reverify checks only the complete causal boundary of active SYSTEM row `SOURCE-SURFACE-AUDIT-FALSE-COMPLETENESS` against current Product `main`.

Disposition: **FIXED-CURRENT / closed-by-system-fix**.

The active row required the repository's DOM/resource-producing source surfaces to be defined explicitly and scanned fail-closed, rather than allowing historical file counts or a narrower hand-selected corpus to masquerade as completeness. It also absorbed the active `MISSING-BUTTON-TYPE` / `SITEWIDE-BTN-TYPE-AUDIT` accounting boundary.

Product #1829 closes that boundary. No independent current residue remains under this causal owner.

---

## 2. Product repair

Merged Product PR #1829, final head `33a9a14ed23d82626caf9e12f3ee9a07bcef58f4`, merge commit `4750b649eab5ad749c8b84f11fc064370b42225f`.

The logical Product delta is exactly four audit/control-plane files:

- `scripts/audit-pro-source-corpus-test.js`;
- `scripts/cache-bust.js`;
- `scripts/lib/audit-pro-source-corpus.js`;
- `scripts/lib/product-source-surfaces.js`.

The repair establishes these owner semantics:

1. one repository-derived source-surface classifier is authoritative instead of historical route/file-count allowlists;
2. DOM/control-producing kinds and resource-producing kinds are declared separately;
3. JSON/CSS are resource-only for the DOM census, preventing quoted markup data from becoming false DOM findings;
4. unknown/unclassified textual source kinds are streamed in bounded chunks and scanned for producer sentinels, including cross-chunk matches;
5. declared textual Product source is inspected regardless of byte size, while unreadable, non-regular, binary-declared or invalid escaped-root cases fail closed;
6. tracked internal symlink aliases are containment-validated and not double-counted;
7. dynamic button creation is covered alongside static `<button>` markup;
8. governed public `?v=` tokens are validated without mistaking canonical helper inputs for revision literals;
9. `scripts/cache-bust.js` remains the canonical asset-revision owner while gaining the previously missing code/data source census;
10. AuditPro corpus construction fails on genuinely unclassified DOM/control producer classes and requires `unclassified=[]` rather than freezing a historical cardinality.

The earlier false-completeness modes were therefore repaired structurally, not hidden by path-specific exceptions, arbitrary byte ceilings or preserved historical counts.

---

## 3. Exact-head Product certification

PR #1829 records terminal green certification on exact final head `33a9a14ed23d82626caf9e12f3ee9a07bcef58f4` for all nine applicable pull-request workflows:

- `Shared Files Guard`;
- `Search Modal Contract`;
- `Source Authority Contract`;
- `Deploy Candidate Contract`;
- `Route Registry Validators`;
- `Editorial Metadata v3`;
- `Metadata & IndexNow Readiness`;
- `Glossary Contract`;
- `TTS Download Consent`.

That certification included the repository-derived source classifier, source regression gates, production-like build/static publication checks and browser/runtime coverage. Review state at certification was zero submitted reviews and zero inline review threads.

The Product repair was merged as #1829; the merge receipt is `4750b649eab5ad749c8b84f11fc064370b42225f`.

---

## 4. Current-main persistence check

Current Product `main` at this reverify is `fc2e4570edd9bcc9ffb0588b0bb4f31299ecfb6b`.

Git ancestry comparison from the #1829 merge receipt `4750b649eab5ad749c8b84f11fc064370b42225f` to current `main` shows:

- current `main` is 21 commits ahead;
- merge base remains exactly the #1829 merge receipt;
- none of the four Source Surface owner files above appears in the intervening changed-file set.

Therefore the certified four-file repair is still byte-lineage-preserved on current Product `main`; later Product movement did not rewrite this owner boundary.

The intervening changes include the separately owned Scripture occurrence repair and later unrelated release/metadata work. No closure inference is made from those changes.

---

## 5. Closure-boundary check

The MASTER closure boundary required:

1. explicit definition of DOM/resource-producing source surfaces;
2. deterministic committed scanners that fail when producer classes are omitted;
3. button/accounting manifestations to be governed by that source authority rather than historical counts;
4. resource revision auditing to include JS/code/data producer surfaces previously omitted;
5. no fake completeness claim based on a frozen count.

Current Product satisfies all five through the merged #1829 classifier/corpus/cache-bust repair and its exact-head certification. The current-main persistence check establishes that the owner files have not subsequently drifted.

---

## 6. Boundaries preserved

- No Product mutation is made by this AuditRepo reconciliation.
- No route, UI, Baptist research, TTS, SharedWorker, Service Worker, metadata/feed, dependency or unrelated SYSTEM lane is absorbed.
- `SCRIPTURE-OCCURRENCE-REPRESENTATION-ORACLE` remains a separate AuditRepo reconciliation even though its Product repair is already merged.
- `SW-ROOT-GENERATION-AUTHORITY` remains independently open until its own Product lane reaches terminal merge evidence.
- `RODOSLOVIYE-OG-IMAGE` remains independently open and is currently owned by its separate Product lane.
- Product branch-protection/ruleset governance is not represented as solved by this repair.

---

## 7. Terminal status

`SOURCE-SURFACE-AUDIT-FALSE-COMPLETENESS` has no current independent residue at Product `main` `fc2e4570edd9bcc9ffb0588b0bb4f31299ecfb6b` and should be removed from active MASTER arithmetic.
