# gb-is-my-strength — Search AR-IDX-09 closure

Date: 2026-08-08

## Purpose

Close the verified `AR-IDX-09` Search keyboard defect after its final current-main SYSTEM repair, and reconcile the exact Strangler readiness counters emitted by the same final candidate.

No new Product mutation is performed by this report.

---

## 1. `AR-IDX-09` — CLOSED

Canonical Product PR:

- PR: `#1183` — `SYSTEM: centralize Search keyboard ownership (clean successor)`;
- final base before merge: `main@b9734532ddd2921c1c06040b672e7d9fd6f30dfd`;
- exact candidate head: `853b99ca9080d07e4e7f8c1b7acaddb59ac5030a`;
- final comparison: `behind=0`;
- merged Product commit: `67c234924e6973f9c88a22168d911b15c4c6db2a`;
- merge commit message: `fix(search): centralize global keyboard ownership (#1183)`.

The old defect accepted broad modified `Ctrl/⌘+K` combinations and distributed global shortcut parsing across Search/Home/App/bootstrap surfaces. The final repair establishes one raw owner in `js/site-utils.js`:

- exactly one of Ctrl or Meta + K;
- Alt and Shift rejected;
- simultaneous Ctrl+Meta rejected;
- IME composition rejected;
- input / textarea / select / contenteditable / `role=textbox` targets rejected;
- intent transported through `gb:openSearch` instead of route-local chord parsers.

Home retains only route-specific mobile-nav → Search orchestration. App Search no longer owns a competing keydown parser.

### WebKit duplicate-query root

A prior exact artifact proved a second, independent Search bug exposed by the repair: WebKit desktop could render matching results and then re-enter the same query, replacing them with a fresh `Ищу…` state.

Root cause was duplicate query ownership:

1. Search `open()` warmed Pagefind and also called the current-value query;
2. Home SearchAction set the canonical input value and dispatched a real `input` event, whose handler separately started the query.

The final runtime keeps Search `open()` responsible only for opening + Pagefind warm-up (`ie()`), while the canonical input handler remains the single query-start owner. A permanent source contract now forbids reintroducing the old `ie(callback → current query)` path.

### Home fixture root

The earlier Runtime Interactive failure was also resolved at its real source: the synthetic contenteditable shortcut fixture appended at the end of the long Home document and `focus()` could scroll the page, legitimately hiding the navbar before the next menu assertion.

The final fixture is fixed in the current viewport, uses `focus({ preventScroll: true })`, asserts unchanged `scrollY`, and removes itself after the check. Product geometry was not weakened with `force:true`, artificial scroll cleanup or a browser exception.

---

## 2. Authority / projection boundary — VERIFIED

The Search repair does not mutate retained reference-only HTML merely to satisfy current-runtime checks.

Final architecture:

- broad source-shadow corpus remains available for structural / forensic checks;
- `currentRuntimePages` is a separate authority-aware subset for current cache-revision and G112 runtime semantics;
- explicit `reference-only` / `absent` snapshots are excluded from current runtime ownership checks but remain registered forensic evidence;
- adversarial mutation proves that changing a retained route back to canonical makes the same bytes re-enter current-runtime checks;
- `404.html` remains an active special surface.

The existing Search Modal workflow was broadened to cover the full source classes G112 scans rather than enumerating only today’s component families. No new permanent Search workflow survives the final Product diff.

Final asset projection:

- `js/search.js` revision: `bdb556ee`;
- canonical authority-aware cache-bust projection updated only mutable/current owners;
- `52` explicit `reference-only` HTML snapshots remained byte-stable;
- temporary finalizer/projector/sync workflows self-removed and are absent from the final PR changed-file set.

---

## 3. Exact-head evidence

All pull-request workflow runs returned for exact candidate `853b99ca9080d07e4e7f8c1b7acaddb59ac5030a` were terminal `SUCCESS` before merge.

Key runs:

