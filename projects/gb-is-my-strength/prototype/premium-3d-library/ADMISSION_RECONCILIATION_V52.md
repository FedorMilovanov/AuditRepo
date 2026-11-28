# V5.2 artifact admission reconciliation (2026-11-08)

Scope: **experimental AuditRepo Premium 3D Library**, not Product.

AuditRepo Validate failed on source ZIPs and a GPT Image design reference without
artifact admission sidecars, and on an exact duplicate of a progression preview.
All three original binary files have now been preserved byte-for-byte with
standard sidecars (path, size, SHA-256, purpose, provenance, retention).

`preview/progression-screenshot.png` was byte-for-byte identical to the canonical
`preview/progression-1440.png` (SHA-256
`2077b358fcb556f1bc2a96c35b08fc6f091c9776460e05a2240083b0bc3216db`).
README already pointed to the canonical file. The redundant file was removed,
its two manifest references reconciled, and its historical bytes remain
recoverable from the parent Git commit. Nothing was regenerated or substituted.

`V5_SOURCE_MANIFEST.json` is reconciled against exact staged Git blob bytes,
not Windows CRLF working-tree representations. `V52_ART_MANIFEST.json` remains
scoped to the independently tested architectural art wave.

The validator has **not** been bypassed, disabled, weakened or marked
continue-on-error. Product site and all unrelated prototype lanes are untouched.
