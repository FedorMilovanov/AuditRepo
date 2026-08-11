# V14 SW toast accessibility — terminal closure

Date: 2026-08-11
Product: `FedorMilovanov/gb-is-my-strength`
Audit root: `V14-SW-TOAST-A11Y`
Disposition: **TERMINAL MERGED-GREEN / RESIDUAL NONE**

## Root

The service-worker notification shell exposed update/offline state through a pointer-oriented notification surface. Passive state lacked an explicit live-status owner and the reload path was not a native keyboard-operable action. The actionable update could also disappear on the legacy timeout while a keyboard user was interacting with it.

## Product closure

Fresh-main successor Product PR #1627, `fix(sw): make update notices keyboard-accessible on fresh main`, merged to current Product history as commit `8a9520e776cd607c4ac287517be2c71ffdc70301` from exact tested head `c9651910acc5ff2e62da093521a09ec3b569af59`.

The repair makes the notification owner a polite atomic status, preserves passive auto-dismiss behavior, renders reload as a real `button[type=button]`, keeps actionable update state available until reload/replacement/teardown, and preserves visible keyboard focus/mobile wrapping. It reuses the repository's governed cache-bust normalizer rather than introducing a second writer.

## Verification

Exact-head Product CI for `c9651910acc5ff2e62da093521a09ec3b569af59` records:

- `Shared Files Guard` — PASS.
- `SW Register Accessibility Contract` — PASS.
- job `Chromium WebKit status and reload action` — PASS, including exact-commit checkout/identity, syntax validation, Chromium + WebKit accessibility behavior, and evidence upload.
- adjacent source/authority/deploy/search-cold-bootstrap/overlay-runtime contracts relevant to this repair also completed successfully.

The same head still contained unrelated pre-existing Search/app-surface and other runtime reds; those are not used as evidence for this root and are not attributed to the SW repair. `V14-SW-TOAST-A11Y` therefore leaves active MASTER now, while Search remains active independently.

## Terminal result

`V14-SW-TOAST-A11Y` is solved by a root-level product change plus a permanent Chromium/WebKit class guard. No active residual remains. Do not reopen this root without fresh current-main evidence.