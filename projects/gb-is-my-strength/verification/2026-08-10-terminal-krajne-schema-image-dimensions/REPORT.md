# Terminal report — V09-KRAJNE-SCHEMA-IMAGE-DIMENSIONS

Date: 2026-08-10
Disposition: **TERMINAL / MERGED-GREEN**

## Product result

- Product PR: `FedorMilovanov/gb-is-my-strength#1564`
- Exact tested head: `ae01a90b0e3cc013bb4691c409d3c42d4d75b9bc`
- Merge commit: `e28750cc3421d3d4108027fa0641709fafa52a16`
- Krajne Article JSON-LD now declares `1200×630` for `https://gospod-bog.ru/images/og-krajne-isporcheno.webp`, matching the published image/OG projection.

## Permanent proof

The existing rich-results audit was generalized instead of adding a second media-size registry. For local Article ImageObjects it reads actual PNG/JPEG/WebP headers and compares declared dimensions to the published binary; when JSON-LD and Open Graph reference the same image URL it also rejects contradictory OG dimensions.

The dedicated `Schema Image Dimensions Contract` completed success on the exact PR head. It built production-like `dist`, ran the generalized binary-backed audit, mutated only the Krajne built JSON-LD width from `1200` to `1199`, proved that the audit fails closed for the mismatch, restored the file, and proved the audit passes again. Shared Files Guard, Deploy Candidate, Metadata/IndexNow, Search Modal, Scripture Occurrence Index, Editorial Dateline, Print Paper, Glossary and the substantive Source Authority publication steps were also green before GitHub accepted the protected exact-head merge.

## Terminal conclusion

`V09-KRAJNE-SCHEMA-IMAGE-DIMENSIONS` is resolved on merged `main` and must not remain active in MASTER. Reopen only on fresh current-main evidence.
