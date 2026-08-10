# Terminal report — V08-MAPENGINE-INTRO-FOCUS

Date: 2026-08-10
Disposition: **TERMINAL / MERGED-GREEN**

## Product result

- Product PR: `FedorMilovanov/gb-is-my-strength#1562`
- Exact final head: `64c8a6fa75c4b8ea3dc34c6a214b52ca52576e12`
- Merge commit: `5329e31b713257e0678914d1f4c1827bf2511327`
- The MapEngine Intro now participates in the existing shared special-overlay lifecycle instead of bypassing it.

## Repair

- Intro has its own `special:map:…:intro` overlay owner.
- Existing map underlay controls are blocked through the shared inert-target authority while Intro is visible.
- Initial focus lands on `Начать изучение`.
- Button, backdrop and Escape share one dismissal lifecycle.
- Dismissal lands on the surviving active story owner instead of `BODY`.
- Intro ownership is destroyed with the other MapEngine special-overlay owners.

## Permanent proof

The exact current-main PR head completed `MapEngine Intro Focus Contract` successfully. The production-like Chromium + WebKit matrix covers 390×844 and 1440×1000, all three dismissal paths, sequential Tab/Shift+Tab containment, rendered focusable-underlay inert ownership, deterministic initial focus, post-dismiss focus and uncaught page errors. Metadata/IndexNow was also green and the protected exact-head merge was accepted by GitHub with no current-head red.

## Terminal conclusion

`V08-MAPENGINE-INTRO-FOCUS` is resolved on merged `main` and must not remain active in MASTER. Reopen only on fresh current-main evidence.
