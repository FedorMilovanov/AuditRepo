# Current-head reverify — static-asset worktree portability closure

## Disposition

`FIXED-CURRENT / closed-by-existing-owner-repair`

## Anchors

- Reverify date: 2026-09-12
- Product repository: `FedorMilovanov/gb-is-my-strength`
- Current Product `main`: `81b3cb63013da25cdaa096730b17fbca61023da8`
- Product PR: #2010 `feat(teen): ship route-specific visual media`
- Exact certified head: `b450cfcbe2be51de5275847f17f21eb1991c6b5d`
- Merge: `06f3e2a985710abe06dcbde76b48231121cc0990`
- AuditRepo base: `09bb0426de9f69240ec84b313eb7b69ee5e1ea6e`

## Mechanism

The combined visual-parity witness initially appeared to report six missing Genesis6 catalog images only in an additional Windows worktree.

Git authority showed that:

- `images/articles/genesis6` is a mode-`120000` symlink entry;
- its target is the canonical `public/images/articles/genesis6` asset tree;
- the assets themselves were present and valid.

The ordinary checkout materialized the symlink correctly. An additional Windows worktree materialized the mode-`120000` entry as a plain file, so filesystem checks under the legacy root path failed even though the canonical public assets existed.

This is an audit/worktree portability defect, not Product media loss.

## Repair already owned by #2010

PR #2010 introduced `scripts/lib/static-public-asset.js` and moved Articles catalog media validation to repository static-asset authority.

The resolver:

1. normalizes the public URL;
2. checks `public/<asset>` first;
3. retains the legacy root path only as fallback;
4. requires an actual file via `statSync(...).isFile()`.

Therefore validation no longer depends on Windows being able to materialize the compatibility symlink.

## Independent Windows worktree witness

At exact head `b450cfcbe2be51de5275847f17f21eb1991c6b5d`:

- additional worktree `images/articles/genesis6`: plain file, not a usable link;
- `WT_ROOT_CHILD=False`;
- `WT_PUBLIC_CHILD=True`;
- `articles-visual-parity-audit.js`: EXIT=0;
- all six Genesis6 catalog images resolved under `public/images/articles/genesis6/...`.

This directly exercises the environment that produced the false-red.

## Exact-head server evidence

All triggered workflows on the final #2010 head succeeded, including:

- Shared Files Guard — `34717515107`
- Native Source Contract — `34717515083`
- Runtime Interactive Audit — `34717515087`
- Source Authority Contract — `34717515111`
- Visual Parity Guard — pixel-diff — `34717515081`
- Deploy Candidate Contract — `34717515106`
- Teen Series Release — `34717515104`
- Metadata SSOT Closure — `34717515124`
- Article Capability Completeness — `34717515126`
- Route Registry Validators — `34717515114`

The earlier LOT WebKit timeout belonged to an older #2010 head/run and was not a TEEN/media or static-asset failure; final exact-head Runtime Interactive is green.

## Current-state consequence

The Windows-worktree Genesis6 image false-red is closed. No new Product defect remains on this mechanism, and no competing repair lane is needed.

MASTER arithmetic is unchanged.

## AuditRepo transaction boundary

This reconciliation modifies only the append-only closure ledger and this receipt. It does not edit `MASTER_BUG_MATRIX.md` or `SYSTEM_THEMES.md`.
