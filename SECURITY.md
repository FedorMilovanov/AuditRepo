# Security and sensitive-evidence handling

AuditRepo stores audit observations, verification artifacts and root-cause analyses across projects. This makes **provenance, redaction, permitted access and responsible disclosure** important even when the repository contains no deployed runtime.

## Reporting vulnerabilities

Never paste a live credential, personal dataset, exploit payload, private environment URL or unpublished security weakness into a public issue, PR, verification report or screenshot.

Use GitHub's **Security → Report a vulnerability** private channel if available. Otherwise contact the maintainer through a pre-existing trusted private channel. Identify the affected component and revision, a redacted reproduction, expected/actual behavior and impact. Do not invent a public contact email or expose secret material to request one.

## Evidence safety principles

1. **Own and authorized scope only.** Do not inspect another person's private data, exercise leaked credentials or run intrusive tests without permission.
2. **Evidence may be sensitive.** Raw logs, HTTP headers, browser captures, auth traces and external research snippets must be redacted or withheld when publication would disclose credentials, personal data or a still-exploitable security weakness.
3. **History is not credential revocation.** If an active secret is exposed, revoke or rotate it at the provider first. A deletion from the newest commit or a rewritten Git tree does not revoke a token or cookie.
4. **Product truth stays in Product.** AuditRepo's recorded observation does not grant write access to another repository, provider account, live database or external system. Verify current Product source, open PRs and the authorized owner before mutations.
5. **Rights and provenance matter.** A screenshot, document scan, archive or report retains its actual source, licensing and privacy obligations. Do not infer reuse rights from the fact that an artifact exists here.
6. **Preserve useful audit history safely.** Follow [CLEANUP_RETENTION_POLICY.md](CLEANUP_RETENTION_POLICY.md) and the artifact-admission gate; do not conceal a confirmed security problem by deleting the active finding without an evidence-based disposition.

## Verification before publication or repair

The canonical rules are in [AUDITREPO_OPERATING_MODEL.md](AUDITREPO_OPERATING_MODEL.md), [MULTI_WITNESS_VERIFICATION_PROTOCOL.md](MULTI_WITNESS_VERIFICATION_PROTOCOL.md) and [CONCURRENT_EDIT_PROTOCOL.md](CONCURRENT_EDIT_PROTOCOL.md). High-risk findings (security, rights, data loss, production identity) require independent corroboration proportionate to impact; failure or unavailable evidence is not proof of success.

Repository checks are implemented by [scripts/validate_audit_repo.py](scripts/validate_audit_repo.py), [scripts/check_artifact_admission.py](scripts/check_artifact_admission.py) and the project workflows under [.github/workflows/](.github/workflows/). They validate repository contracts, **not** the current safety of every system mentioned in an historical report.

This policy is explanatory and does **not** replace the existing audit operating model or authorize new provider writes.
