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

## 2026-08-06 — C04 early publication and stronger PD rationale remain incomplete

- Scope: one bounded media candidate, `C04 / Mayakovsky 1915.jpg`.
- Result:
  - verified-at-anchor: Commons file identity, Product acquisition hash, byte size, current dimensions and unknown creator metadata;
  - caption-corroborated: the portrait is published as Vladimir Mayakovsky, 1915, in the collected-works plate lineage;
  - early-publication-cited: the current Commons record cites `Курская правда`, №86, 14 April 1940, and the Kursk regional library confirms the April 1940 archive exists;
  - source-page-unverified: the exact newspaper page/image context was not directly obtained in the bounded wave;
  - stronger-rights-rationale: Commons `PD-Russia-1996` states Russian and United States URAA reasoning, but the factual publication predicates and Product editorial decision still require verification;
  - no Product mutation and no production-media acceptance.
- Evidence angles: Product provenance ledger + current/historical Commons metadata + 1955 collected-works illustration list + Kursk library digitized-newspaper archive + exact image inspection.
- Owner outcomes: exact newspaper page / primary object record / reviewed PD decision / permission or replacement / park.
- Live evidence: not required; this was a provenance, publication-history and rights verification.
- Detailed evidence: `../verification/2026-08-06-c04-publication-rights-wave/REPORT.md`.

## 2026-08-06 — C05 source lineage and publication rights remain unverified

- Scope: one bounded media candidate, `C05 / Mayakovsky 1917 a.jpg`.
- Result:
  - verified-at-anchor: exact Commons file identity, Product acquisition hash, 396 × 601 dimensions, 28,507 bytes, year field 1917 and unknown author metadata;
  - original-source-unavailable: the cited FPLIB gallery could not be fetched through the available path;
  - caption-repeated-not-independent: PICRYL/GetArchive and a retro-photo page repeat the 1917 caption but inherit Commons or provide no primary object evidence;
  - independent-object-unverified: no museum/archive exact-object record, accession history or inspectable early publication was obtained;
  - rights-blocked: generic `PD-old` lacks a United States public-domain tag and the factual publication/creator predicates remain unknown;
  - no Product mutation and no production-media acceptance.
- Evidence angles: Product provenance ledger + Commons description/history/licensing + dead-source check + derivative-republication classification.
- Owner outcomes: recover FPLIB archive / primary object or early publication / reviewed PD decision / permission or replacement / park.
- Live evidence: not required; this was a source-lineage, caption and rights verification.
- Detailed evidence: `../verification/2026-08-06-c05-source-rights-wave/REPORT.md`.

## 2026-08-06 — C06 caption/object verified, early publication and rights predicate remain unresolved

- Scope: one bounded media candidate, `C06 / Mayakovsky 1918.jpg`.
- Result:
  - verified-at-anchor: exact Commons identity, Product SHA-256, 316 × 401 dimensions, 32,218 bytes, 1918 and unknown-author metadata;
  - caption/object-verified: same composition authenticated through State Mayakovsky Museum as Vladimir Mayakovsky in Catherine Park, Moscow, 1918, unknown photographer;
  - same-object confirmed: tree, cane, coat, hat, bow tie, birches and pond match;
  - source-lineage-unavailable: old RSL URL cited by Commons could not be inspected;
  - early-publication-unverified: no pre-1931 publication page or catalogue statement obtained;
  - rights-rationale-predicate-unverified: `PD-Russia-expired` gives Russia/US pre-1931 routes, but publication predicate remains unproved;
  - no Product mutation and no production-media acceptance.
- Evidence angles: Product provenance ledger + Commons current record/licensing + State Mayakovsky Museum-backed Russia-in-Photo object + Culture.ru corroboration + manual visual comparison + RSL source availability check.
- Owner outcomes: recover RSL source / pre-1931 publication / museum accession / reviewed PD decision / permission or replacement / park.
- Live evidence: not required; this was object, caption, publication-history and rights verification.
- Detailed evidence: `../verification/2026-08-06-c06-object-publication-rights-wave/REPORT.md`.

## 2026-08-06 — C07 pre-1931 source volume verified, exact RSL pages remain unavailable

- Scope: one bounded media candidate, `C07 / Mayakovsky 1925.jpg`.
- Result:
  - verified-at-anchor: exact Commons identity, Product SHA-256, 534 × 709 dimensions, 123,055 bytes, 1925 and unknown-author metadata;
  - caption/date-corroborated: later scholarly volume 1 preserves `В. Маяковский. Фото 1925 г.` and modern exact-composition reproductions identify the same desk/newspapers portrait;
  - publication-volume-verified: FEB bibliography records volume 1 of the ten-volume collected works as GIZ, Moscow–Leningrad, 1928, 360 pages;
  - exact-pages-unavailable: Commons cites RSL volume page 7 for the reproduction and index page 377 for the date, but neither page was directly fetched in the bounded wave;
  - primary-object-unverified: photographer, shooting location, accession and physical print provenance remain unknown;
  - rights-rationale-partially-supported: `PD-Russia-expired` has a verified pre-1931 volume context, but exact-page identity and Product editorial approval remain unresolved;
  - no Product mutation and no production-media acceptance.
- Evidence angles: Product provenance ledger + Commons current record/licensing + FEB bibliography + later scholarly illustration caption + exact composition inspection + RSL page availability check.
- Owner outcomes: recover RSL pages 7/377 / preserve page artifacts and visual match / primary object or photographer / reviewed PD decision / permission or replacement / park.
- Live evidence: not required; this was caption, bibliography, exact-page and rights verification.
- Detailed evidence: `../verification/2026-08-06-c07-publication-volume-wave/REPORT.md`.

## 2026-08-06 — Mayakovsky 30-candidate media family closed in one final batch

- Scope: source issue #77 and the complete C01–C30 media decision family.
- Result:
  - exact original identity and hashes remain complete for `30/30` candidates;
  - accepted active: `5` — C03, C08, C10, C11, C16;
  - verified reserve: `1` — C15;
  - explicit terminal exclusions: `24`;
  - unresolved candidates: `0`;
  - new Product image binaries: `0`;
  - no remaining automatic C09–C30 verification queue.
- New accepted active decisions:
  - C10: State Mayakovsky Museum exact group/leaflet witness, Moscow 1912, documented February 1913 publication, unknown photographer preserved;
  - C11: State Catalogue / State Mayakovsky Museum exact source lineage, Tina Modotti, Mayakovsky and Francisco Moreno, Mexico City 1925;
  - C16: Arzamas exact reproduction credited to the State Mayakovsky Museum, Osip Brik, Moscow 1927.
- Reserve decision: C15 has sufficient evidence but no current essay block uses the exact source, so no decorative active key was created.
- Exclusion classes: `excluded-rights`, `excluded-provenance`, `excluded-scope`; every excluded candidate has a machine-readable candidate-specific reason.
- Product evidence: source PR #333, exact tested head `b9a4bc7dd3dc2c14160e3b551497465eab82753c`, squash merge `dd2df7be196d81d5212b43a08616f782af2fecf6`.
- Regression witness: Project contracts, Content model contract, CI, Articles catalog on Chromium/Android/iPhone, 35+ URL route audit, brand deep audit and Manual Browser QA 4/4.
- Issue outcome: source issue #77 closed as `completed`.
- Reopen only for materially new primary evidence, permission/licence, jurisdiction-specific rights evidence, changed editorial need or a change to the active registry/coverage contract.
- Detailed evidence: `../verification/2026-08-06-mayakovsky-media-final-batch/REPORT.md`.
