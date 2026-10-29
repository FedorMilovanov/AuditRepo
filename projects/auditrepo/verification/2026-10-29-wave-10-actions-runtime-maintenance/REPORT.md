# Wave 10 — GitHub Actions runtime maintenance

**Trigger:** post-merge `main@3f6ac5cf2aa60989fef091a0c54bf46463c9f584` validation annotations

**Class:** technically accessible AuditRepo control-plane maintenance

## Signal

Both required checks succeeded, but GitHub reported that pinned `actions/checkout@v4`, `actions/setup-python@v5` and `actions/upload-artifact@v4` still targeted deprecated Node.js 20 and were being forcibly executed on Node.js 24. This was not a current failure, but leaving the compatibility translation implicit made future runner behavior depend on GitHub's fallback.

## Repair

All workflow uses were updated atomically to current immutable release commits:

- `actions/checkout@v7.0.1` → `3d3c42e5aac5ba805825da76410c181273ba90b1`;
- `actions/setup-python@v7.1.0` → `6d4fd22b20465ccc0f7354476588e8df7c9ca0e0`;
- `actions/upload-artifact@v7.0.2` → `cf430e030ddbb5b0abf93d22962f4752f3646cd9`.

Release tags and exact commit identities were independently resolved through the upstream GitHub API. No floating tags were introduced. Existing inputs, permissions, artifact paths, retention periods and mutation boundaries are unchanged.

## Scope

Five workflow files changed. This wave does not update unrelated Product repositories, close issues, change branch protection or weaken checks. Hosted CI must prove the upgraded actions at the exact branch head before merge.
