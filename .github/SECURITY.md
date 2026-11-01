# Security Policy

## Scope and supported state

Security fixes and operational security decisions apply to the current `main` branch. Historical audit packages, archived projects, old branches and captured evidence are not supported runnable release lines. A historical credential exposure still requires provider-side revocation or rotation.

AuditRepo is an evidence and verification repository. Evidence must not become a place to store live credentials, session cookies, production environment files or private keys.

## Reporting a vulnerability

Do not publish exploitable details, credentials, tokens, private URLs, personal data or proof-of-concept payloads in public issues, pull requests or discussions.

Use GitHub private vulnerability reporting / Security Advisories from the repository Security tab when available. If private reporting is unavailable, contact the repository maintainer privately before public disclosure. Identify the affected path or workflow, impact, reproducible conditions and exact commit without reproducing any live secret value.

## Credential exposure response

Never commit bot tokens, API keys, OAuth tokens, database credentials, cookies, session files, passwords, private keys or production environment files.

If a credential may have been exposed:
1. identify the credential type and provider without copying its value into the report;
2. revoke or rotate it at the provider first;
3. verify the replacement through the provider's owner-controlled operational process;
4. remove the exposed value from reachable Git history where appropriate, but never treat history rewriting as revocation;
5. keep the incident evidence redacted and do not copy a live secret into an audit package.

## Automated repository controls

- The required `preflight` check scans the full Git history with Gitleaks on pull requests and pushes to `main`, with a weekly scheduled scan.
- Workflow preflight validates YAML shape and immutable full-SHA external action references.
- Other repository validation gates remain independent; this policy does not replace artifact admission, evidence custody or project-specific security review.

## Responsible testing

Test only repositories, accounts, files and systems that you are authorized to access. Do not use exposed credentials, access another person's data, attempt destructive provider operations or run denial-of-service tests. Any external or production mutation requires explicit authorization for that exact operation.
