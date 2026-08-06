# Closure Ledger — the-legendary-poet

Append-only журнал компактных результатов verification and repair waves.

Исторические closed/current rows остаются в старой working matrix и prior verified documents. Они не переписываются массово в рамках operating-model migration.

## 2026-08-06 — W6 physical ref retirement completed

- Scope: historical `TLP-CLEAN-001` and branch/evidence lifecycle.
- Result:
  - closed-by-fix: allowlisted source and AuditRepo stale refs were physically deleted after ownership preflight;
  - preserved: source `main` and the exact forensic archive `archive/deep-research-local-images-20260724`;
  - postcondition: source branch inventory reduced to `main` plus the intentional archive; old TLP AuditRepo closure refs are absent;
  - remaining independent: media provenance/rights decisions are not closed by branch retirement.
- Product evidence: source PRs #327/#328 and closure commit `aa2e37573453480531825c8962c372596513f9f2`; AuditRepo maintenance PR #192.
- Regression witness: source project contract records zero open architecture lanes; branch absence was re-listed after deletion.
- Live evidence: not required; repository ref evidence was required and obtained.
- Historical detailed evidence: W6 inventory, deletion manifest, branch disposition and prior verification/reverify documents.

## 2026-08-06 — W7 single route truth and honest archive outcomes

- Scope: route ownership, redirects/NotFound, focus settlement, essay validation and archive mutation outcomes.
- Result:
  - absorbed-by-system-fix: duplicated Router/lazy/sitemap/QA/budget ownership;
  - closed-by-fix: broad unknown-article soft-404 and stale manual redirect acceptance;
  - closed-by-fix: missing focus ownership on return to the session-opening path;
  - closed-by-fix: renderer-level hiding of invalid adjacent headings;
  - closed-by-fix: silent archive removal failure and boolean-only mutation expectations;
  - remaining independent: editorial/media provenance decisions.
- Product evidence: source PR #331, exact tested head `19fd978fcaf7513be93e7222c0caa9f0a5332bda`, squash merge `5cc5ba89ab95d50eb2c31adcade0dd96e13b40d8`.
- Regression witness: machine route contract, project/content validators, production build budgets, catalog across Chromium/Android/iPhone, 35+ route crawl and Manual Browser QA 4/4.
- Live evidence: not required and not claimed.
- Detailed evidence: `../verification/2026-08-06-w7-route-runtime-wave/REPORT.md`.

## 2026-08-06 — TLP adopts AuditRepo operating model v2

- Scope: AuditRepo documentation and evidence navigation only.
- Result:
  - added stable `DOC_MAP.md`, optional `WORK_QUEUE.md`, `SYSTEM_THEMES.md` and this ledger;
  - removed volatile global HEAD/W6 barrier language from the project entrypoint;
  - preserved the historical working matrix and all prior evidence without bulk mutation;
  - established that future source movement alone does not require an AuditRepo sync transaction.
- Product evidence: no Product mutation.
- Regression witness: ordinary AuditRepo validation on the migration PR.
- Live evidence: not applicable.

## 2026-08-06 — C01 caption verified, publication rights remain blocked

- Scope: one bounded media candidate, `C01 / Mayakovsky 1910.jpg`.
- Result:
  - verified-at-anchor: Commons file identity, existing local hashes and dimensions;
  - caption-verified: the same photograph is documented by the State Mayakovsky Museum collection as Vladimir Mayakovsky in Moscow, 1910;
  - narrowed: photographer remains unknown; exact day `1 February` and the object-level phrase `student of the Stroganov School` are not promoted;
  - rights-blocked: `PD-old` on Commons lacks a United States public-domain tag and the original publication history is not established;
  - no Product mutation and no production-media acceptance.
- Evidence angles: Product provenance ledger + Commons description/licensing + museum object record + RIA archive metadata + manual visual comparison of the exact composition.
- Owner outcomes: strengthen public-domain rationale / obtain permission / replace / park.
- Live evidence: not required; this was a provenance and rights verification.
- Detailed evidence: `../verification/2026-08-06-c01-caption-rights-wave/REPORT.md`.

## 2026-08-06 — C02 caption corroborated, primary object and rights remain blocked

- Scope: one bounded media candidate, `C02 / Mayakovsky 1912.jpg`.
- Result:
  - verified-at-anchor: Commons file identity, Product acquisition hash, byte size, dimensions and unknown creator metadata;
  - caption-corroborated: the portrait is repeatedly identified as Vladimir Mayakovsky in 1912, including a Fine Art Images/Heritage commercial catalogue entry for the exact composition;
  - collection-attribution-commercial: that entry places the portrait in the State Mayakovsky Museum collection, but a primary museum exact-object record was not obtained;
  - narrowed: no shooting location, exact date, photographer or accession history is promoted;
  - rights-blocked: Commons `PD-old` lacks a United States public-domain tag and original publication history is not established; commercial reproduction metadata is not a free-use grant;
  - no Product mutation and no production-media acceptance.
- Evidence angles: Product provenance ledger + Commons/FEB metadata + Fine Art Images/Heritage exact-composition catalogue + published collected-works caption + manual visual comparison.
- Owner outcomes: primary museum object record / stronger public-domain rationale / permission / replacement / park.
- Live evidence: not required; this was a provenance and rights verification.
- Detailed evidence: `../verification/2026-08-06-c02-caption-rights-wave/REPORT.md`.
