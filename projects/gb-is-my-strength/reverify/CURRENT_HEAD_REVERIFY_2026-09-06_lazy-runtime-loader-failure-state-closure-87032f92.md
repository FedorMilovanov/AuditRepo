# Current-head reverify — lazy runtime loader failure-state closure

**Project:** `gb-is-my-strength`  
**Date:** 2026-09-06  
**Audit finding:** `LAZY-RUNTIME-LOADER-FAILURE-STATE`  
**Current Product main:** `87032f928c4894d8e2945aa1a41a1fe945eb72c5`  
**AuditRepo rollback point:** `78cb5dab11a04a566d7aa7592cf5b709880ceacb`

---

## 1. Scope and disposition

This reverify checks the complete causal boundary of the active SYSTEM row `LAZY-RUNTIME-LOADER-FAILURE-STATE` against current Product `main`.

Disposition: **FIXED-CURRENT / closed-by-system-fix**.

The row had two independent runtime manifestations under one causal owner:

1. MobileChrome search bootstrap could retain sticky acquisition/boot state after terminal `search.js` failure and prevent a clean retry.
2. Vosk/TTS script acquisition in the canonical Reader and floating-controller owners could retain rejected/pending shared state after a terminal script failure instead of settling and permitting a fresh acquisition.

The repair was intentionally split into two bounded Product PRs rather than merging the older mixed branch wholesale. Product #1814 closes the search half. Product #1825 closes the Vosk/TTS half. Both retain in-flight deduplication while making terminal failure explicit and retryable.

No independent residue remains under this causal owner.

---

## 2. Product repair chain

### Product #1814 — MobileChrome search bootstrap

Merged PR #1814, final exact head `5cfb9a8b871c72a9c7aa89a0afe32add95b12610`, merge `7ba49d82e5fc9c5b40fd0699376796d4f76242f2`.

Net Product repair boundary was exactly three files:

- `.github/workflows/search-cold-bootstrap.yml`;
- `scripts/search-loader-retry-contract-test.js`;
- `src/components/article-pilots/_shared/MobileChromePage.astro`.

The permanent source/browser contract proves both terminal paths — script load without `GBSearch` initialization and network/script error — release `__gbSearchLoading`, clear `__gbSearchBootRequested`, mark the attempt failed, remove the failed script, and permit a later fresh retry. The successful ready/open path remains distinct and genuinely in-flight work still deduplicates.

Merge-authoritative exact-head workflows on `5cfb9a8b...` include:

- `Search Cold Bootstrap Contract` run `34048862188` — success, including Chromium/WebKit cold-bootstrap coverage;
- `Route Registry Validators` run `34048862073` — success;
- `Runtime Interactive Audit` run `34048862198` — success;
- `Deploy Candidate Contract` run `34048862235` — success;
- `Visual Parity Guard — pixel-diff` run `34048861922` — success;
- replacement/final `Shared Files Guard` run `34048900795` — success.

An earlier Shared Files Guard run `34048862180` on the same exact repair sequence was cancelled; the later run above is the terminal merge-authoritative witness.

### Product #1825 — Vosk/TTS acquisition owners

Merged PR #1825, final exact head `7effbb1479e5234448fe531a352bb723b27ef04d`, merge/current Product `main` `87032f928c4894d8e2945aa1a41a1fe945eb72c5`.

The substantive Product owners are:

- `src/runtime/reader-tts.js`;
- `js/floating-cluster-controller.js`.

The PR also adds the dedicated permanent failure-state contract, extends the TTS workflow to own the floating Vosk loader, and propagates the required shared-controller cache-bust revision through its carriers.

The dedicated contract proves for both loader owners and for both terminal acquisition failures (`load` without API initialization and script `error`):

- concurrent callers share one in-flight promise;
- terminal failure rejects instead of hanging;
- failed script is marked `failed`;
- rejected acquisition state is released;
- retry replaces the failed script;
- successful retry becomes `ready`.

Merge-authoritative exact-head workflows on `7effbb14...` were terminal green, including:

- `Vosk Loader Failure State` run `34053288451` — success;
- `TTS Reader Polish` run `34053288468` — success;
- `Reader Controls Accessibility` run `34053288401` — success;
- `Runtime Interactive Audit` run `34053288418` — success;
- `Route Registry Validators` run `34053288405` — success;
- `Site Sections Menu Contract` run `34053288376` — success;
- `Deploy Candidate Contract` run `34053288410` — success;
- `Visual Parity Guard — pixel-diff` run `34053288416` — success;
- `Shared Files Guard` run `34053288344` — success.

The final #1825 head was synchronized with then-current Product `main` before these checks; the merge itself used exact-head protection and produced merge `87032f928c4894d8e2945aa1a41a1fe945eb72c5`.

---

## 3. Closure-boundary check

The MASTER closure boundary required:

1. explicit acquisition states equivalent to `idle/loading/ready/failed`;
2. terminal failed attempts must settle rather than leave a sticky pending/boot lock;
3. a later retry must create or observe a fresh acquisition;
4. genuinely in-flight requests must still deduplicate.

Current Product satisfies all four across the two previously observed manifestation families:

- MobileChrome search bootstrap closes terminal failure and permits a fresh retry while retaining one in-flight acquisition;
- canonical Reader and floating-controller Vosk acquisition close terminal failure, release rejected shared state, replace failed script state on retry and retain one in-flight promise.

The durable tests exercise failure and retry directly rather than inferring correctness from successful cold starts alone.

---

## 4. Boundaries preserved

- The historical mixed branch is provenance only; it was not merged wholesale.
- Search and Vosk/TTS were repaired as separate bounded Product PRs with their own exact-head contracts.
- Reader speedrail behavior was not used as part of this closure and was not changed by the repair chain.
- No inference is made about `TTS-SHAREDWORKER-CLIENT-LIFECYCLE`; that is a distinct active SYSTEM owner concerning MessagePort/document retirement and queued synthesis.
- No inference is made about the other six remaining SYSTEM lanes or `RODOSLOVIYE-OG-IMAGE`.
- No unrelated Product mutation is made by this AuditRepo reconciliation.

---

## 5. Terminal status

`LAZY-RUNTIME-LOADER-FAILURE-STATE` has no current independent residue at Product `main` `87032f928c4894d8e2945aa1a41a1fe945eb72c5` and should be removed from active MASTER arithmetic.
