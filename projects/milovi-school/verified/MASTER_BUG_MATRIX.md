# MASTER BUG MATRIX — Milovi School

> SSOT for current verified necessary work only.

## Current state

| Field | Value |
|---|---:|
| Active work units | **1** |
| Direct current defects | **0** |
| Verified necessary improvements | **0** |
| Narrowed residuals | **0** |
| System verification lanes | **0** |
| Owner decisions | **1** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

## CURRENT DEFECTS — 0

| ID | Current problem | Boundary |
|---|---|---|

## VERIFIED NECESSARY IMPROVEMENTS — 0

| ID | Needed implementation | Why |
|---|---|---|

## NARROWED RESIDUALS — 0

| ID | Current residual |
|---|---|

## SYSTEM VERIFICATION LANES — 0

| ID | Verified work package | Next boundary |
|---|---|---|

## OWNER DECISIONS — 1

| ID | Missing decision / action | Closure boundary |
|---|---|---|
| `MS-GSC-OWNERSHIP-001` | `https://french.milovicake.ru/` is live, self-canonical and indexable; robots advertises the Astro sitemap index and the Google HTML verification file is live. The property can be added through Search Console API, but the currently connected primary Google authorization still gets `403 insufficient permission`. Apex `milovicake.ru` has no Google ownership TXT. Product issue: `Milovi_School#32`. | Complete ownership verification for the currently authorized account: first attempt verification of the already-added URL-prefix property with the existing live HTML token; if Google rejects that token, publish a token generated for the primary account or use deliberate DNS domain-property verification. Then prove Search Console reads succeed, submit/confirm `sitemap-index.xml`, and establish URL Inspection baseline. Do not delete/re-register the GSC Wizard site merely to clear the 403. |

## Terminal disposition

The only active unit is external control-plane ownership. No repository mutation is authorized by this row unless Google requires a new verification file generated for the intended owner.
