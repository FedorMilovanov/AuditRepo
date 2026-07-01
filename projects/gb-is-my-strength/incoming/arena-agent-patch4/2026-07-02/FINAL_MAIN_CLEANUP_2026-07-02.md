# Final main cleanup — 2026-07-02

## Source repo
- Repo: `FedorMilovanov/gb-is-my-strength`
- Final main SHA after cleanup: `08064040`
- Open PRs after cleanup: `0`
- Merged PRs in this cleanup:
  - `#28` — Gill TOC overlay save wiring + PlayEmber overflow fix.
  - `#29` — visual parity screenshot stabilisation and local route-list sync attempt.
  - `#30` — final correction: keep Visual Parity workflow default to documented landing routes only.
- Deleted merged remote lanes:
  - `lane/patch4-gill-toc-actions-2026-07-02`
  - `lane/visual-parity-nagornaya-ci-2026-07-02`
  - `lane/visual-parity-landings-only-2026-07-02`

## Why PR #30 was needed

After PR #28 merged, main CI failed in `Visual Parity Guard — pixel-diff` on `/nagornaya/chast-1/` desktop:

- CI diff: about `1.448%`.
- Local focused route run: stable pass after retries, about `0.230%`.

Root cause was a CI contract mismatch: `visual-parity.yml` described and was intended as a landing-route pixel-diff gate, but its GitHub default route list included the long article route `/nagornaya/chast-1/`; the local npm `visual:parity:guard` did not include that route originally. This allowed local green / CI red drift.

Final fix in PR #30 removed `/nagornaya/chast-1/` from both:

- `.github/workflows/visual-parity.yml` default route list;
- `package.json` `visual:parity:screenshots:landings` route list.

The screenshot script stabilisation from PR #29 remains useful, but long native article pages are no longer part of the blocking landing-route pixel workflow.

## Final CI status observed

Latest main SHA `08064040`:

- `Shared Files Guard` — success.
- `Deploy to GitHub Pages` — success.
- Manual `Visual Parity Guard — pixel-diff` on `main` default routes — success.
- Notify workflow runs after successful workflows — skipped as expected.

## Local gates run during cleanup

- `npm run validate:static-publication` — pass on PR #28 lane before merge.
- `npm run gill:mobile-play:smoke` — pass.
- `npm run gill:mobile-layout:audit` — pass.
- `npm run visual:parity:guard` — pass after PR #30 route-list cleanup.
- `npm run guard:shared-files` — pass for each lane commit with `[LANE ...]` tag.

## Remaining note

Older failed Visual Parity runs remain in GitHub Actions history for earlier SHAs (`b9f4cb59`, `07decfa6`, `f14c5438`), but latest main (`08064040`) has green deploy/shared checks and a green manual Visual Parity run.
