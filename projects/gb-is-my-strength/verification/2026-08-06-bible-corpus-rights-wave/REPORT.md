# Verification Wave — Bible corpus rights and provenance

**Date:** 2026-08-06  
**Theme:** `ST-CONTENT-AUTHORITY` / `SEARCH-P2-07`  
**Evidence status:** `verified-at-anchor / owner-rights decision recorded`  
**Research evidence anchor:** Research PR #149, exact head `be5354b92aa4ab1de6d9483c7b93740e2ff6ab34`, guarded squash merge `d52ea9d54dd2c2488223d25f5f6cefd263c23328`  
**Product evidence anchor:** `76737eefe16a0feb2fdf729c805d17b5cdcdc376`

## Question

Is there an authoritative/licensed Russian Bible corpus that can support a complete public 66-book Product corpus, and which current alternatives must remain blocked?

## Evidence angles

### Current Product ownership

At the Product evidence anchor:

- `data/bible/books.json` owns a 66-book Protestant registry;
- OT defaults to `synodal`;
- NT defaults to `kassian`;
- the canonical contract supports separate `translation`, `source`, `sourceUrl` and `rights` metadata;
- inspected Synodal and Cassian records contain a source label but no `sourceUrl` or `rights`.

This is sufficient operational text ownership for current sparse records, but not a complete publication-grade provenance chain.

### Independent rights/provenance research

Research PR #149 created:

- `BIBLE_CORPUS/00_BIBLE_CORPUS_RIGHTS_PROVENANCE_AUTHORITY_2026-08-06.md`;
- `data/bible-corpus-rights-provenance-2026-08-06.json`.

The wave separated evidence class, access, locator, rights and publication state under Research evidence-policy v2.

Verified dispositions:

1. **CrossWire `RusSynodal` 1.9.1**
   - exact institutional module and copyright records identify the distribution licence as `Public Domain`;
   - exact raw-package endpoint was resolved;
   - archive bytes were not acquired in the execution environment;
   - no archive SHA-256, embedded configuration, complete book manifest or Product mapping is claimed;
   - disposition: `CANDIDATE_ONLY`;
   - holds: `ARCHIVE_HOLD`, `PUBLICATION_HOLD`.

2. **CrossWire `RusSynodalLIO` 1.0.3**
   - copyrighted;
   - distribution permission is granted to CrossWire, not generally to downstream publishers;
   - disposition: `REJECT_UNLICENSED_DOWNSTREAM_USE`;
   - holds: `RIGHTS_HOLD`, `PUBLICATION_HOLD`.

3. **Cassian New Testament**
   - the official Russian Bible Society catalog identifies a current edition as published with RBO permission;
   - no permission for this Product repository is present;
   - current Product provenance wording based on open web publications is not a rights grant;
   - disposition: `DO_NOT_EXPAND_OR_REPUBLISH_WITHOUT_PERMISSION`;
   - holds: `RIGHTS_HOLD`, `PUBLICATION_HOLD`.

### Research integrity witness

Research exact head `be5354b92aa4ab1de6d9483c7b93740e2ff6ab34` passed `Repository authority integrity` run `31097491083`:

- complete Research checkout;
- pinned cross-repository witnesses;
- Python syntax;
- repository control plane;
- deterministic corpus validators;
- read-only tracked-tree verification.

PR #149 merged as `d52ea9d54dd2c2488223d25f5f6cefd263c23328`.

## Classification result

- **Meaningful progress:** the rights/provenance search is no longer an unbounded “find a corpus” task.
- **Accepted candidate:** exact CrossWire `RusSynodal` 1.9.1 only.
- **Rejected shortcut:** `RusSynodalLIO` cannot be treated as generally reusable merely because CrossWire distributes it.
- **Blocked current NT authority:** Cassian remains permission-controlled.
- **Remaining independent work:** acquire and hash the exact RusSynodal archive, verify its module configuration/book manifest/versification, map 66 Product books, compare existing canonical records and run a later Product import/release lane.
- **Canonical finding state:** `SEARCH-P2-07` remains open.
- **Matrix arithmetic:** unchanged.

## Better-than-local outcome

A useful next wave is not another web scrape. It must be a bounded acquisition/import transaction:

1. acquire the exact official archive;
2. record byte length and SHA-256 before extraction;
3. verify module version, licence metadata, text source and book manifest;
4. document `Synodal` / `SynodalProt` versification and 66-book mapping;
5. generate a verse-level import receipt;
6. compare and disposition every existing Product canonical record;
7. populate exact `sourceUrl` and `rights`;
8. run source, corpus, search, production-like dist and browser evidence;
9. keep Cassian excluded unless explicit permission is obtained.

Research closure alone must never authorize Product publication.

## Disposition

- `ST-CONTENT-AUTHORITY`: remains `evidence-rich / owner-decision`, now with a bounded Bible-corpus decision model.
- `SEARCH-P2-07`: `open / candidate identified / acquisition and publication holds remain`.
- Product mutation: none.
- AuditRepo historical matrix: unchanged.
- Live evidence: not required and not claimed.
