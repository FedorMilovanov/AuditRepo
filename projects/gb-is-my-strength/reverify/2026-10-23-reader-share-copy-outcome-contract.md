# Reader share/copy outcome contract — current receipt

Date: 2026-10-23  
Product anchor: `caeb92c839ff4b4f2838a0ad44a582034c41c8d4` (`main`)  
Disposition: **admit one system verification lane** — `SYS-READER-SHARE-COPY-OUTCOME-CONTRACT`.  
Product mutation: none.

## Question

Does the shared reader action owner announce «Ссылка скопирована» only after a copy mechanism reports success, including the legacy fallback used when Web Share and Async Clipboard are unavailable?

## Shared owner and reach

`src/runtime/reader-actions.js` is the capture-phase owner for `[data-action="share"]`. A production-like final-dist census found:

- 105 HTML files;
- 73 routes loading ReaderActionsRuntime;
- 67 routes with share controls;
- 138 rendered share triggers;
- zero share routes missing the runtime owner.

The source fallback creates and selects a temporary textarea, invokes `document.execCommand('copy')`, removes the textarea and returns normally. It does not inspect the command's boolean result. `share()` consequently assigns `data-share-status="copied"` and announces «Ссылка скопирована» even when the copy command explicitly returned `false`.

This is one shared outcome-contract defect, not 67 route defects.

## Browser evidence

Chromium `153.0.8010.0`, production-like build. Web Share and Async Clipboard were removed before page code ran, while the real document method was deterministically instrumented to return `false` without throwing.

On `/articles/dzhon-gill-chast-1-chelovek/`:

| Profile | `execCommand('copy')` | Trigger status | Live toast |
|---|---:|---|---|
| desktop 1280×800 | `false` | `copied` | «Ссылка скопирована» |
| mobile 390×844 | `false` | `copied` | «Ссылка скопирована» |

The invocation was observed exactly once in both cases. This is not inferred from API absence: the attempted operation returned a negative result and the UI converted it to success.

Positive failure control: with Web Share absent and `navigator.clipboard.writeText()` rejecting `NotAllowedError`, the same desktop control produced `data-share-status="failed"`, «Не удалось поделиться», and did not invoke `execCommand`. The catch/status path works; the fallback fails to propagate its result.

A local external-resource connection error was excluded from judgment because it neither owns nor changes the synchronous copy result.

## Guard gap

`scripts/check-engine-contracts.js` verifies ReaderActions singleton/capture ownership, print behavior, module hashing and strict-native integration. It does not execute or inspect:

- `execCommand('copy') === false`;
- a thrown fallback command;
- Async Clipboard rejection;
- the relationship between operation outcome, `data-share-status`, toast icon and live text.

Repository search found no other permanent contract for the share status branches.

## Bounded closure

The shared copy primitive must reject unless the selected mechanism reports success:

- preserve Web Share success and user-cancel (`AbortError`) semantics;
- preserve Async Clipboard fulfillment/rejection semantics;
- inspect the fallback boolean and reject on `false` or exception;
- always remove the temporary textarea, including exceptions;
- set `copied` and announce success only after fulfilled copy;
- set `failed` and announce failure for a rejected non-cancel operation.

Add one executable owner-level contract covering Web Share success/cancel/failure, Async Clipboard success/rejection, and fallback true/false/throw. Browser closure should recheck at least one desktop and one mobile rendered trigger without forcing a success return.

## Boundaries

- `document.execCommand` obsolescence alone is not the finding; the current defect is false positive status after its explicit `false` result.
- No claim is made that modern secure-context Clipboard writes currently fail.
- No requirement is imposed to remove the fallback if its result can be represented honestly.
- The heading-anchor owner already inspects the same boolean and rejects on false; it is not included as defective.
- Current open Product PRs do not own `reader-actions.js`.

## Evidence

Compact receipt: `evidence/2026-10-23-reader-share-copy-outcome.jsonl`.
