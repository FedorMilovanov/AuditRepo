# CURRENT HEAD REVERIFY — stale Home z-token closure

**Date:** 2026-08-02  
**AuditRepo base:** `844f66cda807ff2e807e94e6bdf0e1c1c8d39407`  
**Exact source anchor:** `b251c4b99265a9915881048c5fbde61f810d8c96`  
**Last exact production authority:** `abf1edba190280e554dfda085bef9fb6594c896d`  
**Canonical finding:** `AR-IDX-CSS-01`  
**Production claim:** none

## Claim rechecked

The open row asserted that Home uses 18 `--z-*` variables without definitions, causing fixed/sticky layers to fall back to `z-index:auto`.

At exact source anchor `b251c4b99265a9915881048c5fbde61f810d8c96`:

- `css/site.css` defines the shared z-index scale in `:root`, including `--z-elevated`, `--z-dropdown-high`, `--z-sticky`, `--z-bottom-bar`, `--z-tooltip-low` and `--z-toast-high`;
- `css/home.css` consumes those variables for the reading progress, navbar, mobile navigation and related Home controls;
- the single commit between `7e43efa1a691052314599a9ff96613126b5de099` and `b251c4b99265a9915881048c5fbde61f810d8c96` is the NoteRegistry core and does not modify `css/site.css` or `css/home.css`.

## Disposition

`AR-IDX-CSS-01` is **STALE-ON-CURRENT-HEAD / SOURCE VERIFIED**. The missing-definition root cause is no longer present. This closure does not certify every unrelated stacking interaction and makes no production claim.

## Arithmetic

- canonical IDs: 358
- closed: 184 → 185
- open: 174 → 173
- P1: 85 → 84
- all other category counts unchanged
