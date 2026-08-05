# Reader Projection & Controls — Exact-Head Audit Report

## Verdict

**PASS as an independent current-head audit.** The audit harness, provenance and production-like build succeeded. The Product remains functional, the completed TTS delivery/runtime slice remains closed, and four independent non-TTS repair clusters are confirmed-current.

This package is an **intake**, not a closure transaction. It changes no `MASTER_BUG_MATRIX.md` status and makes no production-deployment claim.

## Three-repository authority scan

| Repository | Role | Result |
|---|---|---|
| `FedorMilovanov/gb-is-my-strength` | Product/runtime authority | Exact current source and production-like browser behavior audited |
| `FedorMilovanov/AuditRepo` | Evidence/SSOT authority | This immutable intake records provenance and classification; no row transition |
| `FedorMilovanov/Research` | Evidence backend | README/rules and searches for ReaderProjection, radiogroup, popup, speakable and favorites found no governing Product contract; no Research mutation required |

Product rules read before the lane: `AGENTS.md`, `AGENTS-REFERENCE.md`, `docs/WORK_MODES.md`, `docs/LANE_LOCK_POLICY.md`, `docs/GIT_WORKTREE_POLICY.md`, and `docs/OWNER-INVARIANTS.md`. AuditRepo and Research root/project rules were also read.

## Exact Product identity

- Product base / rollback: `ff73bd8ccdacf5c521377fb5a7b42479bf701808`
- Audit head: `182793e35c238c6b4635e25bdf9c2dbb3696b75f`
- Audit PR: Product #970
- Workflow run: `30966440764`
- Source job: `92181362473` — success
- Browser job: `92181362486` — success
- Source artifact: `8914900439`
- Source digest: `sha256:2074d961a4cc32f6eb7fd427bb0af995fd71703d7ffb6b8f69e463508cfe5f50`
- Browser artifact: `8914961188`
- Browser digest: `sha256:b895deb934ed00cc84d680a153c8d028d49a7bf5f31a821c7aa387f289350073`
- Shared Files Guard run `30966440717` — success
- Metadata & IndexNow Readiness run `30966440737` — success
- Node Toolchain Contract run `30966440733` — success

Both audit jobs explicitly checked out `github.event.pull_request.head.sha`, failed closed unless `git rev-parse HEAD` equalled that SHA, and stamped the checked-out SHA into their JSON reports. The Product diff contained exactly four audit-only files and zero runtime/UI/content/dependency mutations.

## Check inventory

- Source/owner checks: **80** — 40 pass, 40 diagnostic findings.
- Production-like Chromium checks: **182** — 129 pass, 53 diagnostic findings, 0 harness errors.
- Total authoritative named checks: **262**.
- Routes: Hermenevtika, Gill part 1, Antisovetov.
- Viewports: desktop `1440×900`, mobile `390×844`.
- Production-like Astro build: success; no page exceptions in any of the six route/viewport cases.

## Stable current behavior

- Canonical `GBReaderTTS` API was ready on every audited route.
- No public legacy TTS overlay was rendered.
- Exactly one Play owner was visible per case.
- One Play click started exactly one speech owner and emitted non-empty speech text.
- JSON-LD parsed and Article schema was present.
- Hermenevtika SpeakableSpecification remained present.
- No duplicate DOM IDs were found.
- Save surfaces synchronized `aria-pressed` and saved CSS state.
- Gill's closed speed rail already removes radios from the Tab order and sets `aria-hidden=true`.

These results narrow the legacy TTS source duplication to dormant architecture debt; they do **not** reopen the completed TTS delivery/runtime closure from Product #876/#929 and AuditRepo #168.

## Confirmed-current repair clusters

### 1. Shared ReaderProjection is absent

All three routes, desktop and mobile, rendered zero explicit `data-reader-*`/search/speakable policy markers and exposed no shared ReaderProjection API. TTS still uses a hard-coded block inventory while Hermenevtika JSON-LD owns separate speakable selectors. Search/summary/print do not consume one common projection policy.

### 2. Speed/search accessibility and radiogroup model are incomplete

Hermenevtika's naturally closed rail is visually hidden but is neither `aria-hidden` nor inert, and all five radios remain `tabIndex=0`. Its badge has no `aria-controls`/`aria-expanded`; ArrowRight/Home/End navigation is absent.

Gill's naturally closed rail is correctly hidden from Tab/AT, but when opened all six radios become Tab stops. The badge has no ownership/expanded semantics; Home/End are absent. ArrowRight currently moves focus, so the Gill finding is narrower than Hermenevtika.

### 3. Mobile Play popup semantics are false

On desktop, the visible Play button names a real controlled popup. On all three mobile cases the visible Play button advertises `aria-haspopup=true` while exposing no `aria-controls` and controlling no popup element.

### 4. Favorites metadata/store is presentation-derived

The UI surfaces synchronize pressed/class state, but persisted records have no canonical `type`/`category`, no schema version and no versioned store API. The stored section is breadcrumb presentation (`Главная` or `⌂ Главная`) even when `window.SITE_CONFIG.page` exposes canonical route metadata such as `Биографии служителей` or `Тёмная сторона кафедры`.

Browser evidence also shows saved buttons retaining the label `Добавить в Избранное`; the source probe's broad label regex incorrectly counted that as synchronized. Label synchronization is therefore included in the repair scope.

## Non-authoritative / narrowed signals

- The source check `RC-AUTH-01` is a literal-name false positive; the runtime owner exists.
- Broad source regexes are inventory signals, not proof of runtime behavior.
- The generic `[aria-hidden=true] descendant` inventory includes many CSS-hidden sheets and does not by itself prove sequential keyboard reachability. Only direct speed-slot state checks are promoted here.
- “Final rail closes visibly” was sampled inside a CSS transition. State semantics and Tab ownership, not the transient opacity frame, are authoritative.
- The old TTS state machine remains in `floating-cluster-controller.js`, but audited routes showed one live owner. Treat it as later bounded pruning/convergence work, not a production TTS failure.
- Earlier Product audit PRs #963 and #965 were closed unmerged. Their artifacts are diagnostic only because of base races and synthetic merge provenance. Product #970/run `30966440764` is the sole authority for this intake.

## Required lane order

1. `SYSTEM` controls accessibility lane: Hermenevtika/Gill speed-slot exposure, roving keyboard model, badge ownership, truthful mobile Play semantics.
2. `SYSTEM` ReaderProjection lane: shared policy/API and explicit content markers; preserve TTS FSM/engine behavior.
3. `SYSTEM` favorites lane: canonical route metadata, versioned payload/store/event, all-surface label synchronization and legacy migration.
4. Optional bounded legacy-TTS pruning only after the first three lanes and dedicated one-owner regression evidence.

No lane may combine unrelated Home, source-link, content, design or TTS-engine changes.