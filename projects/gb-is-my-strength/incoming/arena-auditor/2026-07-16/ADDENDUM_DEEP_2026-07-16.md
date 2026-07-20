# ADDENDUM — deep pass (cycle 2) · 2026-07-16

Extends `REPORT.md`. Same mode: **auditor only**, no source patches.

## A. Deploy root cause (now repair-ready)

**ID:** DEP-BLOCK-DIST-PUBLICATION-AUDIT / GATE-HEART-RAIL-MARKER-DRIFT  
**Confidence:** confirmed-current (W1 source + W2 CI step matrix)  
**Detail:** `evidence/DEP-BLOCK-DIST-PUBLICATION-ROOTCAUSE_2026-07-16.md`

### One-line mechanism

```text
dist-publication-audit expects Heart → "gbs2-rail"
GillSeriesRail emits                    "gbs-rail"
audit-pro accepts both  → static gates GREEN
dist-publication does not → deploy RED after build
```

### Minimal repair (for repair agent — not done here)

```diff
# scripts/dist-publication-audit.js  visualShadowArticleMarkers
- 'rimlyanam-7-...': [..., 'gbs2-rail'],
- 'krajne-li-...':   [..., 'gbs2-rail'],
+ 'rimlyanam-7-...': [..., 'gbs-rail'],  // or dual-accept like audit-pro
+ 'krajne-li-...':   [..., 'gbs-rail'],
```

Prefer shared helper with `audit-pro` to kill GATE-MARKER-DATA-DRIFT class.

### Verification chain after fix

```bash
npm run strangler:build:production-like
# pagefind as deploy
node scripts/dist-publication-audit.js --require-pagefind --forbid-dev   # 0 issues
# push → deploy.yml GREEN → Pages SHA == functional SHA
```

## B. Pixel-diff (advisory)

- Workflow: Visual Parity Guard — pixel-diff (`visual-parity.yml`)  
- Run: 29452653070 @ same SHA — fail at «Run pixel-diff screenshots»  
- **Does not block deploy** (workflow comment + separate job)  
- Artifacts not downloadable (blob EOF)  
- Treat as P2 noise until baselines refreshed after intentional chrome changes  

## C. Book engine deep gap

See `evidence/BOOK_ENGINE_DEEP_GAP_2026-07-16.md`.

Summary: data 22 articles / 4 chapters **in main**; sheet structure OK; desktop rail nested article→section **not** ported; progress copy still «серии».

## D. SSOT still stale (AuditRepo)

Until verifier rewrites:

| File | Action needed |
|---|---|
| `NEXT_AGENT_PROMPT.md` | HEAD → `f5e2b4ff`; priority → dist-publication marker fix |
| `MASTER_BUG_MATRIX.md` | P0: open DEP-BLOCK-DIST-PUBLICATION-AUDIT; supersede old DEP-BLOCK-* with CI evidence static gates green |
| reverify | `CURRENT_HEAD_REVERIFY_2026-07-16_f5e2b4ff.md` |

**This intake does not edit verified/** (Single-Writer discipline: matrix needs intentional verifier session).

## E. Candidate ledger update

| ID | Sev | Status this pass |
|---|---|---|
| DEP-BLOCK-DIST-PUBLICATION-AUDIT | P0 | **repair-ready** (mechanism + file + line-level fix) |
| PROD-STALE-DEPLOY-RED | P0 | open until deploy green |
| GATE-HEART-RAIL-MARKER-DRIFT | P0 | alias of above |
| CI-PIXEL-DIFF-HEAD-RED | P2 | open advisory |
| BOOK-RAIL-NESTED-TOC-GAP | P1 | open (post-deploy) |
| BOOK-PROGRESS-COPY | P2 | open |
| AUDITREPO-SSOT-HEAD-DRIFT | P1 | open |

## F. What we could not witness

- Full Actions log text / artifact zip (egress EOF)  
- Local production-like dist build (not run; OOM/time — not required once marker mismatch proven)  
- Live DOM of `dist/` for krajne (inferred from Astro source + ownership)  

## G. Bottom line (cycle 2)

Deploy is red for a **one-file gate drift**, not because book data is invalid.  
Fix the Heart markers in `dist-publication-audit.js` → unlock Pages → then reconcile SSOT → then book visual lane.

