# Promotion verification — W5 premium reader and current architecture truth

Date: 2026-08-05

## Source identities

- Pre-W5 production: `d03f09188cd0360c6c984ed93d03b1432913332c`.
- W5 PR: `FedorMilovanov/TheLegendaryPoet#322`.
- W5 exact tested head: `0536547e178fb091de1a76c85aecec4409478975`.
- W5 squash production: `6f13600ba88f08123c8c1b817ffdc0ca3dec0bc0`.
- Current-truth PR: `FedorMilovanov/TheLegendaryPoet#325`.
- Current-truth exact tested head: `c73cdcb35d30091264db5bf8c1db1c2b0cd46135`.
- Resulting source production: `db6bc3ea8997f78d1370a05e2736cf20645c80dd`.

## W5 exact-head evidence

Every required PR workflow associated with `0536547e178fb091de1a76c85aecec4409478975` completed successfully:

- Project contracts — run `31043346359`;
- CI — run `31043346389`;
- Content model contract — run `31043346323`;
- Articles catalog acceptance — run `31043346317`;
- Yesenin Part I browser acceptance — run `31043346436`;
- Yesenin Part II safe publication — run `31043346368`;
- Site route integrity audit — run `31043346341`;
- Brand deep reference and motion audit — run `31043346334`;
- Brand raster QA — run `31043346333`;
- Manual Browser QA — run `31043346336`, all four jobs successful.

Pages deployment was skipped by the normal pull-request condition and is not treated as a failed product gate.

The promoted W5 outcomes cover desktop Chromium, Android Chrome, desktop WebKit and fresh-process iPhone Safari; archive mutation honesty and exact-poem round-trip; keyboard route focus; reduced motion and forced colors; blocked browser storage; and failed community writes remaining visibly queued instead of reporting false success.

## Current-truth exact-head evidence

Every workflow triggered for `c73cdcb35d30091264db5bf8c1db1c2b0cd46135` completed successfully:

- Project contracts — run `31045020232`;
- CI — run `31045020945`;
- Site route integrity audit — run `31045018727`;
- Brand deep reference and motion audit — run `31045018604`;
- Manual Browser QA — run `31045021380`, all four jobs successful.

PR #325 removed four stale debt claims from the authoritative source document and made the `docs/CURRENT_STATE.md` open-lane section exactly match `docs/project-contract.json`. The resulting source production registers only `TLP-CLEAN-001` and `TLP-GOV-001` as open.

## Promotion decision

- `TLP-QA-001`: promote to `fixed-current`.
- `TLP-SYS-001`: retain `fixed-current` and append the post-W5 truth repair.
- Source production authority: promote to `main@db6bc3ea8997f78d1370a05e2736cf20645c80dd`.
- W6 remains `active-current`; neither inventory nor selective extraction alone proves branch deletion.
- Governance remains `owner-decision` until an explicit package/engine/release/licensing disposition is merged.
