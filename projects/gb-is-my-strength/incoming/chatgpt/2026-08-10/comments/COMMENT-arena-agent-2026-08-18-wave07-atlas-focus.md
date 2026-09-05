# Comment on Finding

## Identity
- Project: `gb-is-my-strength`
- Comment by: Arena Agent (arena.ai Agent Mode) — баговерификатор
- Date: 2026-08-18
- Target report: `incoming/chatgpt/2026-08-10/WAVE-07-ATLAS-FOCUS-STATE-KARTY-SEMANTICS.md`
- Target finding ID: Wave 07 §A **Atlas focus-state lifecycle** class (A1–A6); §B single focus owner mechanism
- Audited anchor (SHA / artifact / live snapshot):
  - Product `main` `485db8c25287fa9bd2f53a5356885f02e4b81f4b`
  - Source: `src/runtime/atlas-runtime.js` (+ `scripts/atlas-focus-state-browser-test.mjs`)
  - AuditRepo MASTER note: `SYS-ATLAS-DRAWER-FOCUS-HANDOFF` closed after Product PR **#1683**
- Signal class: Product (historical defect class → post-fix source check)
- Proof state: **PASS** for `stale` / absorbed-by-system-fix relative to the Wave 07 defect class on current main; **N/A** browser re-run this pass
- Claim boundary: source-level presence of a focus/inert owner and MASTER closure record; **not** a fresh Chromium/WebKit reproduction of A1–A6 on this machine
- Semantic owner / overlap check:
  - MASTER: `SYS-ATLAS-DRAWER-FOCUS-HANDOFF` is **not** an active row (historical closure after #1683)
  - Do not reopen from Wave 07 alone without a new failing focus-lifecycle witness on current main
  - Karty semantic side-notes in Wave 07 are out of scope for this comment

## Comment type

- `stale` — the Wave 07 Atlas focus defect class should not be treated as an open backlog item on current main without new proof
- `evidence-addition` — show the post-#1683 source owner (`setSurfaceInert`, `restoreFocusAfterLayout`, focus restore on `clearFocus` / filter close) that answers §B’s “one state owner” demand

## Evidence

```text
# MASTER (AuditRepo, gb-is-my-strength) still records historical closure:
# SYS-ATLAS-DRAWER-FOCUS-HANDOFF — closed after Product PR #1683 with
# Atlas Chromium/WebKit focus lifecycle green on exact integration candidate.

# Current main atlas runtime is no longer "visual state only":
src/runtime/atlas-runtime.js (Product 485db8c…):
  - setSurfaceInert(element, inert, ariaHidden)
      element.inert = …; aria-hidden true/false ownership
  - restoreFocusAfterLayout(element, displacedFocus, ownsDisplacedFocus)
  - close/filter paths call restoreFocus when active element was inside surface
  - clearFocus(...): if restoreFocus || activeWasInsideDetail → focusGraphOwner(...)
  - focus candidates skip [inert],[hidden],[aria-hidden="true"] ancestors
  - roving tabIndex ownership on graph nodes

# Permanent regression harness still present:
scripts/atlas-focus-state-browser-test.mjs
  (focus/offscreen/detail/filter scenarios — class-level guard)

# What Wave 07 got right (keep as forensic value)
  - correctly collapsed A1–A6 into ONE focus-owner root (not six MASTER rows)
  - correctly demanded inert/hide-from-tab for offscreen drawer/detail
  - audit-transport browser method was proportionate when live nav was blocked

# What changed after the report date
  - Product #1683 integrated a system focus handoff
  - MASTER removed the active SYS row
  - current runtime source implements the missing owner Wave 07 described
```

## Summary

Wave 07 is a **high-quality historical package**: the six mobile/desktop focus stranding symptoms were real as a class, and the “one Atlas focus-state owner” diagnosis was the correct repair shape. On Product `main` `485db8c…` I am **not** reconfirming A1–A6 as open defects. Source now contains the owner Wave 07 said was missing (`inert`/aria-hidden surface control + restore-focus helpers + clearFocus/filter handoff), MASTER already records closure via PR #1683, and a dedicated browser harness remains as the class guard. Treat Wave 07 as **successful root-cause evidence that was absorbed**, not as something to re-admit into MASTER from incoming archaeology. If anyone still sees offscreen tab stops on Atlas, that needs a **new** current browser witness — it would be a regression ticket, not a revival of the pre-#1683 backlog wording.

## Recommended action

- Status change: Wave 07 §A Atlas focus class → **`absorbed-by-system-fix` / do not re-enter MASTER`** without fresh fail proof
- Proposal status: `proposal-conflicted` only if a new browser run fails the harness; otherwise no open proposal
- Conflict registry entry: **NO** (active competing Atlas focus PR not observed)
- Notes for verifier:
  - Optional cheap check: run `atlas-focus-state-browser-test.mjs` on current main if environment allows — expected green
  - Keep Wave 07 in incoming as mechanism teaching material; link from CLOSURE_LEDGER / legacy if useful
  - Karty-only notes in the same file need separate disposition; this comment does not stale those
