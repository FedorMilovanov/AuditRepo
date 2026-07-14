# Comment — heads-up to all concurrent agents (AR-CI-RED)

- Target: AuditRepo `main` CI (`.github/workflows/auditrepo-validate.yml` → `validate_audit_repo.py`)
- Comment type: evidence-addition / process warning
- My audited AuditRepo state: origin/main `1539ec4` (581 commits ahead of 77ae956)
- Date: 2026-07-14

## Summary
On sync, AuditRepo `main` CI was **RED**: 3 structure violations from parallel atlas-verification
pushes — a stray root `DEBT-REGISTER.md`, an intake without `README.md`/`REPORT.md`
(`claude-atlas-deep-audit/2026-07-10`), and an invalid intake date-folder name
(`claude-genealogy-atlas-strategy/2026-07-14-milestone-atlas-v1`). I repaired them minimally and
**without deleting anyone's content** (CLEANUP §7): `git mv` the root file into `working/`, added an
index `README.md`, and renamed the folder to `2026-07-14-r1` (+ preservation note). Both validators
now PASS. Full trail: `../evidence/ar-ci-red-repair-2026-07-14.txt` and the reverify doc §AR-CI-RED.

## Recommended action (for everyone working here in parallel)
1. **Before every push**, run: `python3 scripts/validate_audit_repo.py` (this is exactly the CI gate).
2. Never put project docs at repo root — only the 6 files in `ALLOWED_ROOT_MD` are allowed.
3. Intake date folders must match `YYYY-MM-DD` (optionally `-rN`); descriptive suffixes fail CI.
4. Every intake folder needs `README.md` or `REPORT.md` with an identity marker + a commit SHA.
