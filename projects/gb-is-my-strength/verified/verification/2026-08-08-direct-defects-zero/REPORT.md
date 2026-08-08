# GB direct-defect zero reconciliation — 2026-08-08

## Result

Product direct current defects recorded in `MASTER_BUG_MATRIX.md` are now **0**.

This closure is bounded to the two previously verified direct defects. It does **not** declare the whole Product backlog empty: four verified improvements, two system lanes and four owner decisions remain current work.

## Product anchor

Final Product anchor for this reconciliation:

`76ad2f3ff814c088eb429d5ec0edd35d5bbe27b0`

That commit is the squash merge of Product `#1197` after Product `#1195` had already merged as `a2d0ce587a3de2f659747151207c9adce31950cd`.

---

## S-SEC-01 — CLOSED

Product PR: `#1195` — `SYSTEM: make FAQ JSON-LD plain-text only`

Merged Product commit:

`a2d0ce587a3de2f659747151207c9adce31950cd`

### What changed

The FAQ JSON-LD `acceptedAnswer.text` path no longer reads `innerHTML`, creates a detached sanitizer container, or maintains a tag/attribute blacklist. It now serializes normalized visible `textContent` and then relies on JSON serialization.

This removes the HTML-sanitizer design from a text-only schema field instead of trying to make the blacklist larger.

### Permanent adversarial evidence

`script/faq-jsonld-text-contract-test.js` was not introduced as a new workflow owner; the permanent contract is wired into the existing Shared Files Guard.

The fixture executes the real FAQ JSON-LD module and proves:

- answer `textContent` is normalized and serialized;
- reading answer `innerHTML` is forbidden by a throwing getter;
- creating a detached HTML parser/sanitizer element is forbidden;
- exactly one `FAQPage` script is produced;
- mutating the current owner back to `innerHTML` is killed.

Exact-head Shared Files evidence on `ab6300f5ed745b2cf983681f3564dee3536d4317` was SUCCESS. A fresh collision run after Nagornaya `#1197` opened was also SUCCESS and confirmed the two Product owners were file-disjoint.

The first Runtime Interactive execution had one isolated homepage-interaction failure while independent Home witnesses were green. A same-SHA rerun completed homepage interaction, headed lifecycle, A13 WebKit and the dependent full interactive audit successfully; no Product code was changed to obtain that result.

Canonical cache projection updated mutable `enhancements.js` consumers only. The 52 `reference-only` HTML snapshots remained preserved.

---

## NG-INLINE-01 — CLOSED

Product PR: `#1197` — `fix(nagornaya): tokenize library surfaces across Parts I/II/III/V`

Final exact PR head:

`ae91cbc03dfbe2641a91d7085493753c4e2df444`

Merged Product commit:

`76ad2f3ff814c088eb429d5ec0edd35d5bbe27b0`

### What changed

The duplicated `Из библиотеки` block in Nagornaya Parts I/II/III/V now uses existing shared theme ownership instead of hardcoded light-only colors:

- `--color-surface-2`;
- `--color-accent`, `--color-accent-strong`, `--color-accent-soft`;
- `--color-text`, `--color-text-muted`;
- `--color-border`;
- `--shadow-sm`;
- token-derived `color-mix(...)` borders/rules;
- SVG accent through `currentColor`.

Visible text, href identity/order and DOM tag sequence were preserved. Part IV does not contain the library block and remained untouched.

The existing `scripts/nagornaya-visual-parity-audit.js` is the permanent owner: it requires tokenized library blocks in I/II/III/V, rejects the old light-only literals, verifies the canonical two-link identity/order and verifies no block was introduced into Part IV. No new permanent workflow or shared CSS/JS owner was added.

### Final integration evidence

`#1197` was refreshed on top of merged FAQ security `main@a2d0ce587a3de2f659747151207c9adce31950cd` before final verification.

The net comparison against current main and the GitHub synthetic merge preview both contained exactly five files:

1. `scripts/nagornaya-visual-parity-audit.js`
2. `src/components/nagornaya/chast-1/NagornayaChast1MainShell.astro`
3. `src/components/nagornaya/chast-2/NagornayaChast2MainShell.astro`
4. `src/components/nagornaya/chast-3/NagornayaChast3MainShell.astro`
5. `src/components/nagornaya/chast-5/NagornayaChast5MainShell.astro`

On final head `ae91cbc...`, the effective latest runs for every registered workflow were terminal SUCCESS, including:

- Shared Files Guard `31228200162`;
- Source Authority Contract `31227773880`;
- Runtime Interactive Audit `31227773771`;
- Route Registry Validators `31227773763`;
- Visual Parity Guard `31227773803`;
- Deploy Candidate `31227773810`;
- Search Modal, Home SearchAction, TTS, Native Source, Content Source Truth, Print, Avraam, Node, NoteRegistry, Metadata and discovery/index contracts.

An earlier Shared Files run on the same SHA was cancelled by concurrency and superseded by `31228200162 SUCCESS`; it is not a failed evidence lane.

---

## Current Strangler boundary

Neither direct-defect repair authorizes legacy deletion.

The current retained legacy/native-shadow system remains fail-closed at **26 blockers**:

- 16 mechanical reader repoints;
- 3 obsolete/remove-or-repoint readers;
- 7 dependency owner decisions.

`deletionReady=false` and `physicalMoveAuthorized=false` remain the required disposition.

---

## Fresh reverify of the four remaining improvements

The direct-defect closure does not retire the four improvement rows, but it narrows two stale descriptions.

### AUDIT-CSS-DEAD-KEYFRAMES-TOKENS

Still current, but the presently proved root is narrower than the historical wording. Current `css/site.css` contains two different `@keyframes fx-breathe` definitions. The old assertion that there are two competing mobile `.gb-floater` visual rules was not reconfirmed: current `.gb-floater` matches observed during this re-read are print/interactive-chrome exclusion lists. Keep the row for canonicalizing `fx-breathe`; do not claim the `.gb-floater` duplicate until independently re-proved.

### AUDIT-JS-ESCAPER-DUP-X5

Still current, but the historical `X5` count must not be treated as a current invariant. This re-read directly confirmed separate local HTML-escaping implementations in at least:

- `js/search.js`;
- `js/site.js`;
- `js/highlights.js`.

Before implementation, enumerate the current consumer set and migrate only real current owners to one appropriate shared primitive.

### SEARCH-P3-02

Still current. Search still exposes bounded result slices (Pagefind 10 and fallback 12) rather than a truthful total/continuation surface. The Search keyboard/runtime owner is now stable, so this can be implemented as a user-visible search improvement without reopening `AR-IDX-09`.

### AR-IDX-05

Still current. `src/lib/asset-version.js` owns per-asset hash revisions while runtime code still consumes `SITE_CONFIG.version` for dynamic resource versioning (for example glossary loading). These remain parallel cache/version identities and should be reconciled in a bounded owner-aware change.

---

## MASTER effect

After this reconciliation:

- Active work units: **10**
- Direct current defects: **0**
- Verified necessary improvements: **4**
- System verification lanes: **2**
- Owner decisions: **4**

No closed defect is retained as a MASTER row.
