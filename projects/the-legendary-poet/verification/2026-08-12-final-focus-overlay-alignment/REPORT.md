# Final focus / overlay alignment — current evidence

Date: 2026-08-12

Product source authority: `FedorMilovanov/TheLegendaryPoet`
Verified Product head: `d59cceccb0c49af59b1be38d4c547a6240b3005a`
Mode: read-only Product audit; AuditRepo evidence only.

## Purpose

Preserve the final source observations from the long-running audit session and reconcile them against the current active matrix without inventing duplicate roots. A parallel audit agent updated the control plane while this pass was in flight; therefore this report records overlap explicitly instead of overwriting newer authority.

## Confirmed observations

### 1. Citation deep links reveal and scroll, but do not transfer focus

- `src/components/essay/InlineCitations.tsx` renders real `href="#source-<id>"` links.
- `src/components/essay/SourceLibrary.tsx` watches the hash, resets the filter, expands the list, waits two animation frames, and calls `scrollIntoView()` on the matching `li`.
- The destination `li` is not programmatically focusable and the reveal path does not move focus.

Disposition: manifestation of existing `TLP-A11Y-RUNTIME-001`, not a new root. Required terminal behavior remains a single navigation/focus/hash contract where destination reveal, viewport settlement and focus ownership agree.

### 2. Breadcrumb current-page semantics are correct

`src/components/seo/Breadcrumbs.tsx` marks the terminal crumb with `aria-current="page"` and renders ancestor crumbs as actual links.

Disposition: negative evidence. Do not reopen a Breadcrumb semantics bug without a new current witness.

### 3. Shared modal stack is structurally strong

- `src/hooks/useDialogSurface.ts` owns initial focus, topmost Tab containment, Escape participation and conditional focus restoration.
- `src/utils/overlayRuntime.ts` owns a stack of modal roots, document locking, topmost Escape dispatch and detached-root pruning.
- Command Palette and Immersive Player both participate in this shared runtime.

Disposition: do not describe the modal system as generally untrapped or independently competing. Existing defects are narrower lifecycle/ownership exceptions.

### 4. Consent remains an overlay-stack exception when configured

The current active matrix already records the configuration-dependent case where the consent surface can sit above registered `aria-modal` dialogs while not participating in the overlay stack. This pass independently reached the same root-family conclusion.

Disposition: existing `TLP-A11Y-RUNTIME-001`; no duplicate row.

### 5. SourceLibrary extends the systemic contrast evidence

`SourceLibrary.tsx` contains factual source metadata/count/type text in low-opacity foregrounds, including values around `/35`, `/42` and `/45` on very dark surfaces. These are not all purely decorative.

Disposition: manifestation of existing `TLP-A11Y-CONTRAST-001`; require computed foreground/background and non-text contrast certification rather than class-name inspection alone.

## Negative / bounded conclusions retained

- Current community schema source enables RLS, revokes base-table access from `anon`/`authenticated`, exposes public views without `voter_id`, and grants writes only through explicit RPCs. Do not claim a current public base-table/voter-id leak from repository source.
- `AudioPlayerProvider` topology above lower ErrorBoundaries remains resilience hardening only until a normal current provider-level throw witness exists.
- Current Breadcrumb semantics are not a root.
- General modal Tab escape is not a root; `useDialogSurface` contains Tab for the topmost registered surface.

## Control-plane reconciliation

At completion of this pass, AuditRepo had advanced in parallel to 30 active roots (`1 P1 + 21 P2 + 8 P3`). The overlapping findings above were already represented in the current matrix. This report therefore adds evidence and negative boundaries only; it does not increase the active count.

## Handoff rule

Before any repair wave:

1. re-read Product `main` and compare against `d59cceccb0c49af59b1be38d4c547a6240b3005a`;
2. re-read `verified/MASTER_BUG_MATRIX.md` and `WORK_QUEUE.md` from current AuditRepo `main`;
3. never resurrect a negative finding merely because an older verification report mentioned it;
4. assign one root owner per implementation branch/PR and merge overlapping symptoms into that root;
5. after merge, verify exact resulting `main`, then close/remove the root from the active matrix rather than accumulating historical rows.
