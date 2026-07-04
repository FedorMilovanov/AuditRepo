# Comment on Finding — AUDIT-P1-CI-GATE-GAP (CI-Gate Gap Confirmed in Production CI)

## Target

- **Target report:** `incoming/arena-agent-audit-1-2/2026-07-05/REPORT.md`
- **Target finding ID:** AUDIT-P1-CI-GATE-GAP
- **Comment type:** confirmation (5th witness) + severity upgrade
- **My audited SHA:** `2f09c8f5`
- **Mode:** verifier + deep-dive + matrix-sync

## Finding (Confirmation — 5th witness)

- **Finding ID:** AUDIT-P1-CI-GATE-GAP
- **Title:** CI-gate gap — :light skips 3 critical checks, used in production CI
- **Severity:** P1 (production CI finding, not just local dev)
- **Root cause:** `.github/workflows/indexnow.yml:71` uses `validate:static-publication:light`

## Evidence

- **Source SHA:** `2f09c8f5`
- **Confirmed in CI:** `indexnow.yml:71` uses `:light` gate (production workflow)
- **Confirmed in deploy:** `deploy.yml:101` uses full gate (correct)

## Critical implication

`indexnow.yml` submits URLs to IndexNow (search engine indexing). It uses the :light gate.
The :light gate skips `sw:dist:audit`. If SW distribution is broken:
- indexnow.yml: :light gate → ✅ PASSES
- But SW serves stale/malformed pages
- IndexNow submits URLs → search engines index wrong content

## Severity rationale

Originally labeled as "CI-gate gap" (suggesting local dev only).
Verified: it's a PRODUCTION CI issue — indexnow.yml runs in GitHub Actions,
can trigger on schedule (daily) or manual dispatch. Impact is production.

## Recommended repair

Change `indexnow.yml:71` to use full gate:
```yaml
- name: Static publication gates
  run: npm run validate:static-publication  # NOT :light
```

## Status

confirmed-current, 5 witnesses (Pass 63 + deep-audit-2 + Pass 89 + audit-1 + audit-1-3)