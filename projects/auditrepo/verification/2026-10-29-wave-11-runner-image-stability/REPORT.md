# Wave 11 — runner image stability

**Trigger:** exact-head PR #503 checks after the Node 24 action upgrade  
**Class:** technically accessible workflow reproducibility maintenance

All three workflows succeeded and the Node.js 20 deprecation annotations disappeared. GitHub then emitted the repository-wide notice that `ubuntu-latest` is migrating to Ubuntu 26 beginning 2026-10-19.

AuditRepo's validation, custody and destructive ref-retirement proofs should not silently change operating-system generation under an unchanged repository commit. All six jobs are therefore pinned from the moving alias to `ubuntu-24.04`.

This keeps the currently proven environment explicit while Ubuntu 26 migration occurs. It does not freeze tool dependencies inside the repository or claim perpetual support; a future deliberate runner upgrade must use an exact-head CI transaction and update this evidence.
