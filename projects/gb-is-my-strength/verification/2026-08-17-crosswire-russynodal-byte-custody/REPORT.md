# CrossWire RusSynodal 1.9.1 — byte-exact package custody — 2026-08-17

## Scope

This report closes the previously missing **byte-exact official-package custody** sub-boundary for CrossWire `RusSynodal 1.9.1`.

It does not import the Bible text into Product and does not convert package provenance into permission for any unrelated protected corpus.

## Authority sources

The custody witness used only CrossWire's official repository endpoints:

- package: `https://crosswire.org/ftpmirror/pub/sword/packages/rawzip/RusSynodal.zip`
- live module config: `https://crosswire.org/ftpmirror/pub/sword/raw/mods.d/russynodal.conf`

The verifier permits only HTTPS responses whose final host remains an allowlisted CrossWire host.

## Exact witness

AuditRepo PR #314 exact head:

`953f0d35715e495bd393fd20a3019614320407b4`

Workflow:

- `CrossWire RusSynodal Custody`
- run `32069234645`
- job `95508379260`
- conclusion: **success**

The job successfully completed exact-head checkout, verifier syntax check, official package acquisition/verification, clean tracked-tree check and custody-artifact upload.

Evidence artifact:

- name: `crosswire-russynodal-custody-32069234645`
- artifact ID: `9301073700`
- artifact ZIP digest: `sha256:4197b08efc75b550812a5f5de60c5842890a3b9cb4bcbf6612a479f4405fc61e`
- retention at creation: 30 days

## Byte-exact package receipt

Observed official package response:

```text
source_url = https://crosswire.org/ftpmirror/pub/sword/packages/rawzip/RusSynodal.zip
final_url = https://crosswire.org/ftpmirror/pub/sword/packages/rawzip/RusSynodal.zip
content_type = application/zip
content_length_header = 2119515
last_modified = Thu, 18 Aug 2022 18:35:48 GMT
etag = "20575b-5e68840197b19"
bytes = 2119515
sha256 = b802570e1783c326552b9e810786efe3df4efcd615f28ccf3a86bae27dbc5022
```

The ZIP passed `ZipFile.testzip()` CRC validation and safe-member-path validation.

## Embedded/live configuration equality

The package contains exactly one matching module config:

`mods.d/russynodal.conf`

Its SHA-256 is:

`a51ec4c6b64396beb753dc541d4e56f985bba22b5858343f182470cb18d89671`

The independently downloaded official live config had the same SHA-256 and, after newline normalization, was byte-equal to the embedded config.

Required authority fields were verified fail-closed:

```text
Version = 1.9.1
DistributionLicense = Public Domain
Versification = Synodal
SourceType = OSIS
Encoding = UTF-8
```

## Package manifest

The package contains 7 files total: one config plus six zText data files.

| Path | Bytes | CRC32 | SHA-256 |
|---|---:|---|---|
| `mods.d/russynodal.conf` | 2,602 | `aa190325` | `a51ec4c6b64396beb753dc541d4e56f985bba22b5858343f182470cb18d89671` |
| `modules/texts/ztext/russynodal/nt.bzs` | 336 | `1f0d2b7d` | `6d3b2f522974200d2fff094b1dfb7388563377e4da7ad23b07f2cd7680833c0e` |
| `modules/texts/ztext/russynodal/nt.bzv` | 82,440 | `a23a08a5` | `42fc6c749f882cbac3028a8650ec7783b073cfaa86e011c97c83412f8b8b7b5b` |
| `modules/texts/ztext/russynodal/nt.bzz` | 421,611 | `15bd857e` | `54547aec299d9bf66af52d4cd7856d3beb324179e85875472540c19c4df8dd1d` |
| `modules/texts/ztext/russynodal/ot.bzs` | 624 | `ffda4281` | `c115c8b2d9a1e2bd870730407231f93155f5f2468a581b7a959b53101d26616a` |
| `modules/texts/ztext/russynodal/ot.bzv` | 302,990 | `312bed4c` | `1354e0253f17fbb7189f0366afcddf072bf29bc6367d55b509077583d15b0d89` |
| `modules/texts/ztext/russynodal/ot.bzz` | 1,586,987 | `9b8169e1` | `a4974c794f8dc71aef34efd961072c21fd444a320bb053713a96f109386fdc6e` |

## What this closes

The former CrossWire custody wording in rights coordination said that the official module metadata was verified but the exact package had not yet been materialized and therefore an exact SHA-256, embedded-conf equality and file manifest were still missing.

Those three custody items are now closed:

```text
CROSSWIRE_RUSSYNODAL_1_9_1_OFFICIAL_PACKAGE = ACQUIRED_FROM_OFFICIAL_RAWZIP
CROSSWIRE_RUSSYNODAL_1_9_1_PACKAGE_SHA256 = b802570e1783c326552b9e810786efe3df4efcd615f28ccf3a86bae27dbc5022
CROSSWIRE_RUSSYNODAL_EMBEDDED_CONF_EQUALS_OFFICIAL_LIVE_CONF = YES
CROSSWIRE_RUSSYNODAL_FILE_MANIFEST = CLOSED
CROSSWIRE_RUSSYNODAL_DISTRIBUTION_LICENSE = PUBLIC_DOMAIN
```

## What remains intentionally separate

This report does **not** perform or authorize a Product corpus import. Before a future Product import/publication transaction, the Product owner must still establish the exact application-level canonical/book mapping, Synodal-versification handling and verse-level import/round-trip validation appropriate to the selected implementation.

Those are Product-admission/import witnesses, not missing evidence about whether the CrossWire package itself is the official Public Domain `RusSynodal 1.9.1` object.

The broader AuditRepo rights coordination issue #225 remains open because other translation/TMS lanes still lack terminal dispositions. This CrossWire closure must not be generalized to RBS protected corpora, Kulakov/BTI, RSP, TMSJ or GTY material.

## Classification

```text
CROSSWIRE_METADATA_CUSTODY = CLOSED
CROSSWIRE_BYTE_EXACT_PACKAGE_CUSTODY = CLOSED
CROSSWIRE_PACKAGE_CONFIG_EQUALITY = CLOSED
CROSSWIRE_PACKAGE_FILE_MANIFEST = CLOSED
CROSSWIRE_PRODUCT_IMPORT = NOT_PERFORMED
OTHER_RIGHTS_LANES = UNAFFECTED
RIGHTS_ISSUE_225 = REMAINS_OPEN
```
