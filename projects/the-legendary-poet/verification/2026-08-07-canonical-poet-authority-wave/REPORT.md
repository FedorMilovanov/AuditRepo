# Canonical poet authority and semantic-guard verification wave

Date: 2026-08-07  
Project: `the-legendary-poet`  
Product repair: PR #336  
Exact tested Product head: `8e22188f98b9eaa39bab044794a7852e9b746f8d`  
Product squash merge: `dc37961cf64de5400e622d9c3d202634ed135100`  
Wave status: `closed-by-fix`

## Purpose

PR #334 repaired native scrolling and reader-facing portrait prose, but the final portrait fields were still applied through a central publication override. PR #336 removes that temporary ownership split so the canonical poet modules once again contain the exact prose published to readers.

## TLP-POET-001 — duplicate ownership of poet portrait prose

Initial status: `current-local`  
Final status: `closed-by-fix`  
Root classification: `systemic-root`

PR #336:

- moved final `moralPortrait` and `authorCommentary` prose into all ten canonical `src/data/library/*.ts` poet modules;
- deleted `editorialPortraitOverrides.ts`;
- restored direct object publication in `src/data/library/index.ts` with no clone, map or mutation layer;
- added `scripts/validate-poet-authority.ts`, requiring direct object identity, one source owner for each editorial field and absence of hidden publication rewriting;
- wired the authority validator into the ordinary content check;
- preserved the complete Pasternak record while changing only the two intended editorial fields. Its final blob is `934149ef626be34c3c2d0581cb5a7e278ada4676`.

The result restores the charter rule that one poet has one canonical source module.

## TLP-AUDIT-STYLE-002 — semantic labels backed by exact string matching

Initial status: `current-local`  
Final status: `closed-by-fix`  
Root classification: `ST-TLP-AUDIT-HARNESS`

The first complete CI attempt after canonicalization failed only in the literary-style guard. All required historical boundaries were present, but three witnesses differed by ordinary grammar: one used a declined noun phrase, one used the same concepts in another word order, and one differed only in capitalization.

The validator called these checks semantic invariants but implemented them with case-sensitive `text.includes(marker)`. Changing publication prose to satisfy that implementation would have repeated the frozen-prose harness defect already found during PR #334.

The repaired matcher now:

- normalizes Russian case, `ё/е` and whitespace before exact matching;
- falls back to clause-local matching of significant word stems, allowing bounded grammatical inflection and word-order changes;
- requires all fallback witness tokens to occur in the same clause;
- treats short negative particles as semantically critical, so an opposite positive statement cannot satisfy a negative invariant merely because nearby nouns match;
- leaves the invariant tables, forbidden portrait markers, forbidden poet formulations and essay contracts intact.

An intermediate matcher already passed the current corpus but treated short negative particles too loosely. That was tightened before final certification, so the exact tested head protects both editorial flexibility and negative meaning.

## Runtime cleanup retained from the native-scroll repair

PR #336 did not reopen scrolling. It removed the obsolete `setActiveLenis` compatibility API while retaining browser-native wheel, trackpad and touch ownership. It also RAF-coalesced the `ReadingProgress` fallback listener and cancels a pending measurement frame on unmount.

The scroll runtime guard protects these boundaries, and the existing real-wheel Chromium witness passed on the final head.

## Exact-head verification

Product head `8e22188f98b9eaa39bab044794a7852e9b746f8d` passed before squash merge `dc37961cf64de5400e622d9c3d202634ed135100`:

- Project contracts;
- Content model contract;
- full CI including poet authority, literary semantics, app shell, interactions, TypeScript, production build, route budgets, prerender and SEO;
- Site route integrity audit;
- Articles catalog acceptance;
- both Yesenin publication/browser gates;
- Brand raster QA and Brand deep reference/motion audit;
- Manual Browser QA 4/4: Chromium and Android including real-wheel continuity, process-isolated base iPhone Safari, critical iPhone/reduced motion, desktop WebKit home/route, and premium homepage/pointer-performance coverage.

Pages deployment was intentionally skipped and is not claimed by this source-verification wave.

## Control-plane cleanup

Temporary one-shot orchestration workflows from an earlier failed transport attempt were removed from Product `main`. Product issue #338 was closed after verifying that `8136ad5649a11ff8967d7bb034c2e940779d079b..3c74f6c06afc9f9738d122cc8a6a6f94d559c06b` has zero net file changes and no replacement write-capable transport workflow remains.

## Residual

The `lenis` package remains an unused install-only dependency and lock entry. Product issue #335 owns that dead-dependency cleanup. Runtime use remains prohibited, so this residual does not reopen the closed scroll-ownership defect.

No image binary, Mayakovsky media-provenance file, route contract or essay body was changed by this lane. No live deployment claim is made.

## Closure

`TLP-POET-001` is closed by Product PR #336 and squash merge `dc37961cf64de5400e622d9c3d202634ed135100`.

`TLP-AUDIT-STYLE-002` is closed by the same wave. Canonical poet modules now own the exact reader-facing prose, and semantic guards tolerate ordinary grammatical form without dropping the meaning of negative boundaries.

## Reverify triggers

- reintroduction of a poet publication override or mutation layer outside the canonical module;
- a catalog consumer receiving cloned or rewritten poet objects instead of direct canonical objects;
- duplicate ownership of the editorial portrait fields;
- a literary validator that again freezes one grammatical sentence rather than the semantic boundary;
- a semantic matcher that loses negative meaning or lets witness tokens be scattered across unrelated passages;
- reintroduction of active global JavaScript document scrolling or an uncoalesced scroll measurement path.