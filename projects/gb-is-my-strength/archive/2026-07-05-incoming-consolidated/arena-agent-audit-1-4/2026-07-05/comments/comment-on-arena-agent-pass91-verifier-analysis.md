# Comment on Finding — AUDIT 1.4 Verifier Analysis of Pass 91

## Target

- **Target report:** `incoming/arena-agent-pass91/2026-07-05/REPORT.md`
- **Comment type:** verifier analysis + matrix update
- **My audited SHA:** `2f09c8f5`
- **Mode:** verifier + matrix-deepener

## Summary

Pass 91 made 3 claims. Analysis:

### 1. "96959c93 is phantom SHA" — ❌ CHALLENGED (correct fix, flawed reasoning)

**Pass 91:** "This SHA doesn't exist in source repo."

**My verification:**
```bash
$ git rev-parse 96959c93
96959c933a28fa714eb9db449404cf611fae8a61  # EXISTS ✅
$ git branch -a --contains 96959c93
remotes/origin/lane/gill-pre-v16-submenu-frame
```

`96959c93` IS a valid SHA. It exists on `lane/gill-pre-v16-submenu-frame` (not on `main`).
Pass 91 did a `git clone` which shallow-clones only `main` branch — lane SHA wouldn't appear.
But `git rev-parse` works for any SHA regardless of branch.

**Correct fix:** Matrix now references `8c318010` (main HEAD) ✅
**Wrong reasoning:** Called `96959c93` "phantom" when it's a valid SHA on a lane branch.

### 2. "AUDIT-P0-SWBASELINE → P2" — ✅ AGREED

**My analysis:** SW has correct CACHE_VERSION (v187), baseline.json is documentation only,
CI intentionally uses note() not bad(). No runtime impact. P2 is correct.

### 3. "P1-DEPLOY-FAIL-REOPEN (Pass 90)" — ⚠️ PARTIAL AGREEMENT

**My analysis:** deploy.yml:63-64 allows `|| failure`. This is intentional design with warning.
deploy.yml runs its own validation gates (not bypassing checks). Risk: continuous deploy loop
if IndexNow repeatedly fails. Severity: P2 (not P1). Design choice documented in warning.

### 4. "AR-006 conflict marker" — ✅ RESOLVED

No conflict markers found in NEXT_AGENT_PROMPT.md. Already fixed or was transient.

### 5. Matrix updates added (6 entries)

- AUDIT-P1-CI-GATE-GAP (P1) — 5th witness, production CI
- AUDIT-P2-SW-PRECACHE-4 (P2) — 4 lazy PRECACHE assets
- AUDIT-P2-AR-STALE (P2) — AuditRepo lags source
- AUDIT-P2-WORKFLOWS-CHECK-GAP (P2) — check-workflows.js misses job conditions
- AUDIT-P3-OG-LCP-MISMATCH (P3) — 4 routes og:image ≠ LCP
- AUDIT-P3-SEARCH-LAZY-CONFIRMED (P3) — Pass 56 vs SW PRECACHE conflict
- BUG-ARCH-001 updated: 4 assets (not 2)

## Status

- Pass 91 SHA correction: ✅ VALID (reasoning flawed but fix correct)
- Pass 91 P0→P2 downgrade: ✅ AGREED
- Pass 90 P1-DEPLOY-FAIL-REOPEN: ⚠️ Downgrade to P2 (design choice, not regression)
- AR-006: ✅ RESOLVED
- Matrix gaps: ✅ 6 entries added