- Search Modal Contract: `31223124293` — source validation, production-like build, Chromium/WebKit runtime and read-only proof `SUCCESS`;
- Home SearchAction Contract: `31223124270` — canonical SearchAction runtime, including WebKit, `SUCCESS`;
- Runtime Interactive Audit: `31223124258` — Home Chromium/WebKit, headed lifecycle, A13 WebKit matrix and durable interactive audit `SUCCESS`;
- Shared Files Guard: `31223124246` (plus successful rerun `31223273580`) — lane collision, cache revision, control-plane, legacy inventory and Strangler readiness `SUCCESS`;
- Source Authority Contract: `31223124273` — `SUCCESS`;
- Native Source Contract: `31223124324` — `SUCCESS`;
- Route Registry Validators: `31223124241` — registry contracts, Chromium, WebKit and public-surface browser matrix `SUCCESS`;
- Visual Parity Guard: `31223124245` — `SUCCESS`;
- Deploy Candidate Contract: `31223124287` — `SUCCESS`;
- Node Toolchain Contract: `31223124225` — `SUCCESS`.

Additional triggered Search/reader/editorial/Gill/TTS/Avraam workflow groups on the same SHA were also terminal `SUCCESS`. Conversation comments were `0`, inline review threads were `0`, and the final changed-file list contained no temporary one-shot workflow.

Five historical `COMMENTED` review submissions remain as non-blocking forensic review history; GitHub does not allow dismissing comment-only review submissions. Their requested changes are implemented and covered by the exact-head evidence above.

### Disposition

`AR-IDX-09` is **closed** and removed from MASTER. Its historical predecessor PRs `#1166`, `#1168` and `#1174` remain closed unmerged as forensic transaction/successor history.

---

## 4. `SYS-STRANGLER-RETIREMENT` — exact Search-head re-read

Shared Files Guard run `31223124246` emitted artifact:

- artifact: `repository-control-plane-audit-31223124246`;
- artifact id: `9011117504`;
- digest: `sha256:8b3ca43588b5ff3c6e57170ca9879232e86b14364058cde8f9ac6bef214b6e0a`;
- artifact head SHA: `853b99ca9080d07e4e7f8c1b7acaddb59ac5030a`.

Exact `legacy-shadow-retirement-readiness.json` summary:

- public indexes: `53 / 53`;
- native shadows: `52`;
- native shadow bytes: `4,036,183`;
- built apps: `1`;
- ledger entries: `53`;
- missing ledger candidates: `0`;
- classification-clear references: `52`;
- unknown reference decisions: `0`;
- reference owner decisions: `0`;
- unexpected reference classifications: `0`;
- dependency records: **35**;
- nonblocking dependencies: `9`;
- mechanical repoints: **16**;
- obsolete-or-repoint: **3**;
- dependency owner decisions: **7**;
- unknown dependency impacts: `0`;
- integrity problems: `0`;
- inventory coverage problems: `0`;
- parity problems: `0`;
- blocker total: **26**;
- parity authority clear: `true`;
- `deletionReady: false`;
- `physicalMoveAuthorized: false`;
- verdict: `NOT_YET_SAFE_TO_MOVE_OR_DELETE`.

Compared with the #1176 23-blocker state, #1187 registered cache-bust as a governed mechanical dependency reader and the Search authority work registers two additional policy readers. The increase is therefore explicit dependency-accounting debt, not reopened reference ambiguity: unknown references, integrity, coverage and parity remain zero.

Physical move/delete remains forbidden. The next Strangler transaction remains mechanical repoint / obsolete-reader retirement / seven owner decisions until `blockerTotal=0`.

---

## Current handoff

After Product `#1183`:

- `AR-IDX-09` is closed;
- the broadened Nagornaya `NG-INLINE-01` I/II/III/V presentation root is the cleanest scoped current defect for the next Product lane;
- `S-SEC-01` remains a separate shared-runtime security-design finding. Existing evidence proves the blacklist/attribute-stripping design remains, but does not by itself prove an executable XSS path; its repair lane should begin with an explicit threat model and adversarial fixtures rather than assuming exploitability;
- `SYS-STRANGLER-RETIREMENT` remains open at 26 exact blockers and still forbids physical retirement.
